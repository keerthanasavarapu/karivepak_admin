import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DataTableComponent from './CategoryTable'

const Category = () => {

    return (
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
    );

};

export default Category;