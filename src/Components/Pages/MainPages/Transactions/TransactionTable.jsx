import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Image } from "../../../../AbstractElements";
import {
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  Media,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { MoreVertical } from "react-feather";
import { FaEye } from 'react-icons/fa';

import axios from "axios";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";
import { baseURL, imageURL, variantsBaseURL } from "../../../../Services/api/baseURL";

import dummyImg from "../../../../assets/images/product/2.png";
import Loader from "../../../Loader/Loader";
import moment from "moment";

const TransactionTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('role_name'));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [BasicTab, setBasicTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([
    {
      status: "pending",
      transactionId: "123",
      customerName: "Ravi",
      quantity: 7,
      date: new Date(),
      amount: 200,
      paymentData: {
        cardType: "visa",
        paymentType: "card",
        cardNumber: "4242",
      },
    },
    {
      status: "recieved",
      transactionId: "124",
      customerName: "Ravi",
      quantity: 7,
      date: new Date(),
      amount: 199,
      paymentData: {
        paymentType: "paypal",
        cardNumber: "4242",
        address: "ravi@gk.com",
      },
    },
  ]);


  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));

    try {
      let params = {};

      if (startDate && endDate && BasicTab !== 'all') {
        params = {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD")
        };
      }

      const res = await axios.get(`${baseURL}/api/order/get-all-transactions`, {
        params: params,
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = res?.data?.data;
      setIsLoading(false);
      setTransactions(data.reverse());
    } catch (error) {
      setIsLoading(false);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [startDate, endDate]);

  const handleTab = (step) => {
    setBasicTab(step);
    const { startDate, endDate } = calculateDates(step);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const calculateDates = (step) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (step) {
      case 'all':
        break;
      case 'today':
        startDate.setDate(today.getDate())
        break;
      case '7d': // 7D
        startDate.setDate(today.getDate() - 7);
        break;
      case '1m': // 1M
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3m': // 3M
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6m': // 6M
        startDate.setMonth(today.getMonth() - 6);
        break;
      case '1yr': // 1Y
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }

    return { startDate, endDate: today };
  };

  const orderColumns = [
    {
      name: "Transaction Id",
      selector: (row) => row?._id,
      center: true,
      width: "150px",
      cell: (row) => row?._id,
    },
    {
      name: "Customer Name",
      selector: (row) => `${ row?.customer_info?.first_name}`,
      cell: (row) => (
        <>
          <Media className="d-flex">
            {/* <Image
              attrImage={{
                className: " img-30 me-3",
                src: `${row?.variantImage ? imageURL + row?.customerImage : dummyImg
                  }`,
                alt: "Generic placeholder image",
              }}
            /> */}
            <Media body className="align-self-center">
              <div>
                {(
                  row?.customer_info?.first_name !== undefined &&
                  row?.customer_info?.last_name !== undefined) ?
                  (row?.customer_info?.first_name + ' ' + row?.customer_info?.last_name) :
                  'N/A'}
              </div>
            </Media>
          </Media>
        </>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "No Items",
      selector: (row) => row?.quantity,
      sortable: true,
      center: true,
      cell: (row) => (row?.no_of_items ? row?.no_of_items : 0),
    },
    {
      name: "Date & Time",
      selector: (row) => row?.date,
      sortable: true,
      center: true,
      cell: (row) => moment(row.createdAt).format('DD MMM YYYY, hh:mmA')
    },

    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      center: true,
      cell: (row) => `$${(row?.amount ? row?.amount : 0)}`,
    },
    {
      name: "Payment Type",
      selector: (row) => `${row?.paymentData}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <>
          <Media className="d-flex">
            {/* <Image
              attrImage={{
                className: " img-30 me-3",
                src: `${row?.variantImage ? imageURL + row?.customerImage : dummyImg
                  }`,
                alt: "Generic placeholder image",
              }}
            /> */}
            <Media body className="align-self-center">
              <div>
                {/* {row?.paymentData?.paymentType === "paypal"
                  ? row?.paymentData?.address
                  : `****${row?.paymentData?.cardNumber}`} */}{
                  row?.payment_Type ? row?.payment_Type : "N/A"
                }
              </div>
            </Media>
          </Media>
        </>
      ),
    },
    {
      name: "Status",
      selector: (row) => `${row?.status}`,
      sortable: true,
      center: true,
      cell: (row) =>
        row?.transaction_status === "completed" ? (
          <div
            style={{
              background: "#b7d5ac",
              padding: "6px 14px",
              borderRadius: "20px",
              color: "#0e7a0d",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {row.transaction_status}
          </div>
        ) : (
          <div
            style={{
              background: "#fff1dc",
              padding: "6px 14px",
              borderRadius: "20px",
              color: "#EF940B",
              textTransform: "capitalize",
            }}
          >
            {row.transaction_status}
          </div>
        ),
    },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <>
    //       <UncontrolledDropdown className="action_dropdown">
    //         <DropdownToggle className="action_btn">
    //           <MoreVertical color="#000" size={16} />
    //         </DropdownToggle>
    //         <DropdownMenu>
    //           <DropdownItem>
    //             View Customer
    //             <FaEye />
    //           </DropdownItem>
    //         </DropdownMenu>
    //       </UncontrolledDropdown>
    //     </>
    //   ),
    //   sortable: false,
    //   center: true,
    //   omit: userRole !== "admin",
    //   width: "90px"
    // },
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction?.customer_info?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction?.customer_info?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction?.amount?.toString().includes(searchQuery.toLowerCase())
);

  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="d-flex align-items-center mb-3 justify-between">
              <Nav tabs className="product_variant_tabs">
                <NavItem>
                  <NavLink
                    className={BasicTab === 'all' ? "active" : ""}
                    onClick={() => handleTab('all')}
                  >
                    All
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === 'today' ? "active" : ""}
                    onClick={() => handleTab('today')}
                  >
                    Today
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === '7d' ? "active" : ""}
                    onClick={() => handleTab('7d')}
                  >
                    7D
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === '1m' ? "active" : ""}
                    onClick={() => handleTab('1m')}
                  >
                    1M
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === '3m' ? "active" : ""}
                    onClick={() => handleTab('3m')}
                  >
                    3M
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === '6m' ? "active" : ""}
                    onClick={() => handleTab('6m')}
                  >
                    6M
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={BasicTab === '1yr' ? "active" : ""}
                    onClick={() => handleTab('1yr')}
                  >
                    1Y
                  </NavLink>
                </NavItem>
              </Nav>
              <div className="file-content file-content1 justify-content-end">
                <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                  <i className='fa fa-search' style={{ top: 'unset' }}></i>
                  <input className='form-control border-0' style={{ maxWidth: '195px' }} type='text' onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search customer name, product, price, etc...' />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Row>


      <DataTable
        data={filteredTransactions || []}
        columns={orderColumns}
        pagination
        // onSelectedRowsChange={handleRowSelected}
        // clearSelectedRows={toggleDelet}
        progressPending={isLoading}
        progressComponent={<Loader />}
      />

    </Fragment>
  );
};
export default TransactionTable;
