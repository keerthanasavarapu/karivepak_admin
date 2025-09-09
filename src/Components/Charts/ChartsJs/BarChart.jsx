import React, { Fragment, useEffect, useState } from "react";
import { Col, Card, CardBody, NavItem, NavLink, Nav } from "reactstrap";
import DatePicker from "react-datepicker";
import { baseURL } from "../../../Services/api/baseURL";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useDataContext } from "../../../context/hooks/useDataContext";
import moment from "moment";

const BarChartClass = () => {
    const { categoryData } = useDataContext();
    const [activeTab, setActiveTab] = useState("revenue");
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleTabClick = (tab) => setActiveTab(tab);

    const fetchDashboardData = async (date = startDate) => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (!token || !date) return;

        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/api/dashboard/daily-report`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { month, year },
            });

            // API returns { month, year, reports: [] }
            setData(response?.data?.reports || []);
        } catch (error) {
            console.log(error.response?.status, error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = (list, tab) => {
        if (!Array.isArray(list) || list.length === 0) return 0;
        if (tab === "revenue") return list.reduce((acc, cur) => acc + cur.totalAmount, 0);
        if (tab === "order") return list.reduce((acc, cur) => acc + cur.totalOrders, 0);
        if (tab === "customer") return list.reduce((acc, cur) => acc + cur.totalUsers, 0);
        return 0;
    };

    useEffect(() => {
        setTotalDataCount(calculateTotal(data, activeTab));
    }, [data, activeTab]);

    useEffect(() => {
        fetchDashboardData(startDate);
    }, []);

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    return (
        <Fragment>
            <Col xl="12" md="12">
                <Card>
                    <div
                        className="card-header d-flex align-items-center justify-between"
                        style={{ padding: "15px 30px" }}
                    >
                        <Nav tabs className="product_variant_tabs">
                            <NavItem>
                                <NavLink
                                    className={activeTab === "revenue" ? "active" : ""}
                                    onClick={() => handleTabClick("revenue")}
                                >
                                    Revenue
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === "order" ? "active" : ""}
                                    onClick={() => handleTabClick("order")}
                                >
                                    Order
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={activeTab === "customer" ? "active" : ""}
                                    onClick={() => handleTabClick("customer")}
                                >
                                    Customer
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <div className="d-flex align-items-center file-content file-content-dash">
                            <DatePicker
                                className="form-control datepickerr digits mx-2"
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    fetchDashboardData(date);
                                }}
                                showMonthYearPicker
                                showYearDropdown
                                scrollableYearDropdown
                                dateFormat="MMM yyyy"
                                yearItemNumber={9}
                                showIcon
                                placeholderText="Select Month & Year"
                                minDate={new Date(2020, 0)}
                                maxDate={new Date()}
                            />
                        </div>
                    </div>

                    <CardBody className="chart-block" style={{ padding: "15px" }}>
                        {Array.isArray(data) && (
                            <div style={{ position: "relative" }}>
                                <Bar
                                    data={{
                                        labels: Array.from(
                                            { length: moment(startDate).daysInMonth() },
                                            (_, i) => (i + 1).toString().padStart(2, "0")
                                        ),
                                        datasets: [
                                            {
                                                label: capitalizeFirstLetter(activeTab),
                                                data: Array.from(
                                                    { length: moment(startDate).daysInMonth() },
                                                    (_, i) => {
                                                        const dayData = data.find((entry) => entry.day === i + 1);
                                                        if (!dayData) return 0;

                                                        if (activeTab === "revenue") return dayData.totalAmount || 0;
                                                        if (activeTab === "order") return dayData.totalOrders || 0;
                                                        if (activeTab === "customer") return dayData.totalUsers || 0;
                                                        return 0;
                                                    }
                                                ),
                                                backgroundColor: "#007F2D",
                                                borderRadius: 5,
                                                borderWidth: 2,
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: { display: false },
                                            title: {
                                                display: true,
                                                position: "bottom",
                                                text: moment(startDate).format("MMM YYYY"),
                                                padding: { top: 20 },
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        layout: { padding: { top: 50, bottom: 20 } },
                                    }}
                                />
                                <div>
                                    <h5
                                        style={{ position: "absolute", top: 0, left: 0, margin: "0" }}
                                        className="fw-bolder"
                                    >
                                        {capitalizeFirstLetter(activeTab)}
                                    </h5>
                                    <p style={{ position: "absolute", top: 0, right: 0 }}>
                                        {activeTab !== "customer" && (
                                            <span>
                                                <b>Total {capitalizeFirstLetter(activeTab)}:</b>{" "}
                                                {activeTab === "revenue" ? "₹" : ""}
                                                {totalDataCount.toFixed(2)}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Fragment>
    );
};

export default BarChartClass;
