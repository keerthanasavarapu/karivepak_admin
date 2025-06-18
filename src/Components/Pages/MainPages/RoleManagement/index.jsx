import React, { Fragment, useEffect, useState } from 'react'
import { Box } from 'react-feather'
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import RoleManagementTable from './roleManagementTable';
import './style.scss';
import axios from 'axios';
import { baseURL } from '../../../../Services/api/baseURL';

function RoleManagement() {
    const [count, setCount] = useState({});

    const getCount = async () => {
        const token = JSON.parse(localStorage.getItem('token'))
        try {
            await axios.get(`${baseURL}/api/partner/get-partner-count`, {
                headers: {
                    Authorization: `${token}`,
                }
            }).then((response) => {
                if (response?.data.success) {
                    setCount(response?.data?.data);
                }
            })
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getCount();
    }, [])

    return (
        <>
            <Fragment>
                <Container fluid={true} style={{ paddingTop: '30px' }}>
                    <Row>
                        {/* <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Partners</span></h6>
                                    <h2 className='fw-bold'>{count?.totalCount ? count?.totalCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col> */}
                        {/* <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Store Partners</span></h6>
                                    <h2 className='fw-bold'>{count?.storePartnerCount ? count?.storePartnerCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col> */}
                        <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Delivery Partners</span></h6>
                                    <h2 className='fw-bold'>{count?.deliveryPartnerCount ? count?.deliveryPartnerCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12">
                            <Card>
                                <RoleManagementTable />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        </>
    )
}

export default RoleManagement
