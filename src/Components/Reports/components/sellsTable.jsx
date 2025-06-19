import React, { Fragment, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Image, } from '../../../../../AbstractElements';
import { Col, Input, Row, Nav, NavItem, NavLink, Media } from 'reactstrap';
import axios from 'axios';
import 'react-dropdown/style.css';
import { baseURL, imageURL } from '../../../../../Services/api/baseURL';
import dummyImg from '../../../../../assets/images/product/2.png';
import Loader from '../../../../Loader/Loader';
import moment from 'moment';

const SellsTable = ({ tableData, setTableData, category, subCategory, filterDateTab, startDate, endDate, storeId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [BasicTab, setBasicTab] = useState(1);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [subCollectionValue, setSubCollectionValue] = useState("");

    const fetchItems = async () => {
        setIsLoading(true)
        const token = await JSON.parse(localStorage.getItem("token"))
        try {

            let params = {};

            if (storeId) {
                params.storeId = storeId;
            }

            switch (filterDateTab) {
                case 1: // Today
                    params.start_date = moment().startOf('day').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('day').format('YYYY-MM-DD');
                    break;
                case 2: // Weekly
                    params.start_date = moment().startOf('week').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('week').format('YYYY-MM-DD');
                    break;
                case 3: // Monthly
                    params.start_date = moment().startOf('month').format('YYYY-MM-DD');
                    params.end_date = moment().endOf('month').format('YYYY-MM-DD');
                    break;
                default:
                    break;
            }

            if (selectedCollectionId) {
                params = {
                    category_id: selectedCollectionId
                };
            }
            if (subCollectionValue) {
                params = {
                    subCategory_id: subCollectionValue
                };
            }

            if (startDate && endDate) {
                params.start_date = moment(startDate).format('YYYY-MM-DD');
                params.end_date = moment(endDate).format('YYYY-MM-DD');
            }


            const products = await axios.get(`${baseURL}/api/order/get-all-sells-variants`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            });

            let sortedData = products?.data?.data.sort((a, b) => b.totalItemsSold - a.totalItemsSold);

            setIsLoading(false)
            setTableData(sortedData);
            console.log("products?.data?.data", sortedData)

        } catch (error) {
            setIsLoading(false)
            console.log(error, 'error from items getting')
        }
    }

    useEffect(() => {
        fetchItems();
    }, [selectedCollectionId, subCollectionValue, filterDateTab, startDate, endDate, storeId])

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };

    const handleAll = () => {
        setBasicTab(1);
        setSubCollectionValue("");
        setSelectedCollectionId(null);
        fetchItems()
    }

    const handleTabs = async (data, index) => {
        setBasicTab(index + 2);
        setSelectedCollectionId(data?._id);
        setSubCollectionValue();
    }

    const handleSubCollectionChange = (e) => {
        let value = e.target.value;
        setSubCollectionValue(value);
    }

    const filteredProducts = tableData?.filter(item =>
        item?.productDetails?.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item?.productDetails?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item?.productDetails?.brand?.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item?.productDetails?.subCategory?.sub_collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        item?.productDetails?.tags?.some(tag => tag?.value?.toLowerCase().includes(searchTerm?.toLowerCase()))
    );

    const orderColumns = [
        {
            name: 'RANKS',
            selector: row => row?._id,
            cell: (row, index) => (
                `#${index + 1} `
            ),
            center: true,
        },
        {
            name: 'PRODUCTS',
            selector: row =>row?.order_Variants?.variantName,
            width: "250px",
            cell: (row) => (
                <Media className='d-flex'>
                    <Image attrImage={{ className: 'img-30 me-3', src: `${row?.order_Variants?.variantImage ? imageURL + row?.order_Variants?.variantImage : dummyImg}`, alt: 'Generic placeholder image' }} />
                    <Media body className="align-self-center">
                        <div className='ellipses_text_1'>{row?.order_Variants?.variantName}</div>
                    </Media>
                </Media>
            ),
            center: true,
        },
        {
            name: 'BRAND NAME',
            selector: row => row?.productDetails?.brand?.brandName.toUpperCase(),
            center: true,
            cell: (row) => row?.productDetails?.brand?.brandName.toUpperCase(),
        },
        {
            name: 'CATEGORY',
            selector: row => row?.productDetails?.category.collection_name,
            center: true,
            cell: (row) => capitalizeFirstLetter(row?.productDetails?.category.collection_name)
        },
        {
            name: 'SUBCATEGORY',
            selector: row => row?.productDetails?.subCategory.sub_collection_name,
            center: true,
            cell: (row) => capitalizeFirstLetter(row?.productDetails?.subCategory.sub_collection_name)
        },
        {
            name: 'NO. OF SOLD',
            selector: row => row?.totalItemsSold,
            center: true,
            cell: (row) => row?.totalItemsSold,
        },
        {
            name: 'STOCK',
            selector: row => row?.stockDetails?.totalStock,
            center: true,
            cell: (row) => row?.stockDetails?.totalStock
        },
        {
            name: 'TOTAL REVENUE',
            selector: row => row?.totalRevenue,
            center: true,
            cell: (row) => '$' + (row?.totalRevenue ? row?.totalRevenue : 0),
        },
        {
            name: 'STATUS',
            selector: row => row.status,
            sortable: true,
            center: true,
            cell: (row) => (
                <span style={{ fontSize: '13px' }} className={`badge ${row.status === 'inactive' ? 'badge-light-danger' : 'badge-light-success'}`}>
                    {capitalizeFirstLetter(row.status)}
                </span>
            ),
        },
    ];

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Fragment>
            <Row xxl={12} className='pb-2'>
                <Row>
                    <Col md={12} lg={12} xl={12} xxl={12}>
                        <div>
                            <Nav tabs className='product_variant_tabs mb-3'>
                                <NavItem>
                                    <NavLink className={BasicTab === 1 ? 'active' : ''} onClick={() => handleAll()}>
                                        All Products
                                    </NavLink>
                                </NavItem>
                                {
                                    category.length > 0 && (
                                        category.sort((a, b) =>
                                            a.collection_name.localeCompare(b.collection_name)).slice(0, 20).map((data, index) => {
                                                return (
                                                    <>
                                                        <NavItem key={data?._id}>
                                                            <NavLink className={BasicTab === (index + 2) ? 'active' : ''} onClick={() => handleTabs(data, index)}>
                                                                {data.collection_name}
                                                            </NavLink>
                                                        </NavItem>
                                                    </>
                                                )
                                            })
                                    )
                                }
                            </Nav>
                        </div>
                    </Col>
                    <Col md={12} lg={12} xl={12} xxl={12}>
                        <div className="flex file-content file-content1 justify-content-between">
                            <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                <i className='fa fa-search' style={{ top: 'unset' }}></i>
                                <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                            </div>
                            <div className='d-flex'>
                                <Input type='select' className='ms-3' name='subCategory' value={subCollectionValue} onChange={(e) => handleSubCollectionChange(e)} >
                                    <option value=''>Select Sub Category</option>
                                    {
                                        selectedCollectionId ? (
                                            subCategory.length > 0 && subCategory.filter((item) => item?.collection_id?._id === selectedCollectionId).map((data) => {
                                                return (
                                                    <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                                                );
                                            })
                                        ) : (
                                            subCategory.map((data) => {
                                                return (
                                                    <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                                                );
                                            })
                                        )
                                    }
                                </Input>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>

            {/* {
                filteredProducts?.length !== 0 && ( */}
            <DataTable
                data={filteredProducts || []}
                columns={orderColumns}
                pagination
                progressPending={isLoading}
                progressComponent={<Loader />}
            />
            {/* )
            } */}

        </Fragment >
    )
}
export default SellsTable;