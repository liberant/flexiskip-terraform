import React, { useEffect, useState, useMemo, useCallback } from "react";
import Spinner from "../../common/components/Spinner";
import FormPassword from "../components/FormPassword";
import RunsheetTable from "../components/RunsheetTable";
import httpClient from "../../common/http";
import { setCookie, getCookie, removeCookie } from '../../common/utils/cookies';
import { buildQueryString } from '../../common/helpers';
import { API_URL } from '../../common/constants/params';
import RunsheetTableMobile from "../components/RunsheetTableMobile";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const usePagination = () => {
    const [perPage, setPerPage] = useState(25);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageCount: 1,
        perPage: 10,
        totalCount: 1,
    })

    const handlePageChange = (val) => {
        setPage(val)
    }

    const handlePerPageChange = (val) => {
        setPerPage(val)
    }
    return {
        perPage,
        page,
        pagination,
        setPagination,
        handlePageChange,
        handlePerPageChange,
    }
}

const RunsheetPage = (props) => {
    const { url } = props.match.params;
    const {history } = props;
    const [password, setPassword] = useState(getCookie('runsheet_password'));

    const [statusFilter, setStatusFilter] = useState('Pending');

    const [collections, setCollections] = useState([]);
    const [organisation, setOrganisation] = useState();
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("");

    const [loading, setLoading] = useState([]);

    const {
        perPage,
        page,
        pagination,
        setPagination,
        handlePageChange,
        handlePerPageChange,
    } = usePagination();

    const handleRequestSort = (dataField, sortOrder) => {
        const isAsc = orderBy === dataField && order === "asc";
        setOrder(sortOrder ? sortOrder : isAsc ? "desc" : "asc");
        setOrderBy(dataField);
    };

    const onChangeStatusFilter = (val) => {
        handlePageChange(1);
        setStatusFilter(val);
    }

    const getCollectionsSummary = useCallback(async() => {
        try {
            if (!password) return;
            setLoading(true);
            const payload = {
                limit: perPage, page, status: statusFilter
            }
            const { data } = await httpClient.post(`/runsheet?${buildQueryString(payload)}`, {
                url,
                password,
            });

            setCollections(data.collections);
            setOrganisation(data.organisation);
            setPagination(data.pagination);
            if (!getCookie('runsheet_password')){
                setCookie('runsheet_password', password, 7);
            }
        } catch (error) {
            const { message } = error.response.data
            if(message){
                if (message.includes('not match')) {
                    alert(message);
                    setPassword(undefined);
                    removeCookie('runsheet_password');
                }
                if (message.includes("not found")) {
                    alert(message);
                    history.push('/login');
                }
            }
        } finally {
            setLoading(false);
        }
    }, [password, statusFilter, page, perPage]);

    // only pending collections
    const onExportCSV = async () => {
        try {
            if (!organisation) return;
            const href = `runsheet/report?${buildQueryString({
                organisationId: organisation._id,
                status: statusFilter
            })}`;
            const url = `${API_URL}/${href.replace(/^\//, '')}`;
            window.location = url;
        } catch (error) {
            const { message } = error.response.data;
            console.log(message);
        }
    }

    const onCloseCollectionRequest = async (id) => {
        try {
            setLoading(true);
            await httpClient.put(`/runsheet/close-job/${id}`);
            await getCollectionsSummary();
        } catch (error) {
            const { message } = error.response.data;
            console.log(message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCollectionsSummary();
    }, [password, statusFilter, page, perPage]);

    const data = useMemo(() => stableSort(collections, getComparator(order, orderBy)), [collections, order, orderBy]);

    if (loading) return <Spinner />

    if (!password) return <FormPassword onSubmit={({ password }) => setPassword(password)} />

    if (!organisation) return null;

    return (
        <div>
            <RunsheetTable
                order={order}
                orderBy={orderBy}
                handleRequestSort={handleRequestSort}
                organisation={organisation}
                data={{
                    data,
                    pagination,
                }}
                onChangeStatusFilter={onChangeStatusFilter}
                statusFilter={statusFilter}
                onExportCSV={onExportCSV}
                pageSize={perPage}
                handlePageChange={handlePageChange}
                handlePerPageChange={handlePerPageChange}
                onCloseCollectionRequest={onCloseCollectionRequest}
            />
        </div>
    );
};

export default RunsheetPage;
