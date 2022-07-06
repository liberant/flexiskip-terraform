import PropTypes from "prop-types";
import React from "react";
import LogoFlexskip from "../../public/images/flexi-logo-small.png";
import RunsheetSummary from "../../public/images/runsheet-summary.png";
import { columnsSummary } from "./columnsDef";
import Select from "react-select";
import Pagination from "../../common/components/Pagination";
import RunsheetTableMobile from './RunsheetTableMobile';

const styles = {
    container: {
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "auto",
        paddingBottom: "20px",
    },

    header: {
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
        background: "#CBE6FF",
        height: "90px",
        borderBottom: "3px solid #9FCAEB",
        overflowX: "auto",
        overflowY: "hidden",
    },
    header_left: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        h1: {
            color: "#231F20",
            fontSize: "32px",
            lineHeight: "32px",
            fontWeight: "bold",
        },
    },
    header_right: {
        display: "flex",
        alignItems: "center",
        gap: "26px",
        logo1: {
            width: "65px",
            height: "65px",
        },
        logo2: {
            width: "160px",
            height: "35px",
        },
        border: {
            height: "90px",
            width: 1,
            background: "#9FCAEB",
        },
    },
    box_count: {
        borderRadius: "4px",
        backgroundColor: "#fff",
        padding: "6px 14px",
        p: {
            fontSize: "22px",
            lineHeight: "18px",
            letterSpacing: "2px",
            margin: 0,
        },
    },
    table: {
        margin: "0 22px",
        marginTop: "44px",
        overflow: "auto",
        border: "1px solid #E9EDF5",
        header: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer",
            color: "#231F20",
            height: 38,
            fontSize: 12,
            letterSpacing: "0.5px",
            fontWeight: 500,
        },
        sorter: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            backgroundColor: "#E6EEF4",
            transition: "all 0.3s ease-in-out",
            borderRadius: 2,
            marginLeft: 2,
            marginRight: 2,
        },
        rowCell: {
            color: "#464F60",
            verticalAlign: "middle",
            minhHeight: 38,
            paddingTop: 19,
            paddingBottom: 19,
            fontSize: 14,
        },
    },
    footerBox: {
        display: "flex",
        justifyContent: "space-between",
        margin: 25,
        marginTop: 15,
        color: "#666666",
    },
};

const RunsheetTable = ({
    data,
    pageSize,
    organisation,
    order,
    orderBy,
    handleRequestSort,
    onChangeStatusFilter,
    statusFilter,
    handlePageChange,
    handlePerPageChange,
    onExportCSV,
    onCloseCollectionRequest,
}) => {
    return (
        <div style={styles.container}>
                {/* Desktop */}
            <div className="hidden-xs">
                <div style={styles.header}>
                    <div style={styles.header_left}>
                        <h1 style={styles.header_left.h1}>RUNSHEET SUMMARY</h1>
                        <div style={styles.box_count}>
                            <h5 style={styles.box_count.p}>
                                {data.pagination.totalCount}
                            </h5>
                        </div>
                    </div>
                    <div style={styles.header_right}>
                        <img
                            style={styles.header_right.logo1}
                            src={RunsheetSummary}
                            alt=""
                        />
                        <div style={styles.header_right.border}></div>
                        <img
                            style={styles.header_right.logo2}
                            src={LogoFlexskip}
                            alt=""
                        />
                    </div>
                </div>
                <div style={styles.table}>
                    <h4 style={{ paddingLeft: 10, marginBottom: 20 }}>
                        {organisation.name} - {organisation.address}
                    </h4>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: 10,
                            color: "#239dff",
                            marginBottom: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 20,
                                    width: 100,
                                }}
                            >
                                Request
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    fiexDirection: "row",
                                }}
                            >
                                {["Pending", "Completed"].map((status, index) => {
                                    const isSelected = statusFilter === status;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                onChangeStatusFilter(status)
                                            }
                                            className={`order-table-expdand-button ${isSelected ? "active" : ""
                                                }`}
                                        >
                                            {status}
                                        </div>
                                    );
                                })}
                                <div
                                    onClick={onExportCSV}
                                    className="order-table-expdand-button active"
                                >
                                    Export to CSV
                                </div>
                            </div>
                        </div>
                    </div>
                    <table style={{ margin: 0 }} className="table">
                        <thead>
                            <tr
                                style={{
                                    background: "rgba(240, 248, 255, 0.8)",
                                }}
                            >
                                {columnsSummary.map((column, index) => {
                                    const orderType =
                                        orderBy === column.dataField
                                            ? order
                                            : undefined;
                                    return (
                                        <th
                                            className="table-sort"
                                            key={index}
                                            style={{
                                                ...styles.table.header,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <p
                                                    style={{ margin: 0 }}
                                                    className="line-clamp-1"
                                                >
                                                    {column.text}
                                                </p>
                                                {column.sorter && (
                                                    <div
                                                        onClick={() =>
                                                            handleRequestSort(
                                                                column.dataField
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.table.sorter,
                                                            ...(orderType ===
                                                                "asc" && {
                                                                backgroundColor:
                                                                    "#CBE6FF",
                                                                transform:
                                                                    "rotate(180deg)",
                                                            }),
                                                        }}
                                                    >
                                                        <svg
                                                            width="8"
                                                            height="5"
                                                            viewBox="0 0 8 5"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M3.60957 4.71044C3.80973 4.96065 4.19027 4.96065 4.39043 4.71044L7.35012 1.01083C7.61203 0.683453 7.37894 0.198486 6.95969 0.198486L1.04031 0.198486C0.62106 0.198486 0.387973 0.683451 0.649878 1.01083L3.60957 4.71044Z"
                                                                fill={
                                                                    orderType
                                                                        ? "#00AEEF"
                                                                        : "#CDCDCD"
                                                                }
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                {statusFilter === "Pending" && (
                                    <th></th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((collection, index1) => {
                                const isOverdue = false;
                                return (
                                    <tr
                                        scope="row"
                                        className="table-row-hover"
                                        key={index1}
                                        style={{
                                            background: isOverdue ? "#FFF2F2" : "",
                                        }}
                                    >
                                        {columnsSummary.map((column, index2) => {
                                            const { dataField, style, formatter } =
                                                column;
                                            return (
                                                <td
                                                    key={index1 + "-" + index2}
                                                    style={{
                                                        ...styles.table.rowCell,
                                                        ...style,
                                                    }}
                                                >
                                                    {formatter
                                                        ? formatter(
                                                            collection[dataField]
                                                        )
                                                        : collection[dataField]}
                                                </td>
                                            );
                                        })}
                                        {statusFilter === "Pending" && (
                                            <td
                                                style={{
                                                    ...styles.table.rowCell,
                                                    textAlign: "center",
                                                    width: 30,
                                                }}
                                            >
                                                <button onClick={() => onCloseCollectionRequest(collection._id)} className="btn btn-primary">Mark as complete</button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {data.pagination.totalCount === 0 && (
                        <h4 style={{ textAlign: "center", padding: 20 }}>
                            No data!
                        </h4>
                    )}
                </div>
            </div>
            {/* Mobile */}
            <div className="visible-xs">
                <RunsheetTableMobile
                    order={order}
                    orderBy={orderBy}
                    handleRequestSort={handleRequestSort}
                    data={data}
                    onChangeStatusFilter={onChangeStatusFilter}
                    statusFilter={statusFilter}
                    onExportCSV={onExportCSV}
                    onCloseCollectionRequest={onCloseCollectionRequest} />
            </div>
            {data.pagination.totalCount > 0 && (
                <div style={styles.footerBox}>
                    <div style={{ display: "block", marginTop: 15 }}>
                        <span
                            style={{
                                lineHeight: "36px",
                                fontSize: 16,
                                paddingRight: 15,
                                display: "inline-block",
                                position: "relative",
                                float: "left",
                            }}
                        >
                            Show
                        </span>
                        <Select
                            simpleValue
                            className="page-select-box"
                            name="perPage"
                            placeholder="10 records"
                            clearable={false}
                            value={pageSize}
                            options={[
                                { value: 10, label: "10 records" },
                                { value: 25, label: "25 records" },
                                { value: 50, label: "50 records" },
                                { value: 100, label: "100 records" },
                                { value: 200, label: "200 records" },
                            ]}
                            onChange={handlePerPageChange}
                        />
                    </div>

                    {data.pagination.totalCount > data.pagination.perPage ? (
                        <div>
                            <Pagination
                                page={data.pagination.currentPage}
                                pageCount={data.pagination.pageCount}
                                onChange={handlePageChange}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

RunsheetTable.propTypes = {
    pageSize: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    handlePerPageChange: PropTypes.func.isRequired,
    onExportCSV: PropTypes.func.isRequired,
    organisation: PropTypes.object.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    handleRequestSort: PropTypes.func.isRequired,
    onChangeStatusFilter: PropTypes.func.isRequired,
    statusFilter: PropTypes.string.isRequired,
    onCloseCollectionRequest: PropTypes.func.isRequired,
};

export default RunsheetTable;
