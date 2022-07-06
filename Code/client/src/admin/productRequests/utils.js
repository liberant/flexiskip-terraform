
function VoucherSourcetoPrint(source) {
  return `<html lang="en"><head><title>${source.title}</title></head><body>\n
      ${source.content} </body></html>`;
}

export async function printQRCodes(data) {
  if (data) {
    const printWindow = window.open('/admin/print', '_blank');
    if (printWindow && printWindow.document) {
      printWindow.document.createTextNode('@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }');

      printWindow.document.open();
      printWindow.document.write(VoucherSourcetoPrint(data));
      await printWindow.document.close();
      printWindow.print();
    }
  }
}

