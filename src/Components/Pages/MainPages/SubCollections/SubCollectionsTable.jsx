import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H4, Spinner } from '../../../../AbstractElements';
import { Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Media, Row, UncontrolledDropdown } from 'reactstrap';
import HeaderCard from '../../../Common/Component/HeaderCard';
import { Download, MoreVertical, PlusCircle, PlusSquare } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal'
import { Edit2, Eye, Trash2 } from 'react-feather';
import axios from 'axios';
import moment from 'moment';
import { spinnerData } from './data';

import Swal from 'sweetalert2'
import { baseURL } from '../../../../Services/api/baseURL';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import Loader from '../../../Loader/Loader';


const SubCollectionsTable = () => {
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [data, setData] = useState();
    const [alert, setalert] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [addExcel, setAddExcel] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selectedOption, setSelectedOption] = useState('active');
    const [subCollectionData, setSubCollectionData] = useState([])
    const [editData, setEditData] = useState(null)
    const [selectedCollection, setSelectedCollection] = useState()
    const [subCollectionName, setSubCollectionName] = useState()
    const [collectionData, setCollectionData] = useState([])
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const drop = collectionData.map((item, index) => ({ id: item._id, name: item.collection_name }))
    const [collectionDrop, setCollectionDrop] = useState(drop)
    const AddMOdalToggle = () => {
        SetAddmodal(!AddModal)
        setEditData(null)
        setSelectedCollection()
        setSubCollectionName()
    };
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


    const fetchCollections = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`,
                }
            });

            setCollectionData(collectData.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubcollections = async (page) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const stores = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=${page}&limit=${perPage}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            setSubCollectionData(stores.data.data);
            setTotalRows(stores.data.total);
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = (page) => {
        fetchSubcollections(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const res = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=${page}&limit=${newPerPage}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            setSubCollectionData(res.data.data)
            setPerPage(newPerPage);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

    };

    const postSubcollections = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const obj = {
                collection_id: selectedCollection,
                sub_collection_name: subCollectionName

            }
            const stores = await axios.post(`${baseURL}/api/admin/add-sub-collection`, obj, {
                headers: {
                    Authorization: `${token}`
                }
            })
            fetchSubcollections(1);
            SetAddmodal(!AddModal)
            Swal.fire({
                title: "Sub Collection Added!",
                icon: "success",
                confirmButtonColor: "#d3178a",
            });
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                confirmButtonColor: "#d3178a",
            });
            console.log(error)
        }
    }
    const editSubcollections = async (id) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const obj = {
                collection_id: selectedCollection,
                sub_collection_name: subCollectionName,
            }


            const stores = await axios.patch(`${baseURL}/
api/admin/update-sub-collection/${id}`, obj, {
                headers: {
                    Authorization: `${token}`
                }
            })
            fetchSubcollections(1)
            SetAddmodal(!AddModal)
            Swal.fire({
                title: "Updated Sub-Collection!",
                icon: "success",
                confirmButtonColor: "#d3178a",
            });
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.message,
                icon: "error",
                confirmButtonColor: "#d3178a",
            });
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCollections();
        fetchSubcollections(1);
    }, [])

    const handleEditUpdate = () => {

        if (editData !== null) {
            editSubcollections(editData._id)

        }
        else {
            postSubcollections()
        }
    }


    const inactiveItem = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const obj = {
                status: editData.status === "inactive" ? "active" : 'inactive'
            }

            const itemsData = await axios.patch(`${baseURL}/api/admin/update-sub-collection-status/${editData._id}`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            fetchSubcollections(1)
            setDeleteModal(!deleteModal)
        }
        catch (err) {
            console.log(err)
        }
    }


    const orderColumns = [
        {
            name: 'Collection Name',
            selector: row => row.collection_id.collection_name,
            sortable: true,
            center: true,
            cell: (row) => (
                row.collection_id.collection_name
            )
        },
        {
            name: 'Sub-Collection Name',
            selector: row => row['sub_collection_name'],
            sortable: true,
            center: true,
            cell: (row) => (

                row.sub_collection_name

            )
        },
        // {
        //     name: 'Added By',
        //     selector: row => `${row.added_by.first_name}`,
        //     sortable: true,
        //     center: true,
        //     cell: (row) => (
        //         <div className='d-flex justify-content-end align-items-center'>
        //             <p style={{ fontWeight: '500' }}>{row.added_by.first_name}</p>

        //         </div>
        //     )
        // },
        {
            name: 'Status',
            selector: row => `${row.status}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <p className={`text-${row.status === "inactive" ? "[#ff0000]" : "[#008800]"}`}>{row.status === "active" ? "Active" : "In-Active"}</p>
            )
        },
        // {
        //     name: 'Created Date',
        //     selector: row => `${row.createdAt}`,
        //     cell: (row) => (
        //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //             <p style={{ fontWeight: '500' }}>{moment(row.createdAt).format('DD/MM/YYYY')}</p>
        //         </div>
        //     ),
        //     sortable: true,
        //     center: true,
        // },
        // {
        //     name: 'Updated Date',
        //     selector: row => `${row.updatedAt}`,
        //     sortable: true,
        //     center: true,
        //     cell: (row) => (
        //         <div className='d-flex justify-content-center align-items-center'>
        //             <p className='text-center font-medium'>{moment(row.updatedAt).format("DD/MM/YYYY")}</p>
        //         </div>
        //     ),

        // },
        {
            name: 'Actions',
            cell: (row) => (
                // <div className='d-flex justify-content-center align-items-center' style={{ marginLeft: '20px' }}>

                //     <div
                //         onClick={() => {
                //             setEditData(row)
                //             setSelectedCollection(row.collection_id._id)
                //             setSubCollectionName(row.sub_collection_name)
                //             SetAddmodal(!AddModal)

                //         }}
                //         className='rounded-2' style={{ cursor: 'pointer', marginRight: '10px', border: '1px solid #008000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                //         <Edit2 color='#008000' size={16} />
                //     </div>
                //     <div
                //         onClick={() => {
                //             setEditData(row)
                //             setDeleteModal(!deleteModal)

                //         }}
                //         className='rounded-2' style={{ cursor: 'pointer', border: '1px solid #ff0000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                //         <Trash2 color='#ff0000' size={16} />
                //     </div>
                // </div>
                <>
                    <UncontrolledDropdown className='action_dropdown'>
                        <DropdownToggle className='action_btn'
                        >
                            <MoreVertical color='#000' size={16} />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                setEditData(row)
                                setSelectedCollection(row.collection_id._id)
                                setSubCollectionName(row.sub_collection_name)
                                SetAddmodal(!AddModal)
                            }}>
                                Edit
                                <FaPen />
                            </DropdownItem>
                            <DropdownItem 
                            // className='delete_item'
                             onClick={(rowData) => {
                                setEditData(row)
                                setDeleteModal(!deleteModal)
                            }}>
                                Change Status
                                {/* <FaTrashAlt /> */}
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
            sortable: false,
            center: true,
        }
    ]
    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };




    // const customStyles = {
    //     header: {
    //         style: {
    //             minHeight: '56px',
    //         },
    //     },
    //     headRow: {
    //         style: {
    //             display: "flex",
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //         },
    //     },
    //     headCells: {
    //         style: {
    //             fontSize: '16px',
    //             fontWeight: '500',
    //             textAlign: 'center',

    //         },
    //     },
    //     cells: {
    //         style: {
    //             textAlign: 'center',
    //         }
    //     }
    // };

    const filteredSubCollections = subCollectionData.filter(item =>
        item?.sub_collection_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <Fragment>
            {/* <Row xxl={12} className='pb-4'>
                <Col xxl={8}>
                    <H4>Sub Collection List</H4>
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
                            <div className='d-flex justify-content-center align-items-center rounded-2 bg-primary px-1  cursor-pointer' style={{ width: '175px', height: '35px' }} onClick={AddMOdalToggle}>
                                <PlusSquare size={20} />
                                <p style={{ fontSize: '14px', marginLeft: '5px' }}>Add Sub-Collection</p>
                            </div>
                        </Col>
                        <Col xxl={4}>
                            <div onClick={handleClickImport}
                                style={{ overflow: 'hidden', border: '1px solid gray', height: '35px', width: '155px', borderRadius: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                <Download size={20} style={{ marginRight: '5px' }} />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    style={{ display: 'none' }}
                                    accept=".xlsx"
                                    className="form-control"
                                    onChange={handleFileUpload}
                                />
                                <p style={{ fontSize: '12px', fontWeight: '500' }}>Import From Excel</p>
                            </div>
                        </Col>

                    </Row>


                </Col>
            </Row> */}

            <Row xxl={12} className='pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <H4>Sub Collection List</H4>
                    <div className="file-content">
                        <Media>
                            <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                <i className='fa fa-search'></i>
                                <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                            </div>
                            {
                                userRole === 'admin' && <Media body className='text-end ms-3'>
                                    <Button className='btn btn-primary d-flex align-items-center' onClick={AddMOdalToggle}>
                                        <PlusCircle />
                                        Add Sub-Collection
                                    </Button>
                                </Media>
                            }

                        </Media>
                    </div>
                </div>
            </Row>

            {(selectedRows.length !== 0) &&
                <div className={`d-flex align-items-center justify-content-between bg-light-info p-2`}>
                    <H4 attrH4={{ className: 'text-muted m-0' }}>Delete Selected Product..!</H4>
                    <Btn attrBtn={{ color: 'danger', onClick: () => handleDelete() }}>Delete</Btn>
                </div>
            }
            {
                subCollectionData.length !== 0 ? (
                    <DataTable
                        data={filteredSubCollections || []}
                        columns={orderColumns}
                        center={true}
                        pagination
                        onSelectedRowsChange={handleRowSelected}
                        clearSelectedRows={toggleDelet}
                        progressPending={loading}
                        paginationServer
                        progressComponent={<Loader />}
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
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



            <CommonModal isOpen={AddModal} className="store_modal" title={editData !== null ? "Update Sub Collection" : "Add Sub Collection"} toggler={AddMOdalToggle} size="md">
                <Container>
                    <Form>
                        <>
                            <Col xxl={12} className='flex flex-col'>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Collection Name</Label>
                                    <Input type="select" className='border-[#e1e3ef] text-lg font-medium rounded-md focus:ring-0 focus:outline-none' onChange={(e) => {
                                        const selectedOption = e.target.value;

                                        setSelectedCollection(selectedOption)
                                    }}
                                        value={selectedCollection}
                                    >
                                        <option value="">Select Collection</option>

                                        {
                                            collectionData.map(item => (
                                                <>
                                                    <option value={item._id} placeholder={"Select Collection"} className='text-base'>{item.collection_name}</option>
                                                </>
                                            ))
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col xxl={12}>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Sub-Collection Name</Label>
                                    <Input value={subCollectionName} onChange={(e) => setSubCollectionName(e.target.value)} placeholder='Enter Sub Collection Name' />
                                </FormGroup>
                            </Col>
                        </>
                        <Row>
                            <Col md={12} xxl={12} className='text-center'>
                                <Button onClick={handleEditUpdate} className='cursor-pointer mt-3 bg-[#ff0000] font-medium  px-2 py-2 rounded-2xl text-white flex justify-center items-center'>
                                    {editData !== null ? " Update Sub Collection" : "                                    Save Sub Collection"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>
            <CommonModal isOpen={deleteModal} title="" toggler={() => { setDeleteModal(!deleteModal) }} size="md">
                <Container className='flex flex-col justify-center items-center'>
                    <p>Do You Want To Change Status Of This Collection? </p>
                    <div className='flex flex-row space-x-8'>
                        <div onClick={() => setDeleteModal(!deleteModal)} className='border-1 border-[#ff0000] px-2 py-2 text-[#ff0000] rounded-xl cursor-pointer'>Cancel</div>
                        <div onClick={inactiveItem} className='bg-[#ff0000] px-4 py-2 text-white rounded-xl cursor-pointer'>Yes</div>
                    </div>
                </Container>
            </CommonModal>
        </Fragment >
    )
}
export default SubCollectionsTable