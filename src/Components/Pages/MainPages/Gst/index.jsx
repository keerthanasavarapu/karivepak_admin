import { Card, CardBody, Col, Container, Row } from 'reactstrap'
import DataTableComponent from './GstTable'

const Gst = () => {
    return (
        <Container fluid={true} style={{ paddingTop: '30px' }}>
            <Row>
                <Col sm='12'>
                    <Card>
                        <CardBody>
                            <DataTableComponent />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
};

export default Gst;