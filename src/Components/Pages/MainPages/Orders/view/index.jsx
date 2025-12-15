import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Row,
    Form,
    FormGroup,
    Label,
    Media,
    Input,
    Table,
} from "reactstrap";
import { FaDownload } from "react-icons/fa";
import dummyImg from "../../../../../../src/assets/images/product/1.png";
import CommonModal from "../../../../UiKits/Modals/common/modal";

import { useParams } from "react-router";
import axios from "axios";
import { baseURL, orderURL } from "../../../../../Services/api/baseURL";
import moment from "moment";
import { Truck } from "react-feather";
import Swal from "sweetalert2";

function ViewOrder() {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState();
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [selectedSubOrder, setSelectedSubOrder] = useState(null);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("");
    const [deliveryPersons, setDeliveryPersons] = useState([]);
        const token =  JSON.parse(localStorage.getItem("token"));


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

    const fetchDeliveryPersons = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));

        try {
            const response = await axios.get(
                `${baseURL}/api/auth/delivery-persons`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setDeliveryPersons(response.data.deliveryPersons);
        } catch (error) {
            console.error("Error fetching delivery persons:", error);
        }
    };

    useEffect(() => {

        fetchDeliveryPersons();
    }, []);


      const handleDeliveryAssign = async () => {
    try {
      console.log(selectedSubOrder._id, selectedDeliveryPerson, "gffffffffffffffffffffffffffff");
      const response = await axios.post(
        `${baseURL}/api/delivery/assign/${selectedSubOrder._id}`,
        {
          partnerId: selectedDeliveryPerson,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },

      );
      console.log(response, "resdxfshxsxs")

      Swal.fire({
        title: "Delivery Assigned!",
        icon: "success",
        confirmButtonColor: "#fc2c54",
      });

      setShowDeliveryModal(false);
     getOrderDetails()
    } catch (error) {
      console.log(error, "error in assign")
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to assign delivery",
        icon: "error",
        confirmButtonColor: "#fc2c54",
      });
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
        confirmed: "info",
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

    console.log(orderDetails, "orderdetails")

    return (
        <>
            <Container fluid>
                <div className="page-title">
                    <Row className="align-items-center">
                        <Col xs="6">
                            <p className="mb-0 d-flex align-items-center">
                                Order Id:{" "}
                                <b className="ms-1">{orderDetails?.orderId || "N/A"}</b>{" "}
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
                                    onClick={() => {
                                        setSelectedSubOrder(orderDetails);
                                        setShowDeliveryModal(true);
                                    }}
                                >
                                    <Truck color="#007F2D" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <CommonModal
                    isOpen={showDeliveryModal}
                    title="Assign Delivery Person"
                    toggler={() => setShowDeliveryModal(false)}
                    size="md"
                >
                    <Container>
                        <Form>
                            <Col xxl={12}>
                                <FormGroup>
                                    <Label>Select Delivery Person</Label>
                                    <Input
                                        type="select"
                                        value={selectedDeliveryPerson}
                                        onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {deliveryPersons.map((person) => (
                                            <option key={person._id} value={person._id}>
                                                {person.name}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                                <Row className="text-center">
                                    <Button
                                        color="primary"
                                        onClick={handleDeliveryAssign}
                                        disabled={!selectedDeliveryPerson}
                                    >
                                        Assign Delivery
                                    </Button>
                                </Row>
                            </Col>
                        </Form>
                    </Container>
                </CommonModal>
            </Container>

            <Container fluid>
                <div className="order_details">
                    <Row className="d-flex justify-content-center">
                        {/* Order Info */}
                        <Col lg={4} md={6} sm={12} xs={12} className="d-flex mb-3">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5> Order Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="detail_table">
                                        <tbody>
                                            <tr>
                                                <th>Order ID :</th>
                                                <td>{orderDetails?.orderId}</td>
                                            </tr>
                                            <tr>
                                                <th>Placed At :</th>
                                                <td>
                                                    {moment(orderDetails?.placedAt).format("DD MMM YYYY, h:mm A")}
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
                                                <th>Previous Status :</th>
                                                <td>{orderDetails?.previousStatus || "N/A"}</td>
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
                                                <th>GST{orderDetails?.gstAmounts?.totalGSTPercent} :</th>
                                                <td>₹ {orderDetails?.gstAmounts?.totalGST.toLocaleString() || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Handling Fee :</th>
                                                <td>₹ {orderDetails?.handlingFee.toLocaleString() || 0}</td>
                                            </tr>

                                            <tr>
                                                <th>Small Cart Charges:</th>
                                                <td>₹ {orderDetails?.smallCartFee.toLocaleString() || 0}</td>
                                            </tr>
                                            <tr>
                                                <th>Delivery Charge :</th>
                                                <td>₹ {orderDetails?.deliveryCharge?.toLocaleString() || "fREE"}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <h5 className="mb-0 border-0 p-0">Total :</h5>
                                                </th>
                                                <td>
                                                    <span className="border-0 total_value">
                                                        ₹ {Number(orderDetails?.grandTotal || 0).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Customer Address */}
                        <Col lg={4} md={6} sm={12} className="d-flex">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5>Delivery Address</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="detail_table">
                                        <tbody>
                                            <tr>
                                                <th>Name :</th>
                                                <td>{orderDetails?.deliveryDetails?.deliveryAddressSnapshot?.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Mobile :</th>
                                                <td>{orderDetails?.deliveryDetails?.deliveryAddressSnapshot?.mobile_number}</td>
                                            </tr>
                                            <tr>
                                                <th>Address :</th>
                                                <td>
                                                    {orderDetails?.deliveryDetails?.deliveryAddressSnapshot?.flatNo},{""}
                                                    {orderDetails?.deliveryDetails?.deliveryAddressSnapshot?.address}.{" "}
                                                    {/* {orderDetails?.address?.city},{" "}
                                                {orderDetails?.address?.state},{" "}
                                                {orderDetails?.address?.pincode} */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Type :</th>
                                                <td>{orderDetails?.deliveryDetails?.deliveryAddressSnapshot?.type}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Payment Info */}
                        <Col lg={4} md={6} sm={12} xs={12} className="d-flex mb-3">
                            <Card className="flex-fill card-equal-height">
                                <CardHeader>
                                    <h5>Payment Details</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="detail_table">
                                        <tbody>
                                            <tr>
                                                <th>Transaction ID :</th>
                                                <td>{orderDetails?.payment?.transactionId}</td>
                                            </tr>
                                            {/* <tr>
                                            <th>Payment ID :</th>
                                            <td>{orderDetails?.paymentId}</td>
                                        </tr> */}
                                            <tr>
                                                <th>Razorpay Order ID :</th>
                                                <td>{orderDetails?.paymentResponse?.orderId}</td>
                                            </tr>
                                            <tr>
                                                <th>Signature :</th>
                                                <td className="text-break">
                                                    {orderDetails?.paymentResponse?.signature}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>Payment Date :</th>
                                                <td>
                                                    {moment(orderDetails?.createdAt).format("DD MMM YYYY, h:mm A")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>

                        {/* Timeline */}
                        <Col lg={8} md={12} sm={12}>
                            <Card>
                                <CardHeader>
                                    <h5>Delivery Timeline</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Status</th>
                                                <th>Note</th>
                                                {/* <th>Updated By</th> */}
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderDetails?.deliveryTimeline?.length > 0 ? (
                                                orderDetails.deliveryTimeline.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{capitalizeFirstLetter(item?.status)}</td>
                                                        <td>{item?.note}</td>
                                                        {/* <td>{item?.updatedBy}</td> */}
                                                        <td>
                                                            {moment(item?.timestamp).format(
                                                                "DD MMM YYYY, h:mm A"
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        No timeline found
                                                    </td>
                                                </tr>
                                            )}
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
                                                            <td>
                                                                {data?.discountPrice ? (
                                                                    <>
                                                                        <span className="line-through text-gray-500 mr-1">₹{data?.price}</span>
                                                                        <span className="font-semibold">₹{data?.discountPrice}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>₹{data?.price}</span>
                                                                )}
                                                            </td>

                                                            <td>₹ {orderDetails?.totals?.subtotal}</td>
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
            </Container >
        </>
    );
}

export default ViewOrder;
