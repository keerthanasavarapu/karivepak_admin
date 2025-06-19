import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import ProductTable from './ProductsTable'

const Product = () => {

    return (
        <Container fluid={true} style={{ paddingTop: '30px' }}>
            <Row>
                <Col sm="12">
                    <Card>
                        <CardBody>
                            <ProductTable />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default Product;