import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from 'reactstrap'
import { H3 } from '../../../../../AbstractElements'
import { FaDownload, FaTrash } from 'react-icons/fa'
import dummyImg from '../../../../../../src/assets/images/product/1.png'
import { useParams } from 'react-router'
import axios from 'axios'
import { baseURL, imageURL, orderURL } from '../../../../../Services/api/baseURL'
import moment from 'moment';
import star from '../../../../../../src/assets/images/Star.svg';

function ViewOrder() {

    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState();

    const getOrderDetails = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            await axios.get(`${orderURL}/get-order/${id}`, {
                headers: {
                    Authorization: `${token}`
                }
            }).then((res) => {
                if (res && res.status === 200) {
                    // let response = res?.data?.data.length > 0 && res.data?.data[0];
                    setOrderDetails(res?.data?.data);
                }
            })
        }
        catch (err) {
            console.error(err)
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            const response = await axios.get(`${orderURL}/invoice-pdf/${orderId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `invoice-${orderId}.pdf`;
            link.click();
        } catch (error) {
            console.error('Error downloading the invoice:', error);
        }
    };

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    };

    const statusColors = {
        accepted: 'primary',
        processing: 'info',
        'on-the-way': 'warning',
        delivered: 'success',
        rejected: 'danger'
    };

    const statusKey = orderDetails?.order_status.toLowerCase();
    const color = statusColors[statusKey] || 'primary';

    useEffect(() => {
        if (id) {
            getOrderDetails();
        }
    }, []);

    return (
        <>
            <Container fluid>
                <div className='page-title'>
                    <Row className='align-items-center'>
                        <Col xs='6'>
                            <p className='mb-0 d-flex align-items-center'>Order Id: <b className='ms-1'> {orderDetails?.sequence_number}</b> <span style={{ color: '#E1E6EF' }} className='mx-2'> | </span> <span style={{ fontSize: '13px' }} className={`badge badge-light-${color}`}>
                                {orderDetails?.order_status ? capitalizeFirstLetter(orderDetails?.order_status) : 'N/A'}
                            </span></p>
                        </Col>
                        <Col xs='6'>
                            <div className='d-flex justify-content-end'>
                                <Button className='filter_btn'
                                    onClick={() => downloadInvoice(id)}
                                >
                                    <FaDownload color='#d422ad' />
                                </Button>

                                {/* <Button className='filter_btn ms-2'>
                                    <FaTrash color='red' />
                                </Button> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
            <Container fluid>
                <div className='order_details'>
                    <Row className="d-flex justify-content-center">
                        <Col lg={4} md={6} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5 > Customer Details </h5>
                                </CardHeader>
                                <CardBody>

                                    <Table className='detail_table'>

                                        <tr>
                                            <th>Customer Name :</th>
                                            <td>
                                                {(orderDetails?.address?.first_name && orderDetails?.address?.last_name) ?
                                                    `${orderDetails.address.first_name} ${orderDetails.address.last_name}` :
                                                    'N/A'}
                                            </td>                                       </tr>
                                        <tr>
                                            <th>Mobile Number :</th>
                                            <td>{orderDetails?.address?.addressPhoneNumber ? orderDetails?.address?.addressPhoneNumber : 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th>Address :</th>
                                            <td className='ellipses_text_2'>{orderDetails?.address?.address ? orderDetails?.address?.address : 'N/A'}</td>
                                        </tr>

                                    </Table>

                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5> Order Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Table className='detail_table'>
                                            <tr>
                                                <th>Order ID :</th>
                                                <td>{orderDetails?.sequence_number}</td>
                                            </tr>
                                            <tr>
                                                <th>Order Created At :</th>
                                                <td>{moment(orderDetails?.createdAt).format('DD MMM YYYY, h:mm:A')}</td>
                                            </tr>
                                            {orderDetails?.order_status === 'cancelled' ? <tr>
                                                <th>Order Cancelled :</th>
                                                <td>{orderDetails?.cancel_reason}</td>
                                            </tr> :
                                                <tr>
                                                    <th>Order Delivered At :</th>
                                                    {orderDetails?.order_status === 'delivered' ?
                                                        <td>{moment(orderDetails?.updatedAt).format('DD MMM YYYY, h:mm:A')}</td> :
                                                        <td>{""}</td>}
                                                </tr>
                                            }
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5> Payment Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Table className='detail_table'>
                                            <tr>
                                                <th>Card Holder :</th>
                                                <td>N/A</td>
                                            </tr>
                                            <tr>
                                                <th>Card Number :</th>
                                                <td>N/A</td>
                                            </tr>
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={8} md={12} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Product Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Table>

                                            <tr>
                                                <th>QUANTITY :</th>
                                                <th>PRODUCT NAME :</th>
                                                <th>PRICE :</th>
                                                <th>TOTAL :</th>
                                            </tr>

                                            {
                                                orderDetails?.order_Variants.length > 0 && orderDetails?.order_Variants.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>x {data?.quantity ? data?.quantity : 1}</td>
                                                        <td><div className='d-flex border-0 align-items-center'>
                                                            <img width={30} height={30} src={data?.variant?.variantImage ? imageURL + data?.variant?.variantImage : dummyImg} />
                                                            <span className='ms-2'>
                                                                {data?.variant?.variantName}
                                                            </span></div></td>
                                                        <td>$ {data?.variant?.finalSellingPrice}</td>
                                                        <td>$ {data?.quantity ? (data?.quantity || 1) * data?.variant?.finalSellingPrice : "N/A"}</td>
                                                    </tr>
                                                ))
                                            }
                                        </Table>
                                        {orderDetails?.products.length === 0 && <p className='my-5 w-100 text-center'>No Products Found</p>}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Product Billing</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Table className='detail_table billing_table'>
                                            <tr>
                                                <th>Subtotal :</th>
                                                <td>${orderDetails?.order_value ? orderDetails?.order_value : 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Discount:</th>
                                                <td>${orderDetails?.discount_value}</td>
                                            </tr>
                                            <tr>
                                                <th>Shipping :</th>
                                                <td>
                                                    {/* <span className='success'>Free</span> */}
                                                    <div className='font-normal text-green-700 text-md'>
                                                        {parseFloat(orderDetails?.order_value) >= 18 ?
                                                            (
                                                                <>
                                                                    <span className={`font-medium border-0 line-through`}>
                                                                        ${9.99}
                                                                    </span>
                                                                    <span className='text-base text-green-700 border-0'> FREE Delivery  </span>
                                                                </>
                                                            )
                                                            : (`$${9.99}`)}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <th>Tax(20%) :</th>
                                                <td>$411</td>
                                            </tr> */}
                                            <tr>
                                                <th><h5 className='mb-0 border-0 p-0'>Total:</h5></th>
                                                <td><span className='border-0 total_value'>${orderDetails?.order_value ? orderDetails?.order_value : 0}</span></td>
                                            </tr>
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        {/* <Col lg={6} md={6} sm={12}>
                            <Col lg={12} md={12} sm={12}>
                                <Card>
                                    <CardHeader>
                                        <h6 className='d-flex mb-0 align-items-center justify-content-between'>
                                            GoBooze Rating
                                            <span className='d-flex align-items-center'>
                                                {orderDetails?.gobooze_rating && (
                                                    <>
                                                        <img src={star} alt="Star Icon" />
                                                        {orderDetails?.gobooze_rating}
                                                    </>
                                                )}
                                            </span>
                                        </h6>
                                    </CardHeader>
                                    <CardBody>
                                        <p className='review_text ellipses_text_5'> {orderDetails?.gobooze_review ? '“' + orderDetails?.gobooze_review + '”' : 'Rating Not Provided'}</p>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg={12} md={12} sm={12}>
                                <Card>
                                    <CardHeader>
                                        <h6 className='d-flex mb-0 align-items-center justify-content-between'>
                                            Driver Rating
                                            <span className='d-flex align-items-center'>
                                                {orderDetails?.deliveryUser?.delivery_rating && (
                                                    <>
                                                        <img src={star} alt="Star Icon" />
                                                        {orderDetails?.deliveryUser?.delivery_rating}
                                                    </>
                                                )}
                                            </span>
                                        </h6>                                </CardHeader>
                                    <CardBody>
                                        <p className='review_text'>{orderDetails?.deliveryUser?.delivery_review ? '“' + orderDetails?.deliveryUser?.delivery_review + '”' : 'Rating Not Provided'}</p>
                                    </CardBody>
                                </Card>
                            </Col> 
                        </Col> */}

                        {/* <Col lg={6} md={6} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Products Ratings</h5>
                                </CardHeader>
                                <CardBody>
                                    {
                                        orderDetails?.products.length > 0 ? (
                                            orderDetails.products.map((data, index) => (
                                                <div key={index} className='mb-3'>
                                                    <div className='d-flex align-items-center'>
                                                        <img alt='variant' width={50} height={50} src={data?.variant?.variantImage ? imageURL + data.variant.variantImage : dummyImg} />
                                                        <span className='ms-2'>
                                                            <span style={{color: '#1D2433CC'}}>{data?.variant?.product?.brand?.brandName.toUpperCase()}</span> <br />
                                                            <strong> {data?.variant?.variantName}</strong>
                                                        </span>
                                                    </div>
                                                    <div className='d-flex align-items-center mt-1'>
                                                        {data?.product_rating && (
                                                            <>
                                                                <img width={20} height={20} src={star} alt="Star Icon" className="me-1" />
                                                                <span className="me-2">{data.product_rating}</span>
                                                            </>
                                                        )}
                                                        {data?.product_review && (
                                                            <span>| {data.product_review}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='text-center my-5'>No products available</div>
                                        )
                                    }

                                </CardBody>
                            </Card>
                        </Col> */}
                    </Row>
                </div>
            </Container>
        </>
    )
}

export default ViewOrder
