import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Col, Row } from "reactstrap";
import { baseURL, productBaseURL } from "../../../../Services/api/baseURL";
import Loader from "../../../Loader/Loader";
import axios from "axios";

const CustomerTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [customersData, setCustomersData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const customerCols = [
        {
            name: "Customer Name",
            selector: row => row?.firstName + " " + (row?.lastName !== null ? row?.lastName : ""),
            sortable: true,
        },
        {
            name: "Customer Email",
            selector: row => row?.email,
            cell: (row) => (
                row?.email === null ? "NA" : row?.email
            ),
            sortable: true,
        },
        {
            name: "Orders",
            selector: row => row?.totalOrders ? row?.totalOrders : 0,
            sortable: true,
        },
        {
            name: "Amount Paid",
            selector: row => row?.totalAmount ? '$' + row?.totalAmount.toFixed(2) : `$0`,
            sortable: true,
        },
        {
            name: "Address",
            selector: row => row?.address?.address ? row?.address?.address : 'N/A',
            cell: (row) => (
                <div style={{ textAlign: 'left'}} className="w-full text-left">
                    {row?.address?.address ? row?.address?.address : 'N/A'}
                </div>
            ),
            sortable: true,
            center: true,
        }
    ];

    const fetchCustomers = async () => {
        setIsLoading(true);
        try {
            const token = await JSON.parse(localStorage.getItem('token'));
            const response = await axios.get(`${baseURL}/api/customers/get-customers-list`, {
                headers: {
                    Authorization: `${token}`,
                }
            });

            if (response.status === 200) {
                const customersData = response?.data?.data;
                setCustomersData(customersData);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = customersData.filter((customer) => {
        const fullName = `${customer?.firstName} ${customer?.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase()) ||
               customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               customer?.address?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Fragment>
            <Row xxl={12} className='pb-2'>
                <Row>
                    <Col md={12} lg={12} xl={12} xx={12}>
                        <div className="file-content file-content1 justify-content-between">
                            <h5 className="font-bold">
                                Customers
                            </h5>
                            <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                                <i className="fa fa-search"></i>
                                <input
                                    className="form-control border-0"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    type="text"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>
            {isLoading ? (
                <Loader />
            ) : (
                <DataTable style={{ textAlign: 'right' }}
                    data={filteredData}
                    columns={customerCols}
                    pagination
                />
            )}
        </Fragment>
    );
};

export default CustomerTable;
