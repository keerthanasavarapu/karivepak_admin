import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Badge,
  Button,
  Alert,
  Container,
  Spinner
} from 'reactstrap';
import { MapPin, Package, Truck, CheckCircle, AlertCircle, MoreVertical } from 'react-feather';
import { baseURL } from '../../../../Services/api/baseURL';
import axios from 'axios';
import moment from 'moment';

const SubOrderDetail = () => {
  const { id } = useParams();
  console.log(id,"suborderid")
  const [subOrder, setSubOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBadgeColor = (status, type) => {
    if (type === 'order') {
      return {
        placed: "warning",
        confirmed: "success",
        processing:"success",
        shipped:"success",
        delivered:"success",
        cancelled: "danger",
        returned:"success",
        pending: "danger",
      }[status] || 'secondary';
    }
    if (type === 'delivery') {
      return {
        pending: "primary",
        in_transit: "primary",
        delivered: "success",
        accepted:"success",
        cancelled:"primary",
        failed: "danger",
      }[status] || 'secondary';
    }
    return 'secondary';
  };

  useEffect(() => {
    const fetchSubOrder = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(`${baseURL}/api/orders/suborder/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data,"suborder in return order")
        setSubOrder(response?.data?.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sub-order details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        <AlertCircle size={16} className="me-2" />
        {error}
      </Alert>
    );
  }

  const TimelineItem = ({ icon: Icon, title, description }) => (
    <div className="d-flex mb-3">
      <div className="me-3">
        <div className="rounded-circle bg-light p-2">
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h6 className="mb-1">{title}</h6>
        <small className="text-muted">{description}</small>
      </div>
    </div>
  );

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Sub-Order Details</h4>
          <Badge color={getBadgeColor(subOrder?.orderStatus, 'order')}>
            {subOrder?.orderStatus?.toUpperCase()}
          </Badge>
        </Col>
      </Row>

      <Row>
        {/* Product Details Card */}
        <Col md={6} className="mb-1">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Product Information</h4>
            </CardHeader>
            <CardBody>
              <div className="d-flex mb-3">
                <img
                  src={subOrder?.variantId?.images?.[0] || '/api/placeholder/200/200'}
                  alt={subOrder?.variantId?.title}
                  className="me-3"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <div>
                  <h5>{subOrder?.variantId?.title}</h5>
                  <p className="text-muted mb-2">Rental Period: {subOrder?.rentalPeriod}</p>
                  <h4 className="mb-2">₹{subOrder?.price?.toLocaleString('en-IN')}</h4>
                  <p className="text-muted">Quantity: {subOrder?.quantity}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Owner & Customer Details Card */}
        <Col md={6} className="mb-1">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Contact Information</h4>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <h5 className="mb-2">Owner Details</h5>
                <p className="mb-0">{subOrder?.owner?.name}</p>
                <p className="text-muted mb-1">{subOrder?.owner?.mobile}</p>
                {/* <p className="text-muted">{subOrder?.owner?.email}</p> */}
              </div>
              <div>
                <h5 className="mb-2">Customer Details : </h5>
                <p className="mb-0">{subOrder?.deliveryDetails?.deliveryAddress?.name}</p>
                <p className="text-muted mb-1">{subOrder?.deliveryDetails?.deliveryAddress?.mobile}</p>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Delivery Details Card */}
        <Col md={12} className="mb-1">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Delivery Information</h4>
            </CardHeader>
            <CardBody>
              <Badge color={getBadgeColor(subOrder?.deliveryStatus, 'delivery')}>
                {subOrder?.deliveryStatus?.toUpperCase()}
              </Badge>
              <div className="mt-4">
                <h5 className="mb-3">Delivery Address</h5>
                <p className="text-muted">{subOrder?.returnDeliveryDetails?.deliveryAddress?.address}</p>
              </div>
              {/* {subOrder?.deliveryPerson && (
                <div className="mt-4">
                  <h5 className="mb-3">Delivery Person</h5>
                  <p className="mb-1">{subOrder?.deliveryPerson?.name}</p>
                  <p className="text-muted">{subOrder?.deliveryPerson?.mobile}</p>
                </div>
              )} */}
              {!subOrder?.returnDeliveryDetails?.returnDeliveryPersonId ? (
                <div className="mt-4">
                  <h5 className="mb-3">Delivery Person</h5>
                  <p className="text-muted">Not Assigned</p>
                </div>
              ) : (
                <div className="mt-4">
                  <h5 className="mb-3">Delivery Person</h5>
                  <p className="mb-1">{subOrder?.returnDeliveryDetails?.returnDeliveryPersonId?.name}</p>
                  <p className="text-muted">{subOrder?.returnDeliveryDetails?.returnDeliveryPersonId?.mobile}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>

        <Col md={12} className="mb-1">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Pickup Information</h4>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <h5 className="mb-2">Pickup Address</h5>
                <p className="mb-0">{subOrder?.returnDeliveryDetails?.pickupAddress?.full}</p>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Order Timeline Card */}
        <Col md={12} className="mb-1">
          <Card>
            <CardHeader>
              <h4 className="mb-0">Order Timeline</h4>
            </CardHeader>
           <CardBody>
                 <TimelineItem
                   icon={Package}
                   title="Order Placed"
                   description={`Order placed on ${moment(subOrder?.statusTimeline[0]?.timestamp).format('DD/MM/YYYY')}`}
                 />
   
                 {subOrder?.statusTimeline[0]?.status === 'confirmed' && (
                   <TimelineItem
                     icon={CheckCircle}
                     title="Order Confirmed"
                     description={`Order Confirmed on ${moment(subOrder?.statusTimeline[0]?.timestamp).format('DD/MM/YYYY')}`}
                   />
                 )}
   
                 {subOrder?.deliveryTimeline?.map((item, index) => {
                   // Define icon based on status
                   let icon;
                   switch (item.status) {
                     case 'pending':
                       icon = Truck; // You can replace with any suitable icon
                       break;
                     case 'in-transit':
                       icon = Truck;
                       break;
                     case 'media-uploaded':
                       icon = Truck; // You can use a camera icon
                       break;
                     case 'delivered':
                       icon = CheckCircle;
                       break;
                     default:
                       icon = Truck; // fallback icon
                   }
   
                   return (
                     <TimelineItem
                       key={item._id || index}
                       icon={icon}
                       title={item.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                       description={`${item.note} on ${moment(item.timestamp).format('DD/MM/YYYY HH:mm')}`}
                     />
                   );
                 })}
   
               </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SubOrderDetail;