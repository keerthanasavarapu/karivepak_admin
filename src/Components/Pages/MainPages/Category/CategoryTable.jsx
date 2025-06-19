import React, { Fragment, useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { H4 } from '../../../../AbstractElements';
import {
    Button, Col, Container, DropdownItem, DropdownMenu,
    DropdownToggle, Form, FormGroup, Input, Label,
    Media, Row, UncontrolledDropdown
} from 'reactstrap';
import { MoreVertical, PlusCircle } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { baseURL } from '../../../../Services/api/baseURL';
import { FaPen, FaTrash } from 'react-icons/fa';
import Loader from '../../../Loader/Loader';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMainCategories } from '../../../../redux/slice/maincategory.slice';

const CategoryTable = () => {
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const token = JSON.parse(localStorage.getItem("token"));

    const [editData, setEditData] = useState(null);
    const [editMetaData, setEditMetaData] = useState(null);
    console.log(editMetaData, "editMetaData")

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMetaOpen, setIsMetaOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false); // Define setLoading using useState
    const [formData, setFormData] = useState({
        name: '',
        status: 'active',
        image: null,
        imagePreview: null,
        metaTitle: "",
        metaDescription: ""
    });
    const [metaData, setMetaData] = useState({
        metaTitle: "",
        metaDescription: ""
    });
    console.log(metaData, "metaData")

    // const dispatch = useDispatch();
    // const { categories, totalRows /* removed loading from here */ } = useSelector(state => state.maincategory); // Adjusted selector and removed loading
    const [categories, setCategories] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0
    });

    const fetchCategories = async (page = 1) => {
        setLoading(true);
        try {
            const rawToken = localStorage.getItem('token');
            if (!rawToken) throw new Error("No token found in localStorage");

            const token = JSON.parse(rawToken);
            const response = await axios.get(`${baseURL}/api/maincategory`, {
                params: {
                    page,
                    limit: pagination.perPage,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const categoriesData = response.data.mainCategories || [];

            setCategories(categoriesData);
            setPagination(prev => ({
                ...prev,
                totalRows: response.data.count || categoriesData.length,
            }));

        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire({
                title: "Error",
                text: error?.response?.data?.message || "Failed to fetch categories",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(1);
    }, []);

    // Modal Toggle
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen) {
            resetForm();
        }
    };
    const toggleMetaModal = () => {
        setIsMetaOpen(!isMetaOpen);
        if (isMetaOpen) {
            resetMetaForm();
        }
    };

    // Toggle Delete Modal
    const toggleDeleteModal = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen);
        if (isDeleteModalOpen) {
            setSelectedCategory(null);
        }
    };

    // Reset Form
    const resetForm = () => {
        setEditData(null);
        setFormData({
            name: '',
            status: 'active',
            image: null,
            imagePreview: null
        });
    };
    const resetMetaForm = () => {
        setEditMetaData(null);
        setMetaData({
            metaTitle: "",
            metaDescription: ""
        });
    };

    // Input Change Handler
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'image' && files[0]) {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, } = e.target;
        setMetaData(prev => ({
            ...prev,
            [name]: value
        }));

    }

    // Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('status', formData.status);

        // Append image only if it's a new file
        if (formData.image instanceof File) {
            formPayload.append('image', formData.image);
        }

        try {
            if (editData) {
                // Update existing category
                await axios.put(`${baseURL}/api/maincategory/${editData._id}`, formPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                Swal.fire({
                    title: "Category Updated!",
                    icon: "success",
                    confirmButtonColor: "#fc2c54",
                });
            } else {
                // Add new category
                await axios.post(`${baseURL}/api/maincategory`, formPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                Swal.fire({
                    title: "Category Added!",
                    icon: "success",
                    confirmButtonColor: "#fc2c54",
                });
            }

            toggleModal();
            fetchCategories(pagination.page);
        } catch (error) {
            console.error('Error submitting category:', error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to submit category",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        } finally {
            setLoading(false);
        }
    };



    const handleMetaSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(editMetaData._id, "editMetaDataId")
            const response = await axios.put(`${baseURL}/api/maincategory/admin/${editMetaData._id}`, metaData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            Swal.fire({
                title: response?.data?.message,
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });
            console.log(response, "reponse of meta");
            toggleMetaModal();
            fetchCategories(pagination.page);
        } catch (error) {
            console.error('Error submitting category:', error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to submit category",
                icon: "error",
                confirmButtonColor: "#fc2c54",

            })
        } finally {
            setLoading(false);
        }
    }



    // Edit Category
    const handleEditCategory = (row) => {
        setEditData(row);
        setFormData({
            name: row.name,
            status: row.status,
            image: row.image || null,
            imagePreview: row.image || null,
            metaTitle: row.metaTitle || "",
            metaDescription: row.metaDescription || ""
        });
        setIsModalOpen(true);
    };

    const handleAddMetaData = (row) => {
        setEditMetaData(row);
        setMetaData({
            metaTitle: row.metaTitle || "",
            metaDescription: row.metaDescription || ""
        });
        setIsMetaOpen(true);
    };




    // Delete Category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        setLoading(true);
        try {
            await axios.delete(`${baseURL}/api/maincategory/${selectedCategory._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: "Category Deleted!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });

            toggleDeleteModal();
            fetchCategories(pagination.page); // Use fetchMainCategories
        } catch (error) {
            console.error('Error deleting category:', error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to delete category. This category may be in use by subcategories.",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        } finally {
            setLoading(false);
        }
    };

    // Open Delete Modal
    const openDeleteModal = (row) => {
        setSelectedCategory(row);
        setIsDeleteModalOpen(true);
    };

    // Table Columns
    const columns = [
        {
            name: 'Image',
            selector: row => row.images?.[0],
            sortable: false,
            center: true,
            cell: row => (
                <div className="blog-image-container" style={{ padding: '2px' }}>
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={row.name}
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                background: '#f0f0f0',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            No Image
                        </div>
                    )}
                </div>
            ),
            width: '100px'
        },
        {
            name: 'Category Name',
            selector: row => row.name,
            sortable: true,
            center: true,
        },
        {
            name: 'Created Date',
            selector: row => row.createdAt,
            sortable: true,
            center: true,
            cell: row => moment(row.createdAt).format("DD/MM/YYYY"),
        },
        {
            name: 'Updated Date',
            selector: row => row.updatedAt,
            sortable: true,
            center: true,
            cell: row => moment(row.updatedAt).format("DD/MM/YYYY"),
        },
        {
            name: 'Actions',
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag="span" className="p-2 cursor-pointer">
                        <MoreVertical size={16} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => handleEditCategory(row)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <FaPen className="mr-2" /> Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleAddMetaData(row)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <FaPen className="mr-2" /> Add meta Data
                        </DropdownItem>
                        {userRole && userRole.toLowerCase() === 'admin' && (
                            <DropdownItem onClick={() => openDeleteModal(row)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <FaTrash className="mr-2" /> Delete
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
            sortable: false,
            center: true,
            width: "120px",
        }
    ];

    // Filtered Categories
    const filteredCategories = Array.isArray(categories)
        ? categories.filter(item =>
            (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <Fragment>
            <Row className='pb-4'>
                <div className='d-flex justify-content-between align-items-center'>
                    <H4>Category List</H4>
                    <div className="file-content">
                        <Media>
                            <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                <i className='fa fa-search'></i>
                                <input
                                    className='form-control border-0'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type='text'
                                    placeholder='Search...'
                                />
                            </div>
                            {userRole && userRole.toLowerCase() === 'admin' && (
                                <Media body className='text-end ms-3'>
                                    <Button className='btn btn-primary d-flex align-items-center' onClick={toggleModal}>
                                        <PlusCircle />
                                        Add Category
                                    </Button>
                                </Media>
                            )}
                        </Media>
                    </div>
                </div>
            </Row>

            <DataTable
                data={filteredCategories}
                columns={columns}
                pagination
                paginationServer
                paginationTotalRows={pagination.totalRows} // <-- fix here
                onChangePage={(page) => {
                    setPagination(prev => ({ ...prev, page }));
                }}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPagination(prev => ({ ...prev, perPage: newPerPage, page }));
                }}
                progressPending={loading}
                progressComponent={<Loader />}
            />

            {/* Add/Edit Category Modal */}
            <CommonModal
                isOpen={isModalOpen}
                title={editData ? "Edit Category" : "Add Category"}
                className="store_modal"
                toggler={toggleModal}
                size="md"
            >
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Col xxl={12}>
                            <FormGroup>
                                <Label className="font-medium text-base">
                                    Category Name <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-medium text-base">
                                    Image {!editData && <span className="text-danger">*</span>}
                                </Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={handleInputChange}
                                    accept="image/*"
                                    required={!editData}
                                />
                                {formData.imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Category Preview"
                                            style={{
                                                maxWidth: '200px',
                                                maxHeight: '200px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                )}
                            </FormGroup>
                            <Row className="text-center">
                                <Button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {editData ? "Update Category" : "Add Category"}
                                </Button>
                            </Row>
                        </Col>
                    </Form>
                </Container>
            </CommonModal>


            <CommonModal
                isOpen={isMetaOpen}
                title={editMetaData ? "Edit Category" : "Add Category"}
                className="store_modal"
                toggler={toggleMetaModal}
                size="md"
            >
                <Container>
                    <Form onSubmit={handleMetaSubmit}>
                        <Col xxl={12}>
                            <FormGroup>
                                <Label className="font-medium text-base">
                                    Meta Title <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="metaTitle"
                                    value={metaData.metaTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-medium text-base">
                                    Meta Description <span className="text-danger">*</span>
                                </Label>
                                <Input
                                    type="text"
                                    name="metaDescription"
                                    value={metaData.metaDescription}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <Row className="text-center">
                                <Button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {editMetaData ? "Update Category" : "Add Category"}
                                </Button>
                            </Row>
                        </Col>
                    </Form>
                </Container>
            </CommonModal>


            {/* Delete Confirmation Modal */}
            <CommonModal
                isOpen={isDeleteModalOpen}
                title="Delete Category"
                toggler={toggleDeleteModal}
                className="delete_modal"
                size="md"
            >
                <Container>
                    <div className="text-center mb-4">

                        <h5>Are you sure you want to delete this category {selectedCategory?.categoryName}?</h5>
                        <p className="text-muted">
                            {/* {selectedCategory?.categoryName} */}
                        </p>
                        <p className="text-danger">
                            This action cannot be undone. All subcategories associated with this category will also be affected.
                        </p>
                    </div>
                    <Row className="text-center">
                        <Col xs={6}>
                            <Button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={toggleDeleteModal}
                            >
                                Cancel
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                                type="button"
                                className="btn btn-danger w-100"
                                onClick={handleDeleteCategory}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </CommonModal>
        </Fragment>
    );
}

export default CategoryTable;