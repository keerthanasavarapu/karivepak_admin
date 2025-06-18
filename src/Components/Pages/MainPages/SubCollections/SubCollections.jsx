import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';
import HeaderCard from '../../../Common/Component/HeaderCard';
import CommonModal from '../../../UiKits/Modals/common/modal'
import DataTableComponent from './SubCollectionsTable';

const SubCollections = () => {

    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <DataTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

};

export default SubCollections;