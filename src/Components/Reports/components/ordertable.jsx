import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { H5 } from '../../../../../AbstractElements';
import { Button, Col, Container, Form, FormGroup, Input, Label, Pagination, PaginationItem, Row } from 'reactstrap';
import { DropdownItem, DropdownMenu, DropdownToggle, Media, UncontrolledDropdown } from 'reactstrap';
import {  MoreVertical } from 'react-feather';
import {  FaDownload, FaRegEye, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { debounce } from 'lodash';
import Loader from '../../../../Loader/Loader';

const OrdersTable = ({orderData}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchText, setSearchText] = useState('');

    const debouncedSearch = React.useRef(
        debounce(async (searchTerm) => {
            setSearchText(searchTerm);
        }, 300)
    ).current;

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
    };

    const handleNavigate = (id) => {
        navigate(`/orders/${id}`);
    }

    function capitalizeFirstLetter(string) {
        return string?.charAt(0)?.toUpperCase() + string.slice(1);
    }

    const filteredData = orderData?.filter(order => {
        const address = order?.address;
        const addressMatches = (
            address?.addressFullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.addressPhoneNumber?.includes(searchTerm) ||
            address?.addressPincode?.includes(searchTerm) ||
            address?.city?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.country?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.houseNo?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.locality?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.roadName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
            address?.state?.toLowerCase().includes(searchTerm?.toLowerCase())
        );

        const variantMatches = order?.products?.some(product => {
            return (
                product?.variant?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                product?.variant?.variantCode?.toLowerCase().includes(searchTerm?.toLowerCase())
            );
        });

        const productMatches = order.products?.some(product => {
            if (product?.product) {
                return (
                    product.product.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    product.product.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    product.product.brand.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    product.product.category.collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    product.product.subCategory.collection_id?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
                    product.product?.tags?.some(tag => tag?.tag?.toLowerCase().includes(searchTerm?.toLowerCase()))
                );
            } else {
                return false;
            }
        });

        return addressMatches || variantMatches || productMatches;
    });


    const orderColumns = [
        {
            name: '#ORDER_ID',
            selector: row => row['sequence_number'],
            sortable: true,
            center: true,
            cell: (row) => (
               
                <div className='ellipses_text_1'>{row?.sequence_number}</div>
            )
        },
        {
            name: 'CUSTOMER NAME',
            selector: row => `${row.customer}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <div className=''>
                    {(row?.users?.first_name !== undefined ? row?.users?.first_name : 'N/A') + ' ' + (row?.users?.last_name !== undefined ? row?.users?.last_name : 'N/A')}
                    {/* {
                        row?.users?.phoneNumber && <p>{row?.users?.phoneNumber}</p>
                    } */}
                </div>
            )
        },
        {
            name: 'ORDER DATE',
            selector: row => `${row.createdAt}`,
            sortable: true,
            center: true,
            cell: (row) => (
                moment(row.createdAt).format('DD MMM, YYYY')
            )
        },
        {
            name: 'TOTAL',
            selector: row => `${row?.order_value}`,
            cell: (row) => (
                row?.order_value ? ('$' + row?.order_value.toFixed(2)) : "N/A"
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'NO. OF ITEMS',
            selector: row => `${row?.products}`,
            cell: (row) => (
                row?.products && row?.products.length
            ),
            sortable: true,
            center: true,
        },
        // {
        //     name: 'PAYMENT DETAILS',
        //     selector: row => `${row.payment_method}`,
        //     cell: (row) => (
        //         row.payment_method
        //     ),
        //     sortable: true,
        //     center: true,
        // },
        {
            name: 'DELIVERY ADDRESS',
            selector: row => `${row.address}`,
            cell: (row) => (
                <div className='ellipses_text_1'>
                    <p className='ellipses-line-1'>{row.address?.addressFullName}
                        {row.address?.houseNo}, {row.address?.roadName}, {row.address?.locality}
                        {row.address?.city}, {row.address?.country}, {row.address?.addressPincode}
                        {row.address?.addressPhoneNumber}</p>
                </div>
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'STORE',
            selector: row => `${row.discard_from}`,
            cell: (row) => (
                row?.store?.storeName
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'ORDER STATUS',
            selector: row => `${row.order_status}`,
            cell: (row) => {
                const customColors = {
                    accepted: 'primary',
                    processing: 'warning',
                    'on-the-way': 'info',
                    delivered: 'success',
                    rejected: 'danger',
                    cancelled: 'dark',
                    returned: 'secondary'
                };

                const statusKey = row?.order_status?.toLowerCase();
                const color = customColors[statusKey] || 'primary';
                return (
                    <span style={{ fontSize: '13px' }} className={`badge badge-light-${color}`}>
                        {capitalizeFirstLetter(row?.order_status)}
                    </span>
                );
            },
            sortable: true,
            center: true,
        }
        ,
    ];

    return (
        <Fragment>
            <Row xxl={12}>
                <Row>
                    <Col md={12} lg={12} xl={12} xxl={12}>
                        <div className="file-content align-items-center justify-content-between mb-3">
                            <H5 attrH5={{ className: 'mb-0 font-semibold' }}>Orders</H5>
                            <div className='d-flex'>
                                <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                    <i className='fa fa-search'></i>
                                    <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                                </div>
                                {/* <Input type='select' className='ms-3 sortBy' name='subCategory' >
                                    <option>Sort By</option>
                                </Input> */}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>

            <DataTable
                data={filteredData}
                columns={orderColumns}
                pagination
                progressPending={isLoading}
                progressComponent={<Loader />}
            />


        </Fragment>
    )
}
export default OrdersTable