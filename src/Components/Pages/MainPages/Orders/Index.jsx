import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody} from 'reactstrap';
import DataTableComponent from './OrdersTable';
import './style.scss';
import square from '../../../../../src/assets/images/sqaurebox.svg'
import axios from 'axios';
import { baseURL, orderURL } from '../../../../Services/api/baseURL';

const Orders = () => {
  const [countData, setCountData] = useState();

  const getCount = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
        await axios.get(`${baseURL}/api/dashboard/get-orders-with-status-count`, {
            headers: {
                Authorization: `${token}`,
            }
        }).then((res) => {
            if (res && res.status === 200) {
                setCountData(res?.data?.data);
            }
        })
    }
    catch (error) {
        console.log()
    }
}

useEffect(() => {
  getCount();
}, [])

  return (
    <Fragment>
      <Container fluid={true} style={{ paddingTop: '30px' }}>
        <Row >
            <Col xl='3' sm='6' >
            <Card className='social-widget widget-hover'>
            <CardBody>
                <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center gap-2'>
                      <img src={square} alt="" className='square_box' />  <h6 className="mb-0"> Total Completed Orders</h6>
                    </div>
                </div>
                <div className='d-flex justify-content-between mt-3' >
                    <h5 className='fw-600 f-16 mb-0'>
                        {countData?.total_completed_orders ? countData?.total_completed_orders : 0}
                    </h5>
                </div>

            </CardBody>
        </Card>
            </Col>
        </Row>
        
        <Row>
          <Col sm="12">
            <Card>
                <DataTableComponent />
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default Orders;