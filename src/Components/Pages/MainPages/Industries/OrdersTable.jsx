import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, H5 } from "../../../../AbstractElements";
import { tableColumns, orderColumns, products } from "./data";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Pagination,
  PaginationItem,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import CommonModal from "../../../UiKits/Modals/common/modal";
// import ExcelExport from 'react-data-export';
// import * as XLSX from 'xlsx';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Media,
  UncontrolledDropdown,
} from "reactstrap";
import { MoreVertical, Trash2 } from "react-feather";
import { FaDownload, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseURL, orderURL } from "../../../../Services/api/baseURL";
import moment from "moment";
import Loader from "../../../Loader/Loader";
import { debounce } from "lodash";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const DataTableComponent = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [orderData, setOrderData] = useState([])
  const [toggleDelet, setToggleDelet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, SetShowmodal] = useState(false);
  const [file, setFile] = useState({});
  const fileInputRef = useRef(null);
  const [fileData, setFileData] = useState([]);
  const [addExcel, setAddExcel] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [orderId, setOrderId] = useState('');
  const [statusValue, setStatusValue] = useState('')
  const [showOrderCancellationPopup, setShowOrderCancellationPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [BasicTab, setBasicTab] = useState(4);

  const handleTab = (step) => {
    setBasicTab(step);
  };

  const formik = useFormik({
    initialValues: {
      cancel_reason: "",
    },
    validationSchema: Yup.object({
      cancel_reason: Yup.string().required(
        "Please Enter Reason for Order Cancellation"
      ),
    }),
    onSubmit: async (values) => {
      const token = await JSON.parse(localStorage.getItem("token"));
      let body = {
        order_status: statusValue,
        cancel_reason: formik.values.cancel_reason,
      };
      if (body.order_status === "") {
        return Swal.fire({
          icon: "error",
          title: "Provide Order Status",
        });
      }
      try {
        await axios
          .patch(`${orderURL}/update-order-status/${orderId}`, body, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            if (res && res.status === 200) {
              Swal.fire({
                icon: "success",
                title: res?.data?.message,
              });
              //SetShowmodal(false);
              setShowOrderCancellationPopup(false);
              setOrderId("");
              setStatusValue("");
              formik.setFieldValue("cancel_reason", "");
              getOrderData();
            }
          });
      } catch (err) {
        console.error(err);
      }
    },
  });





  const getOrderData = async () => {
    console.log("control entered")
    try {
          await axios.get(`${baseURL}/api/business/`
           
      ).then((res) => {
        console.log("control fetched")
          
            if (res && res.status === 200) {

              console.log(res)
              setOrderData(res.data);
            }
        }
        )
        // console.log(res,'from vendors page')
    }
    catch (error) {
        console.log()
    }
}
  const toggleModal = () => {
    setOrderId("");
    SetShowmodal(!showModal);
  };

  const toggleCancelOrderModal = () => {
    formik.resetForm();
    setOrderId("");
    setShowOrderCancellationPopup(!showOrderCancellationPopup);
  };

  const debouncedSearch = React.useRef(
    debounce(async (searchTerm) => {
      setSearchText(searchTerm);
    }, 300)
  ).current;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  

  const handleNavigate = (id) => {
    navigate(`/orders/${id}`);
  };

  // downloadInvoice(orderId)
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
  const handleStatus = async (e) => {
    e.preventDefault();
    const token = await JSON.parse(localStorage.getItem("token"));
    let body = {
      order_status: statusValue,
      cancel_reason: cancelReason,
    };
    if (body.order_status === "") {
      return Swal.fire({
        icon: "error",
        title: "Provide Order Status",
      });
    }
    try {
      await axios
        .patch(`${orderURL}/update-order-status/${orderId}`, body, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          if (res && res.status === 200) {
            Swal.fire({
              icon: "success",
              title: res?.data?.message,
            });
            //SetShowmodal(false);
            setShowOrderCancellationPopup(false);
            //SetShowmodal(false);
            setShowOrderCancellationPopup(false);
            setOrderId("");
            setStatusValue("");
            getOrderData();
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  // function capitalizeFirstLetter(string) {
  //   return string?.charAt(0)?.toUpperCase() + string.slice(1);
  // }


  useEffect(() => {
    getOrderData();
  }, [BasicTab,searchTerm]);

  


  const orderColumns = [
    {
      name: "BUSINESS ID",
      selector: (row) => row["_id"],
      sortable: true,
      width: "150px",
      center: true,
      cell: (row) => {
        // Get the last 6 characters of the ID
        const businessId = row?._id;
        const formattedId = businessId ? `ID: ${businessId.slice(-6).toUpperCase()}` : "N/A";
    
        return (
          <div
            className='ellipses_text_3'
            // style={{ textDecoration: 'underline', color: 'black' }}
            onClick={() => handleNavigate(row?._id)}
          >
            {formattedId}
          </div>
        );
      },
    },    
    {
      name: "BUSINESS NAME",
      selector: (row) => `${row.businessName || "N/A"}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <div>
          {row.businessName ? row.businessName : "N/A"}
        </div>
      ),
    },
    {
      name: "BUSINESS TYPE",
      selector: (row) => `${row.businessType || "N/A"}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <div>
          {row.businessType ? row.businessType : "N/A"}
        </div>
      ),
    },
    {
      name: "CITY",
      selector: (row) => `${row?.city || "N/A"}`,
      cell: (row) => (
        <div>
          {row?.city ? row.city : "N/A"}
        </div>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "GST NAME",
      selector: (row) => `${row?.gstName}`,
      cell: (row) => {
        const gstName = row?.gstName || "N/A";
        const maskedGstName = gstName.length > 4 ? 
          gstName.slice(0, -4) + "*".repeat(4) : gstName;
          
        return (
          <div style={{ marginLeft: "30px" }}>
            {maskedGstName}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    
    {
      name: "MOBILE NUMBER",
      selector: (row) => `${row?.mobileNumber}`,
      cell: (row) => {
        const mobileNumber = row?.mobileNumber || "N/A";
        const maskedMobileNumber = mobileNumber.length > 4 ? 
          mobileNumber.slice(0, -4) + "*".repeat(4) : mobileNumber;
    
        return (
          <div style={{ marginLeft: "30px" }}>
            {maskedMobileNumber}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    {
      name: "EMAIL",
      selector: (row) => `${row?.emailAddress}`,
      cell: (row) => {
        const email = row?.emailAddress || "N/A";
        const maskedEmail = email.includes('@') 
          ? email.slice(0, email.indexOf('@') - 4) + "*".repeat(4) + email.slice(email.indexOf('@')) 
          : email;
    
        return (
          <div style={{ marginLeft: "30px" }}>
            {maskedEmail}
          </div>
        );
      },
      sortable: true,
      center: true,
    },
    {
      name: " ADDRESS",
      selector: (row) => `${row?.businessAddress}`,
      cell: (row) => {
        const businessAddress = row?.businessAddress || "N/A";
        
        return (
          <div style={{ marginLeft: "30px" }}>
            {businessAddress}
          </div>
        );
      },
      sortable: true,
      center: true,
    }
    
    // {
    //     name: 'PAYMENT DETAILS',
    //     selector: row => `${row.payment_method}`,
    //     cell: (row) => (
    //         row.payment_method
    //     ),
    //     sortable: true,
    //     center: true,
    // },
    // {
    //   name: "DELIVERY ADDRESS",
    //   selector: (row) => `${row.address}`,
    //   width: "350px",
    //   cell: (row) => (
    //     <div className="ellipses_text_1">
    //       {row.address?.address ? (
    //         <>
    //           <p className="ellipses-line-1">{row.address?.address}</p>
    //         </>
    //       ) : (
    //         <>
    //         {/* {console.log(row,"fillesrefs")} */}
    //           {/* {row.address?.addressFullName}
    //           {row.address?.houseNo}, {row.address?.roadName}, {row.address?.locality}
    //           {row.address?.city}, {row.address?.country}, {row.address?.addressPincode}
    //           {row.address?.addressPhoneNumber} */}
    //           {row?.address[0]?.addressFullName || ""}
    //           {row?.address[0]?.houseNo || ""}, {row?.address[0]?.roadName || ""},{" "}
    //           {row?.address[0]?.locality || ""}
    //           {row?.address[0]?.city || ""}, {row?.address[0]?.country || ""},{" "}
    //           {row?.address[0]?.addressPincode || ""}
    //           {row?.address[0]?.addressPhoneNumber || ""}
    //         </>
    //       )}
    //     </div>
    //   ),
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: "STORE",
    //   selector: (row) => `${row.discard_from}`,
    //   cell: (row) => row?.store?.storeName,
    //   sortable: true,
    //   center: true,
    // },
    // {
    //   name: "ORDER STATUS",
    //   selector: (row) => `${row.order_status}`,
    //   cell: (row) => {
    //     const customColors = {
    //       accepted: "primary",
    //       processing: "warning",
    //       "on-the-way": "info",
    //       delivered: "success",
    //       rejected: "danger",
    //       cancelled: "danger",
    //       returned: "secondary",
    //     };

    //     const statusKey = row?.order_status?.toLowerCase();
    //     const color = customColors[statusKey] || 'primary';
    //     return (
    //       <span style={{ fontSize: '13px' }} className={`badge badge-light-${color}`}>
    //         {/* {capitalizeFirstLetter(row?.order_status)} */}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    //   center: true,
    // },
    

    // {
    //   name: 'Actions',
    //   cell: (row) => (
    //     <div className='d-flex justify-content-end align-items-center' style={{ marginRight: '20px' }}>
    //       <div
    //         className='cursor-pointer'
    //       >
    //         <UncontrolledDropdown className='action_dropdown'>
    //           <DropdownToggle className='action_btn'
    //           >
    //             <MoreVertical color='#000' size={16} />
    //           </DropdownToggle>
    //           <DropdownMenu>
    //             <DropdownItem onClick={() => handleNavigate(row?._id)}>
    //               View
    //               <FaRegEye />
    //             </DropdownItem>
    //             {(row.order_status !== 'cancelled') &&
    //               <DropdownItem onClick={() => {
    //                 toggleCancelOrderModal()
    //                 setOrderId(row?._id)
    //                 setStatusValue("cancelled")
    //               }
    //               }>
    //                 Cancel Order
    //                 <i className="fa fa-refresh" aria-hidden="true"></i>
    //               </DropdownItem>}
    //             <DropdownItem onClick={() => downloadInvoice(row?._id)}>
    //               Invoice
    //               <FaDownload />
    //             </DropdownItem>
    //             {/* <DropdownItem className='delete_item' onClick={() => handleDelete(row?._id)} >
    //                                 Delete
    //                                 <FaTrashAlt />
    //                             </DropdownItem> */}
    //           </DropdownMenu>
    //         </UncontrolledDropdown>
    //       </div>
    //     </div>
    //   ),
    //   sortable: false,
    //   center: true,
    // },
  ];

  console.log(orderData,'sidjvnisjdnv')

  return (
    <Fragment>
      <Row xxl={12} className="p-3">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content align-items-center justify-content-between">
              <H5 attrH5={{ className: "mb-0" }}>Orders</H5>
              <div className="px-4">
                      <Nav tabs className="product_variant_tabs mb-3">
                        <NavItem>
                          <NavLink
                            className={BasicTab === 1 ? "active" : ""}
                            onClick={() => handleTab(1)}
                          >
                            Today
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={BasicTab === 2 ? "active" : ""}
                            onClick={() => handleTab(2)}
                          >
                            Weekly
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={BasicTab === 3 ? "active" : ""}
                            onClick={() => handleTab(3)}
                          >
                            Monthly
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={BasicTab === 4 ? "active" : ""}
                            onClick={() => handleTab(4)}
                          >
                            All
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
              <div className="d-flex">
                <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                  <i className="fa fa-search"></i>
                  <input
                    className="form-control border-0"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    type="text"
                    placeholder="Search..."
                  />
                </div>
                {/* <Input type='select' className='ms-3 sortBy' name='subCategory' >
                                    <option>Sort By</option>
                                </Input> */}
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      <DataTable
        data={orderData}
        columns={orderColumns}
        pagination
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        // paginationServer
        progressComponent={<Loader />}
      // paginationTotalRows={totalRows}
      // onChangeRowsPerPage={handlePerRowsChange}
      // onChangePage={handlePageChange}
      />
    </Fragment>
  );
};
export default DataTableComponent;


  // useEffect(() => {
  //     getOrderData();
  // }, [currentPage, perPage, searchText]);
  // const filteredData = orderData.filter((order) => {
  //   const address = order?.address;
  //   const addressMatches =
  //     address?.addressFullName
  //       ?.toLowerCase()
  //       .includes(searchTerm?.toLowerCase()) ||
  //     address?.addressPhoneNumber?.includes(searchTerm) ||
  //     address?.addressPincode?.includes(searchTerm) ||
  //     address?.city?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.country?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.houseNo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.locality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.roadName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     address?.state?.toLowerCase().includes(searchTerm?.toLowerCase());

    // const variantMatches = order.products.some((product) => {
    //   return (
    //     product.variant.variantName
    //       ?.toLowerCase()
    //       .includes(searchTerm?.toLowerCase()) ||
    //     product.variant.variantCode
    //       ?.toLowerCase()
    //       .includes(searchTerm?.toLowerCase())
    //   );
    // });

    // const productMatches = order.products.some((product) => {
    //   if (product.product) {
    //     return (
    //       product.product.productName
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.description
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.brand.brandName
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.category.collection_name
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.subCategory.collection_id
    //         ?.toLowerCase()
    //         .includes(searchTerm?.toLowerCase()) ||
    //       product.product.tags.some((tag) =>
    //         tag.tag?.toLowerCase().includes(searchTerm?.toLowerCase())
    //       )
    //     );
    //   } else {
    //     return false;
    //   }
    // });

    // return addressMatches || variantMatches || productMatches;
  // });

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  // const handlePerRowsChange = async (newPerPage, page) => {
  //   setPerPage(newPerPage);
  // };

    // const getOrderData = async () => {
  //   setIsLoading(true);

  //   let startDate, endDate;
  //   const tab=BasicTab;
  
  //     switch (tab) {
  //       case 1: // Today
  //         startDate = moment().startOf('day');
  //         endDate = moment().endOf('day');
  //         break;
  //       case 2: // Weekly
  //         startDate = moment().startOf('week');
  //         endDate = moment().endOf('week');
  //         break;
  //       case 3: // Monthly
  //         startDate = moment().startOf('month');
  //         endDate = moment().endOf('month');
  //         break;
  //       case 4: // Be default ALL, no date condition.
  //       startDate = null;
  //       endDate = null;
  //         break;
  //       default:
  //         startDate = null;
  //         endDate = null;
  //         break;
  //     }

  //   try {
  //     const token = await JSON.parse(localStorage.getItem("token"));
  //     const userData = await JSON.parse(localStorage.getItem("UserData"));
  //     let url =
  //       userRole !== "admin"
  //         ? `${baseURL}/api/dashboard/get-orders-with-status?storeId=${userData?._id}&search_string=${searchTerm}`
  //         : `${baseURL}/api/dashboard/get-orders-with-status?search_string=${searchTerm}`;
  //       let params= {};
  //         if(startDate !==null && endDate !==null) {
  //             params={  
  //               start_date: moment(startDate).format("YYYY-MM-DD"),
  //               end_date: moment(endDate).format("YYYY-MM-DD")
  //             }           
  //       }

  //     await axios
  //       .get(url, {
  //         params: params,
  //         headers: {
  //           Authorization: `${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         if (res?.data?.success && res) {
  //           setOrderData(res?.data?.data);
  //           setIsLoading(false);
  //         }
  //       });
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error(error);
  //   }
  // };

    // const addmodalExcel = () => setAddExcel(!addExcel);
    // const token = await JSON.parse(localStorage.getItem("token"));
        // await axios.get(`${baseURL}/api/dashboard/get-orders-with-status-count`, {
 // , {

            // headers: {
            //     Authorization: `${token}`,
            // }
        // }
         // const handleDelete = async (id) => {
  //     const token = await JSON.parse(localStorage.getItem("token"));
  //     if (window.confirm(`Are you sure you want to delete this Order?`)) {
  //         try {
  //             const res = await axios.delete(`${baseURL}/api/order/delete/${id}`, {
  //                 headers: {
  //                     Authorization: `${token}`
  //                 }
  //             });
  //             if (res?.status === 200 && res) {
  //                 Swal.fire({
  //                     icon: 'success',
  //                     title: res?.data?.message
  //                 })
  //                 getOrderData();
  //             }
  //         }
  //         catch (error) {
  //             console.error(error);
  //         }
  //     }
  // };

  // const handleFileUpload = (e) => {
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(e.target.files[0]);
  //   // reader.onload = (e) => {
  //   //     const data = e.target.result;
  //   //     const workbook = XLSX.read(data, { type: "binary" });
  //   //     const sheetName = workbook.SheetNames[0];
  //   //     const sheet = workbook.Sheets[sheetName];
  //   //     const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  //   //     setFileData(parsedData);
  //   //     addmodalExcel(); // Open the modal after reading the file
  //   // };
  // };

  // const handleClickImport = () => {
  //   // Trigger the file input click
  //   fileInputRef.current.click();
  // };

  /* const handleChange = (e) => {
       const files = e.target.files;
       if (files && files[0]) setFile(files[0]);
   };*/

  // const handleChange = (name, value) => {
  //   formik.setFieldValue(name, value);
  // }

  //-------------------------------------------------
//   <CommonModal isOpen={showOrderCancellationPopup} title={"Cancel Order"} className="store_modal" toggler={toggleCancelOrderModal} size="md">
//   <Container>
//     <form className="p-2 md:p-4" onSubmit={formik.handleSubmit}>
//       <div className="flex flex-col gap-4">

//         <label
//           style={{
//             fontFamily: 'Lato',
//             fontSize: '18px',
//             fontWeight: '400',
//             textAlign: 'left',
//           }}
//         >
//           Please enter the reason for cancellation
//         </label>
//         <input
//           type="text"
//           id="reason"
//           name='cancel_reason'
//           placeholder="Enter reason for cancellation"
//           className={`w-[100%] focus:outline-none border-b-2 p-2`}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           value={formik.values.cancel_reason}
//         />
//         {formik.touched.cancel_reason && formik.errors.cancel_reason ? (
//           <span className="text-red-500 text-sm mt-2">{formik.errors.cancel_reason}</span>

//         ) : (
//           ""
//         )}
//       </div>
//       <div className="flex justify-center gap-4">
//         <button
//           className="bg-[#D3178A] mt-4 w-32 h-12 rounded-full text-white"
//           type="submit"
//         >
//           Cancel Order
//         </button>

//       </div>
//     </form>
//   </Container>
// </CommonModal>

// <CommonModal
//   isOpen={showModal}
//   title={"Change Status"}
//   className="store_modal"
//   toggler={toggleModal}
//   size="md"
// >
//   <Container>
//     <Form className="status_form" onSubmit={handleStatus}>
//       <>
//         <Col xxl={12}>
//           <FormGroup>
//             <Row>
//               {/* <Col>
//                                       <Label>
//                                           <Input type='radio' name='status' className='me-2' id='1' />
//                                           Pending
//                                       </Label>
//                                   </Col> */}
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value={"accepted"}
//                     checked={statusValue === "accepted"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Accepted
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value={"rejected"}
//                     checked={statusValue === "rejected"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Rejected
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     id="1"
//                     value="on-the-way"
//                     checked={statusValue === "on-the-way"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   On the way
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="delivered"
//                     id="1"
//                     checked={statusValue === "delivered"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Delivered
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="cancelled"
//                     id="1"
//                     checked={statusValue === "cancelled"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Cancelled
//                 </Label>
//               </Col>
//               <Col>
//                 <Label>
//                   <Input
//                     type="radio"
//                     name="status"
//                     className="me-2"
//                     value="returned"
//                     id="1"
//                     checked={statusValue === "returned"}
//                     onChange={(e) => setStatusValue(e.target.value)}
//                   />
//                   Returned
//                 </Label>
//               </Col>
//             </Row>
//           </FormGroup>
//         </Col>
//       </>
//       <Row>
//         <Col xxl={12} className="text-right mt-3">
//           <Button
//             type="button"
//             className="cancel_Btn"
//             onClick={() => SetShowmodal(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="cursor-pointer bg-[#ff0000] font-medium w-40 ms-2 px-2 py-2 rounded-2xl text-white flex justify-center items-center"
//           >
//             Change Status
//           </Button>
//         </Col>
//       </Row>
//     </Form>
//   </Container>
// </CommonModal> 

 // {!isLoading && filteredData.length === 0 &&
                // <>
                //     <p className='my-5 text-center'>No Data Found</p>
                // </>
            //} 