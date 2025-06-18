import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DataTableComponent from './serviceTable';
import ProductsHeader from './serviceHeader';
import './style.scss'

const Products = () => {
    
    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                 <ProductsHeader/>       
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody style={{padding: '15px'}}>
                                <DataTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

};

export default Products;