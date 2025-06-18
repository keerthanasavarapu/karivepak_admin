import React, { Fragment } from 'react'
import { Card, Col, Container, Row } from 'reactstrap';
import ContentManagementTable from './contentManagementTable';
import './style.scss';

const ContentManagement = () => {

    return (
        <>
            <Fragment>
                <Container fluid={true} style={{ paddingTop: '30px' }}>
                    <Row>
                        <Col sm="12">
                            <Card>
                                <ContentManagementTable />
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        </>
    )
}

export default ContentManagement
