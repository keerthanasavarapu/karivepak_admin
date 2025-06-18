import React, { Fragment, useEffect, useState } from "react";
import "./style.scss";
import DataTableComponent from "./TransactionTable";
import axios from "axios";
import { baseURL, variantsBaseURL } from "../../../../Services/api/baseURL";
import TransactionsCountCard from "../../../TransactionsCountCard";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import moment from "moment";
const Variants = () => {
  const [countData, setCountData] = useState({});
  const [BasicTab, setBasicTab] = useState(1);

  const handleTab = (step) => {
    setBasicTab(step);
    getCountData(step)
  };
  
  const getCountData = async (tab) => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      
      let startDate, endDate;
  
      switch (tab) {
        case 1: // Today
          startDate = moment().startOf('day');
          endDate = moment().endOf('day');
          break;
        case 2: // Weekly
          startDate = moment().startOf('week');
          endDate = moment().endOf('week');
          break;
        case 3: // Monthly
          startDate = moment().startOf('month');
          endDate = moment().endOf('month');
          break;
        case 4: // Yearly
          startDate = moment().startOf('year');
          endDate = moment().endOf('year');
          break;
        default:
          break;
      }
  
      await axios.get(`${baseURL}/api/order/get-all-transactions-count`, {
        headers: {
          Authorization: `${token}`,
        },
        params: {
          start_date: moment(startDate).format("YYYY-MM-DD"),
          end_date: moment(endDate).format("YYYY-MM-DD")
        }
      }).then((response) => {
        if (response.status === 200) {
          let updatedData = response?.data.data;
          console.log("updated data", updatedData);
          setCountData(updatedData);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCountData(1);
  }, []);

  return (
    <Fragment>
      <Container fluid={true} style={{ paddingTop: "30px" }}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody className="p-0 py-4">
                <div className="d-flex justify-content-between">
                  <div className="w-75">
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
                            Yearly
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                  </div>
                  <div className="w-25">
                  </div>
                </div>

                <hr style={{ borderColor: "#F1F3F9", opacity: 1 }} />
                <TransactionsCountCard data={countData} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <Card>
              <CardBody style={{ padding: "15px" }}>
                <DataTableComponent />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Variants;
