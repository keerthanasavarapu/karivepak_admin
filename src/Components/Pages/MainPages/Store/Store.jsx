import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { Breadcrumbs, H2, H5, H6, LI, P, UL } from '../../../../AbstractElements';
import HeaderCard from '../../../Common/Component/HeaderCard';
import CommonModal from '../../../UiKits/Modals/common/modal'
import DataTableComponent from './StoreTable';
import Loader from '../../../../Layout/Loader';
import { Box } from 'react-feather';
import { Image } from '../../../../Constant';
import axios from 'axios';
import { baseURL } from '../../../../Services/api/baseURL';
import './style.scss';
import { useDataContext } from '../../../../context/hooks/useDataContext';

const Store = () => {
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const { storeData } = useDataContext();
    const [storeCount, setStoreCount] = useState({});

    const getStoreCount = async () => {
        try {
            await axios.get(`${baseURL}/api/store/get-store-count`).then((res) => {
                setStoreCount(res?.data?.data);
            })
        }
        catch (error) {
            console.error("error", error);
        }
    }

    useEffect(() => {
        getStoreCount();
    }, [storeData]);

    return (
        <Fragment>
            <Suspense fallback={<Loader />}>

                <Container fluid={true} style={{ paddingTop: '30px' }}>

                    {/* /// Stores Info */}
                    {/* {
                        userRole === 'admin' &&   <Row>
                        <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Stores</span></h6>
                                    <h2 className='fw-bolder'>{storeCount?.totalCount ? storeCount?.totalCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Closed Stores</span></h6>
                                    <h2 className='fw-bolder'>{storeCount?.inActiveCount ? storeCount?.inActiveCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="12" md="4">
                            <Card className='store_card'>
                                <CardBody>
                                    <h6 className='d-flex border-0 p-1 align-items-center fw-bold' ><Box /> <span className='ms-2'>Total Opened Stores</span></h6>
                                    <h2 className='fw-bolder'>{storeCount?.activeCount ? storeCount?.activeCount : 0}</h2>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    } */}

                    <Row>
                        <Col sm="12">
                            <Card>
                                <DataTableComponent />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Suspense>
        </Fragment>
    );

};

export default Store;