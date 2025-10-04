import React, { Fragment, useEffect, useState } from "react";
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
import { FaEye } from "react-icons/fa";

import axios from "axios";
import "react-dropdown/style.css";
import { useNavigate } from "react-router-dom";
import { baseURL, imageURL } from "../../../../Services/api/baseURL";

import dummyImg from "../../../../assets/images/product/2.png";
import Loader from "../../../Loader/Loader";
import moment from "moment";

const TransactionTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("role_name"));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [BasicTab, setBasicTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions
  const fetchItems = async () => {
    setIsLoading(true);
    const token = JSON.parse(localStorage.getItem("token"));

    try {
      let params = {};

      if (startDate && endDate && BasicTab !== "all") {
        params = {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD"),
        };
      }

      const url =
        userRole === "admin"
          ? `${baseURL}/api/transaction/get-all-transactions`
          : `${baseURL}/api/transactions/my`;

      const res = await axios.get(url, {
        params,
        headers: {
          Authorization: `${token}`,
        },
      });
console.log(res?.data?.data,"response of transa")
      const data = res?.data?.data || [];
      setTransactions(data.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [startDate, endDate]);

  // Handle Tabs (date filters)
  const handleTab = (step) => {
    setBasicTab(step);
    const { startDate, endDate } = calculateDates(step);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const calculateDates = (step) => {
    const today = new Date();
    let startDate = new Date();

    switch (step) {
      case "all":
        return { startDate: "", endDate: "" };
      case "today":
        startDate.setDate(today.getDate());
        break;
      case "7d":
        startDate.setDate(today.getDate() - 7);
        break;
      case "1m":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "1yr":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        break;
    }

    return { startDate, endDate: today };
  };

  // Table Columns
  const orderColumns = [
    // {
    //   name: "Transaction Id",
    //   selector: (row) => row._id,
    //   center: true,
    //   width: "180px",
    // },
    {
      name: "Customer Name",
      selector: (row) => row?.userId?.name || "N/A",
      cell: (row) => (
        <Media className="d-flex">
          <Image
            attrImage={{
              className: " img-30 me-3",
              src: row?.userId?.profilePic
                ?  row.userId.profilePic
                : dummyImg,
              alt: "User",
            }}
          />
          <Media body className="align-self-center">
            {row?.userId?.name || "N/A"}
          </Media>
        </Media>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Order Id",
      selector: (row) => row?.orderId?.orderId || "N/A",
      center: true,
    },
    {
      name: "Date & Time",
      selector: (row) => row.createdAt,
      sortable: true,
      center: true,
      cell: (row) => moment(row.createdAt).format("DD MMM YYYY, hh:mmA"),
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      center: true,
      cell: (row) => `₹${Number(row.amount).toFixed(2)}`,
    },
    {
      name: "Status",
      selector: (row) => row.transactionStatus,
      sortable: true,
      center: true,
      cell: (row) => (
        <div
          style={{
            background:
              row.transactionStatus === "completed" ? "#b7d5ac" : "#fff1dc",
            padding: "6px 14px",
            borderRadius: "20px",
            color:
              row.transactionStatus === "completed" ? "#0e7a0d" : "#EF940B",
            fontWeight: "bold",
            textTransform: "capitalize",
          }}
        >
          {row.transactionStatus}
        </div>
      ),
    },
    // {
    //   name: "Actions",
    //   cell: (row) => (
    //     <UncontrolledDropdown className="action_dropdown">
    //       <DropdownToggle className="action_btn">
    //         <MoreVertical color="#000" size={16} />
    //       </DropdownToggle>
    //       <DropdownMenu>
    //         <DropdownItem
    //           onClick={() =>
    //             navigate(`/transactions/${row._id}`, { state: row })
    //           }
    //         >
    //           View Transaction <FaEye />
    //         </DropdownItem>
    //       </DropdownMenu>
    //     </UncontrolledDropdown>
    //   ),
    //   sortable: false,
    //   center: true,
    //   omit: userRole !== "admin",
    //   width: "120px",
    // },
  ];

  // Search Filter
  const filteredTransactions = transactions.filter(
    (t) =>
      t?.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t?.amount?.toString().includes(searchQuery.toLowerCase()) ||
      t?.transactionStatus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t?.orderId?.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="d-flex align-items-center mb-3 justify-between">
              {/* Tabs */}
              {/* <Nav tabs className="product_variant_tabs">
                {["all", "today", "7d", "1m", "3m", "6m", "1yr"].map((tab) => (
                  <NavItem key={tab}>
                    <NavLink
                      className={BasicTab === tab ? "active" : ""}
                      onClick={() => handleTab(tab)}
                    >
                      {tab.toUpperCase()}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav> */}
               <h4>Transactions</h4>

              {/* Search */}
              <div className="file-content file-content1 justify-content-end">
                <div className="mb-0 form-group position-relative search_outer d-flex align-items-center">
                  <i className="fa fa-search" style={{ top: "unset" }}></i>
                  <input
                    className="form-control border-0"
                    style={{ maxWidth: "250px" }}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer, amount, status..."
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      {/* Data Table */}
      <DataTable
        data={filteredTransactions || []}
        columns={orderColumns}
        pagination
        highlightOnHover
        responsive
        progressPending={isLoading}
        progressComponent={<Loader />}
      />
    </Fragment>
  );
};

export default TransactionTable;
