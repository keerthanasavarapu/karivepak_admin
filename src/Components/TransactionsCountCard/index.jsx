import React, { useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from "reactstrap";
import { H3, H5, H6, P } from "../../AbstractElements";
import "./style.scss";

function TransactionsCountCard({ data }) {

  return (
    <div className="px-4">
      <Row>
        <Col sm={12} xl={3} md={3}>
          <Card>
            <CardBody style={{ padding: "20px" }}>
              <H6 attrH6={{ className: "fw-bolder" }}>
                {<i className="icofont icofont-truck me-2"></i>} Total
                Transactions
              </H6>
              <H3 attrH3={{ className: "mb-0 mt-3 fw-bolder" }}>
                {data?.transactions?.totalTransactions || 0}
              </H3>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} xl={3} md={3} className="card_width">
          <Card>
            <CardBody style={{ padding: "20px" }}>
              <H6 attrH6={{ className: "fw-bolder" }}>
                {<i className="icofont icofont-truck me-2"></i>} Total Customers
              </H6>
              <H3 attrH3={{ className: "mb-0 mt-3 fw-bolder" }}>
                {/* {data?.customers?.count || 0} */}
                {data?.transactions?.uniqueCustomerCount || 0}
              </H3>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} xl={3} md={3} className="card_width">
          <Card>
            <CardBody style={{ padding: "20px" }}>
              <H6 attrH6={{ className: "fw-bolder" }}>
                {<i className="icofont icofont-truck me-2"></i>} Total Revenue
              </H6>
              <H3 attrH3={{ className: "mb-0 mt-3 fw-bolder" }}>
                $ {data?.transactions?.revenue?.toFixed(2) || 0}
              </H3>
            </CardBody>
          </Card>
        </Col>
        <Col sm={12} xl={3} md={3} className="card_width">
          <Card>
            <CardBody style={{ padding: "20px" }}>
              <H6 attrH6={{ className: "fw-bolder" }}>
                {<i className="icofont icofont-truck me-2"></i>} Net Profit
              </H6>
              <H3 attrH3={{ className: "mb-0 mt-3 fw-bolder" }}>
                ${data?.net_profit?.totalNetProfit?.toFixed(2) || 0}
              </H3>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TransactionsCountCard;
