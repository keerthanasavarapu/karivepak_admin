import React, { Fragment, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';
import HeaderCard from '../../../Common/Component/HeaderCard';
import CommonModal from '../../../UiKits/Modals/common/modal'
import BrandsTableComponent from './brandTable';
import axios from 'axios';

const Brands = () => {

    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody style={{padding: '15px'}}>
                                <BrandsTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

};

export default Brands;