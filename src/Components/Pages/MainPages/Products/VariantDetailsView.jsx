import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { baseURL } from '../../../../Services/api/baseURL';
import { FaEdit, FaTrash, FaImages } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Loader from '../../../Loader/Loader';

const VariantDetailsView = ({ variantId, onEdit, onDelete, token }) => {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    currentImage: null
  });

  console.log(variant, " variants in variants")

  useEffect(() => {
    const fetchVariantDetails = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/products/${variantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data, " product details response");
        setVariant(response?.data?.product);
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to fetch variant details'
        });
        setLoading(false);
      }
    };

    if (variantId) {
      fetchVariantDetails();
    }
  }, [variantId, token]);

  const openImageModal = (image) => {
    setImageModal({
      isOpen: true,
      currentImage: image
    });
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      currentImage: null
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (!variant) {
    return <div>No product details found</div>;
  }

  const renderItemDetails = (itemDetails) => {
    if (!itemDetails) {
      return <dd className="col-sm-12">No item details available</dd>;
    }

    // If itemDetails is a string, parse it
    let parsedDetails;
    try {
      parsedDetails = typeof itemDetails === "string"
        ? JSON.parse(itemDetails)
        : itemDetails;
    } catch (e) {
      return <dd className="col-sm-12">Invalid item details</dd>;
    }

    // If parsed details is an array like [{key:"color", value:"red"}]
    if (Array.isArray(parsedDetails) && parsedDetails.length > 0) {
      return parsedDetails.map((item, index) => (
        <React.Fragment key={index}>
          <dt className="col-sm-4">
            {item.key.charAt(0).toUpperCase() + item.key.slice(1)}:
          </dt>
          <dd className="col-sm-8">{item.value || "N/A"}</dd>
        </React.Fragment>
      ));
    }

    return <dd className="col-sm-12">No item details available</dd>;
  };

  




  return (
    <div>
      <Card className="mb-4">
        <CardBody>
          {/* <CardTitle tag="h4" className="mb-4">
            Product Details
            <div className="float-end">
              <Button
                color="primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(variant)}
              >
                <FaEdit className="me-1" /> Edit
              </Button>

            </div>
          </CardTitle> */}

          <Row>
            <Col md={6} className='mt-4'>
              <h5>Basic Information</h5>
              <dl className="row">
                <dt className="col-sm-4">Title:</dt>
                <dd className="col-sm-8">{variant.name}</dd>

                <dt className="col-sm-4">Category:</dt>
                <dd className="col-sm-8">{variant.main_category?.name || 'N/A'}</dd>

                <dt className="col-sm-4">Sub Category:</dt>
                <dd className="col-sm-8">{variant.category?.name || 'N/A'}</dd>
                {/* 
                <dt className="col-sm-4">Product:</dt>
                <dd className="col-sm-8">{variant.productId?.productName || 'N/A'}</dd> */}

                <dt className="col-sm-4">Description:</dt>
                <dd className="col-sm-8">{variant.description}</dd>


                <dt className="col-sm-4">Weight:</dt>
                <dd className="col-sm-8">{variant.weight ? `${variant.weight}` : 'N/A'}</dd>

                <dt className="col-sm-4">Original Price:</dt>
                <dd className="col-sm-8">{variant.price ? ` ₹ ${variant.price}` : '0'}</dd>
                <dt className="col-sm-4">Discount Price:</dt>
                <dd className="col-sm-8">{variant.discountPrice ? ` ₹ ${variant.discountPrice}` : '0'}</dd>
                <dt className="col-sm-4">Tags:</dt>
                <dd className="col-sm-8">{variant.tags ? ` ${variant.tags}` : 'NA'}</dd>
              </dl>
            </Col>

            <Col md={6} className='mt-4'>
              <h5>Item Details</h5>
              <dl className="row">
                {renderItemDetails(variant.itemDetails)}
              </dl>
            </Col>

          </Row>

          <Row className="mt-4">



            <Col md={6} className='mt-'>
              <h5>Stock</h5>
              <dl className="row">
                <dt className="col-sm-4">Stock:</dt>
                <dd className="col-sm-8">{variant.stock}</dd>
                <dt className="col-sm-4">Created Date:</dt>
                <dd className="col-sm-8">
                  {moment(variant?.createdAt).format('DD/MM/YYYY')}
                </dd>
                <dt className="col-sm-4">Updated Date:</dt>
                <dd className="col-sm-8">
                  {moment(variant?.updatedAt).format('DD/MM/YYYY')}
                </dd>
              </dl>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h5>
                Images
                <span className="ms-2 badge bg-secondary">
                  {variant.image?.length || 0}
                </span>
              </h5>
              <div className="d-flex flex-wrap">
                {variant.image?.map((image, index) => (
                  <div
                    key={index}
                    className="me-2 mb-2 position-relative"
                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                    onClick={() => openImageModal(image)}
                  >
                    <img
                      src={image}
                      alt={`Variant Image ${index + 1}`}
                      className="img-thumbnail"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div className="position-absolute bottom-0 end-0 p-1">
                      <FaImages color="white" />
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h5>Other Info</h5>
              <dl className="row">

                {/* 
                <dt className="col-sm-4">Meta Title:</dt>
                <dd className="col-sm-8">{variant?.metaTitle}</dd>


                <dt className="col-sm-4">Meta Description:</dt>
                <dd className="col-sm-8">{variant?.metaDescription}</dd> */}

                <dt className="col-sm-4">Created At:</dt>
                <dd className="col-sm-8">{moment(variant.createdAt).format('DD/MM/YYYY HH:mm')}</dd>

                <dt className="col-sm-4">Updated At:</dt>
                <dd className="col-sm-8">{moment(variant.updatedAt).format('DD/MM/YYYY HH:mm')}</dd>
                {/* 
                <dt className="col-sm-4">Approved:</dt>
                <dd className="col-sm-8">
                  {variant.status != "rejected" ?
                    <span className={`badge ${variant.isApproved ? 'bg-success' : 'bg-warning'}`}>
                      {variant.isApproved ? 'Approved' : 'Pending Approval'}
                    </span> : <span className={`badge ${variant.status && 'bg-danger'}`}>
                      {variant.status && 'Rejected'}
                    </span>}
                </dd> */}
              </dl>
            </Col>

            {/* <Col md={6}>
              <h5>Sale Information</h5>
              <dl className="row">
                <dt className="col-sm-4">For Sale:</dt>
                <dd className="col-sm-8">{variant.isForSale ? 'Yes' : 'No'}</dd>

                {variant.isForSale && variant.salePrice != null && (
                  <>
                    <dt className="col-sm-4">Sale Price:</dt>
                    <dd className="col-sm-8"> ₹ {variant.salePrice.toFixed(2)}</dd>
                  </>
                )}
              </dl>
            </Col> */}
          </Row>
        </CardBody>
      </Card>

      {/* Image Modal */}
      <Modal isOpen={imageModal.isOpen} toggle={closeImageModal} size="lg">
        <ModalHeader toggle={closeImageModal}>Image View</ModalHeader>
        <ModalBody className="text-center">
          <img
            src={imageModal.currentImage}
            alt="Full Size"
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default VariantDetailsView;