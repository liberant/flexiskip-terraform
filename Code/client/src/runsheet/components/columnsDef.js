import moment from "moment";
import React from 'react';

export function dueDateFormatter(dueDate, background = "#F3FAFF") {
    if (!dueDate) {
        return null;
    }
    // "Collection Date (createdAt)" + 3 business days (ignore weekend)
    return (
        <div
            style={{
                padding: "4px 10px",
                background: background,
                borderRadius: "4px",
                display: "inline",
                fontSize: "12px",
                color: "#464F60",
            }}
        >
            {moment(dueDate).format("DD MMM YYYY")}
        </div>
    );
}

export function statusFormatter(status) {
    if (!status) {
        return null;
    }
    if (status === 'Futiled') {
        return (
            <div
                style={{
                    padding: "4px 10px",
                    background: "#fcf3e0",
                    color: '#ebad16',
                    borderRadius: "4px",
                    display: "inline",
                    fontSize: "12px",
                    textTransform: "uppercase",
                }}
            >
                {status}
            </div>
        );
    }
    return (
        <div
            style={{
                padding: "4px 10px",
                background: "#E1FCEF",
                color: '#14804A',
                borderRadius: "4px",
                display: "inline",
                fontSize: "12px",
                textTransform: "uppercase",
            }}
        >
            {status}
        </div>
    );
}

function divisionFormatter(division) {
    if (!division) {
        return 'N/A';
    }
    return `DIVISION ${division}`;
}

export const columnsSummary = [
    {
        dataField: "dueDate",
        text: "DUE DATE",
        headerStyle: { width: 120 },
        style: { width: 120 },
        formatter: dueDateFormatter,
        sorter: true,
    },

    {
        dataField: "crCode",
        text: "CR NO.",
        sorter: true,
        headerStyle: { width: 120 },
        style: { width: 120 },
    },
    {
        dataField: "qrCode",
        text: "QR NO.",
        sorter: true,
        headerStyle: { width: 120 },
        style: { width: 120 },
    },
    {
        dataField: "address",
        text: "ADDRESS",
        headerStyle: { width: 200 },
        style: {
            width: 200,
        },
    },
    {
        dataField: "collectionAddress",
        text: "COLLECTION ADDRESS",
        headerStyle: { width: 200 },
        style: { width: 200, },
    },
    {
        dataField: "status",
        sorter: true,
        text: "STATUS",
        headerStyle: { width: 120 },
        style: { width: 120 },
        formatter: statusFormatter,
    },
    {
        dataField: "division",
        sorter: true,
        text: "DIVISION",
        headerStyle: { width: 120 },
        style: { width: 120 },
        formatter: divisionFormatter,
    },
    {
        dataField: "dayCount",
        sorter: true,
        text: "DAY COUNT",
        headerStyle: {
            textAlign: "center",
            width: 120,
        },
        style: {
            textAlign: "center",
            width: 120,
        },
    },
    {
        dataField: "comment",
        text: "COMMENT",
        headerStyle: { width: 120 },
        style: { width: 120 },
    },
];
