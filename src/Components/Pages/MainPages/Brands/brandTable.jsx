import React, { Fragment, useCallback, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H4, Spinner } from '../../../../AbstractElements';
import { Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Media, Row, UncontrolledDropdown } from 'reactstrap';
import { MoreVertical, PlusCircle } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal'
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { baseURL, imageURL } from '../../../../Services/api/baseURL';
import dummyImg from '../../../../assets/images/product/2.png';
import { Image } from '../../../../AbstractElements';
import { FaPen, FaTrashAlt } from 'react-icons/fa';

export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]

const BrandTable = () => {
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [editData, setEditData] = useState([]);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('active');
    const [brandData, setBrandData] = useState([])
    const [deleteModal, setDeleteModal] = useState(false);
    const [token, setToken] = useState(null);
    const [image, setImage] = useState("");
    const [brandId, setBrandId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {
            setToken(token);
            return;
        }
        setToken(null);
    }, []);

    const toggleModal = () => {
        formik.resetForm();
        setBrandId("");
        SetAddmodal(!AddModal)
    }

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value);
    };

    function capitalize(word) {
        const lower = word.toLowerCase();
        return word.charAt(0).toUpperCase() + lower.slice(1);
    }

    const getEditData = async (brandId) => {
        const token = await JSON.parse(localStorage.getItem("token"))
        if (brandId) {
            try {
                const response = await axios.get(`${baseURL}/api/brand/get-brand/${brandId}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                if (response.data.success) {
                    let data = response?.data.data;
                    data.brandName && formik.setFieldValue("brandName", data.brandName)
                    data.description && formik.setFieldValue("brandDescription", data.description)
                    data.image && formik.setFieldValue("storeManager", data.image);
                    setImage(data.image);
                    setLoading(false);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    const getBrandsList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        const userData = await JSON.parse(localStorage.getItem('UserData'))
        const userRole = JSON.parse(localStorage.getItem('role_name'));
        let params = {};
        if(userRole==='store'){
            params = {
                role: userRole,
                storeId: userData?._id
            }; 
        }
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/brand/get-brand`, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (response.data.success) {
                setBrandData(response?.data?.data.reverse());
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const deleteBrand = async (id) => {
        if (window.confirm("Do You Want To change status of this Brand?")) {
            const token = await JSON.parse(localStorage.getItem("token"))

            try {
                const data = await axios.delete(`${baseURL}/api/brand/delete-brand/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    }
                })
                getBrandsList();
                Swal.fire({
                    icon: 'success',
                    title: data?.data?.message
                })
            } catch (error) {
                console.log(error, 'edit')
            }
        }


    }

    useEffect(() => {
        getBrandsList()
    }, []);

    const inactiveItem = async () => {
        console.log("Switching item status");
        const token = JSON.parse(localStorage.getItem("token"));
    
        if (!token) {
            console.log("Token not found");
            return;
        }
    
        try {
            const obj = {
                status: editData.status === "inactive" ? "active" : "inactive"
            };
    
            
            const itemsData = await axios.delete(`${baseURL}/api/brand/delete-brand/${editData._id}`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
    
            getBrandsList();
            setDeleteModal(!deleteModal);
        } catch (err) {
            console.log(err);
        }
    };
    

    const uploadImage = async (event) => {
        let file = event.target.files[0];
        let img = URL?.createObjectURL(file);
        formik.setFieldValue("brandLogo", file);
        setImage(img);
    };

    const deleteImage = () => {
        formik.setFieldValue("brandLogo", "");
        setImage("")
    }

    const formik = useFormik({
        initialValues: {
            brandName: "",
            brandLogo: "",
            brandDescription: ""
        },
        validationSchema: Yup.object({
            brandName: Yup.string().min(3, 'Please enter min 3 characters').required('Required'),
        }),
        onSubmit: async (values) => {
            const token = await JSON.parse(localStorage.getItem("token"))
            try {

                const formData = new FormData();
                values.brandName && formData.append('brandName', values.brandName);
                values.brandDescription && formData.append('description', values.brandDescription)
                values.brandLogo && formData.append('Image', values.brandLogo);
                let response;

                if (brandId) {
                    response = await axios.patch(`${baseURL}/api/brand/update-brand/${brandId}`,
                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }
                else {
                    response = await axios.post(`${baseURL}/api/brand/add-brand`,
                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }
                formik.resetForm();
                toggleModal();
                getBrandsList();
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonColor: "#d3178a",
                });
            } catch (error) {
                console.log(error, 'post')
            }
        },
    })


    const filteredBrandData = brandData.filter(item =>
        item?.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const orderColumns = [
        {
            name: "Brand Image",
            selector: row => (
                <>
                    <Media className='d-flex'>
                        <Image attrImage={{ className: ' img-30', src: `${row?.brandImage ? imageURL + row.brandImage : dummyImg}`, alt: 'Brand Image' }} />

                    </Media>
                </>
            ),
            center: false,
        },
        {
            name: 'Brand Name',
            selector: row => row['brandName'],
            sortable: true,
            center: false,
            cell: (row) => (
                capitalize(row.brandName)
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
                                getEditData(row?._id);
                                setBrandId(row?._id);
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
                                {/* <FaPen /> */}
                            {/* </DropdownItem> */}
                            {/* <DropdownItem  */}
                             {/* className='delete_item' */}
                             {/* onClick={(rowData) => { */}
                                {/* setEditData(row) */}
                                {/* setDeleteModal(!deleteModal) */}
                            {/* }}> */}
                                {/* Change Status */}
                                {/* <FaTrashAlt /> */}
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
            sortable: false,
            center: true,
            omit: userRole !== 'admin'
        }
    ]

    return (
        <Fragment>
            <Row xxl={12} className='pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <h4 className='mb-0'>Brands List</h4>
                    <div className="file-content">
                        <Media>
                            <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                <i className='fa fa-search'></i>
                                <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
                            </div>
                            {
                                userRole === 'admin' && <Media body className='text-end ms-3'>
                                    <Button className='btn btn-primary d-flex align-items-center' onClick={toggleModal}>
                                        <PlusCircle />
                                        Add Brand
                                    </Button>
                                </Media>
                            }

                        </Media>
                    </div>
                </div>
            </Row>

            {
                brandData.length !== 0 ?
                    (<DataTable
                        data={filteredBrandData}
                        columns={orderColumns}
                        striped={true}
                        center={true}
                        pagination
                        clearSelectedRows={toggleDelet}
                    />) :
                    !loading && <p className='text-center my-5'>No Data Found</p>
            }
            {
                loading && (
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


            <CommonModal isOpen={AddModal} title={brandId ? "Update Brand" : "Add Brand"} className="store_modal" toggler={toggleModal} size="md">
                <Container>
                    <Form onSubmit={formik.handleSubmit} >
                        <>
                            <Col xxl={12}>
                                <Row className='mb-3'>
                                    <Col xl={12}>
                                        <div className='d-flex justify-content-center' >
                                            <img style={{ maxWidth: "100%", borderRadius: '50%', width: '100px', height: "100px" }} src={image ? image : dummyImg} />
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <Label className='font-medium text-base'>Brand Logo</Label>
                                        <Row>
                                            <Col xl={9}>
                                                <Input type='file' onChange={(e) => uploadImage(e)} accept="image/*" />
                                            </Col>
                                            <Col xl={3} className='text-right'>
                                                <Button className='w-100' onClick={deleteImage}>Delete</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Brand Name <span className='text-danger'>*</span></Label>
                                    <Input name='brandName' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.brandName} placeholder='Enter Brand Name' />
                                    {formik.touched.brandName && formik.errors.brandName ? (
                                        <span className="error text-danger">{formik.errors.brandName}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                                <FormGroup>
                                    <Label className='font-medium text-base'>Brand Description</Label>
                                    <Input className='form-control' name='brandDescription' type='textarea' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.brandDescription} placeholder='Enter Brand Description' />
                                    {formik.touched.brandDescription && formik.errors.brandDescription ? (
                                        <span className="error text-danger">{formik.errors.brandDescription}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                        </>
                        <Row>
                            <Col xxl={12} className='text-center'>
                                <Button type='submit' className='cursor-pointer bg-[#ff0000] font-medium w-40 mt-4 px-2 py-2 rounded-2xl text-white flex justify-center items-center'>
                                    {brandId ? "Update Brand" : "Save Brand"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>
            <CommonModal isOpen={deleteModal} title="" toggler={() => { setDeleteModal(!deleteModal) }} size="md">
                <Container className='flex flex-col justify-center items-center'>
                    <p>Do You Want To Change Status Of This Brand? </p>
                    <div className='flex flex-row space-x-8'>
                        <div onClick={() => setDeleteModal(!deleteModal)} className='border-1 border-[#ff0000] px-2 py-2 text-[#ff0000] rounded-xl cursor-pointer'>Cancel</div>
                        <div onClick={inactiveItem} className='bg-[#ff0000] px-4 py-2 text-white rounded-xl cursor-pointer'>Yes</div>
                    </div>
                </Container>
            </CommonModal>
        </Fragment>
    )
}
export default BrandTable