import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H4, Spinner, ToolTip } from '../../../../AbstractElements';
import { tableColumns, orderColumns, products, spinnerData } from './data';
import { Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import HeaderCard from '../../../Common/Component/HeaderCard';
import { Download, PlusSquare } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal'
import * as XLSX from 'xlsx';

import { Edit2, Eye, EyeOff, Trash2 } from 'react-feather';
import axios from 'axios';

import Select, { components } from "react-select";
// import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip'
import { baseURL } from '../../../../Services/api/baseURL';


const ItemsTable = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [data, setData] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsData, setitemsData] = useState([]);
    const [AddModal, SetAddmodal] = useState(false);
    const [editData, seteditdata] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedOption, setSelectedOption] = useState('active');
    const [itemName, setItemName] = useState()
    const [price, setPrice] = useState()

    const [collectionData, setCollectionData] = useState([])
    const [subCollectionData, setSubCollectionData] = useState([])
    const [selectedCollection, setSelectedCollection] = useState()
    const [selectedSubCollection, setSelectedSubCollection] = useState()
    const [collectionName, setcollectionName] = useState()
    const [tooltip, setTooltip] = useState(false);
    const toggle = () => setTooltip(!tooltip);
    const controlStyles = {
        border: '1px solid black',
        padding: '5px',
        background: '#ff0000',
        color: 'white',
    };

    console.log(
        editData,
        collectionData,
        'editdata'
    );
    const [discount, setDiscount] = useState()
    const AddMOdalToggle = () => {
        SetAddmodal(!AddModal)
        seteditdata(null)
        setItemName()
        setPrice()
        setDiscount()
        setSelectedCollection()
        setSelectedSubCollection()
    }
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
            setToggleDelet(!toggleDelet);

            setData(data.filter((item) => selectedRows.filter((elem) => elem.id === item.id).length > 0 ? false : true));
            setSelectedRows('');
        }
    };


    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };
    const fetchItems = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const subcollectData = await axios.get(`${baseURL}/
api/admin/get-sub-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            setSubCollectionData(subcollectData.data.data)

            const collectData = await axios.get(`${baseURL}/
api/admin/get-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            setCollectionData(collectData.data.data)

            const itemsData = await axios.get(`${baseURL}/
api/admin/get-all-items`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            setitemsData(itemsData.data.data)
        } catch (error) {
            console.log(error, 'error from items getting')
        }
    }
    const postItems = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        console.log(token);
        try {
            const obj = {
                item_name: itemName,
                collection: selectedCollection,
                price: price,
                sub_collection: selectedSubCollection
            }

            const itemsData = await axios.post(`${baseURL}/
api/admin/add-item`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            fetchItems()
            SetAddmodal(!AddModal)
            Swal.fire({
                title: "Item Added!",
                icon: "success",
                confirmButtonColor: "#d3178a",

            });
        } catch (error) {
            console.log(error, 'error from items getting')
        }
    }
    const editItems = async (id) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        console.log(token);
        try {
            const obj = {
                item_name: itemName,
                collection: selectedCollection,
                price: price,
                sub_collection: selectedSubCollection
            }

            const itemsData = await axios.patch(`${baseURL}/
api/admin/update-item/${id}`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            fetchItems()
            SetAddmodal(!AddModal)
            Swal.fire({
                title: "Item Updated!",
                icon: "success",
                confirmButtonColor: "#d3178a",

            });
        } catch (error) {
            console.log(error, 'error from items getting')
        }
    }
    const inactiveItem = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        console.log(token);
        try {
            const obj = {
                status: editData.status === "inactive" ? "active" : 'inactive'
            }

            const itemsData = await axios.patch(`${baseURL}/
api/admin/update-item-status/${editData._id}`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            fetchItems()
            setDeleteModal(!deleteModal)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])
    const handleEdit = () => {
        if (editData !== null) {
            editItems(editData._id)
        } else {
            postItems()
        }
    }








    const orderColumns = [
        {
            name: 'Item Name',
            selector: row => row['item_name'],
            sortable: true,
            center: true,
            cell: (row) => (
                <>
                    {/* <Tooltip anchorSelect=".my-anchor-element" place="top" style={{ backgroundColor: "#efefef", color: row.status === "active" ? "#008800" : "#ff0000", border: '1px solid #000' }}>

                        <>
                            {row.status === "active" ? "Active" : " In-Active"}

                        </>
                    </Tooltip> */}

                    <div className="font-medium flex items-center" id={`${row.status === 'active' ? "active " : "inactive"}`}

                    >
                        {row.status === 'active' ? (<div className='w-2 h-2 mr-3 bg-[#008800] rounded-full'></div>) : (<div className='w-2 mr-3 h-2 bg-[#ff0000] rounded-full'></div>)}
                        {row.item_name}
                    </div>

                </>
            )
        },
        {
            name: 'Collection',
            selector: row => row.collection.collection_name,
            sortable: true,
            center: true,
            cell: (row) => (
                <p style={{ fontWeight: '500' }}>
                    {row?.collection?.collection_name}
                </p>
            )
        },
        {
            name: 'Sub-Collection',
            selector: row => `${row.sub_collection.sub_collection_name}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <div>
                    <p style={{ fontWeight: '500' }}>{row?.sub_collection?.sub_collection_name}</p>

                </div>
            )
        },
        {
            name: 'Price',
            selector: row => `${row.price}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <div className='d-flex justify-content-end align-items-center'>
                    <p style={{ fontWeight: '500' }}>{row.price}</p>

                </div>
            )
        },
        {
            name: 'Discount',
            selector: row => `${row.discount}`,
            cell: (row) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ fontWeight: '500' }}>{row.discount}</p>
                </div>
            ),
            sortable: true,
            center: true,
        },
        // {
        //     name: 'Added By',
        //     selector: row => `${row.addedby}`,
        //     sortable: true,
        //     center: true,
        //     cell: (row) => (
        //         <div className='d-flex justify-content-center align-items-center'>
        //             <p className='text-center font-medium'>{row.addedby}</p>
        //         </div>
        //     ),

        // },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='d-flex justify-content-center align-items-center' style={{ marginLeft: '20px' }}>
                    <span className='rounded-2' style={{ cursor: 'pointer', marginRight: '10px', border: '1px solid #cc5500', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Eye color='#cc5500' size={16} />
                    </span>
                    <div
                        onClick={() => {
                            seteditdata(row)
                            setItemName(row.item_name)
                            setSelectedCollection(row.collection._id)
                            setcollectionName(row.collection.collection_name)
                            setSelectedSubCollection(row.sub_collection._id)
                            setPrice(row.price)
                            SetAddmodal(!AddModal)

                        }}
                        className='rounded-2' style={{ cursor: 'pointer', marginRight: '10px', border: '1px solid #008000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Edit2 color='#008000' size={16} />
                    </div>
                    <div
                        onClick={() => {
                            seteditdata(row)
                            setDeleteModal(!deleteModal)
                        }}
                        className='rounded-2' style={{ cursor: 'pointer', border: '1px solid #ff0000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Trash2 color='#ff0000' size={16} />
                    </div>
                </div>
            ),
            sortable: false,
            center: true,
        }
    ]

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {

            },
        },
        headCells: {
            style: {
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'center',



            },
        },
        cells: {
            style: {
                textAlign: 'start'
            }
        }

    };

    const Control = ({ children, ...props }) => (
        <components.Control {...props}>
            Click to Select → {props.name}
        </components.Control>
    );

    return (
        <Fragment>
            <Row xxl={12} className='pb-4'>
                <Col xxl={8}>
                    <H4>Items List</H4>

                </Col>
                <Col xxl={4}>
                    <Row xxl={12} >
                        <Col xxl={6}>
                            <Form className='search-file form-inline'>
                                <div className='mb-0 form-group border border-1 rounded-2' style={{ backgroundColor: '#f8f9fc', width: '185px', height: '35px' }}>
                                    <i className='fa fa-search ' style={{ marginInline: '5px', marginTop: '12px' }}></i>
                                    <input className='form-control border-none outline-none focus:outline-none' type='text' style={{ paddingLeft: '2px', paddingTop: '10px', width: '140px', border: 'none', backgroundColor: 'transparent', outline: 'none' }} value={searchTerm} onChange={(e) => handleSearch(e)} placeholder='Search...' />
                                </div>
                            </Form>
                        </Col>

                        <Col xxl={6}>
                            <div className='d-flex justify-content-center align-items-center rounded-2 bg-primary px-1 cursor-pointer' style={{ width: '145px', height: '35px' }} onClick={AddMOdalToggle}>
                                <PlusSquare size={20} />
                                <p style={{ fontSize: '14px', marginLeft: '5px' }}>Add Items</p>
                            </div>
                        </Col>


                    </Row>


                </Col>
            </Row>

            {(selectedRows.length !== 0) &&
                <div className={`d-flex align-items-center justify-content-between bg-light-info p-2`}>
                    <H4 attrH4={{ className: 'text-muted m-0' }}>Delete Selected Product..!</H4>
                    <Btn attrBtn={{ color: 'danger', onClick: () => handleDelete() }}>Delete</Btn>
                </div>
            }
            {
                itemsData?.length !== 0 ? (
                    <DataTable
                        data={itemsData || []}
                        columns={orderColumns}
                        // striped={true}
                        center={true}
                        pagination
                        // expandableRows
                        // expandableRowsComponent={ExpandedComponent}
                        customStyles={customStyles}
                        // selectableRows
                        onSelectedRowsChange={handleRowSelected}
                        clearSelectedRows={toggleDelet}
                    />
                ) : (
                    <>
                        {
                            spinnerData.map((spinner) =>
                                <Col xxl="12" key={spinner.id} className='flex justify-center items-center'>
                                    <div className="loader-box">
                                        <Spinner attrSpinner={{ className: spinner.spinnerClass }} />
                                    </div>
                                </Col>
                            )
                        }
                    </>
                )
            }



            <CommonModal isOpen={AddModal} title={editData !== null ? "Update Item" : "Add New Item"} toggler={AddMOdalToggle} size="lg">
                <Container>
                    <Form>
                        <>

                            <Row xxl={12}>
                                <Col xxl={12}>
                                    <Label className='font-medium text-base'>Item Name</Label>
                                    <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder='Enter Item Name' />
                                </Col>
                            </Row>


                            <Row xxl={12} className='mt-2'>
                                <Col xxl={6} className='flex flex-col'>
                                    <Label className='font-medium text-base'>Collection</Label>
                                    <select
                                        className='border-[#e1e3ef] text-lg font-medium rounded-md focus:ring-0 focus:outline-none foucs:border-none'

                                        onChange={
                                            (e) => {

                                                setSelectedCollection(e.target.value);
                                            }}
                                        value={selectedCollection}
                                    >
                                        <option value="">Select Collection</option>
                                        {collectionData.map(item => (
                                            <option key={item._id} value={item._id} className='text-sm font-medium'>
                                                {item.collection_name}
                                            </option>
                                        ))}
                                    </select>

                                </Col>
                                <Col xxl={6} className='flex flex-col'>
                                    <Label className='font-medium text-base'>Sub Collection</Label>
                                    <select className='border-[#e1e3ef] text-lg font-medium rounded-md focus:ring-0 focus:outline-none' onChange={(e) => {

                                        setSelectedSubCollection(e.target.value)

                                    }}
                                        value={selectedSubCollection}
                                    >
                                        <option value="">Select Sub-Collection</option>

                                        {
                                            subCollectionData.map(item => (
                                                <>
                                                    <option value={item._id} className='text-sm font-medium'>{item.sub_collection_name}</option>
                                                </>
                                            ))
                                        }
                                    </select>
                                </Col>
                            </Row>

                            <Row className='mt-2'>

                                <Col xxl={6}>
                                    <Label className='font-medium text-base'>Price</Label>
                                    <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder='Enter Price' />
                                </Col>
                                <Col xxl={6}>
                                    <Label className='font-medium text-base'>Discount</Label>
                                    <Input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder='Enter Discount' />
                                </Col>

                            </Row>

                            <Col xxl={12} className='mt-2'>
                                <Label className='font-medium text-base'>Item Images</Label>
                                <Input type='file' />
                            </Col>
                        </>
                        <Row>
                            <Col xxl={9}>

                            </Col>
                            <Col xxl={3}>
                                <div
                                    onClick={handleEdit}
                                    className='cursor-pointer mt-3 bg-[#ff0000] font-medium w-40 px-2 py-2 rounded-2xl text-white flex justify-center items-center'>
                                    {editData !== null ? "Update Item" : "Save Item"
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>
            <CommonModal isOpen={deleteModal} title="" toggler={() => { setDeleteModal(!deleteModal) }} size="md">
                <Container className='flex flex-col justify-center items-center'>
                    <p>Do You Want To Change Status Of This Item? </p>
                    <div className='flex flex-row space-x-8'>
                        <div onClick={() => setDeleteModal(!deleteModal)} className='border-1 border-[#ff0000] px-2 py-2 text-[#ff0000] rounded-xl cursor-pointer'>Cancel</div>
                        <div onClick={inactiveItem} className='bg-[#ff0000] px-4 py-2 text-white rounded-xl cursor-pointer'>Yes</div>
                    </div>

                </Container>
            </CommonModal>
        </Fragment >
    )
}
export default ItemsTable