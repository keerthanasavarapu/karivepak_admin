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
  const [activeTab, setActiveTab] = useState('placed');
  const [activeTabs, setActiveTabs] = useState('day');
  const [startDate, setStartDate] = useState(new Date());
  const [formattedStartDate, setFormattedStartDate] = useState(format(new Date(), 'MMM yyyy'));
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


  const fetchOrders = async (page) => {
    console.log(formattedStartDate, "formattedDate")
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/orders/filter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          month: String(formattedStartDate),
          period: String(activeTabs),
          status: String(activeTab)
        }
      });
      console.log(response.data, "response of orders")

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
      // Swal.fire({
      //   title: "Error",
      //   text: "Failed to fetch orders",
      //   icon: "error",
      //   confirmButtonColor: "#fc2c54",
      // });
    } finally {
      setLoading(false);
    }
  };



  const fetchDeliveryPersons = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/users/delivery-persons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setDeliveryPersons(response.data.deliveryPersons);
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
    }
  };

  useEffect(() => {

    fetchDeliveryPersons();
  }, []);

  useEffect(() => {
    fetchOrders();

  }, [activeTab, activeTabs, formattedStartDate]);

  const getBadgeColor = (status, type) => {
    if (type === "payment") {
      return (
        {
          pending: "danger",
          failed: "danger",
          completed: "success",
          success: "success",
        }[status] || "secondary"
      );
    }
    if (type === "order") {
      return (
        {
          placed: "warning",
          confirmed: "success",
          processing: "success",
          shipped: "success",
          delivered: "success",
          cancelled: "danger",
          returned: "success",
          pending: "danger",
        }[status] || "secondary"
      );
    }
    if (type === "delivery") {
      return (
        {
          pending: "primary",
          in_transit: "primary",
          delivered: "success",
          accepted: "success",
          cancelled: "primary",
          failed: "danger",
        }[status] || "secondary"
      );
    }
    if (type === "placed") {
      return (
        {
          placed: "warning",
          cancelled: "primary",
          delivered: "success",
          failed: "danger",
        }[status] || "secondary"
      );
    }
    return "secondary";
  };

  const handleDeliveryAssign = async () => {
    try {
      console.log(selectedSubOrder._id, selectedDeliveryPerson);
      const response = await axios.patch(
        `${baseURL}/api/orders/${selectedSubOrder._id}/assign-delivery`,
        {
          deliveryPersonId: selectedDeliveryPerson,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Delivery Assigned!",
        icon: "success",
        confirmButtonColor: "#fc2c54",
      });

      setShowDeliveryModal(false);
      fetchOrders(pagination.page);
    } catch (error) {
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
      selector: (row) => row._id,
      sortable: true,
      width: "150px",
    },
    {
      name: "Customer",
      selector: (row) => row.user?.name,
      sortable: true,
      cell: (row) => (
        <div>
          <div>{row.user?.name || "N/A"}</div>
          <small className="text-muted">{row.user?.mobile || "N/A"}</small>
        </div>
      ),
    },
    {
      name: "Items",
      selector: (row) => row.subOrders?.length || 0,
      sortable: true,
      cell: (row) => row.subOrders?.length || 0,
      width: "80px"
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
      name: "Tax",
      selector: (row) => row.taxDetails?.totalTax,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.taxDetails?.totalTax?.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          ₹
          {row.totalAmount?.toLocaleString("en-IN", {
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
        <Badge color={getBadgeColor(row.paymentStatus, "payment")}>
          {row.paymentStatus?.toUpperCase()}
        </Badge>
      ),
    },
    {
      name: "Order Status",
      selector: (row) => row.orderStatus,
      sortable: true,
      cell: (row) => (
        <Badge color={getBadgeColor(row.orderStatus, "placed")}>
          {row.orderStatus?.toUpperCase()}
        </Badge>
      ),
    },
    // {
    //   name: "Delivery charges",
    //   selector: row => row.deliveryCharge,
    //   sortable: true,
    //   cell: row => (
    //     <span className="fw-bold">₹{row.deliveryCharge?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
    //   )
    // },
    // {
    //   name: "Total Tax",
    //   selector: row => row.taxDetails.totalTax,
    //   sortable: true,
    //   cell: row => (
    //     <span className="fw-bold">₹{row.taxDetails?.totalTax?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
    //   )
    // },
    {
      name: "Coupon Applied",
      selector: (row) => row.couponCode,
      sortable: true,
      cell: (row) =>
        row.couponCode ? (
          <div className="d-flex flex-column gap-2">
            <Badge color="info" pill>
              {row.couponCode}
            </Badge>
            ₹{row.couponDiscount}
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
  ];

  const subOrderColumns = [
    {
      name: "Product",
      selector: (row) => row.variantId?.title,
      cell: (row) => (
        <div
          className="d-flex align-items-center text-inherit hover:text-blue-600 hover:underline hover:cursor-pointer "
          onClick={() => navigate(`/orders/suborder/${row._id}`)}
        >
          <img
            src={row.variantId?.images?.[0]}
            alt={row.variantId?.title}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              marginRight: "10px",
              borderRadius: "4px",
            }}
          />
          <div>
            <div>{row.variantId?.title}</div>
            <small className="text-muted">
              Rental Period: {row.rentalPeriod?.toUpperCase()}
            </small>
          </div>
        </div>
      ),
    },
    {
      name: "Owner",
      selector: (row) => row.owner?.name,
      cell: (row) => (
        <div>
          <div>{row.owner?.name}</div>
          <small className="text-muted">{row.owner?.mobile}</small>
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
    {
      name: "Delivery Address",
      cell: (row) => (
        <div style={{ maxWidth: "200px" }}>
          <small>{row.deliveryDetails?.deliveryAddress?.full || "N/A"}</small>
        </div>
      ),
    },
    {
      name: "Order Status",
      cell: (row) => (
        <div>
          <Badge
            color={getBadgeColor(row.orderStatus, "order")}
            className="me-2"
          >
            {row.orderStatus?.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      name: "Delivery Status",
      cell: (row) => (
        <div>
          <Badge color={getBadgeColor(row.deliveryStatus, "delivery")}>
            {row.deliveryStatus?.toUpperCase()}
          </Badge>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <UncontrolledDropdown direction="down" className="mb-20">
          <DropdownToggle tag="span" className="p-2 cursor-pointer">
            <MoreVertical size={16} />
          </DropdownToggle>
          <DropdownMenu container="body" end>
            <DropdownItem
              onClick={() => navigate(`/orders/suborder/${row._id}`)}
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
            <DropdownItem
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
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-light">
      <h6 className="mb-3 text-gray-900 fw-bold">Suborders</h6>
      <DataTable
        data={data.subOrders}
        columns={subOrderColumns}
        dense
        className="bg-white rounded shadow-sm "
      />
    </div>
  );

  // Filter function for search
  const filteredOrders = orderData.filter(
    (item) =>
      item._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.mobile?.includes(searchTerm) ||
      item.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDateChange = (date) => {
    const formatted = format(date, 'MMM yyyy'); // e.g., "Jun 2025"
    console.log(formatted, "formatted date");
    setStartDate(date);
    setFormattedStartDate(formatted);
    fetchOrders();
  };

  console.log(filteredOrders, "filteredorders");

  return (
    <Fragment>
      <div className="card-header d-flex align-items-center justify-between" style={{ padding: '15px 30px' }}>
        <Nav tabs className='product_variant_tabs'>
          <NavItem>
            <NavLink className={activeTab === 'placed' ? 'active' : ''} onClick={() => handleTabClick('placed')}>
              Placed
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'confirmed' ? 'active' : ''} onClick={() => handleTabClick('confirmed')}>
              Confirmed
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'processing' ? 'active' : ''} onClick={() => handleTabClick('processing')}>
              Processing
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'shipped' ? 'active' : ''} onClick={() => handleTabClick('shipped')}>
              Shipped
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'delivered' ? 'active' : ''} onClick={() => handleTabClick('delivered')}>
              Delivered
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'cancelled' ? 'active' : ''} onClick={() => handleTabClick('cancelled')}>
              Cancelled
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTab === 'returned' ? 'active' : ''} onClick={() => handleTabClick('returned')}>
              Returned
            </NavLink>
          </NavItem>
        </Nav>
        <Nav tabs className='product_variant_tabs'>
          <NavItem>
            <NavLink className={activeTabs === 'day' ? 'active' : ''} onClick={() => handleTabClicks('day')}>
              Today
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTabs === 'week' ? 'active' : ''} onClick={() => handleTabClicks('week')}>
              Weekly
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={activeTabs === 'month' ? 'active' : ''} onClick={() => handleTabClicks('month')}>
              Monthly
            </NavLink>
          </NavItem>


        </Nav>

        {/* <div>
                            <DatePicker
                                className="form-control datepickerr digits mx-2"
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date);
                                    fetchDashboardData(date); //  fetch data on change
                                }}
                                showMonthYearPicker //  Enables month + year picker view
                                dateFormat="MMM yyyy" //  Displays like "Jan 2025"
                                yearItemNumber={9}
                                showIcon
                                placeholderText="Last Year"
                            />


                        </div> */}

      </div>
      <Row className="pb-4">
        <div className="d-flex justify-content-between align-items-center">
          <H4>Order List</H4>

          <div>
            <DatePicker
              className="form-control datepickerr digits mx-2"
              selected={startDate}
              onChange={handleDateChange}
              showMonthYearPicker
              dateFormat="MMM yyyy"
              yearItemNumber={9}
              showIcon
              placeholderText="Last Year"
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
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
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
