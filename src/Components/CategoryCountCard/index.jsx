import React from 'react'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import { H3, H5, H6, P } from '../../AbstractElements';
import './style.scss';

function CategoryCountCard({ data }) {
    console.log(data,"hudusf")

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    return (
        <>
            {
                data.length !== 0 &&
                <Row className='product_header_container'>
                    <Col sm={12} xl={3} md={3} className='card_width'>
                        <Card>
                            <CardBody
                                style={{ padding: '20px' }}
                            >
                                <H6 attrH6={{ className: 'fw-bolder' }}>{<i className="icofont icofont-truck me-2"></i>} Total Products</H6>
                                <H3 attrH3={{ className: 'mb-0 mt-3 fw-bolder' }}>
                                    {data?.total[0] && data?.total[0]?.count ? data?.total[0]?.count : 0}
                                </H3>
                            </CardBody>
                        </Card>
                    </Col>
                    {data?.categories?.sort((a, b) =>
                        a?._id[0]?.collection_name.localeCompare(b?._id[0]?.collection_name))?.map((item, index) => {
                            return (
                                <>
                                    {
                                        item?._id.length > 0 && item?._id[0]?.status === 'active' &&
                                        <Col sm={12} xl={3} md={3} key={index} className='card_width'>
                                            <Card>
                                                <CardBody style={{ padding: '20px' }}>
                                                    <H6 attrH6={{ className: 'fw-bolder' }}>{<i className="icofont icofont-truck me-2"></i>} {item?._id[0] && capitalizeFirstLetter(item?._id[0]?.collection_name)}</H6>
                                                    {''}
                                                    <H3 attrH3={{ className: 'mb-0 mt-3 fw-bolder' }}>
                                                        {item?.count}
                                                    </H3>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    }

                                </>
                            )
                        }
                        )}
                </Row>
            }

        </>
    )
}

export default CategoryCountCard
