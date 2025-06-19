import React, { Fragment, useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { H4 } from '../../../../AbstractElements';
import {
    Button, Col, Container, DropdownItem, DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, Label,
    Media, Row, UncontrolledDropdown, Badge
} from 'reactstrap';
import { NavItem, NavLink, Nav } from "reactstrap";
import { Eye, MoreVertical, Truck, AlertCircle } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { baseURL } from '../../../../Services/api/baseURL';
import Loader from '../../../Loader/Loader';
import { useNavigate } from 'react-router';
import { Completed } from '../../../../Constant';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const ReturnOrdersTable = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const [orderData, setOrderData] = useState([]);

    const [activeTab, setActiveTab] = useState('past');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0
    });
    const [startDate, setStartDate] = useState(new Date());
    const [formattedStartDate, setFormattedStartDate] = useState(format(new Date(), 'MMM yyyy'));
    const [showDelivery, setShowDelivery] = useState(false);
    console.log(showDelivery, "showDeliveryModal")
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedSubOrder, setSelectedSubOrder] = useState(null);
    console.log(selectedSubOrder, "selected suborderorder")
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const navigate = useNavigate();

    console.log(orderData, "orderdata")

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        console.log(tab, "tab")
    };

const fetchReturnOrders = async (page = 1, month = moment().month() + 1, year = moment().year()) => {
  console.log(month, year, "month and year");
  setLoading(true);
  try {
    const response = await axios.get(`${baseURL}/api/return/timeline/${month}/${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        month,
        year
      }
    });

    console.log(response.data, "response of return orders");

    if (Array.isArray(response.data?.data)) {
      setOrderData(response.data.data);
      setPagination(prev => ({
        ...prev,
        totalRows: response.data.length || 0
      }));
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error('Error fetching return orders:', error);
  } finally {
    setLoading(false);
  }
};



    const fetchDeliveryPersons = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/users/delivery-persons`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
            setDeliveryPersons(response.data.deliveryPersons);
        } catch (error) {
            console.error("Error fetching delivery persons:", error);
        }
    };

useEffect(() => {
  const month = moment(startDate).month() + 1; 
  const year = moment(startDate).year();       
  fetchReturnOrders(1, month, year);          
}, [formattedStartDate]);


        useEffect(() => {
        fetchDeliveryPersons();
    }, []);

    const getBadgeColor = (status, type) => {
        if (type === 'payment') {
            return {
                pending: 'warning',
                failed: 'danger',
                success: 'success'
            }[status] || 'secondary';
        }
        if (type === 'orderStatus') {
            return {
                pending: 'warning',
                in_transit: 'primary',
                delivered: 'success',
                failed: 'danger'
            }[status] || 'secondary';
        }
        if (type === 'deliveryStatus') {
            return {
                pending: 'warning',
                completed: "success",
                in_transit: 'primary',
                delivered: 'success',
                failed: 'danger'
            }[status] || 'secondary';
        }
        if (type === 'returnStatus') {
            return {
                pending: 'warning',
                'return-requested': "warning",
                completed: "success",
                in_transit: 'primary',
                delivered: 'success',
                failed: 'danger'
            }[status] || 'secondary';
        }
        return 'secondary';
    };

    const handleDeliveryAssign = async () => {
        try {
            console.log(selectedSubOrder._id, selectedDeliveryPerson)
            await axios.patch(`${baseURL}/api/return/suborders/${selectedSubOrder._id}/assign-delivery-person`, {
                deliveryPersonId: selectedDeliveryPerson
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            Swal.fire({
                title: "Delivery Assigned!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });

            setShowDelivery(false);
            // fetchOrders(pagination.page);
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
                cancelReason: selectedStatus === 'cancelled' ? cancelReason : undefined
            };

            await axios.patch(`${baseURL}/update-suborder-status/${selectedSubOrder._id}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            Swal.fire({
                title: "Status Updated!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });

            setShowStatusModal(false);
            // fetchOrders(pagination.page);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to update status",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        }
    };
    console.log('orderDataaa123', orderData);
    const ConfirmOrder = async (subOrder) => {
        try {
            await axios.patch(
                `${baseURL}/api/orders/suborders/confirm/${subOrder._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            Swal.fire({
                title: "Status Updated!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });
            // fetchOrders(pagination.page);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to update status",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        }
    };

    const columns = [
        {
            name: "Order ID",
            selector: row => row._id,
            sortable: true,
            width: "120px"
        },
        {
            name: "Product",
            selector: row => row.variantId?.title,
            cell: row => (
                <div className="d-flex align-items-center text-inherit hover:text-blue-600 hover:underline hover:cursor-pointer "
                    onClick={() => navigate(`/return-orders/suborder/${row._id}`)}
                >
                    <img
                        src={row.variantId?.images?.[0]}
                        alt={row.variantId?.title}
                        style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            marginRight: '10px',
                            borderRadius: '4px'
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
            width: "170px"
        },
        {
            name: "Quantity",
            selector: row => row.quantity,
            sortable: true,
            cell: row => (
                <div>

                    <small className="text-muted">{row.quantity || 'N/A'}</small>
                </div>
            ),
            width: "100px"
        },

        // {
        //     name: "Total Amount",
        //     selector: row => row.totalAmount,
        //     sortable: true,
        //     cell: row => (
        //         <span className="fw-bold">₹{row.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        //     )
        // },
        {
            name: "Order Status",
            selector: row => row.orderStatus,
            sortable: true,
            cell: row => (
                <Badge color={getBadgeColor(row.orderStatus, 'orderStatus')}>
                    {row.orderStatus?.toUpperCase()}
                </Badge>
            )
        },
        {
            name: "Delivery Status",
            selector: row => row.deliveryStatus,
            sortable: true,
            cell: row => (
                <Badge color={getBadgeColor(row.deliveryStatus, 'deliveryStatus')}>
                    {row.deliveryStatus?.toUpperCase()}
                </Badge>
            )
        },
        {
            name: "Retrun  Status",
            selector: row => row.returnStatus,
            sortable: true,
            cell: row => (
                <Badge color={getBadgeColor(row.returnStatus, 'returnStatus')}>
                    {row.returnStatus?.toUpperCase()}
                </Badge>
            )
        },

        {
            name: "Start Date",
            selector: row => row.startDate,
            sortable: true,
            cell: row => moment(row.startDate).format('DD/MM/YYYY')
        },
        {
            name: "End Date",
            selector: row => row.endDate,
            sortable: true,
            cell: row => moment(row.endDate).format('DD/MM/YYYY')
        },
        {
            name: "Actions",
            cell: row => (
                <UncontrolledDropdown >
                    <DropdownToggle tag="span" className="p-2 cursor-pointer">
                        <MoreVertical size={16} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {
                            setSelectedSubOrder(row);
                            setShowDelivery(true);

                        }} className='d-flex'>
                            <Truck className="me-2" size={14} />
                            Assign Delivery
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        }
    ];

    // const subOrderColumns = [
    //     {
    //         name: "Product",
    //         selector: row => row.variantId?.title,
    //         cell: row => (
    //             <div className="d-flex align-items-center text-inherit hover:text-blue-600 hover:underline hover:cursor-pointer "
    //                 onClick={() => navigate(`/orders/suborder/${row._id}`)}
    //             >
    //                 <img
    //                     src={row.variantId?.images?.[0]}
    //                     alt={row.variantId?.title}
    //                     style={{
    //                         width: '50px',
    //                         height: '50px',
    //                         objectFit: 'cover',
    //                         marginRight: '10px',
    //                         borderRadius: '4px'
    //                     }}
    //                 />
    //                 <div>
    //                     <div>{row.variantId?.title}</div>
    //                     <small className="text-muted">
    //                         Rental Period: {row.rentalPeriod?.toUpperCase()}
    //                     </small>
    //                 </div>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Owner",
    //         selector: row => row.owner?.name,
    //         cell: row => (
    //             <div>
    //                 <div>{row.owner?.name}</div>
    //                 <small className="text-muted">{row.owner?.mobile}</small>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Quantity & Price",
    //         cell: row => (
    //             <div>
    //                 <div>Qty: {row.quantity}</div>
    //                 <span className="fw-bold">₹{row.price?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Delivery Address",
    //         cell: row => (
    //             <div style={{ maxWidth: "200px" }}>
    //                 <small>{row.deliveryDetails?.deliveryAddress?.full || 'N/A'}</small>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Return Status",
    //         cell: row => (
    //             <div>
    //                 <Badge color={getBadgeColor(row.orderStatus, 'order')} className="me-2">
    //                     {row.orderStatus?.toUpperCase()}
    //                 </Badge>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Delivery Status",
    //         cell: row => (
    //             <div>
    //                 <Badge color={getBadgeColor(row.deliveryStatus, 'delivery')}>
    //                     {row.deliveryStatus?.toUpperCase()}
    //                 </Badge>
    //             </div>
    //         )
    //     },
    //     {
    //         name: "Actions",
    //         cell: row => (
    //             <UncontrolledDropdown className='mb-20'>
    //                 <DropdownToggle tag="span" className="p-2 cursor-pointer">
    //                     <MoreVertical size={16} />
    //                 </DropdownToggle>
    //                 <DropdownMenu>
    //                     <DropdownItem onClick={() => navigate(`/orders/suborder/${row._id}`)}>
    //                         <Eye className="me-2" size={14} />
    //                         View Details
    //                     </DropdownItem>
    //                     <DropdownItem onClick={() => {
    //                         setSelectedSubOrder(row);
    //                         setShowDeliveryModal(true);
    //                     }}>
    //                         <Truck className="me-2" size={14} />
    //                         Assign Delivery
    //                     </DropdownItem>
    //                     <DropdownItem
    //                         onClick={() => {
    //                             setSelectedSubOrder(row);
    //                             ConfirmOrder(row);
    //                         }}
    //                     >
    //                         <AlertCircle className="me-2" size={14} />
    //                         Confirm Order
    //                     </DropdownItem>
    //                     <DropdownItem onClick={() => {
    //                         setSelectedSubOrder(row);
    //                         setSelectedStatus(row.orderStatus);
    //                         setShowStatusModal(true);
    //                     }}>
    //                         <AlertCircle className="me-2" size={14} />
    //                         Update Status
    //                     </DropdownItem>
    //                 </DropdownMenu>
    //             </UncontrolledDropdown>
    //         )
    //     }
    // ];

    // const ExpandedComponent = ({ data }) => (
    //     <div className="p-4 bg-light">
    //         <h6 className="mb-3 text-gray-900 fw-bold">Suborders</h6>
    //         <DataTable
    //             data={data.subOrders}
    //             columns={subOrderColumns}
    //             dense
    //             className="bg-white rounded shadow-sm"
    //         />
    //     </div>
    // );

    // Filter function for search
    const filteredOrders = orderData?.filter(item =>
        item._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.quantity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rentalPeriod?.includes(searchTerm)
        // item.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // console.log(filteredOrders,"filteredOrders")



const handleDateChange = (date) => {
  const formatted = moment(date).format('MMMM YYYY'); 
  const month = moment(date).month() + 1; 
  const year = moment(date).year();      

//   console.log(month, year, "month and year to be passed as integer and number");

  setStartDate(date);
  setFormattedStartDate(formatted);

  fetchReturnOrders(month, year); // Pass as integer and number
};
    return (
        <Fragment>
            <Row className='pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <H4>Return orders List</H4>


                    <div className="file-content">
                        <Media>
                            <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                <i className='fa fa-search'></i>
                                <input
                                    className='form-control border-0'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type='text'
                                    placeholder='Search by ID, Customer, Mobile or Coupon...'
                                />
                            </div>
                        </Media>
                    </div>
                </div>
            </Row>

            <div className="card-header d-flex align-items-center justify-between" style={{ padding: '15px 30px' }}>
                {/* <Nav tabs className='product_variant_tabs'>
                    <NavItem>
                        <NavLink className={activeTab === 'past' ? 'active' : ''} onClick={() => handleTabClick('past')}>
                            Past
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === 'present' ? 'active' : ''} onClick={() => handleTabClick('present')}>
                            Present
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab === 'future' ? 'active' : ''} onClick={() => handleTabClick('future')}>
                            Future
                        </NavLink>
                    </NavItem>
                </Nav> */}
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
                <div className='d-flex align-items-center file-content file-content-dash'>

                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredOrders}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                progressPending={loading}
                progressComponent={<Loader />}
            // expandableRows
            // expandableRowsComponent={ExpandedComponent}
            />

            {/* Delivery Assignment Modal */}
            <CommonModal
                isOpen={showDelivery}
                title="Assign Delivery Person"
                toggler={() => setShowDelivery(false)}
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
                                <Button color="primary" onClick={handleDeliveryAssign} disabled={!selectedDeliveryPerson}>
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
                            {selectedStatus === 'cancelled' && (
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

export default ReturnOrdersTable;