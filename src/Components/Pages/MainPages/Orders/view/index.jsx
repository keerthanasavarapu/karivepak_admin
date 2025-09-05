import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
    Table,
} from "reactstrap";
import { FaDownload } from "react-icons/fa";
import dummyImg from "../../../../../../src/assets/images/product/1.png";
import { useParams } from "react-router";
import axios from "axios";
import { baseURL, orderURL } from "../../../../../Services/api/baseURL";
import moment from "moment";

function ViewOrder() {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState();

    const getOrderDetails = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const res = await axios.get(`${baseURL}/api/orders/${id}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (res && res.status === 200) {
                setOrderDetails(res?.data?.order);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const downloadInvoice = async (orderId) => {
        try {
            const response = await axios.get(`${orderURL}/invoice-pdf/${orderId}`, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `invoice-${orderId}.pdf`;
            link.click();
        } catch (error) {
            console.error("Error downloading the invoice:", error);
        }
    };

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    }

    const statusColors = {
        placed: "primary",
        accepted: "info",
        processing: "warning",
        delivered: "success",
        rejected: "danger",
    };

    const statusKey = orderDetails?.status?.toLowerCase();
    const color = statusColors[statusKey] || "primary";

    useEffect(() => {
        if (id) {
            getOrderDetails();
        }
    }, [id]);

    return (
        <>
            <Container fluid>
                <div className="page-title">
                    <Row className="align-items-center">
                        <Col xs="6">
                            <p className="mb-0 d-flex align-items-center">
                                Order Id:{" "}
                                <b className="ms-1">{orderDetails?._id || "N/A"}</b>{" "}
                                <span style={{ color: "#E1E6EF" }} className="mx-2">
                                    |
                                </span>{" "}
                                <span
                                    style={{ fontSize: "13px" }}
                                    className={`badge badge-light-${color}`}
                                >
                                    {orderDetails?.status
                                        ? capitalizeFirstLetter(orderDetails?.status)
                                        : "N/A"}
                                </span>
                            </p>
                        </Col>
                        <Col xs="6">
                            <div className="d-flex justify-content-end">
                                <Button
                                    className="filter_btn"
                                    onClick={() => downloadInvoice(id)}
                                >
                                    <FaDownload color="#d422ad" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            <Container fluid>
                <div className="order_details">
                    <Row className="d-flex justify-content-center">
                        {/* Order Info */}
                        <Col lg={4} md={6} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5> Order Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="detail_table">
                                        <tbody>
                                            <tr>
                                                <th>Order ID :</th>
                                                <td>{orderDetails?._id}</td>
                                            </tr>
                                            <tr>
                                                <th>Placed At :</th>
                                                <td>
                                                    {moment(orderDetails?.placedAt).format(
                                                        "DD MMM YYYY, h:mm A"
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Status :</th>
                                                <td>
                                                    {orderDetails?.status
                                                        ? capitalizeFirstLetter(orderDetails?.status)
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Payment Method :</th>
                                                <td>{orderDetails?.paymentMethod || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment Status :</th>
                                                <td>{orderDetails?.paymentStatus || "N/A"}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Billing */}
                        <Col lg={4} md={6} sm={12} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5> Billing Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="detail_table">
                                        <tbody>
                                            <tr>
                                                <th>Subtotal :</th>
                                                <td>₹ {orderDetails?.totals?.subtotal || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Discount :</th>
                                                <td>₹ {orderDetails?.totals?.discount || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Delivery Charge :</th>
                                                <td>₹ {orderDetails?.deliveryCharge || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <h5 className="mb-0 border-0 p-0">Total :</h5>
                                                </th>
                                                <td>
                                                    <span className="border-0 total_value">
                                                        ₹ {orderDetails?.grandTotal || 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Products */}
                        <Col lg={8} md={12} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Product Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>QUANTITY</th>
                                                    <th>PRODUCT NAME</th>
                                                    <th>PRICE</th>
                                                    <th>TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderDetails?.items?.length > 0 ? (
                                                    orderDetails.items.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>x {data?.quantity || 1}</td>
                                                            <td>
                                                                <div className="d-flex border-0 align-items-center">
                                                                    <img
                                                                        width={30}
                                                                        height={30}
                                                                        src={
                                                                            data?.product?.image?.[0]
                                                                                ? data.product.image[0]
                                                                                : dummyImg
                                                                        }
                                                                        alt="product"
                                                                    />
                                                                    <span className="ms-2">
                                                                        {data?.product?.name}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td>₹ {data?.price}</td>
                                                            <td>₹ {data?.quantity * data?.price}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">
                                                            No Products Found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
}

export default ViewOrder;
