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

