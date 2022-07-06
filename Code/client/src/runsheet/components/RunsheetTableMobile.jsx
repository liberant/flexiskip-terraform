import PropTypes from "prop-types";
import React from "react";
import LogoFlexskip from "../../public/images/flexi-logo-small.png";
import RunsheetSummary from "../../public/images/runsheet-summary.png";
import { statusFormatter, dueDateFormatter} from "./columnsDef";
import Select from "react-select";
import Pagination from "../../common/components/Pagination";


const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
        background: "#CBE6FF",
        height: "67px",
        borderBottom: "3px solid #9FCAEB",
        overflowX: "auto",
        overflowY: "hidden",
    },
    header_left: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        justifyContent: 'start',
        padding: "30px 0",
        h1: {
            color: "#231F20",
            fontSize: "20px",
            lineHeight: "32px",
            fontWeight: 700,
            margin:0
        },
    },
    box_count: {
        borderRadius: "4px",
        backgroundColor: "#F3FAFF",
        padding: "6px 14px",
        p: {
            fontSize: "16px",
            lineHeight: "18px",
            letterSpacing: "3px",
            margin: 0,
            color: '#464F60'
        },
    },
    header_right: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        gap: "26px",
        width: '100%',
        logo1: {
            width: "45px",
            height: "45px",
        },
        logo2: {
            width: "130px",
            height: "29px",
        },
        border: {
            height: "67px",
            width: 1,
            background: "#9FCAEB",
        },
    },
    footerBox: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 15,
        color: "#666666",
    },
    title : {
        color: '#231F20',
        fontSize: 12,
        paddingBottom: 2,
    },
    content : {
        color: '#464F60',
        fontSize: 12,
    }
};

const RunsheetTableMobile = ({
    data,
    order,
    orderBy,
    handleRequestSort,
    onChangeStatusFilter,
    statusFilter,
    onExportCSV,
    onCloseCollectionRequest,
}) => {
    return (
        <div>
            <div style={styles.header}>
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
            <div style={{
                padding: '0 12px'
            }}>
                <div style={styles.header_left}>
                    <h1 style={styles.header_left.h1}>RUNSHEET SUMMARY</h1>
                    <div style={styles.box_count}>
                        <h5 style={styles.box_count.p}>
                            {data.pagination.totalCount}
                        </h5>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        fiexDirection: "row",
                        marginBottom: 20
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
                <Select
                    simpleValue
                    className="w-100"
                    name="perPage"
                    placeholder="SORT BY CATEGORY"
                    clearable={false}
                    value={`${orderBy}-${order}`}
                    options={[
                        { value: 'status-asc', label: "STATUS (ASCENDING)" },
                        { value: 'status-desc', label: "STATUS (DESCENDING)" },
                        { value: 'crCode-asc', label: "CR NO. (ASCENDING)" },
                        { value: 'crCode-desc', label: "CR NO. (DESCENDING)" },
                        { value: 'qrCode-asc', label: "QR NO. (ASCENDING)" },
                        { value: 'qrCode-desc', label: "QR NO. (DESCENDING)" },
                        { value: 'division-asc', label: "DIVISION (ASCENDING)" },
                        { value: 'division-desc', label: "DIVISION (DESCENDING)" },
                        { value: 'dayCount-asc', label: "DAY COUNT (ASCENDING)" },
                        { value: 'dayCount-desc', label: "DAY COUNT (DESCENDING)" },
                        { value: 'dueDate-asc', label: "DUE DATE (ASCENDING)" },
                        { value: 'dueDate-desc', label: "DUE DATE (DESCENDING)" },
                    ]}
                    onChange={(value) => {
                        const orderBy = value.split('-')[0];
                        const order = value.split('-')[1];
                        handleRequestSort(orderBy, order);
                    }}
                />
               {data.data.map((collection, index) => {
                   return (
                       <div key={index} style={{ marginTop: 16 }}>
                           <div style={{
                               background: '#F0F8FFCC',
                               border: '1px solid #E9EDF5',
                               borderBottom: 0,
                               padding: '10px 16px',
                               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                           }}>
                               <div>
                                   <p style={styles.title}>DUE DATE</p>
                                   {dueDateFormatter(collection.dueDate, '#fff')}
                               </div>
                               <div>
                                   <p style={styles.title}>CR NO.</p>
                                   <p style={{ ...styles.content , fontSize: 14 }}>{collection.crCode}</p>
                               </div>
                               <div>
                                   <p style={styles.title}>QR NO.</p>
                                   <p style={{ ...styles.content, fontSize: 14 }}>{collection.qrCode}</p>
                               </div>
                           </div>
                           <div style={{
                               border: '1px solid #E9EDF5',
                               padding: '26px 16px',
                               display: 'flex',
                               flexDirection: 'column',
                               gap: 20
                           }}>
                               <div>
                                   <p style={styles.title}>ADDRESS</p>
                                   <p style={styles.content}>{collection.address}</p>
                               </div>
                               <div>
                                   <p style={styles.title}>COLLECTION ADDRESS</p>
                                   <p style={styles.content}>{collection.collectionAddress}</p>
                               </div>
                               <div style={{
                                   display: 'flex', alignItems: 'center',
                                   justifyContent: 'start', gap: '40px'
                               }}>
                                   <div >
                                       <p style={styles.title}>DIVISION</p>
                                       <p style={{ ...styles.content, fontSize: 14 }}>{collection.division || 'N/A'}</p>
                                   </div>
                                   <div>
                                       <p style={styles.title}>DAY COUNT</p>
                                       <p style={{ ...styles.content, fontSize: 14 }}>{collection.dayCount}</p>
                                   </div>
                               </div>
                               <div>
                                   <p style={styles.title}>STATUS</p>
                                   {statusFormatter(collection.status)}
                               </div>
                               <div>
                                   <p style={styles.title}>COMMENTS</p>
                                   <p style={styles.content}>{collection.comments}</p>
                               </div>
                               {statusFilter === "Pending" && (
                                   <div>
                                       <button onClick={() => onCloseCollectionRequest(collection._id)} className="btn btn-primary">Mark as complete</button>
                                   </div>

                               )}
                           </div>
                       </div>
                   )
               })}
            </div>
        </div>
    );
};

RunsheetTableMobile.propTypes = {
    data: PropTypes.object.isRequired,
    onExportCSV: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    handleRequestSort: PropTypes.func.isRequired,
    onChangeStatusFilter: PropTypes.func.isRequired,
    statusFilter: PropTypes.string.isRequired,
    onCloseCollectionRequest: PropTypes.func.isRequired,
};

export default RunsheetTableMobile;
