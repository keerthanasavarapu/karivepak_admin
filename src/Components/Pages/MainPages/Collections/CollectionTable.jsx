import React, { Fragment, useCallback, useRef, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H4, Spinner } from '../../../../AbstractElements';
// import { tableColumns, orderColumns, products } from './data';
import { Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Media, Row, UncontrolledDropdown, } from 'reactstrap';
import HeaderCard from '../../../Common/Component/HeaderCard';
import { Download, MoreVertical, PlusCircle, PlusSquare } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal'
import { Edit2, Eye, Trash2 } from 'react-feather';
import axios from 'axios';
import moment from 'moment';
import { spinnerData } from './data'
import Swal from 'sweetalert2';
import { baseURL } from '../../../../Services/api/baseURL';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { useFormik } from 'formik';
import Loader from '../../../Loader/Loader';

export const products = [
    {
        id: 1,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
    {
        id: 2,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'Inactive',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
    {
        id: 3,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
]

const CollectionTable = () => {
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [editData, setEditData] = useState([]);
    const [data, setData] = useState(products);
    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [addExcel, setAddExcel] = useState(false)
    const [selectedOption, setSelectedOption] = useState('active');
    const [CollectionData, setCollectionData] = useState([])
    const [collectionName, setCollectionName] = useState()
    const [deleteModal, setDeleteModal] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState("");

    const AddMOdalToggle = () => {
        SetAddmodal(!AddModal)
        setEditData(null)
        setCollectionName(null);
        setQuantity("");
    }
    const addmodalExcel = () => setAddExcel(!addExcel)
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };
    const orderColumns = [
        {
            name: 'Collection Name',
            selector: row => row['collection_name'],
            sortable: true,
            center: true,
            cell: (row) => (
                row.collection_name
            )
        },
        {
            name: 'Status',
            selector: row => `${row.status}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <p className={`text-${row.status === "inactive" ? "[#ff0000]" : "[#008800]"}`}>{row.status === "active" ? "Active" : "In-Active"}</p>
            )
        },
        {
            name: 'Created Date',
            selector: row => `${row.createdAt}`,
            cell: (row) => (
                moment(row.createdAt).format("DD/MM/YYYY")
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'Updated Date',
            selector: row => `${row.updatedAt}`,
            sortable: true,
            center: true,
            cell: (row) => (
                moment(row.updatedAt).format("DD/MM/YYYY")
            ),

        },
        {
            name: 'Actions',
            cell: (row) => (

                <>
                    <UncontrolledDropdown className='action_dropdown'>
                        <DropdownToggle className='action_btn'
                        >
                            <MoreVertical color='#000' size={16} />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {
                                setEditData(row)
                                setCollectionName(row.collection_name)
                                setQuantity(row.quantity)
                                setSelectedOption(row.status)
                                SetAddmodal(true)
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
    ];

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

    const fetchCollections = async (page) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=${page}&limit=${perPage}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            setCollectionData(collectData.data.data);
            setTotalRows(collectData.data.total);
        } catch (error) {
            console.log(error)
        }
    }

    const handlePageChange = (page) => {
        fetchCollections(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);

        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=${page}&limit=${newPerPage}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            setCollectionData(collectData.data.data)
            setPerPage(newPerPage);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }


    };

    const PostCollections = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.post(`${baseURL}/api/admin/add-collection`, { collection_name: collectionName, quantity: quantity }, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            AddMOdalToggle()
            fetchCollections(1);
            Swal.fire({
                title: "Collection Added!",
                icon: "success",
                confirmButtonColor: "#d3178a",

            });
        } catch (error) {
            console.log(error, 'post')
        }
    }
    const EditCollections = async (id) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.patch(`${baseURL}/
api/admin/update-collection/${id}`, { collection_name: collectionName, quantity: quantity }, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            SetAddmodal(!AddModal)
            fetchCollections(1);
            Swal.fire({
                title: "Updated Sub Collection!",
                icon: "success",
                confirmButtonColor: "#d3178a",

            });
        } catch (error) {
            console.log(error, 'edit')
        }
    }
    const inActiveCollections = async (id) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.patch(`${baseURL}/api/admin/update-collection-status/${id}`, { status: selectedOption }, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            SetAddmodal(!AddModal)
            fetchCollections(1);
        } catch (error) {
            console.log(error, 'edit')
        }
    }
    useEffect(() => {
        fetchCollections(1);
    }, [])
    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const inactiveItem = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const obj = {
                status: editData.status === "inactive" ? "active" : 'inactive'
            }

            const itemsData = await axios.patch(`${baseURL}/
api/admin/update-collection-status/${editData._id}`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            fetchCollections(1)
            setDeleteModal(!deleteModal)
        }
        catch (err) {
            console.log(err)
        }
    }


    const handlePostCollections = (row) => {
        if (editData === null) {
            PostCollections()
        } else {
            if (editData.status !== selectedOption && editData.collection_name === collectionName) {
                inActiveCollections(editData._id)

            } else {
                EditCollections(editData._id)

            }
        }


    }
    const handleActiveCollections = (row) => {
        setEditData(row)
        SetAddmodal(!AddModal)

        if (editData !== null) {
            setSelectedOption(editData.status)
            inActiveCollections(editData._id)
        }

    }
    const filteredCollections = CollectionData.filter(item =>
        item?.collection_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <Fragment>
            <Row xxl={12} className='pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <H4>Collection List</H4>
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
                                        Add Collection
                                    </Button>
                                </Media>
                            }
                        </Media>
                    </div>
                </div>
            </Row>

            {
                CollectionData.length !== 0 ?
                    (<DataTable
                        data={filteredCollections || []}
                        columns={orderColumns}
                        pagination
                        onSelectedRowsChange={handleRowSelected}
                        clearSelectedRows={toggleDelet}
                        progressPending={loading} paginationServer
                        progressComponent={<Loader />}
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                    />) : (
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
                    )}

            <CommonModal isOpen={AddModal} title="Add New Collection" className="store_modal" toggler={AddMOdalToggle} size="md">
                <Container>
                    <Form >
                        <>
                            <Col xxl={12}>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Collection Name <span className='text-danger'>*</span></Label>
                                    <Input name='brandName' value={collectionName} onChange={(e) => setCollectionName(e.target.value)} placeholder='Enter Collection Name' />
                                </FormGroup>
                            </Col>
                            <Col xxl={12}>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Order Max Quantity<span className='text-danger'>*</span></Label>
                                    <select name='quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} >
                                        <option value={''} disabled selected>Select Max Order Quantity</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </FormGroup>
                            </Col>
                        </>
                        <Row>
                            <Col xxl={12} className='text-center'>
                                <Button type='button' onClick={handlePostCollections} className='cursor-pointer bg-[#ff0000] font-medium w-40 mt-4 px-2 py-2 rounded-2xl text-white flex justify-center items-center'>
                                    Save Collection
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
        </Fragment>
    )
}
export default CollectionTable