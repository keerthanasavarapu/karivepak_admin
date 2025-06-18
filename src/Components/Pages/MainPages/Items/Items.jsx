import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../../AbstractElements';
import HeaderCard from '../../../Common/Component/HeaderCard';
import CommonModal from '../../../UiKits/Modals/common/modal'
import DataTableComponent from './ItemsTable';
import { Tooltip } from 'react-tooltip';

const Items = () => {

    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                {/* {
                    [
                        "active", "inactive"
                    ].map((item, index) => (
                        <Tooltip key={item}
                            anchorId={item}
                            content={item.charAt(0).toUpperCase() + item.slice(1)}
                            place="right"
                            style={
                                {
                                    zIndex: '3',
                                    backgroundColor: 'red',
                                    opacity: '1',
                                    color: 'black',
                                    fontWeight: "600",
                                    fontSize: "1.25rem",
                                    textTransform: "capitalize"
                                }} />
                    ))
                } */}
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

export default Items;