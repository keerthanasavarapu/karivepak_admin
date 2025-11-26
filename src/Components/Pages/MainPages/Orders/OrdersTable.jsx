import React, { Fragment, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { H4 } from "../../../../AbstractElements";
import {
  Button,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Media,
  Row,
  UncontrolledDropdown,
  Badge,
  Nav, NavItem, NavLink
} from "reactstrap";
import { Eye, MoreVertical, Truck, AlertCircle } from "react-feather";
import CommonModal from "../../../UiKits/Modals/common/modal";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { baseURL } from "../../../../Services/api/baseURL";
import Loader from "../../../Loader/Loader";
import DatePicker from 'react-datepicker';
import { useNavigate } from "react-router";
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';


const OrderTable = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [orderData, setOrderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    totalRows: 0,
  });

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  console.log(showDeliveryModal, "showDeliveryModal");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSubOrder, setSelectedSubOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('Placed');
  const [activeTabs, setActiveTabs] = useState('day');
  const [startDate, setStartDate] = useState();
  const [formattedStartDate, setFormattedStartDate] = useState('');
  console.log(startDate, "startDate")
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleTabClicks = (tab) => {
    setActiveTabs(tab);
  };


  const fetchOrders = async (selectedDate) => {
    console.log("calling orders with", selectedDate);
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/orders/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { date: selectedDate, status: activeTab } // send date as query param
      });

      if (Array.isArray(response?.data?.orders)) {
        setOrderData(response?.data?.orders);
        setPagination(prev => ({
          ...prev,
          totalRows: response?.data?.orders?.length
        }));
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };




  const fetchDeliveryPersons = async () => {
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

  useEffect(() => {
    fetchOrders(formattedStartDate);

  }, [formattedStartDate, activeTab]);

  const getBadgeColor = (status, type) => {
    if (!status) return "secondary"; // default if empty
    const normalized = status.toLowerCase();

    if (type === "paymentStatus") {
      return (
        {
          pending: "danger",
          failed: "danger",
          paid: "success",
          success: "success",
        }[normalized] || "secondary"
      );
    }

    if (type === "order") {
      return (
        {
          placed: "warning",
          confirmed: "info",
          processing: "primary",
          shipped: "primary",
          delivered: "success",
          cancelled: "danger",
          returned: "secondary",
          pending: "danger",
        }[normalized] || "secondary"
      );
    }

    if (type === "delivery") {
      return (
        {
          pending: "danger",
          in_transit: "primary",
          delivered: "success",
          accepted: "success",
          cancelled: "danger",
          failed: "danger",
        }[normalized] || "secondary"
      );
    }

    if (type === "placed") {
      return (
        {
          placed: "warning",
          cancelled: "danger",
          delivered: "success",
          failed: "danger",
        }[normalized] || "secondary"
      );
    }

    return "secondary";
  };


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
      fetchOrders(pagination.page);
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

  const handleStatusUpdate = async () => {
    try {
      const body = {
        orderStatus: selectedStatus,
        cancelReason: selectedStatus === "cancelled" ? cancelReason : undefined,
      };

      await axios.patch(
        `${baseURL}/update-suborder-status/${selectedSubOrder._id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Status Updated!",
        icon: "success",
        confirmButtonColor: "#fc2c54",
      });

      setShowStatusModal(false);
      fetchOrders(pagination.page);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update status",
        icon: "error",
        confirmButtonColor: "#fc2c54",
      });
    }
  };

  const ConfirmOrder = async (subOrder) => {
    try {
      const response = await axios.patch(
        `${baseURL}/api/orders/suborders/confirm/${subOrder._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "response in confirm order")
      Swal.fire({
        title: "Status Updated!",
        icon: "success",
        confirmButtonColor: "#fc2c54",
      });
      fetchOrders(pagination.page);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update status",
        icon: "error",
        confirmButtonColor: "#fc2c54",
      });
    }
  };


  const AssignPorter = async (subOrder) => {
    try {
      await axios.post(
        `${baseURL}/api/porter/order/${subOrder._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Porter Assigned!",
        icon: "success",
        confirmButtonColor: "#fc2c54",
      });
      fetchOrders(pagination.page);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to assign porter",
        icon: "error",
        confirmButtonColor: "#fc2c54",
      });
    }
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
      width: "150px",
    },
    {
      name: "Customer",
      selector: (row) => row.user?.name,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div >
          <div>{row.user?.name || "N/A"}</div>
          <small className="text-muted">{row.user?.mobile_number || "N/A"}</small >
        </div>
      ),
    },
    {
      name: "Items cost",
      selector: (row) => row.items.length || 0,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">

          <small className="text-muted">₹ {row.totals?.subtotal || "N/A"}</small >
          <div>({row.items.length || 0})</div>

        </div>
      ),
      // width: "100px"
    },
    {
      name: "GST",
      selector: (row) => row.gstAmounts?.totalGST,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.gstAmounts?.totalGST?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      name: "Handling Fee",
      selector: (row) => row.handlingFee,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.handlingFee?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      name: "Small Cart Charges",
      selector: (row) => row.smallCartFee,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.smallCartFee?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },

    {
      name: "Delivery charges",
      selector: (row) => row.deliveryCharge,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.deliveryCharge?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      name: "Delivery Address",
      cell: (row) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <small>{row.address?.address || "N/A"}</small>
        </div>
      ),
    }
    ,

    {
      name: "Total Amount",
      selector: (row) => row.grandTotal,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.grandTotal?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      sortable: true,
      cell: (row) => (
        <Badge color={getBadgeColor(row.paymentStatus, "paymentStatus")}>
          {row.paymentStatus?.toUpperCase()}
        </Badge>

      ),
    },
    {
      name: "Order Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge color={getBadgeColor(row.status, "order")}>
          {row.status?.toUpperCase()}
        </Badge>

      ),
    },
    {
      name: "Coupon Applied",
      selector: (row) => row.coupon,
      sortable: true,
      cell: (row) =>
        row.coupon ? (
          <div className="d-flex flex-column gap-2">
            <Badge color="info" pill>
              {row.coupon}
            </Badge>
            ₹{row.coupon}
          </div>
        ) : (
          "No Coupon"
        ),
    },
    {
      name: "Order Date",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (row) => moment(row.createdAt).format("DD/MM/YYYY"),
    },

    {
      name: "Actions",
      cell: (row) => (
        <UncontrolledDropdown direction="down" >
          <DropdownToggle tag="span" className="p-2 cursor-pointer">
            <MoreVertical size={16} />
          </DropdownToggle>
          <DropdownMenu container="body" end>
            <DropdownItem
              onClick={() => navigate(`/orders/${row._id}`)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: "10px" }}
            >
              <Eye className="me-2" size={14} />
              View Details
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSelectedSubOrder(row);
                setShowDeliveryModal(true);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: "10px" }}
            >
              <Truck className="me-2" size={14} />
              Assign Delivery
            </DropdownItem>
            {/* <DropdownItem
              onClick={() => {
                setSelectedSubOrder(row);
                AssignPorter(row)
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: "10px" }}
            >
              <Truck className="me-2" size={14} />
              Assign Porter
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSelectedSubOrder(row);
                ConfirmOrder(row);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: "10px" }}
            >
              <AlertCircle className="me-2" size={14} />
              Confirm Order
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setSelectedSubOrder(row);
                setSelectedStatus(row.orderStatus);
                setShowStatusModal(true);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <AlertCircle className="me-2" size={14} />
              Update Status
            </DropdownItem> */}
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const subOrderColumns = [

    {
      name: "Product Image",
      selector: (row) => row.items?.product,
      cell: (row) => (
        <div
          className="d-flex align-items-center text-inherit hover:text-blue-600 hover:underline hover:cursor-pointer "
        >
          <img
            src={row.product?.image?.[0]}
            alt={row.items?.product.name}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "10px",
              borderRadius: "4px",
            }}
          />
          {/* <div>
            <div>{row.variantId?.title}</div>
            <small className="text-muted">
              Rental Period: {row.rentalPeriod?.toUpperCase()}
            </small>
          </div> */}
        </div>
      ),
    },
    {
      name: "Product Name",
      selector: (row) => row.product?.name,
      cell: (row) => (
        <div>
          <div>{row.product?.name}</div>
          {/* <small className="text-muted">{row.user?.mobile}</small> */}
        </div>
      ),

    },
    {
      name: "Quantity & Price",
      cell: (row) => (
        <div>
          <div>Qty: {row.quantity}</div>
          <span className="fw-bold">
            ₹{row.price?.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </span>
        </div>
      ),
    },



  ];

  const ExpandedComponent = ({ data }) => (
    console.log(data, "expanded data..."),
    <div className="p-4 bg-light">
      <h6 className="mb-3 text-gray-900 fw-bold">Product</h6>
      <DataTable
        data={data.items || []}
        columns={subOrderColumns}
        dense
        className="bg-white rounded shadow-sm "
      />
    </div>
  );

  // filter logic
  const filteredOrders = orderData.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order?.orderId?.toLowerCase().includes(search) ||
      order?.user?.name?.toLowerCase().includes(search) ||
      order?.user?.mobile_number?.toLowerCase().includes(search) ||
      order?.coupon?.toLowerCase().includes(search)
    );
  });


  const handleDateChange = (date) => {
    if (!date) {
      setStartDate(null);
      setFormattedStartDate("");
      fetchOrders("");
      return;
    }

    const formatted = format(date, 'dd MMM yyyy');
    setStartDate(date);
    setFormattedStartDate(formatted);
    fetchOrders(formatted);
  };



  console.log(filteredOrders, "filteredorders");

  return (
    <Fragment>
      <div className="card-header d-flex align-items-center justify-between" style={{ padding: '15px 30px' }}>
        <Nav tabs className='product_variant_tabs'>
          <NavItem>
            <NavLink className={activeTab === 'Placed' ? 'active' : ''} onClick={() => handleTabClick('Placed')}>
              Placed
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'Confirmed' ? 'active' : ''} onClick={() => handleTabClick('Confirmed')}>
              Confirmed
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'Shipped' ? 'active' : ''} onClick={() => handleTabClick('Shipped')}>
              Shipped
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'Delivered' ? 'active' : ''} onClick={() => handleTabClick('Delivered')}>
              Delivered
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'Cancelled' ? 'active' : ''} onClick={() => handleTabClick('Cancelled')}>
              Cancelled
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'Returned' ? 'active' : ''} onClick={() => handleTabClick('Returned')}>
              Returned
            </NavLink>
          </NavItem>
        </Nav>
      </div>
      <Row className="pb-4">
        <div className="d-flex justify-content-between align-items-center">
          <H4>Order List</H4>

          <div>
            <DatePicker
              className="form-control datepickerr digits mx-2"
              selected={startDate}
              onChange={handleDateChange}
              dateFormat="dd MMM yyyy"
              showIcon
              placeholderText="Select Date"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />

          </div>
          <div className="file-content">
            <Media>
              <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                <i className="fa fa-search"></i>
                <input
                  className="form-control border-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search by ID, Customer, Mobile or Coupon..."
                />
              </div>

            </Media>
          </div>
        </div>

      </Row>

      <DataTable
        columns={columns}
        data={filteredOrders}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        progressPending={loading}
        progressComponent={<Loader />}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />


      {/* Delivery Assignment Modal */}
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

      {/* Status Update Modal */}
      <CommonModal
        isOpen={showStatusModal}
        title="Update Order Status"
        toggler={() => setShowStatusModal(false)}
        size="md"
      >
        <Container>
          <Form>
            <Col xxl={12}>
              <FormGroup>
                <Label>Select Status</Label>
                <Input
                  type="select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Shipped</option>
                  <option value="cancelled">Delivered</option>
                  <option value="processing">Cancelled</option>
                </Input>
              </FormGroup>
              {selectedStatus === "cancelled" && (
                <FormGroup>
                  <Label>Cancellation Reason</Label>
                  <Input
                    type="text"
                    placeholder="Enter cancellation reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </FormGroup>
              )}
              <Row className="text-center">
                <Button
                  color="primary"
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus}
                >
                  Update Status
                </Button>
              </Row>
            </Col>
          </Form>
        </Container>
      </CommonModal>
    </Fragment>
  );
};

export default OrderTable;
