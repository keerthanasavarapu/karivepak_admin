import React, { useEffect, useState } from 'react'
import Widgets2 from '../../../Common/CommonWidgets/Widgets2'
import { Widgets2Data, Widgets2Data2 } from '../../../../Data/DefaultDashboard'
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Media, Nav, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap';
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
// import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    const { setCategoryData } = useDataContext();
    const [startDate, setstartDate] = useState(new Date());
    const [countData, setCountData] = useState();
    const [activeTab, setActiveTab] = useState('today');

    const handleChange = date => {
        setstartDate(date);
    };

    // const getCategory = async () => {
    //     const token = await JSON.parse(localStorage.getItem("token"));
    //     try {
    //         await axios.get(`${baseURL}/api/admin/get-all-collections`).then((res) => {
    //             if (res && res.status === 200) {
    //                 setCategoryData(res?.data?.data.filter((data) => data.status === 'active'))
    //             }
    //         })
    //     }
    //     catch (error) {
    //         console.log()
    //     }
    // }

    // const getCount = async () => {
    //     const token = await JSON.parse(localStorage.getItem("token"));
    //     try {
    //         await axios.get(`${baseURL}/api/dashboard/get-all-revenue-count`, {
    //             headers: {
    //                 Authorization: `${token}`,
    //             }
    //         }).then((res) => {
    //             if (res && res.status === 200) {
    //                 setCountData(res?.data?.data);
    //             }
    //         })
    //     }
    //     catch (error) {
    //         console.log()
    //     }
    // }

    // useEffect(() => {
    //     getCategory();
    //     getCount();
    // }, [])

    return (
        <div className='dashboard_container' style={{ paddingTop: '10px' }}>
            <Container fluid={true} className='general-widget'>
                <div className="card">
                    {/* <div className="card-header d-flex align-items-center justify-between" style={{ padding: '15px 30px' }}>
                        <Nav tabs className='product_variant_tabs'>
                            <NavItem>
                                <NavLink className={`nav-link ${activeTab === 'today' ? "active" : ""}`} onClick={() => setActiveTab('today')}>
                                    Today
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`nav-link ${activeTab === 'weekly' ? "active" : ""}`} onClick={() => setActiveTab('weekly')}>
                                    Weekly
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={`nav-link ${activeTab === 'monthly' ? "active" : ""}`} onClick={() => setActiveTab('monthly')}>
                                    Monthly
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <div className='file-content file-content-dash'>
                            <DatePicker className="datepickerr form-control digits mx-2"
                                // selected={startDate}
                                // onChange={(date) => setStartDate(date)}
                                dateFormat="MMM yyyy"
                                showIcon
                                placeholderText='Select Date'
                            />
                        </div>
                    </div> */}
                    <div className="card-body pt-3">
                        <Row >
                            <Col xl='3' sm='6'>
                                <Card className='social-widget mb-0'>
                                    <CardBody>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <img src={squareBox} className='square_box' /> <h6 className="mb-0"> Total Orders</h6>
                                            </div>
                                            {/* <span className='font-primary f-12 d-xxl-block d-xl-none'>View History</span> */}
                                        </div>
                                        <div className='d-flex justify-content-between mt-3' >
                                            <h5 className='fw-600 f-16 mb-0'>
                                                {
                                                    countData?.total_orders ? countData?.total_orders : 0
                                                }
                                            </h5>
                                            {/* <div className='d-flex justify-content-between align-items-center' >
                                        {
                                            data.changeType === 'Increment' ? <i className="fa fa-arrow-circle-o-up" style={{ fontSize: '22px', color: '#08875D' }}></i> : <i className="fa fa-arrow-circle-o-down" style={{ fontSize: '22px', color: '#E02D3C', }}></i>
                                        }
                                        <span style={data.changeType === 'Increment' ? { color: '#08875D', marginInline: '5px' } : { color: '#E02D3C', marginInline: '5px' }}>
                                            +{data.change}%
                                        </span>

                                        <span style={{ color: '#1d243366' }}>Last Month</span>
                                    </div> */}
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl='3' sm='6'>
                                <Card className='social-widget mb-0'>
                                    <CardBody>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <img src={squareBox} className='square_box' />  <h6 className="mb-0"> Total Customers</h6>
                                            </div>
                                            {/* <span className='font-primary f-12 d-xxl-block d-xl-none'>View History</span> */}
                                        </div>
                                        <div className='d-flex justify-content-between mt-3' >
                                            <h5 className='fw-600 f-16 mb-0'>
                                                {
                                                    countData?.total_customers ? countData?.total_customers : 0
                                                }
                                            </h5>

                                        </div>

                                    </CardBody>
                                </Card>
                            </Col><Col xl='3' sm='6'>
                                <Card className='social-widget mb-0'>
                                    <CardBody>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <img src={squareBox} className='square_box' />  <h6 className="mb-0">Total Revenue</h6>
                                            </div>
                                            {/* <span className='font-primary f-12 d-xxl-block d-xl-none'>View History</span> */}
                                        </div>
                                        <div className='d-flex justify-content-between mt-3' >
                                            <h5 className='fw-600 f-16 mb-0'>
                                                $ {
                                                    countData?.total_revenue ? countData?.total_revenue?.toFixed(2) : 0
                                                }
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
                <Row>
                    <Col lg={6} md={12}>
                        <TopSellingProductCard />
                    </Col>
                    <Col lg={6} md={12}>
                        <OrdersCard />
                    </Col>
                </Row>
                <Row>
                    <Col lg={6} md={12}>
                        <OrderStatusCard />
                    </Col>
                    <Col lg={6} md={12}>
                        {/* <TopSellingCitiesCard /> */}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Dashboard;


const TopSellingProductCard = () => {
    const {
        dashboardTopProducts,
        setDashboardTopProducts,
        categoryData
    } = useDataContext();
    const [categoryId, setCategoryId] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);

    const getTopSellingProducts = async () => {
        try {
            const token = await JSON.parse(localStorage.getItem("token"));
            let params = {};

            if (categoryId) {
                params.categoryId = categoryId;
            }

            if (startDate && endDate) {
                params.start_date = moment(startDate).format('YYYY-MM-DD');
                params.end_date = moment(endDate).format('YYYY-MM-DD');
            }

            await axios.get(`${baseURL}/api/dashboard/get-all-top-selling`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            }).then((res) => {
                if (res?.status === 200 && res) {
                    setDashboardTopProducts(res?.data?.data);
                }
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getTopSellingProducts();
    }, [categoryId, startDate, endDate]);

    const orderColumns = [
        {
            name: 'RANK',
            width: '70px',
            selector: row => `${row?._id}`,
            cell: (row, index) => (
                <>
                    <p className='mb-0 ellipses_1'>{'#' + (index + 1)}</p>
                </>
            ),
            center: true,
        },
        {
            name: 'PRODUCT',
            selector: row => `${row?._id}`,
            width: '300px',
            cell: (row) => (
                <>
                    <Row className='product_data mb-0 p-0 border-0'>
                        <Col lg={2}>
                            <div className='product_img dash_product_img'>
                                <img src={row?.variants && row?.variants?.variantImage ? imageURL + row?.variants?.variantImage : dummyImg} />
                            </div>
                        </Col>
                        <Col lg={10}>
                            <div className='product_text'>
                                {row?.variants?.variantName}
                            </div>
                        </Col>
                    </Row>
                </>
            ),
            center: true,
        },
        // {
        //     name: 'STOCK',
        //     selector: row => `${row?.users}`,
        //     cell: (row) => (
        //         <>
        //             <Media className='d-flex'><Image attrImage={{ className: 'img-30 me-3', src: `${dummyImg}`, alt: 'Generic placeholder image' }} />
        //                 <Media body className="align-self-center">
        //                     <div>{(row?.customer_info && row?.customer_info?.first_name !== undefined ? row?.customer_info?.first_name : 'N/A') + ' ' + (row?.customer_info?.last_name !== undefined ? row?.customer_info?.last_name : 'N/A')}</div>
        //                 </Media>
        //             </Media>
        //         </>
        //     ),
        //     center: true,
        // },
        {
            name: 'SUB CATEGORY',
            width: '150px',
            selector: row => row?.variants?.product?.subCategory?.sub_collection_name,
            center: true,
            cell: (row) => (
                row?.variants?.product?.subCategory?.sub_collection_name
            )
        },
        {
            name: 'TOTAL SALE',
            selector: row => row?.variants?.final_selling_price,
            center: true,
            cell: (row) => (
                row?.total_sale !== undefined ? ('$' + ' ' + row?.total_sale  ) : 'N/A'
            )
        },
        // {
        //     name: 'STOCK',
        //     selector: row => row?.delivery_time,
        //     center: true,
        //     cell: (row) => (

        //     )
        // },
    ];


    return (
        <Card>
            <div className="card-header " style={{ padding: '15px' }}>
                <h6 className='mb-3 w-100'>Top Selling Product</h6>
                <div className='d-flex align-items-center file-content file-content-dash'>
                    <Input type='select' name='product_id' onChange={(e) => setCategoryId(e.target.value)}>
                        <option value=''>All Category</option>
                        {
                            categoryData && categoryData.length > 0 && categoryData?.sort((a, b) =>
                                a.collection_name.localeCompare(b.collection_name)).slice(0, 6)?.map((data) => {
                                return (
                                    <>
                                        <option value={data?._id}>{data.collection_name}</option>
                                    </>
                                )
                            })
                        }
                    </Input>
                    <DatePickerComponent
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                    />
                </div>
            </div>
            {
                dashboardTopProducts.length > 0 &&
                <DataTable
                    data={dashboardTopProducts}
                    columns={orderColumns}
                    striped={true}
                    center={true}
                    pagination
                    fixedHeader
                />
            }
            {
                dashboardTopProducts.length === 0 && <p className='my-5 text-center'>No Data Found</p>
            }
        </Card>
    );
}

export const OrdersCard = () => {
    const [showProducts, setShowProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setsearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [productId, setProductId] = useState('');
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);


    const { dashboardOrdersData, setDashboardOrdersData, variantsData, setAllVariantsData } = useDataContext();

    const getDashboardOrders = async () => {
        try {
            const token = await JSON.parse(localStorage.getItem("token"));

            let params = {};

            if (searchText) {
                params.search_string = searchText;
            }
            if (productId) {
                params.product_id = productId;
            }
            if (startDate && endDate) {
                params.start_date = moment(startDate).format('YYYY-MM-DD');
                params.end_date = moment(endDate).format('YYYY-MM-DD');
            }

            await axios.get(`${baseURL}/api/dashboard/get-orders`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            }).then((res) => {
                if (res?.status === 200 && res) {
                    setDashboardOrdersData(res?.data?.data?.slice(0, 7));
                }
            })
        }
        catch (error) {
            console.error(error);
        }
    }

    const getAllVariants = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const response = await axios.get(`${productBaseURL}/variants/variants`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (response && response.status === 200) {
                setAllVariantsData(response?.data?.data);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        getAllVariants();
    }, []);

    useEffect(() => {
        getDashboardOrders();
    }, [searchText, productId, startDate, endDate]);

    const debouncedSearch = React.useRef(
        debounce(async (searchTerm) => {
            setSearchText(searchTerm);
        }, 300)
    ).current;

    const handleSearch = (event) => {
        setsearchTerm(event.target.value);
        debouncedSearch(event.target.value);
    }

    const handleProductToggle = () => {
        setShowProducts(!showProducts);
    }

    const handleProductData = (data) => {
        setSelectedProduct(data);
    }

    const orderColumns = [
        {
            name: 'ORDER ID',
            selector: row => `${row?._id}`,
            cell: (row) => (
                <>
                    <p className='mb-0 ellipses_1'>{row?.sequence_number}</p>
                </>
            ),
            center: true,
        },
        {
            name: 'PRODUCTS',
            selector: row => `${row?._id}`,
            width: '300px',
            cell: (row) => (
                <>
                    <Row className='product_data mb-0 p-0 border-0'>
                        <Col lg={2}>
                            <div className='product_img dash_product_img'>
                                <img src={row?.variants[0] && row?.variants[0]?.variant?.variantImage ? imageURL + row?.variants[0]?.variant?.variantImage : dummyImg} />
                            </div>
                        </Col>
                        <Col lg={10}>
                            <div className='product_text'>
                                {row?.variants[0]?.variant?.variantName}
                            </div>
                        </Col>
                    </Row>
                    {/* <div className='position-relative'>
                        <div className='form-control select-product' onClick={() => handleProductToggle(index)}>
                            {selectedIndex === index && selectedProduct ? (
                                <Row className='product_data mb-0 p-0 border-0'>
                                    <Col lg={2}>
                                        <div className='product_img'>
                                            <img src={selectedProduct?.variants[0]?.variantImage ? imageURL + selectedProduct?.variants[0]?.variantImage : dummyImg} />
                                        </div>
                                    </Col>
                                    <Col lg={10}>
                                        <div className='product_text'>
                                            {selectedProduct?.productName}
                                        </div>
                                    </Col>
                                </Row>
                            ) : 'Select Product'}
                            {showProducts && selectedIndex === index ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {showProducts && selectedIndex === index && (
                            <div className='product_wrapper'>
                                {row?.variants_data.map((data) => (
                                    <Row key={data?._id} className='product_data' onClick={() => handleProductData(data)}>
                                        <Col lg={2}>
                                            <div className='product_img'>
                                                <img src={dummyImg} />
                                            </div>
                                        </Col>
                                        <Col lg={10}>
                                            <div className='product_text'>
                                                {data.productName}
                                            </div>
                                        </Col>
                                    </Row>
                                ))}
                                {row?.variants_data?.length === 0 && <p className='mb-0 text-center'>No Data Found</p>}
                            </div>
                        )}
                    </div> */}
                </>
            ),
            center: true,
        },
        {
            name: 'CUSTOMER',
            selector: row => `${row?.users}`,
            width: '150px',
            cell: (row) => (
                <>
                    <Media className='d-flex'><Image attrImage={{ className: 'img-30 me-3', src: `${dummyImg}`, alt: 'Generic placeholder image' }} />
                        <Media body className="align-self-center">
                            <div className='product_text'>{(row?.customer_info && row?.customer_info?.first_name !== undefined ? row?.customer_info?.first_name : 'N/A') + ' ' + (row?.customer_info?.last_name !== undefined ? row?.customer_info?.last_name : 'N/A')}</div>
                        </Media>
                    </Media>
                </>
            ),
            center: true,
        },
        {
            name: 'TOTAL',
            selector: row => row?.order_value,
            center: true,
            cell: (row) => (
                row?.order_value ? '$' + ' ' + row?.order_value?.toFixed(2) : 'N/A'
            )
        },
        {
            name: 'DELIVERY DATE',
            width: '150px',
            selector: row => row?.delivery_time,
            center: true,
            cell: (row) => {
                if (row?.delivery_time) {
                    const deliveryTime = moment(row.delivery_time);
                    const today = moment().startOf('day');
                    const tomorrow = moment().add(1, 'days').startOf('day');

                    if (deliveryTime.isSame(today, 'day')) {
                        return 'Today';
                    } else if (deliveryTime.isSame(tomorrow, 'day')) {
                        return 'Tomorrow';
                    } else if (deliveryTime.isBefore(today, 'day')) {
                        return deliveryTime.format('YYYY-MM-DD');
                    } else {
                        return deliveryTime.format('YYYY-MM-DD');
                    }
                } else {
                    return 'N/A';
                }
            }
        },
    ]

    return (
        <Card>
            <div className="card-header " style={{ padding: '15px' }}>
                <h6 className='mb-3 w-100'>Orders</h6>
                <div className='d-flex align-items-center flex-wrap file-content file-content-dash'>
                    <div className='mb-0 form-group position-relative search_outer me-2 d-flex align-items-center'>
                        <i className='fa fa-search'></i>
                        <input className='form-control border-0 searchh' type='text' placeholder='Search...' value={searchTerm} onChange={(e) => handleSearch(e)} />
                    </div>
                    <Input type='select' name='product_id' onChange={(e) => setProductId(e.target.value)}>
                        <option value=''>All Product</option>
                        {
                            variantsData && variantsData.length > 0 && variantsData?.map((variant) => {
                                return (
                                    <>
                                        <option value={variant?._id}>{variant.variantName}</option>
                                    </>
                                )
                            })
                        }
                    </Input>
                    <DatePicker className="form-control datepickerr digits mx-2" selected={startDate}
                        onChange={onChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        placeholderText='Select Date'
                        showIcon
                    />
                </div>
            </div>
            {
                dashboardOrdersData.length > 0 &&
                <DataTable
                    data={dashboardOrdersData}
                    columns={orderColumns}
                    striped={true}
                    center={true}
                    pagination
                />
            }
            {
                dashboardOrdersData.length === 0 && <p className='my-5 text-center'>No Data Found</p>
            }
        </Card>
    );
}

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

export const OrderStatusCard = () => {
    const { variantsData } = useDataContext();
    const [startDate, setStartDate] = useState();
    const [orderStatus, setOrderStatus] = useState([]);
    const [productId, setProductId] = useState('');

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    const getOrderStatus = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            let params = {};

            if (productId) {
                params.product_id = productId;
            }

            if (startDate) {
                params.date = moment(startDate).format('');
            }

            const res = await axios.get(`${baseURL}/api/dashboard/get-all-order-status-count`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (res && res?.data?.success) {
                setOrderStatus(res?.data?.data);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    let totalItemCount = 0;

    if (orderStatus && orderStatus.length > 0) {
        totalItemCount = orderStatus.reduce((accumulator, status) => {
            return accumulator + status.total_count;
        }, 0);
    }

    const customColors = {
        accepted: 'primary',
        processing: 'info',
        'on-the-way': 'warning',
        delivered: 'success',
        rejected: 'danger',
        cancelled: 'dark',
        returned: 'secondary'
    };

    const orderStatusTitle = {
        accepted: 'New',
        pending: 'Pending',
        'on-the-way': 'Dispatched',
        delivered: 'Delivered',
        rejected: 'Rejected',
        cancelled: 'Cancelled',
        returned: 'Returned'
    };


    useEffect(() => {
        getOrderStatus();
    }, [productId, startDate]);

    return (
        <>
            <Card>
                <CardHeader className='p_15'>
                    <h6 className='mb-3'>Order Status</h6>
                    <div className='d-flex align-items-center file-content file-content-dash'>

                        <Input type='select' name='product_id' onChange={(e) => setProductId(e.target.value)}>
                            <option value=''>All Product</option>
                            {
                                variantsData && variantsData.length > 0 && variantsData?.map((variant) => {
                                    return (
                                        <>
                                            <option value={variant?._id}>{variant.variantName}</option>
                                        </>
                                    )
                                })
                            }
                        </Input>
                        <DatePicker className="form-control datepickerr digits mx-2" selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showYearPicker
                            dateFormat="yyyy"
                            yearItemNumber={9}
                            showIcon
                            placeholderText='Last Year'
                        />

                    </div>
                </CardHeader>
                <CardBody>
                    <div className="progress-showcase row">
                        <Col>
                            {
                                orderStatus && orderStatus.length > 0 &&
                                orderStatus.map((status, index) => {
                                    const percentage = (status.total_count / totalItemCount) * 100;
                                    const statusKey = status?._id?.order_status.toLowerCase();
                                    const color = customColors[statusKey] || 'primary';
                                    const title = orderStatusTitle[statusKey];
                                    return (
                                        <>
                                            <Row xxl={12} key={index}>
                                                <Col xxl={2}>
                                                    <span style={{ fontSize: '12px' }}>{title}</span>
                                                </Col>
                                                <Col xxl={8}>
                                                    <Progressbar attrProgress={{ color: color, value: percentage, className: 'md-progress-bar mt-2', animated: true }} />
                                                </Col>
                                                <Col xxl={2} className='mt-2'>
                                                    <span >{status?.total_count}</span>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                })

                            }
                            {
                                orderStatus.length === 0 && <p className='my-5 text-center'>No Data Found</p>
                            }
                        </Col>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export const TopSellingCitiesCard = () => {
    const { variantsData } = useDataContext();
    const [startDate, setStartDate] = useState();
    const [citiesStatus, setCitiesStatus] = useState([]);
    const [productId, setProductId] = useState('');

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    const getTopCitiesStatus = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            let params = {};

            if (productId) {
                params.product_id = productId;
            }

            if (startDate) {
                params.year = moment(startDate).format('');
            }

            const res = await axios.get(`${baseURL}/api/dashboard/get-top-cities-selling-status`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (res && res?.data?.success) {
                setCitiesStatus(res?.data?.data);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getTopCitiesStatus();
    }, [productId, startDate]);

    return (
        <>
            <Card>
                <CardHeader className='p_15'>
                    <h6 className='mb-3'>Top 10 Cities Selling Product</h6>
                    <div className='d-flex align-items-center file-content file-content-dash'>
                        <Input type='select' name='product_id' onChange={(e) => setProductId(e.target.value)}>
                            <option value=''>All Product</option>
                            {
                                variantsData && variantsData.length > 0 && variantsData?.map((variant) => {
                                    return (
                                        <>
                                            <option value={variant?._id}>{variant.variantName}</option>
                                        </>
                                    )
                                })
                            }
                        </Input>
                        <DatePicker className="form-control datepickerr digits mx-2" selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            showYearPicker
                            dateFormat="yyyy"
                            yearItemNumber={9}
                            showIcon
                            placeholderText='Last Year'
                        />

                    </div>
                </CardHeader>
                {/* <CardBody className='p_15'>
                    <div className="progress-showcase row">
                        <Col>
                            <Row >
                                <Col md={2}>
                                    New
                                </Col>
                                <Col md={8}>
                                    <Progressbar attrProgress={{ color: 'primary', value: '10', animated: true }} />
                                </Col>
                                <Col md={2}>
                                    2121
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    Pending
                                </Col>
                                <Col md={8}>
                                    <Progressbar attrProgress={{ color: 'secondary', value: '25', animated: true }} />
                                </Col>
                                <Col md={2}>
                                    2121
                                </Col>
                            </Row>
                            <Row >
                                <Col md={2}>
                                    Dispatched
                                </Col>
                                <Col md={8}>
                                    <Progressbar attrProgress={{ color: 'success', value: '50', animated: true }} />
                                </Col>
                                <Col md={2}>
                                    2121
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2}>
                                    Delievered
                                </Col>
                                <Col md={8}>
                                    <Progressbar attrProgress={{ color: 'info', value: '75', animated: true }} />
                                </Col>
                                <Col md={2}>
                                    2121
                                </Col>
                            </Row>

                        </Col>
                    </div>
                </CardBody> */}
                <CardBody>
                    <div className="progress-showcase row">
                        <Col>
                            {
                                citiesStatus && citiesStatus?.topCities?.length > 0 &&
                                citiesStatus?.topCities?.map((status, index) => {
                                    const percentage = (status.orderCount / citiesStatus?.totalOrderCount) * 100;

                                    return (
                                        <>
                                            <Row xxl={12} key={index}>
                                                <Col xxl={2}>
                                                    <span style={{ fontSize: '12px' }}>{status?.city?.name}</span>
                                                </Col>
                                                <Col xxl={8}>
                                                    <Progressbar attrProgress={{ value: percentage, className: 'md-progress-bar mt-2', animated: true }} />
                                                </Col>
                                                <Col xxl={2} className='mt-2'>
                                                    <span >{status?.orderCount}</span>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                })

                            }
                            {
                                citiesStatus?.topCities?.length === 0 && <p className='my-5 text-center'>No Status Found</p>
                            }
                        </Col>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}