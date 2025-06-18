import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H1, H4, H6, Image, P, Spinner, ToolTip } from '../../../../AbstractElements';
import { products, spinnerData } from './data';
import { Col, FormGroup, Input, Label, Row, Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Media, Button, DropdownToggle, UncontrolledAccordion, DropdownMenu, DropdownItem, UncontrolledDropdown, CardTitle, CardText } from 'reactstrap';
import { Download, MoreVertical, PlusCircle, PlusSquare, Trash, Upload } from 'react-feather';
// import * as XLSX from 'xlsx';
import axios from 'axios';
import 'react-dropdown/style.css';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { baseURL, imageURL, productBaseURL } from '../../../../Services/api/baseURL';
import endPoints from '../../../../Services/EndPoints';
import dummyImg from '../../../../assets/images/product/2.png';
import Loader from '../../../Loader/Loader';
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useDataContext } from '../../../../context/hooks/useDataContext';

const ItemsTable = () => {
    const navigate = useNavigate();
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const { productsData, setProductsData } = useDataContext();
    const [selectedRows, setSelectedRows] = useState([]);
    const [editData, seteditdata] = useState([]);
    const [subCollectionData, setSubCollectionData] = useState([])
    const [collectionData, setCollectionData] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [BasicTab, setBasicTab] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [subCollectionValue, setSubCollectionValue] = useState("");
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    // const fetchCategoryList = async () => {
    //     const token = await JSON.parse(localStorage.getItem("token"))
    //     try {
    //         const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
    //             headers: {
    //                 Authorization: `${token}`,
    //             }
    //         });
    //         let data = collectData?.data?.data.filter((item) => item.status === "active")
    //         setCollectionData(data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const fetchSubcollectionsList = async () => {
    //     const token = await JSON.parse(localStorage.getItem("token"))
    //     let limit = 1000;
    //     try {
    //         const response = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=1&limit=${limit}`, {
    //             headers: {
    //                 Authorization: `${token}`
    //             }
    //         })
    //         let data = response?.data?.data.filter((item) => item.status === "active");
    //         setSubCollectionData(data);

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const fetchItems = async () => {
    //     setIsLoading(true)
    //     const token = await JSON.parse(localStorage.getItem("token"))
    //     try {
    //         let params = {};
    //         if (selectedCollectionId) {
    //             params = {
    //                 category_id: selectedCollectionId
    //             };
    //         }
    //         if (subCollectionValue) {
    //             params = {
    //                 subCategory_id: subCollectionValue
    //             };
    //         }

    //         const userData = await JSON.parse(localStorage.getItem('UserData'))
    //         const userRole = JSON.parse(localStorage.getItem('role_name'));
           
    //         if(userRole==='store'){
    //             params = {
    //                 role: userRole,
    //                 storeId: userData?._id
    //             }; 
    //         }

    //         const products = await axios.get(`${productBaseURL}/products/get-products`, {
    //             params: params,
    //             headers: {
    //                 Authorization: `${token}`,
    //             }
    //         })

    //         const productsData = products?.data?.data

    //         // if (productsData.length > 0) {
    //         setIsLoading(false)
    //         setProductsData(productsData.reverse());
    //         // }

    //     } catch (error) {
    //         setIsLoading(false)
    //         console.log(error, 'error from items getting')
    //     }
    // }

    // const inactiveItem = async (id) => {
    //     const token = await JSON.parse(localStorage.getItem("token"))
    //     try {
    //         const status = editData.status === "inactive" ? "active" : 'inactive'

    //         let formData = new FormData();
    //         formData.append('status', status);

    //         const itemsData = await axios.patch(`${baseURL}/products/update-product-status/${editData._id}`, formData, {
    //             headers: {
    //                 Authorization: `${token}`,
    //             }
    //         })

    //         fetchItems()
    //         setDeleteModal(!deleteModal)
    //     }
    //     catch (err) {
    //         console.log(err)
    //     }
    // }
    const fetchItems = async () => {
            setIsLoading(true)
            const token = await JSON.parse(localStorage.getItem("token"))
            try {
                // let params = {};
                // if (selectedCollectionId) {
                //     params = {
                //         category_id: selectedCollectionId
                //     };
                // }
                // if (subCollectionValue) {
                //     params = {
                //         subCategory_id: subCollectionValue
                //     };
                // }
    
                // const userData = await JSON.parse(localStorage.getItem('UserData'))
                // const userRole = JSON.parse(localStorage.getItem('role_name'));
               
                // if(userRole==='store'){
                //     params = {
                //         role: userRole,
                //         storeId: userData?._id
                //     }; 
                // }
    
                const products = await axios.get(`${baseURL}/api/products`
                    // , {
                    // params: params,
                    // headers: {
                    //     Authorization: `${token}`,
                    // }}
                )
                // console.log(products, "products");

                // Check if products and products.data exist
                const productsData = products?.data || []; // Default to an empty array if undefined
                // console.log(productsData, "osvnisjd");
                
                // If you're accessing the length of productsData
                if (productsData.length > 0) {
                //   console.log("There are products:", productsData);
                } else {
                //   console.log("No products available");
                }
                
                // if (productsData.length > 0) {
                setIsLoading(false)
                setProductsData(productsData.reverse());
                // }
    
            } catch (error) {
                setIsLoading(false)
                // console.log(error, 'error from items getting')
            }
        }
    // useEffect(() => {
    //     fetchCategoryList();
    //     fetchSubcollectionsList();
    // }, []);

    useEffect(() => {
        fetchItems();
    }, [selectedCollectionId, subCollectionValue])

    const handleNavigate = () => {
        navigate('/product/create')
    }

    const handleNavigateEdit = (id) => {
        navigate(`/product/edit/${id}`);
    }

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
        // getFilteredData(data?._id, "");
    }

    const handleSubCollectionChange = (e) => {
        let value = e.target.value;
        setSubCollectionValue(value);
        // getFilteredData("", value);
    }

    // const getFilteredData = async () => {
    //     setIsLoading(true);
    //     try {
    //         const token = await JSON.parse(localStorage.getItem("token"));
    //         let params = {};
    //         if (subCollectionValue) {
    //             params = {
    //                 subCategory_id: subCollectionValue
    //             };
    //         }
    //         if (selectedCollectionId) {
    //             params = {
    //                 category_id: selectedCollectionId
    //             };
    //         }

    //         const response = await axios.get(`${productBaseURL}/products/get-products`, {
    //             params: params,
    //             headers: {
    //                 Authorization: `${token}`,
    //             }
    //         });

    //         if (response?.status === 200 && response) {
    //             setProductsData(response?.data?.data.reverse());
    //             console.log(response?.data?.data.reverse())
    //             setIsLoading(false);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         setIsLoading(false);
    //     }
    // }
    // console.log(productsData, "products")
    // const filteredProducts = productsData.filter(item =>
    //     item?.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //     item?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //     item?.brand?.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //     item?.subCategory?.sub_collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    //     item?.tags.some(tag => tag.value.toLowerCase().includes(searchTerm?.toLowerCase()))
    // );

    const deleteVariant = async (id) => {
        if (window.confirm(`Are you sure you want to delete this Product ?`)) {
            try {
                const token = await JSON.parse(localStorage.getItem("token"))
                await axios.delete(`${productBaseURL}/products/delete/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    }
                }).then((res) => {
                    Swal.fire({
                        icon: "success",
                        title: res?.data?.message,
                    })
                    fetchItems();
                })
            }
            catch (err) {
                console.error(err)
            }
        }
    }

    const orderColumns = [
        {
            name: 'Product',
            selector: row => `${row?._id}`,
            width: "250px",
            cell: (row) => (
                <>

                    <Media className='d-flex'><Image attrImage={{ className: 'img-30 me-3', src: `${row?.variants?.length > 0 ? imageURL + row?.variants[0].variantImage : dummyImg}`, alt: 'Generic placeholder image' }} />
                        <Media body className="align-self-center">
                            <div className='ellipses_text_1'>{row?.productName}</div>
                        </Media>
                    </Media>
                </>
            ),
            center: true,
        },
        {
            name: 'Category Name',
            selector: row => row?.category?.name.toUpperCase(),
            center: true,
            cell: (row) => (
                row?.category?.name.toUpperCase()
            )
        },
        // {
        //     name: 'Sub Category',
        //     selector: row => row?.subCategory?.sub_collection_name.toUpperCase(),
        //     center: true,
        //     // width: "100px",
        //     cell: (row) => (
        //         row?.subCategory?.sub_collection_name.toUpperCase()
        //     )
        // },
        {
            name: 'Tags',
            selector: row => row?.tag?.split(',').map(singleTag => singleTag.trim()).join(', '), // Split by comma, trim extra spaces, and join back as a string
            width: "270px",
            headerStyle: (selector, id) => {
                return { textAlign: "left" };
            },
            cell: (row) => {
                const { tag } = row;
                const MAX_DISPLAY_TAGS = 2;
                const tagsArray = tag?.split(',').map(singleTag => singleTag.trim()) || []; // Split the string into an array and trim spaces
        
                if (tagsArray.length > MAX_DISPLAY_TAGS) {
                    const pendingItemsCount = tagsArray.length - MAX_DISPLAY_TAGS;
                    return (
                        <>
                            {tagsArray.slice(0, MAX_DISPLAY_TAGS).map((singleTag, index) => (
                                <span key={index} style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                    {singleTag}
                                </span>
                            ))}
                            <span style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                + {pendingItemsCount}
                            </span>
                        </>
                    );
                } else {
                    return (
                        <>
                            {tagsArray.map((singleTag, index) => (
                                <span key={index} style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                    {singleTag}
                                </span>
                            ))}
                        </>
                    );
                }
            },
            center: false,
        },
        {
            name: 'Description',
            selector: row => `${row?.description.slice(0, 100)}`,
            width: "250px",
            cell: (row) => {
                const description = row?.description;
                const maxLength = 50;

                if (description && description.length > maxLength) {
                    return (
                        <>{description.slice(0, maxLength)}...</>
                    );
                } else {
                    return (
                        <>{description}</>
                    );
                }
            },
            center: true,
        },
        {
            name: 'Unit Quantity',
            selector: row => `${row.unitQuantity}`,  // Access the uniqueQuantity field from the row
            sortable: true,
            center: true,
            width: "90px",
            cell: (row) => (
                <span style={{ fontSize: '13px' }} className={`badge ${row.unitQuantity === 0 ? 'badge-light-danger' : 'badge-light-success'}`}>
                    {row.unitQuantity} {/* Display the uniqueQuantity */}
                </span>
            ),
        },
        

        {
            name: 'Actions',
            cell: (row) => (
                <div className='d-flex justify-content-end align-items-center' style={{ marginRight: '20px' }}>
                    <div
                        className='cursor-pointer'
                    >
                        <UncontrolledDropdown className='action_dropdown'>
                            <DropdownToggle className='action_btn'
                            >
                                <MoreVertical color='#000' size={16} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => handleNavigateEdit(row?._id)}>
                                    Edit
                                    <FaPen />
                                </DropdownItem>
                                <DropdownItem className='delete_item' onClick={() => deleteVariant(row?._id)}>
                                    Delete
                                    <FaTrashAlt />
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>

                    {/* <div
                        onClick={() => {
                            seteditdata(row)
                            setDeleteModal(!deleteModal)
                        }}
                        className='rounded-2' style={{ cursor: 'pointer', border: '1px solid #ff0000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Trash2 color='#ff0000' size={16} />
                    </div> */}
                </div>
            ),
            right: true,
            omit: userRole !== 'admin'
        }

    ]

    // function capitalizeFirstLetter(string) {
    //     return string.charAt(0).toUpperCase() + string.slice(1);
    // }

    const uploadCSV = async (selectedFile) => {
        setIsLoading(true);
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const formData = new FormData();
            formData.append("csv", selectedFile);
            const res = await axios.post(`${baseURL}/api/csv/import-from-csv
            `, formData, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (res) {
                fetchItems();
                setIsLoading(false);
            }
        } catch (error) {
            // console.log(error);
            setIsLoading(false);
        }
    }
// console.log(collectionData,'json');
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
                                // Ensure collectionData is defined and has data
                                Array.isArray(collectionData) && collectionData.length > 0 && (
                                    collectionData.sort((a, b) =>
                                        a.collection_name.localeCompare(b.collection_name)
                                    ).slice(0, 20).map((data, index) => {
                                        return (
                                            <NavItem key={data?._id}>
                                                <NavLink className={BasicTab === (index + 2) ? 'active' : ''} onClick={() => handleTabs(data, index)}>
                                                    {data.collection_name}
                                                </NavLink>
                                            </NavItem>
                                        )
                                    })
                                )
                            }
                        </Nav>
                    </div>
                </Col>
                <Col md={12} lg={12} xl={12} xxl={12}>
                    <div className="file-content file-content1 justify-content-between">
                        <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                            <i className='fa fa-search' style={{ top: 'unset' }}></i>
                            <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                        </div>
                        <div className='d-flex'>
                            <Input type='select' className='ms-3' name='subCategory' value={subCollectionValue} onChange={(e) => handleSubCollectionChange(e)} >
                                <option value=''>Select Sub Category</option>
                                {
                                    // Ensure subCollectionData is defined and has data
                                    Array.isArray(subCollectionData) && subCollectionData.length > 0 && selectedCollectionId ? (
                                        subCollectionData.filter((item) => item?.collection_id?._id === selectedCollectionId).map((data) => {
                                            return (
                                                <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                                            );
                                        })
                                    ) : (
                                        Array.isArray(subCollectionData) && subCollectionData.length > 0 && subCollectionData.map((data) => {
                                            return (
                                                <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                                            );
                                        })
                                    )
                                }
                            </Input>
                            {
                                userRole === 'admin' && <Button className='btn btn-primary d-flex align-items-center ms-3' onClick={handleNavigate}>
                                    <PlusCircle />
                                    Add Product
                                </Button>
                            }
                            {
                                userRole === 'admin' &&
                                <Label htmlFor='csv' className='btn mb-0 btn-primary d-flex align-items-center ms-3 btn btn-secondary'>
                                    <Input
                                        id='csv'
                                        type='file'
                                        accept=".zip"
                                        className='d-none'
                                        onChange={(e) => uploadCSV(e.target.files[0])}
                                    />
                                    <Upload />
                                    Import via ZIP
                                </Label>
                            }
    
                        </div>
                    </div>
                </Col>
            </Row>
        </Row>
    
        <DataTable
            data={productsData || []}
            columns={orderColumns}
            pagination
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleDelet}
            progressPending={isLoading}
            progressComponent={<Loader />}
        />
    </Fragment>
    
    )
}
export default ItemsTable