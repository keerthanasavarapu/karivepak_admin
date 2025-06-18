import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import './style.scss';
import DataTableComponent from './VariantsTable';
import CategoryCountCard from '../../../CategoryCountCard';
import axios from 'axios';
import { productBaseURL,variantsBaseURL } from '../../../../Services/api/baseURL';
import { H3, H6 } from '../../../../AbstractElements';

const Variants = () => {

    const [countData, setCountData] = useState([]);

    const getCountData = async () => {
        const userData = await JSON.parse(localStorage.getItem('UserData'))
        const userRole = JSON.parse(localStorage.getItem('role_name'));
        let params = {};
        if(userRole==='store'){
            params = {
                role: userRole,
                storeId: userData?._id
            }; 
        }
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            await axios.get(`${variantsBaseURL}/count/variant`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            }).then((response) => {
                if (response.status === 200) {
                    let updatedData = response?.data.data;
                    // let updatedData = response.data.data.sort((a, b) =>
                    //     a.category.localeCompare(b.category));
                    // let updatedData = response.data.data;
                    // updatedData.forEach(function (item, i) {
                    //     if (item.category === "Total Products") {
                    //         updatedData.splice(i, 1);
                    //         updatedData.unshift(item);
                    //     }
                    // })
                    setCountData(updatedData);
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCountData();
    }, []);

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }


    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                <CategoryCountCard data={countData} />
                {/* <Row className='product_header_container'>
                    {
                        countData &&
                        <Col sm={12} xl={3} md={3} className='card_width'>
                            <Card>
                                <CardBody style={{ padding: '20px' }}>
                                    <H6>{<i className="icofont icofont-truck me-2"></i>} Total Products</H6>
                                    <H3 attrH3={{ className: 'mb-0 mt-3' }}>
                                        {countData?.totalCount && countData?.totalCount?.count}
                                    </H3>
                                </CardBody>
                            </Card>
                        </Col>
                    }
                    {countData?.categoryCount?.sort((a, b) =>
                        a.category.localeCompare(b.category))?.map((item, index) => {
                            return (
                                <>
                                    <Col sm={12} xl={3} md={3} key={index} className='card_width'>
                                        <Card>
                                            <CardBody style={{ padding: '20px' }}>
                                                <H6>{<i className="icofont icofont-truck me-2"></i>} {item?.category && capitalizeFirstLetter(item?.category)}</H6>
                                                {''}
                                                <H3 attrH3={{ className: 'mb-0 mt-3' }}>
                                                    {item?.count}
                                                </H3>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </>
                            )
                        }
                        )}
                </Row> */}
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody style={{ padding: '15px' }}>
                                <DataTableComponent />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );

};

export default Variants;