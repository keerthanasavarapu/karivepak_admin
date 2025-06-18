import React from 'react';
import { Fragment } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { P } from '../../AbstractElements';

const Footer = () => {
  return (
    <Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md="12" className="footer-copyright text-center">
              <P attrPara={{ className: "mb-0 flex justify-center items-center space-x-8" }}>
                <img src="https://www.codefacts.com/assets/images/Code%20Facts%20Logo%202.png" alt="" width={50} height={50} style={{ marginRight: '10px' }} />
                Developed By Codefacts It Solutions</P>
            </Col>
          </Row>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;