import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Col, Row, Button } from "reactstrap";
import axios from "axios";
import { baseURL } from "../../../../Services/api/baseURL";
import Loader from "../../../Loader/Loader";
import exportExcelUser from "../../../Reports/components/exportExcelCustomer";

const UserTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0,
    });

    const userCols = [
                {
            name: "UserId",
            selector: (row) => row?.userId || "NA",
            sortable: true,
        },
        {
            name: "User Name",
            selector: (row) => row?.name,
            sortable: true,
            cell: (row) => (
                <div>
                    <div>{row?.name}</div>
                    <div style={{ fontSize: "12px", color: "gray" }}>{row?.mobile_number}</div>
                </div>
            ),
        },
        {
            name: "User Email",
            selector: (row) => row?.email || "NA",
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) => row?.role,
            sortable: true,
            width: "120px",
        },
    ];

    // Fetch paginated users
    const fetchUsers = async (page = 1) => {
        setIsLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const response = await axios.get(`${baseURL}/api/user/getallusers`, {
                params: { page, limit: pagination.perPage },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                const users = response.data.data;
                const totalUsers = response.data.data.length || response.data.totalUsers || 0;

                setUsersData(users);
                setPagination((prev) => ({
                    ...prev,
                    totalRows: totalUsers,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all users for Excel export
    const fetchAllUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("token"));
            const response = await axios.get(`${baseURL}/api/user/getallusers?all=true`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                //  users with a "role" property
                const onlyUsers = response?.data?.data?.filter(u => u.role === 'user');
                setAllUsers(onlyUsers);
            }

        } catch (error) {
            console.error("Failed to fetch all users", error);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.page);
    }, [pagination.page, pagination.perPage]);

    useEffect(() => {
        fetchAllUsers(); // For Excel export
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = allUsers.filter(
        (t) =>
            t?.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t?.email?.toString().includes(searchQuery.toLowerCase()) ||
            t?.mobile_number?.toLowerCase().includes(searchQuery.toLowerCase())

    );

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleRowsPerPageChange = (perPage) => {
        setPagination({ page: 1, perPage, totalRows: pagination.totalRows });
    };

    const downloadExcelUserData = () => {
        exportExcelUser(allUsers);
    };

    return (
        <Fragment>
            <Row className="pb-2">
                <Col md={12} className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Users</h4>
                    <div className="d-flex align-items-center">
                        <div className="mb-0 form-group position-relative search_outer d-flex align-items-center me-2">
                            <i className="fa fa-search"></i>
                            <input
                                className="form-control border-0 ms-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                        <Button
                            type="button"
                            className="btn btn-primary d-flex align-items-center"
                            style={{ minWidth: "136px" }}
                            onClick={downloadExcelUserData}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                <path
                                    d="M9.33882 8.82071L8.125 10.0341V5.75H11.687C12.135 5.75 12.564 5.929 12.88 6.245C13.196 6.561 13.375 6.99 13.375 7.438V15.562C13.375 16.01 13.196 16.439 12.88 16.755C12.564 17.072 12.135 17.25 11.687 17.25H2.313C1.865 17.25 1.436 17.072 1.12 16.755C0.804 16.439 0.625 16.01 0.625 15.562V7.438C0.625 6.99 0.804 6.561 1.12 6.245C1.436 5.929 1.865 5.75 2.313 5.75H5.875V10.0341L4.67032 8.82962C4.44849 8.61864 4.16527 8.50765 3.87192 8.51141C3.57855 8.51516 3.29827 8.63337 3.09082 8.84082C2.88337 9.04827 2.76516 9.32856 2.76141 9.62191C2.75765 9.91527 2.86864 10.1985 3.07071 10.4112L6.20465 13.5454C6.41572 13.7563 6.70176 13.8747 7 13.8747C7.29824 13.8747 7.58428 13.7563 7.79523 13.5455L10.9293 10.4112C11.1314 10.1985 11.2423 9.91527 11.2386 9.62191C11.2348 9.32855 11.1166 9.04827 10.9092 8.84082C10.7017 8.63337 10.4214 8.51516 10.1281 8.51141C9.83473 8.50765 9.55151 8.61864 9.33882 8.82071ZM7.08839 0.786612C7.11183 0.810053 7.125 0.841847 7.125 0.875V4.75H6.875V0.875C6.875 0.841849 6.88817 0.810054 6.91161 0.786612C6.93505 0.763169 6.96685 0.75 7 0.75C7.03315 0.75 7.06495 0.76317 7.08839 0.786612Z"
                                    fill="white"
                                    stroke="white"
                                />
                            </svg>
                            <span className="ms-2">Export Excel</span>
                        </Button>
                    </div>
                </Col>
            </Row>

            {isLoading ? (
                <Loader />
            ) : (
                <DataTable
                    data={filteredData}
                    columns={userCols}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                    progressPending={isLoading}
                    progressComponent={<Loader />}
                />
            )}
        </Fragment>
    );
};

export default UserTable;
