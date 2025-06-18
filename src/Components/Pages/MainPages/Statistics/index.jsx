import { Fragment } from "react"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

import StatsTable from "./Statistics";






const Statistics = () => {
    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: "30px" }}>
                <Row>
                    <Col sm='12'>
                        <Card>
                            <CardBody style={{ padding: '15px' }}>
                                <StatsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
};

export default Statistics;