import React, { useEffect, useState } from 'react'
import Widgets2 from '../../../Common/CommonWidgets/Widgets2'
import { Widgets2Data, Widgets2Data2 } from '../../../../Data/DefaultDashboard'
import {
    Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Media, Nav, NavItem, NavLink, Row, UncontrolledDropdown,
    Badge
} from 'reactstrap';
import MonthlyChart from './MonthlyChart';
import LineChartClass from '../../../Charts/ChartsJs/LineChart';
import { BarChart } from '../../../../Constant';
import BarChartClass from '../../../Charts/ChartsJs/BarChart';
import DataTables from '../../../Tables/DataTable';
import DataTableComponent from '../../../Tables/DataTable/DataTableComponent';
import DatePicker from 'react-datepicker';
import { H5, Image, P, Progressbar } from '../../../../AbstractElements';
import axios from 'axios';
import { baseURL, imageURL, productBaseURL } from '../../../../Services/api/baseURL';
import { useDataContext } from '../../../../context/hooks/useDataContext';
import DataTable from 'react-data-table-component';
import dummyImg from '../../../../../src/assets/images/product/1.png';
import { debounce } from 'lodash';
import { addMonths } from 'date-fns';
import moment from 'moment';
import squareBox from '../../../../../src/assets/images/sqaurebox.svg'
import Loader from "../../../Loader/Loader";
import OrdersTable from '../Orders/OrdersTable';



const Dashboard = () => {
    const { setCategoryData } = useDataContext();
    const [startDate, setstartDate] = useState(new Date());
    const [countData, setCountData] = useState();
    const [activeTab, setActiveTab] = useState("today");
    const [loading, setLoading] = useState(false);

    const handleChange = (date) => {
        setstartDate(date);
    };

    // Format currency in INR
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "₹0";
        return (
            "₹" +
            Number(value).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    };

    const getCount = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const response = await axios.get(
                `${baseURL}/api/dashboard/dashboard-stats`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            setCountData(response?.data?.data);
            console.log(response, "respomsnei");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCount();
    }, []);

    return (
        <div className="dashboard_container" style={{ paddingTop: "10px" }}>
            <Container fluid={true} className="general-widget">
                <div className="card">
                    <div className="card-body pt-3">
                        <Row>
                            {/* Total Orders */}
                            <Col xl="3" sm="6">
                                <Card className="social-widget mb-0">
                                    <CardBody>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={squareBox} className="square_box" alt="box" />
                                                <h6 className="mb-0"> Total Orders</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <h5 className="fw-600 f-16 mb-0">
                                                {countData?.totalOrders ? countData?.totalOrders : 0}
                                            </h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

                            {/* Total Customers */}
                            <Col xl="3" sm="6">
                                <Card className="social-widget mb-0">
                                    <CardBody>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={squareBox} className="square_box" alt="box" />
                                                <h6 className="mb-0"> Total Customers</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <h5 className="fw-600 f-16 mb-0">
                                                {countData?.totalCustomers
                                                    ? countData?.totalCustomers
                                                    : 0}
                                            </h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>

                            {/* Total Revenue */}
                            <Col xl="3" sm="6">
                                <Card className="social-widget mb-0">
                                    <CardBody>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={squareBox} className="square_box" alt="box" />
                                                <h6 className="mb-0">Total Revenue</h6>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-3">
                                            <h5 className="fw-600 f-16 mb-0">
                                                {formatCurrency(countData?.totalTransactions)}
                                            </h5>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>

                <MonthlyChart />
                <Row>
                    <Col lg={12} md={12}>
                        <BarChartClass />
                    </Col>
                </Row>

                <Col>
                    <OrdersCard />
                </Col>
            </Container>
        </div>
    );
};

export default Dashboard;




export const OrdersCard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchText, setSearchText] = useState("");
    const [productId, setProductId] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0,
    });

    const token = JSON.parse(localStorage.getItem("token"));

    const fetchOrders = async (page = 1, perPage = pagination.perPage) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/orders/admin`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    perPage,
                    search: searchText || undefined,
                    productId: productId || undefined,
                    startDate: startDate ? startDate.toISOString() : undefined,
                    endDate: endDate ? endDate.toISOString() : undefined,
                },
            });

            if (Array.isArray(response?.data?.orders)) {
                setOrderData(response.data.orders);
                setPagination((prev) => ({
                    ...prev,
                    totalRows: response?.data?.totalOrders || 0,
                    page,
                    perPage,
                }));
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getBadgeColor = (status, type) => {
        if (!status) return "secondary"; // default if empty
        const normalized = status.toLowerCase();

        if (type === "paymentStatus") {
            return (
                {
                    pending: "danger",
                    failed: "danger",
                    paid: "success",
                    success: "success",
                }[normalized] || "secondary"
            );
        }

        if (type === "order") {
            return (
                {
                    placed: "warning",
                    confirmed: "info",
                    processing: "primary",
                    shipped: "primary",
                    delivered: "success",
                    cancelled: "danger",
                    returned: "secondary",
                    pending: "danger",
                }[normalized] || "secondary"
            );
        }

        if (type === "delivery") {
            return (
                {
                    pending: "danger",
                    in_transit: "primary",
                    delivered: "success",
                    accepted: "success",
                    cancelled: "danger",
                    failed: "danger",
                }[normalized] || "secondary"
            );
        }

        if (type === "placed") {
            return (
                {
                    placed: "warning",
                    cancelled: "danger",
                    delivered: "success",
                    failed: "danger",
                }[normalized] || "secondary"
            );
        }

        return "secondary";
    };
    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        fetchOrders(pagination.page, pagination.perPage);
    }, [pagination.page, pagination.perPage, searchText, productId, startDate, endDate]);


    const debouncedSearch = React.useRef(
        debounce((term) => setSearchText(term), 300)
    ).current;

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
        // reset to first page on new search
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const orderColumns = [
        { name: "Order ID", selector: (row) => row._id, sortable: true, width: "150px" },
        {
            name: "Customer",
            selector: (row) => row.user?.name,
            sortable: true,
            width: "200px",
            cell: (row) => (
                <div>
                    <div>{row.user?.name || "N/A"}</div>
                    <small className="text-muted">{row.user?.email || "N/A"}</small>
                </div>
            ),
        },
        { name: "Items", selector: (row) => row.items?.length || 0, sortable: true, width: "80px" },
        {
            name: "Delivery charges",
            selector: (row) => row.deliveryCharge,
            sortable: true,
            cell: (row) => (
                <span className="fw-bold">₹{row.deliveryCharge?.toLocaleString("en-IN")}</span>
            ),
        },
        {
            name: "Delivery Address",
            cell: (row) => (
                <div style={{ maxWidth: "200px" }}>
                    <small>{row.address?.city || "N/A"}</small>
                </div>
            ),
        },
        {
            name: "Total Amount",
            selector: (row) => row.grandTotal,
            sortable: true,
            cell: (row) => (
                <span className="fw-bold">₹{row.grandTotal?.toLocaleString("en-IN")}</span>
            ),
        },
        {
            name: "Payment Status",
            selector: (row) => row.paymentStatus,
            sortable: true,
            cell: (row) => (
                <Badge color={getBadgeColor(row.paymentStatus, "paymentStatus")}>
                    {row.paymentStatus?.toUpperCase()}
                </Badge>
            ),
        },
        {
            name: "Order Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <Badge color={getBadgeColor(row.status, "placed")}>
                    {row.status?.toUpperCase()}
                </Badge>
            ),
        },
        {
            name: "Coupon Applied",
            selector: (row) => row.coupon,
            sortable: true,
            cell: (row) =>
                row.coupon ? (
                    <Badge color="info" pill>
                        {row.coupon}
                    </Badge>
                ) : (
                    "No Coupon"
                ),
        },
        {
            name: "Order Date",
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => moment(row.createdAt).format("DD/MM/YYYY"),
        },
    ];

    return (
        <Card>
            <div  style={{ padding: "15px" }}>

                <OrdersTable />
</div>
        </Card>
    );
};


const DatePickerComponent = ({
    startDate, endDate, setStartDate, setEndDate
}) => {

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <DatePicker className="form-control datepickerr digits mx-2" selected={startDate}
            onChange={onChange}
            minDate={new Date()}
            maxDate={addMonths(new Date(), 5)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            showIcon
            placeholderText='Select Date'
        />
    );
}

