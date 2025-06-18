import { Fragment, lazy, Suspense } from 'react'
import Loader from '../../../Loader/Loader'
import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'

import DataTableComponent from './Customers'

// const LazyComponent = lazy(() => import('./Customers'))

const Customers = () => {
    return (
        <Fragment>
            <Container fluid={true} style={{paddingTop:'30px'}}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody style={{padding:'15px'}}>
                                {/* <LazyComponent /> */}
                                <DataTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
        // <Suspense fallback={<Loader />}>
        //     <LazyComponent />
        // </Suspense>
    )
};

export default Customers;