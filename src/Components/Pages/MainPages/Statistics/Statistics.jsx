import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Media, Nav, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { Image } from '../../../../AbstractElements';
import axios from 'axios';
import { baseURL, imageURL, productBaseURL } from '../../../../Services/api/baseURL';
import { useDataContext } from '../../../../context/hooks/useDataContext';
import DataTable from 'react-data-table-component';
import dummyImg from '../../../../../src/assets/images/product/1.png';
import { debounce } from 'lodash';
import moment from 'moment';


const StatsTable = () => {

    const StatTab = ['Orders', 'Revenue']

    const [activeTab, setActiveTab] = useState('order');

    const [showProducts, setShowProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setsearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [productId, setProductId] = useState('');
    const [searchText, setSearchText] = useState('');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(null);
    const [customersData, setCustomersData] = useState([])
    const revenuesData = []
    const revenueCols = []
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

    const fetchCustomers = async () => {
        // setIsLoading(true);
        console.log("Cutomers");
        try {
            const token = await JSON.parse(localStorage.getItem('token'));

            const response = await axios.get(`${baseURL}/api/customers/get-customers-list`,
                // axios.get(`${baseURL}/users/{userId}`, 
                {
                    headers: {
                        Authorization: `${token}`,
                    }
                })

            if (response.status === 200) {
                const customersData = response?.data?.data
                // setIsLoading(false);
                setCustomersData(customersData)
                console.log(response);
            }
        }
        catch (e) {
            console.log(e)
            // setIsLoading(false)
        }

    }

    useEffect(() => {
        fetchCustomers();
    }, [])

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

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const orderColumns = [
        {
            name: 'ORDER ID',
            selector: row => `${row?.sequence_number}`,
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
                row?.order_value ? '$' + ' ' + row?.order_value : 'N/A'
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
                    return '';
                }
            }
        },
    ]

    // const revenueColumns = [

    // ]
    const customerCols = [
        {
            name: "Customer Name",
            selector: row => row?.firstName + " " + row?.lastName,
            // cell: (row) => (
            //     row?.email === null ? "NA" : row?.email
            // ),
            // cell: row => {
            //     // let firstName = row?.first_name !== null ? row?.first_name.charAt(0).toUpperCase() + row?.first_name.slice(1) : "NA",
            //     // const lastName = row?.last_name !== null ? row?.last_name.charAt(0).toUpperCase() + row?.last_name.slice(1) : "NA",

            //     // return (
            //     //     firstName + " " + lastName
            //     // )
            //     //     (

            //     // )
            //     // (firstName + " " + lastName)
            // },
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
            name: "orders",
            selector: row => row?.totalOrders,
            sortable: true,
        },
        {
            name: "amount paid",
            selector: row => row?.totalAmount,
            sortable: true,
        },
        {
            name: "address",
            selector: row => row?.address.locality,
            sortable: true,
        }

    ]
    let defaultDt = {
        defaultCols: '',
        defaultData: ''
    }
    // let defaultCols = ''
    // let defaultData = ''
    if (activeTab === 'order') {
        defaultDt.defaultCols = orderColumns;
        defaultDt.defaultData = dashboardOrdersData
    } else if (activeTab === 'customer') {
        defaultDt.defaultCols = customerCols;
        defaultDt.defaultData = customersData
    }

    return (
        <>
            <div className="card-header " style={{ padding: '15px' }}>
                <Nav tabs className='product_variant_tabs'>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'order' ? 'active' : ''}
                            onClick={() => handleTabClick('order')}
                        >
                            Orders
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'revenue' ? 'active' : ''}
                            onClick={() => handleTabClick('revenue')}
                        >
                            Revenue
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'customer' ? 'active' : ''}
                            onClick={() => handleTabClick('customer')}
                        >
                            Customers
                        </NavLink>
                    </NavItem>
                </Nav>

                <div className='d-flex align-items-center flex-wrap file-content file-content-dash'>
                    {/* <div className='d-flex flex-start'>
                        <h6 className='mb-3 w-100'>Statistics</h6>
                    </div> */}
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
                    {
                        // userRole === 'admin' &&
                        // <Label htmlFor='stats' className='btn mb-0 btn-primary d-flex align-items-center ms-3 btn btn-secondary'>
                        //     <Input
                        //         id='stats'
                        //         type='file'
                        //         accept=".zip"
                        //         className='d-none'
                        //     // onChange={(e) => uploadCSV(e.target.files[0])}
                        //     />
                        //     {/* <Upload /> */}
                        //     Export
                        // </Label>
                        <Button>
                            Export
                        </Button>
                    }

                </div>
            </div>
            {
                // defaultData.length > 0 &&
                activeTab === 'order' &&
                <DataTable
                    data={dashboardOrdersData}
                    columns={orderColumns}
                    striped={true}
                    center={true}
                    pagination
                />
            }
            {
                // defaultData.length > 0 &&
                activeTab === 'customer' &&
                <DataTable
                    data={customersData}
                    columns={customerCols}
                    striped={true}
                    center={true}
                    pagination
                />
            }
            {
                // defaultData.length > 0 &&
                activeTab === 'revenue' &&
                <DataTable
                    data={revenuesData}
                    columns={revenueCols}
                    striped={true}
                    center={true}
                    pagination
                />
            }
            {/* {
                defaultDt.defaultData.length === 0 && <p className='my-5 text-center'>No Data Found</p>
            } */}
        </ >
    );
}

export default StatsTable;  