const { GoogleSpreadsheet } = require('google-spreadsheet');
const _ = require('lodash');
const Promise = require('bluebird');
const config = require('../../config');
const logger = require('./log');
const { formatDateAu } = require('./helpers');
const CouncilAddress = require("../app/models/council-address-db/address");
const { generateGeoAddress } = require('./helpers');

async function loadGoogleSheetReport(sheetName) {
  try {
    const doc = new GoogleSpreadsheet(config.reportSpreadsheetId);
    await doc.useServiceAccountAuth(require('../../google-service-account.json'));
    await doc.loadInfo();
    logger.info(`Google sheet loaded : ${doc.title}`);

    const colSheet = _.find(doc._rawSheets, s => s._rawProperties.title === sheetName);

    if (!colSheet) throw new Error(`Google sheet report : Sheet '${sheetName}' not found`);

    return colSheet;
  } catch (error) {
    logger.error(error.message);
    logger.error(error.stack);
    throw new Error(error.message);
  }
}

async function mapCollectionRequestReportDataToColumn(headers, colReqs) {
  try {
    await Promise.map(colReqs, async (colReq) => {
      colReq.userType = colReq.customer && colReq.customer.getType ? await colReq.customer.getType() : '';
    });
    const newRows = await Promise.all(colReqs.map(async (colReq) => {
      const { addressTreated, postcode } =
        generateGeoAddress(colReq.collectionAddress);
      const councilAddr = await CouncilAddress.findOne({
        address_1: {
          $regex: addressTreated,
        },
        postcode,
      });
      colReq.council = councilAddr
        ? councilAddr.class_electoral_division
        : 'N/A';

      const item = colReq.items ? colReq.items[0] : '';
      const supplyPartner = colReq.contractorOrganisation ? colReq.contractorOrganisation.name : '';
      const newRow = {};
      console.log(item.bin.code);
      headers.forEach((header) => {
        if (header === 'QR Code') newRow['QR Code'] = item.bin ? item.bin.code : 'No Code';
        else if (header === 'Status') newRow.Status = colReq.status || '';
        else if (header === 'Collection No.') newRow['Collection No.'] = colReq.code || '';
        else if (header === 'Name') newRow.Name = colReq.customer ? colReq.customer.fullname : '';
        else if (header === 'Address') newRow.Address = colReq.collectionAddress || '';
        else if (header === 'Type') newRow.Type = colReq.userType || '';
        else if (header === 'Product') newRow.Product = item.product ? item.product.name : '';
        else if (header === 'Order Date') newRow['Order Date'] = formatDateAu(colReq.createdAt) || '';
        else if (header === 'Acceptance Date') newRow['Acceptance Date'] = formatDateAu(colReq.acceptedAt) || formatDateAu(colReq.createdAt) || '';
        else if (header === 'Collection Date') newRow['Collection Date'] = formatDateAu(colReq.collectedAt) || formatDateAu(colReq.disposedAt) || '';
        else if (header === 'Completion Date') newRow['Completion Date'] = formatDateAu(colReq.disposedAt) || '';
        else if (header === 'State') newRow.State = colReq.collectionState || '';
        else if (header === 'Region') newRow.Region = colReq.council;
        else if (header === 'Weight') newRow.Weight = item.bin && item.bin.collectedWeight ? item.bin.collectedWeight : '250';
        else if (header === 'Supply Partner') newRow['Supply Partner'] = supplyPartner;
      });

      return newRow;
    }));

    return newRows;
  } catch (error) {
    logger.error(error);
    logger.error(error);
    throw new Error(error);
  }
}

async function mapProductReportDataToColumn(headers, binReqs) {
  try {
    await Promise.map(binReqs, async (binReq) => {
      binReq.userType = binReq.customer && binReq.customer.getType ? await binReq.customer.getType() : '';
    });
    const newRows = [];
    await Promise.all(binReqs.map(async (binReq) => {
      const { addressTreated, postcode } =
        generateGeoAddress(binReq.shippingAddress);
      const councilAddr = await CouncilAddress.findOne({
        address_1: {
          $regex: addressTreated,
        },
        postcode,
      });
      binReq.council = councilAddr
        ? councilAddr.class_electoral_division
        : 'N/A';

      const orderQty = binReq.bins.length;
      const item = binReq.items[0];
      const user = binReq.customer;
      let j = orderQty;

      while (j >= 1) {
        const bin = binReq.bins[j - 1];
        const newRow = {};

        headers.forEach((header) => {
          if (header === 'Code') newRow.Code = bin.code;
          else if (header === 'QR Code') newRow['QR Code'] = bin.code;
          else if (header === 'Status') newRow.Status = binReq.status || '';
          else if (header === 'Request No.') newRow['Request No.'] = binReq.code;
          else if (header === 'Name') newRow.Name = user ? user.fullname : '';
          else if (header === 'Address') newRow.Address = binReq.shippingAddress;
          else if (header === 'Type') newRow.Type = binReq.userType || '';
          else if (header === 'Product') newRow.Product = item.product.name;
          else if (header === 'Order Date') newRow['Order Date'] = formatDateAu(binReq.createdAt);
          else if (header === 'Dispatch Date') newRow['Dispatch Date'] = formatDateAu(bin.dispatchedAt);
          else if (header === 'Delivery Date') newRow['Delivery Date'] = formatDateAu(binReq.updatedAt);
          else if (header === 'State') newRow.State = binReq.shippingState;
          else if (header === 'Region') newRow.Region = binReq.council;
          else if (header === 'Weight') newRow.Weight = item.bin && item.bin.collectedWeight ? item.bin.collectedWeight : '250';
        });
        newRows.push(newRow);
        j--;
      }
    }));

    return newRows;
  } catch (error) {
    logger.error(error);
    logger.error(error);
    throw new Error(error);
  }
}


async function updateGoogleSheetReportForCollectionRequest(colReqs, mode) {
  try {
    logger.info(`Run update Google sheet collection report (sheetId: ${config.reportSpreadsheetId})`);
    if (!mode) throw new Error('Mode param is required !');

    const colSheet = await loadGoogleSheetReport(config.collectionRequestSheetReport);
    await colSheet.loadHeaderRow();
    const HEADER_ROW = colSheet.headerValues;

    // add new row report
    await colSheet.setHeaderRow(HEADER_ROW);
    const rows = await colSheet.getRows();

    if (mode === 'update') {
      // Populate data to create new row if it doesn't exist in the sheet
      await Promise.map(colReqs, async colReq => colReq
        .populate('items.product')
        .populate('items.bin')
        .populate('contractorOrganisation')
        .populate('customer')
        .execPopulate());
      const updateRows = await mapCollectionRequestReportDataToColumn(HEADER_ROW, colReqs);

      await Promise.each(updateRows, async (colReq) => {
        const existingRowIndex = rows.findIndex(row => row['QR Code'] === colReq['QR Code']);
        if (existingRowIndex > -1) {
          rows[existingRowIndex] = Object.assign(rows[existingRowIndex], colReq);
          return rows[existingRowIndex].save();
        }
        // If not found, append new row
        return colSheet.addRow(colReq);
      });
    }

    if (mode === 'override') {
      const newRows = await mapCollectionRequestReportDataToColumn(HEADER_ROW, colReqs);
      if (newRows.length === 0) return;
      await colSheet.addRows(newRows);
    }
  } catch (error) {
    logger.error('Error when update Google Sheet Report For Collection Request');
    logger.error(error.message);
    logger.error(error.stack);
    throw new Error(error.message);
  }
}

async function updateGoogleSheetReportForProducts(binReqs, mode) {
  try {
    logger.info(`Run update Google sheet product report (sheetId: ${config.reportSpreadsheetId})`);
    if (!mode) throw new Error('Mode param is required !');

    const prodSheet = await loadGoogleSheetReport(config.productRequestSheetReport);
    await prodSheet.loadHeaderRow();
    const HEADER_ROW = prodSheet.headerValues;

    // add new row report
    await prodSheet.setHeaderRow(HEADER_ROW);
    const rows = await prodSheet.getRows();

    if (mode === 'update') {
      // Populate data to create new row if it doesn't exist in the sheet
      await Promise.map(binReqs, async binReq => binReq
        .populate('items.product')
        .populate('bins')
        .populate('customer')
        .execPopulate());
      const updateRows = await mapProductReportDataToColumn(HEADER_ROW, binReqs);

      await Promise.each(updateRows, async (binReq) => {
        const existingRowIndex = rows.findIndex(row => row['QR Code'] === binReq['QR Code']);
        if (existingRowIndex > -1) {
          rows[existingRowIndex] = Object.assign(rows[existingRowIndex], binReq);
          return rows[existingRowIndex].save();
        }
        // If not found, append new row
        return prodSheet.addRow(binReq);
      });
    }

    if (mode === 'override') {
      const newRows = await mapProductReportDataToColumn(HEADER_ROW, binReqs);
      if (newRows.length === 0) return;
      await prodSheet.addRows(newRows);
    }
  } catch (error) {
    logger.error('Error when update Google Sheet Report For Products');
    logger.error(error.message);
    logger.error(error.stack);
    throw new Error(error.message);
  }
}

module.exports = {
  updateGoogleSheetReportForCollectionRequest,
  updateGoogleSheetReportForProducts,
  loadGoogleSheetReport,
  mapCollectionRequestReportDataToColumn,
  mapProductReportDataToColumn,
};
