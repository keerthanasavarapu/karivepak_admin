import React, { Fragment, Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink, Card, CardBody, Button, Input } from 'reactstrap';
import { H3 } from '../../../../AbstractElements';
import ReportsCountCard from './components/countCard';
import OrdersTable from './components/ordertable';
import DatePicker from 'react-datepicker';
import { baseURL } from '../../../../Services/api/baseURL';
import axios from 'axios';
import moment from 'moment';
import exportToExcel from './components/exportToExcel';
import SellsTable from './components/sellsTable';

function ReportsComponent() {
    const [activeTab, setActiveTab] = useState('orders');
    const [filterDateTab, setFilterDateTab] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [storeData, setStoreData] = useState([]);
    const [countData, setCountData] = useState();
    const [tableData, setTableData] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [subCollectionData, setSubCollectionData] = useState([])
    const [collectionData, setCollectionData] = useState([])

    const userRoles = JSON.parse(localStorage.getItem("role_name"));

    const handleTab = (step) => {
        setActiveTab(step);
    };

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        setFilterDateTab(null);
    };

    const fetchStores = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const stores = await axios.get(`${baseURL}/api/store/get-all-stores`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            let filteredData = stores?.data?.data.filter((item) => item.status === "active");
            setStoreData(filteredData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const getCount = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        const userData = await JSON.parse(localStorage.getItem('UserData'))

        try {

            let params = {};
            let url = "";

            switch (filterDateTab) {
                case 1: // Today
                    params.start_date = moment().startOf('day').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('day').format('YYYY-MM-DD');
                    break;
                case 2: // Weekly
                    params.start_date = moment().startOf('week').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('week').format('YYYY-MM-DD');
                    break;
                case 3: // Monthly
                    params.start_date = moment().startOf('month').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('month').format('YYYY-MM-DD');
                    break;
                default:
                    break;
            }

            if (startDate && endDate) {
                params.start_date = moment(startDate).format('YYYY-MM-DD');
                params.end_date = moment(endDate).format('YYYY-MM-DD');
            }

            if (activeTab === "orders") {
                url = `${baseURL}/get-orders-report-count`;
                if (storeId) {
                    params.store_id = storeId;
                }
            }
            if (activeTab === "sells") {
                url = `${baseURL}/api/order/get-all-category-sells-count`;
                params.store_id = undefined

            }

            const userRole = JSON.parse(localStorage.getItem("role_name"));

            if (userRole !== 'admin') {
                params.store_id = userData?._id
            }

            await axios.get(`${url}`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            }).then((res) => {
                if (res && res.status === 200) {
                    setCountData(res?.data?.data);
                }
            })
        }
        catch (error) {
            console.log()
        }
    }

    const getData = async () => {
        // setIsLoading(true);

        try {
            const token = await JSON.parse(localStorage.getItem("token"));
            const userData = await JSON.parse(localStorage.getItem('UserData'))

            let url;
            let params = {};

            if (activeTab === "orders") {
                url = `${baseURL}/get-all-report-orders`;
                if (storeId) {
                    params.store_id = storeId;
                }
            }

            if (activeTab === "sells") {
                url = `${baseURL}/api/order/get-all-sells-variants`;
                params.store_id = undefined
            }

            const userRole = JSON.parse(localStorage.getItem("role_name"));

            if (userRole !== 'admin') {
                params.store_id = userData?._id
            }
            
            switch (filterDateTab) {
                case 1: // Today
                    params.start_date = moment().startOf('day').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('day').format('YYYY-MM-DD');
                    break;
                case 2: // Weekly
                    params.start_date = moment().startOf('week').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('week').format('YYYY-MM-DD');
                    break;
                case 3: // Monthly
                    params.start_date = moment().startOf('month').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('month').format('YYYY-MM-DD');
                    break;
                default:
                    break;
            }

            if (startDate && endDate) {
                params.start_date = moment(startDate).format('YYYY-MM-DD');
                params.end_date = moment(endDate).format('YYYY-MM-DD');
            }

            axios.get(`${url}`, {
                params: params,
                headers: {
                    Authorization: `${token}`
                }
            })
                .then((res) => {
                    if (res?.data?.success && res) {
                        console.log(res?.data?.data);
                        setTableData(res?.data?.data);
                    }
                });
        } catch (error) {
            // setIsLoading(false);
            console.error(error);
        }
    };

    const fetchCategoryList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            let data = collectData?.data?.data.filter((item) => item.status === "active")
            setCollectionData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubcollectionsList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        let limit = 1000;
        try {
            const response = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=1&limit=${limit}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            let data = response?.data?.data.filter((item) => item.status === "active");
            setSubCollectionData(data);

        } catch (error) {
            console.log(error)
        }
    }

    const downloadExcel = () => {
        if (activeTab === "orders") {
            exportToExcel(tableData, 'Orders_Report', 'orders');
        }
        if (activeTab === "sells") {
            exportToExcel(tableData, 'Sells_Report', 'sells');
        }
    }

    useEffect(() => {
        fetchStores();
        fetchCategoryList();
        fetchSubcollectionsList();
    }, []);

    useEffect(() => {
        getData();
        getCount();
    }, [storeId, startDate, endDate, filterDateTab, activeTab]);

    return (
        <>
            <Fragment>
                <Container fluid={true}>
                    <div className='page-title'>
                        <Row>
                            <Col xs='6'>
                                <H3>Reports</H3>
                            </Col>
                            <Col xs='6'>
                                <div className='d-flex justify-content-end'>
                                    <Nav tabs className="product_variant_tabs">
                                        <NavItem>
                                            <NavLink
                                                className={activeTab === 'orders' ? "active" : ""}
                                                onClick={() => handleTab('orders')}
                                            >
                                                Orders
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={activeTab === 'sells' ? "active" : ""}
                                                onClick={() => handleTab('sells')}
                                            >
                                                Sells
                                            </NavLink>
                                        </NavItem>
                                        {/* <NavItem>
                                            <NavLink
                                                className={activeTab === 'products' ? "active" : ""}
                                                onClick={() => handleTab('products')}
                                            >
                                                Products
                                            </NavLink>
                                        </NavItem> */}
                                    </Nav>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col sm="12">
                            <Card>
                                <CardBody className="p-0 py-4">
                                    <div className="px-4 d-flex align-items-center justify-between">
                                        <Nav tabs className="product_variant_tabs mb-3">
                                            <NavItem>
                                                <NavLink
                                                    className={filterDateTab === 1 ? "active" : ""}
                                                    onClick={() => {
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                        setFilterDateTab(1)
                                                    }}
                                                >
                                                    Today
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={filterDateTab === 2 ? "active" : ""}
                                                    onClick={() => {
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                        setFilterDateTab(2)
                                                    }}
                                                >
                                                    Weekly
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={filterDateTab === 3 ? "active" : ""}
                                                    onClick={() => {
                                                        setStartDate(null);
                                                        setEndDate(null);
                                                        setFilterDateTab(3);
                                                    }}
                                                >
                                                    Monthly
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <div className='d-flex align-items-center file-content file-content-dash'>

                                            {
                                                userRoles !== 'admin' ? (<></>) : (activeTab === "orders" &&
                                                    <Input type='select' onChange={(e) => setStoreId(e.target.value)} >
                                                        <option value=''>All Stores</option>
                                                        {storeData && storeData.length > 0 && storeData.map((data) => (
                                                            <option key={data._id} value={data._id}>{data.storeName}</option>
                                                        ))}
                                                    </Input>)
                                            }
                                            <DatePicker className="datepickerr form-control digits mx-2"
                                                onChange={onChange}
                                                startDate={startDate}
                                                endDate={endDate}
                                                selectsRange
                                                showIcon
                                                placeholderText='Select Date'
                                            />
                                            <button type='button' onClick={() => downloadExcel()}
                                                className='btn btn-secondary d-flex upload_label'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                                    <path d="M9.33882 8.82071L9.33871 8.82059L9.32968 8.82962L8.125 10.0341V5.75L11.687 5.75C11.6871 5.75 11.6872 5.75 11.6874 5.75C12.1348 5.75058 12.5637 5.92857 12.8801 6.24494C13.1965 6.56141 13.3745 6.99049 13.375 7.43803V15.562C13.3745 16.0095 13.1965 16.4386 12.8801 16.7551C12.5636 17.0715 12.1345 17.2495 11.687 17.25H2.31303C1.86549 17.2495 1.43641 17.0715 1.11994 16.7551C0.803539 16.4387 0.625547 16.0097 0.625 15.5622V7.43778C0.625547 6.99032 0.80354 6.56135 1.11994 6.24494C1.43631 5.92857 1.86523 5.75058 2.31263 5.75C2.31277 5.75 2.3129 5.75 2.31303 5.75L5.875 5.75V10.0341L4.67032 8.82962L4.67043 8.8295L4.66118 8.82071C4.44849 8.61864 4.16527 8.50765 3.87192 8.51141C3.57855 8.51516 3.29827 8.63337 3.09082 8.84082C2.88337 9.04827 2.76516 9.32856 2.76141 9.62191C2.75765 9.91527 2.86864 10.1985 3.07071 10.4112L3.07059 10.4113L3.07965 10.4204L6.20465 13.5454L6.20477 13.5455C6.41572 13.7563 6.70176 13.8747 7 13.8747C7.29824 13.8747 7.58428 13.7563 7.79523 13.5455L7.79535 13.5454L10.9204 10.4204L10.9205 10.4205L10.9293 10.4112C11.1314 10.1985 11.2423 9.91527 11.2386 9.62191C11.2348 9.32855 11.1166 9.04827 10.9092 8.84082C10.7017 8.63337 10.4214 8.51516 10.1281 8.51141C9.83473 8.50765 9.55151 8.61864 9.33882 8.82071ZM7.08839 0.786612C7.11183 0.810053 7.125 0.841847 7.125 0.875V4.75H6.875V0.875C6.875 0.841849 6.88817 0.810054 6.91161 0.786612C6.93505 0.763169 6.96685 0.75 7 0.75C7.03315 0.75 7.06495 0.76317 7.08839 0.786612Z" fill="white" stroke="white" />
                                                </svg> Export Excel
                                            </button>
                                        </div>
                                    </div>

                                    <hr style={{ borderColor: "#F1F3F9", opacity: 1 }} />
                                    <ReportsCountCard data={countData} activeTab={activeTab} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <Card>
                                <CardBody style={{ padding: "15px" }}>
                                    {
                                        activeTab === "orders" && <OrdersTable orderData={tableData} />
                                    }
                                    {
                                        activeTab === "sells" &&
                                        <SellsTable
                                            tableData={tableData}
                                            setTableData={setTableData}
                                            category={collectionData}
                                            subCategory={subCollectionData}
                                            filterDateTab={filterDateTab}
                                            startDate={startDate}
                                            endDate={endDate}
                                            storeId={storeId}
                                        />
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        </>
    )
}

export default ReportsComponent
