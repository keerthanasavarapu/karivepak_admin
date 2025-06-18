import React, { Fragment, useState } from 'react';
import { Card, CardBody, Form, Row } from 'reactstrap';
import { Image, H5, H6, P, Btn } from '../../../../AbstractElements';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table, Col, CardHeader, } from 'reactstrap';
import { BasicProgressBars, FirstName, Id, LastName, MarginTop, TableHeadOptions, TableHeadspan, thead, theadlight, theadtext, tomake, Username } from '../../../../Constant';
import { H3, Progressbar } from '../../../../AbstractElements';
import './Styles.css'
import { Captiontabledata, OrdersData } from './Data';
import DatePicker from "react-datepicker";


const CardWidget = ({ data }) => {
    return (
        <Card className='social-widget widget-hover'>
            <CardBody>
                <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center gap-2'>
                        <h6 className="mb-0">{<i className="icofont icofont-truck me-2"></i>} Total Products</h6>
                    </div>
                    {/* <span className='font-primary f-12 d-xxl-block d-xl-none'>View History</span> */}
                </div>
                <div className='d-flex justify-content-between mt-3' >
                    <h5 className='fw-600 f-16 mb-0'>
                        {
                            data.total
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

    );
};

export default CardWidget;



export const DropdownCommon = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <>

            <Dropdown {...dropdownMain} isOpen={dropdownOpen} color='light' toggle={toggle} style={{ backgroundColor: '#fff', minWidth: '150px' }}>
                <DropdownToggle {...btn} size='sm' color='light' className='form-select text-dark bg-light'>
                    {icon && <i className={iconName} style={{}}></i>}
                    {!icon && options[0]}
                </DropdownToggle>
                <DropdownMenu>
                    {options.map((item, i) => (
                        <DropdownItem key={i}>{item}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export const TableHeadClass = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const DailyDropdown = ["Premixed Drinks", "Beer & Ciders", "Wines", "Spirits"];
    return (
        <>
            <Col sm="12" md='6' lg="6" xl="6">
                <Card>
                    <CardHeader className='py-2'>
                        <div className='d-flex  align-items-center'>
                            <Row xxl={12} sm={6}>
                                <Col xxl={6}>
                                    <H6 attrH6={{ style: { marginTop: '10px', width: '250px' } }}>Top Selling Product</H6>

                                </Col>
                                <Col xxl={6}>
                                    <Row xxl={12}>
                                        <Col xxl={7}>
                                            <DropdownCommon icon={false} options={DailyDropdown} btn={{ caret: false }} />

                                        </Col>
                                        <Col xxl={5}>
                                            <DatePicker id='BasicDatePick' className="form-control digits" selected={startDate} onChange={handleChange} />

                                        </Col>
                                    </Row>



                                </Col>
                            </Row>
                        </div>


                    </CardHeader>
                    <div className="card-block row">
                        <Col sm="12">
                            <div className="table-responsive">
                                <Table>
                                    <thead style={{ backgroundColor: '#f8f9fc' }}>
                                        <tr style={{ backgroundColor: '' }}>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Rank</th>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Product</th>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Stock</th>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Sub Category</th>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Total Sales</th>
                                            <th scope="" style={{ color: '#1d243366', fontSize: '12px' }}>Stock Status</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Captiontabledata.slice(0, 5).map((item) =>
                                                <tr key={item.id}>
                                                    <td style={{ width: '5px' }}>{item.rank}</td>
                                                    <td>{item.ProductName}</td>
                                                    <td>{item.Stock}</td>
                                                    <td>{item.SubCategory}</td>
                                                    <td>{item.TotalSales}</td>

                                                    <td>    <p style={item.StockStatus === 'In Stock' ? { color: '#08875d', backgroundColor: '#08875d22', borderRadius: '99px', textAlign: 'center', fontSize: '12px' } : item.StockStatus === "Low Stock" ? { color: '#EF940B', backgroundColor: '#ef940b22', borderRadius: '99px', textAlign: 'center', fontSize: '12px' } : { color: '#e02d3c', backgroundColor: '#e02d3c22', borderRadius: '99px', textAlign: 'center', fontSize: '10px', paddingBlock: '5px' }}>{item.StockStatus}</p></td>

                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col >
        </>
    );
};

export const OrdersTable = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };
    const [searchTerm, setSearchTerm] = useState('');

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const DailyDropdown = ["Beer&Ciders", "Wines", "Spirits"];
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };
    return (
        <>
            <Col sm="12" md='6' lg="6" xl="6">
                <Card>
                    <CardHeader className='py-2'>
                        <div className='d-flex  align-items-center'>
                            <Row xxl={12} sm={6}>
                                <Col xxl={6}>
                                    <Row xxl={12}>
                                        <Col xxl={4}>
                                            <H6 attrH6={{ style: { marginTop: '10px', } }}>Orders</H6>
                                        </Col>
                                        <Col xxl={8}>
                                            <Form className='search-file form-inline'>
                                                <div className='mb-0 form-group border border-1 rounded-2' style={{ backgroundColor: '#f8f9fc', width: '120px', height: '35px' }}>
                                                    <i className='fa fa-search ' style={{ marginLeft: '5px', marginTop: '12px' }}></i>
                                                    <input className='form-control-plaintext' type='text' style={{ paddingLeft: '2px', paddingTop: '6px', }} value={searchTerm} onChange={(e) => handleSearch(e)} placeholder='Search...' />
                                                </div>
                                            </Form>
                                        </Col>
                                    </Row>


                                </Col>
                                <Col xxl={6}>
                                    <Row xxl={12}>
                                        <Col xxl={7}>
                                            <DropdownCommon icon={false} options={DailyDropdown} btn={{ caret: false }} />

                                        </Col>
                                        <Col xxl={5}>
                                            <DatePicker id='BasicDatePick' className="form-control digits" selected={startDate} onChange={handleChange} />

                                        </Col>
                                    </Row>



                                </Col>
                            </Row>
                        </div>                    </CardHeader>
                    <div className="card-block row">
                        <Col sm="12">
                            <div className="table-responsive">
                                <Table >
                                    <thead style={{ backgroundColor: '#f8f9fc', paddingBlock: '1px' }}>
                                        <tr>
                                            <th scope="" style={{ color: '#1d243366' }}>Orderid</th>
                                            <th scope="" style={{ color: '#1d243366' }}>Product</th>
                                            <th scope="" style={{ color: '#1d243366' }}>Customer</th>
                                            <th scope="" style={{ color: '#1d243366' }}>Total</th>
                                            <th scope="" style={{ color: '#1d243366' }}>Delivery Date</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            OrdersData.slice(0, 5).map((item) =>
                                                <tr key={item.id}>
                                                    <th scope="row">{item.id}</th>
                                                    <td><span className='mr-2'>{item.Qty}</span><span>{item.ProductName}</span></td>
                                                    <td>{item.customer}</td>
                                                    <td>{item.Total}</td>
                                                    <td>{item.DeliveryDate}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </div>
                </Card>
            </Col>
        </>
    );
};

export const Basic = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const DailyDropdown = ["Beer&Ciders", "Wines", "Spirits"];
    return (
        <Card>
            <CardHeader className='py-2'>
                <Row xxl={12}>
                    <Col xxl={6}>
                        <H5>Order Status</H5>
                    </Col>
                    <Col xxl={6}>
                        <Row xxl={12}>
                            <Col xxl={7}>
                                <DropdownCommon icon={false} options={DailyDropdown} btn={{ caret: false }} />
                            </Col>
                            <Col xxl={5}>
                                <DatePicker id="BasicDatePick" className="form-control digits  " placeholderText="Select Date" selected={startDate} onChange={handleChange} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </CardHeader>
            <CardBody>
                <div className="progress-showcase row">
                    <Col>
                        <Row xxl={12}>
                            <Col xxl={2}>
                                <span style={{ fontSize: '10px' }}>New</span>
                            </Col>
                            <Col xxl={8}>
                                <Progressbar attrProgress={{ color: 'primary', value: '60', className: 'sm-progress-bar mt-2' }} />
                            </Col>
                            <Col xxl={2}>
                                <span>350</span>
                            </Col>
                        </Row>
                        <Row xxl={12}>
                            <Col xxl={2}>
                                <span style={{ fontSize: '10px' }}>Pending</span>
                            </Col>
                            <Col xxl={8}>
                                <Progressbar attrProgress={{ color: 'info', value: '25', className: 'sm-progress-bar mt-2' }} />
                            </Col>
                            <Col xxl={2}>
                                <span>350</span>
                            </Col>
                        </Row>
                        <Row xxl={12}>
                            <Col xxl={2}>
                                <span style={{ fontSize: '8.5px', fontWeight: '400' }}>Dispatched</span>
                            </Col>
                            <Col xxl={8}>
                                <Progressbar attrProgress={{ color: 'warning', value: '50', className: 'sm-progress-bar mt-2' }} />
                            </Col>
                            <Col xxl={2}>
                                <span>350</span>
                            </Col>
                        </Row>
                        <Row xxl={12}>
                            <Col xxl={2}>
                                <span style={{ fontSize: '10px' }}>Delivered</span>
                            </Col>
                            <Col xxl={8}>
                                <Progressbar attrProgress={{ color: 'success', value: '100', className: 'sm-progress-bar mt-2' }} />
                            </Col>
                            <Col xxl={2}>
                                <span>350</span>
                            </Col>
                        </Row>
                        <Row xxl={12}>
                            <Col xxl={2}>
                                <span style={{ fontSize: '10px' }}>Cancelled</span>
                            </Col>
                            <Col xxl={8}>
                                <Progressbar attrProgress={{ color: 'danger', value: '50', className: 'sm-progress-bar mt-2' }} />
                            </Col>
                            <Col xxl={2}>
                                <span>350</span>
                            </Col>
                        </Row>


                    </Col>
                </div>
            </CardBody>
        </Card>
    );
};
export const Basic1 = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const DailyDropdown = ["Beer&Ciders", "Wines", "Spirits", "Premixed"];
    const cities = [
        {
            id: 1,
            city: 'Sydney',
            Total: 1245,
            percen: 15,
            color: 'danger'
        },
        {
            id: 2,
            city: 'Melbourne',
            Total: 1245,
            percen: 15,
            color: 'primary'
        },
        {
            id: 3,
            city: 'Wollongong',
            Total: 1245,
            percen: 15,
            color: 'warning'
        },
        {
            id: 4,
            city: 'Melbourne',
            Total: 1245,
            percen: 15,
            color: 'success'
        },
        {
            id: 5,
            city: 'New South Wales',
            Total: 1245,
            percen: 15,
            color: 'info'
        },
        {
            id: 6,
            city: 'Canberra',
            Total: 1245,
            percen: 15,
            color: 'danger'
        },
        {
            id: 7,
            city: 'Newcastle',
            Total: 1245,
            percen: 15,
            color: 'primary'
        },
        {
            id: 8,
            city: 'Melbourne',
            Total: 1245,
            percen: 15,
            color: 'warning'
        }
    ];
    return (
        <Card>
            <CardHeader className='py-2'>
                <Row xxl={12}>
                    <Col xxl={6}>
                        <H6>Top 10 Cities Selling Product</H6>

                    </Col>
                    <Col xxl={6}>
                        <Row xxl={12}>
                            <Col xxl={7}>
                                <DropdownCommon icon={false} placeholderText="Select" options={DailyDropdown} btn={{ caret: false }} />

                            </Col>
                            <Col xxl={5}>
                                <DatePicker id="BasicDatePick" className="form-control digits" placeholderText="Select Date" selected={startDate} onChange={handleChange} />

                            </Col>
                        </Row>



                    </Col>
                </Row>

            </CardHeader>
            <CardBody>
                <div className="progress-showcase row">
                    <Col>
                        <Row xxl={12}>
                            {cities.slice(0, 4).map((city) => (

                                <Col xxl={6} key={city.id}>
                                    <Row xxl={12}>
                                        <Col xxl={5}>
                                            <span>{city.city}</span>
                                        </Col>
                                        <Col xxl={3}>
                                            <Progressbar attrProgress={{ color: city.color, value: '100', className: 'sm-progress-bar mt-2' }} />
                                        </Col>
                                        <Col xxl={4}>
                                            <span>{city.Total}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            ))}
                            {
                                cities.slice(4, 8).map((city, index) => (
                                    <Col xxl={6} key={index}>
                                        <Row xxl={12}>
                                            <Col xxl={5}>
                                                <span style={{ fontSize: '14px' }}>{city.city}</span>
                                            </Col>
                                            <Col xxl={3}>
                                                <Progressbar attrProgress={{ color: city.color, value: '70', className: 'sm-progress-bar mt-2' }} />
                                            </Col>
                                            <Col xxl={4}>
                                                <span>{city.Total}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                ))
                            }
                        </Row>

                    </Col>
                </div>
            </CardBody>
        </Card>
    );
};
