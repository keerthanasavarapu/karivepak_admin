import React from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { baseURL } from '../../../Services/api/baseURL';

const Settings = () => {
    const formik = useFormik({
        initialValues: {
            partner_accept_time: null,
            minimum_discount: null,
        },
        validationSchema: Yup.object({
            partner_accept_time: Yup.number()
                .min(0, 'Value must be at least 0')
                .max(100, 'Value must be at most 100')
                .required('Required'),
            minimum_discount: Yup.number()
                .min(0, 'Value must be at least 0')
                .max(100, 'Value must be at most 100')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            const token = await JSON.parse(localStorage.getItem("token"));
            await axios.post(`${baseURL}/api/content-management/add`,
                values,
                {
                    headers: {
                        Authorization: `${token}`,
                        "Content-Type": "multipart/form-data",
                    }
                });
        },
    });

    return (
        <>
            <Breadcrumbs mainTitle={'Setting'} parent="Setting" subParent="Setting" />
            <Container fluid={true}>
                <Row>
                    <Col lg={12} md={12} sm={12}>
                        <Card>
                            <CardBody>
                                <Form onSubmit={formik.handleSubmit}>
                                    <FormGroup>
                                        <Label for="partner_accept_time">
                                            Partner Accept Time (minutes)
                                        </Label>
                                        <Input
                                            type="number"
                                            id="partner_accept_time"
                                            name="partner_accept_time"
                                            min={0}
                                            max={100}
                                            value={formik.values.partner_accept_time}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter time"
                                            invalid={formik.touched.partner_accept_time && formik.errors.partner_accept_time ? true : false}
                                        />
                                        {formik.touched.partner_accept_time && formik.errors.partner_accept_time ? (
                                            <div className="invalid-feedback">{formik.errors.partner_accept_time}</div>
                                        ) : null}
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="minimum_discount">
                                            Minimum Order Amount
                                        </Label>
                                        <Input
                                            type="number"
                                            id="minimum_discount"
                                            name="minimum_discount"
                                            min={0}
                                            max={100}
                                            value={formik.values.minimum_discount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter Amount"
                                            invalid={formik.touched.minimum_discount && formik.errors.minimum_discount ? true : false}
                                        />
                                        {formik.touched.minimum_discount && formik.errors.minimum_discount ? (
                                            <div className="invalid-feedback">{formik.errors.minimum_discount}</div>
                                        ) : null}
                                    </FormGroup>
                                    <Button type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Settings;
