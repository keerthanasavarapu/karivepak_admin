import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {
    Button,
    Col,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
    UncontrolledDropdown,
    Media,
    Container,
} from 'reactstrap';
import { PlusCircle, MoreVertical } from 'react-feather';
import { FaPen, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { baseURL } from '../../../../Services/api/baseURL';
import CommonModal from '../../../UiKits/Modals/common/modal';
import Loader from '../../../Loader/Loader';

const SubCategoriesTable = () => {
    const [editData, setEditData] = useState(null);
    const [userData, setUserData] = useState({
        role: '',
        token: ''
    });
    const [tableState, setTableState] = useState({
        data: [],
        loading: false,
        totalRows: 0,
        perPage: 10,
        currentPage: 1
    });
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0
    });
    const [categoriesData, setCategoriesData] = useState([]);
    const [modalState, setModalState] = useState({
        isAddModalOpen: false,
        isDeleteModalOpen: false,
        selectedSubCategory: null,
    });
    const [formData, setFormData] = useState({
        categoryId: '',
        subCategoryName: '',
    });
    const [searchTerm, setSearchTerm] = useState('');




    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token") || "null");
        const role = JSON.parse(localStorage.getItem("role_name") || "null");
        setUserData({ role, token });
    }, []);


    useEffect(() => {
        if (userData.token) {
            fetchCategories();
            fetchSubCategories();
        }
    }, [userData.token, pagination.page, pagination.perPage]);



    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/maincategory`, {
                headers: { Authorization: `Bearer ${userData.token}` }
            });

            // Fix here: correctly set the mainCategories
            setCategoriesData(response.data.mainCategories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    const fetchSubCategories = async () => {
        setTableState(prev => ({ ...prev, loading: true }));
        console.log("hittin API with pagination:", pagination);
        try {
            const response = await axios.get(`${baseURL}/api/category`, {
                params: {
                    page: pagination.page,
                    limit: pagination.perPage
                },
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });
            console.log("Subcategories response:", response.data);

            setTableState(prev => ({
                ...prev,
                data: response.data.categories || [],
                totalRows: response.data.total || 0,
                loading: false,
            }));
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setTableState(prev => ({ ...prev, loading: false }));
        }
    };


    const handleSubmitSubCategory = async () => {
        // 🔍 Validation
        if (!formData.categoryId && !modalState.selectedSubCategory) {
            Swal.fire({
                title: "Please select a Category",
                icon: "warning",
                confirmButtonColor: "#fc2c54",
            });
            return;
        }

        if (!formData.subCategoryName.trim()) {
            Swal.fire({
                title: "Please enter Sub Category Name",
                icon: "warning",
                confirmButtonColor: "#fc2c54",
            });
            return;
        }

        if (!modalState.selectedSubCategory && !formData.image) {
            Swal.fire({
                title: "Please select an image",
                icon: "warning",
                confirmButtonColor: "#fc2c54",
            });
            return;
        }

        try {
            const isEdit = Boolean(modalState.selectedSubCategory);
            const endpoint = isEdit
                ? `${baseURL}/api/category/${modalState.selectedSubCategory._id}`
                : `${baseURL}/api/category`;
            const method = isEdit ? "put" : "post";

            const data = new FormData();

            // ✅ Use field names expected by backend
            data.append("name", formData.subCategoryName.trim());

            // ✅ Only send main_category when adding
            if (!isEdit) {
                data.append("main_category", formData.categoryId);
            }

            if (formData.image) {
                data.append("image", formData.image);
            }

            const response = await axios[method](endpoint, data, {
                headers: {
                    Authorization: `Bearer ${userData.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: isEdit ? "Sub Category Updated!" : "Sub Category Added!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });

            fetchSubCategories(tableState.currentPage);
            resetModal();
        } catch (error) {
            console.error("Subcategory error:", error);
            Swal.fire({
                title: error?.response?.data?.message || "Error occurred",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        }
    };



    const handleDeleteSubCategory = async () => {
        try {
            if (!modalState.selectedSubCategory) return;

            await axios.delete(`${baseURL}/api/category/${modalState.selectedSubCategory._id}`, {
                headers: { Authorization: `Bearer ${userData.token}` },
            });

            Swal.fire({
                title: "Sub Category Deleted!",
                icon: "success",
                confirmButtonColor: "#fc2c54",
            });

            fetchSubCategories(tableState.currentPage);
            resetModal();
        } catch (error) {
            Swal.fire({
                title: error?.response?.data?.message || "Error occurred",
                icon: "error",
                confirmButtonColor: "#fc2c54",
            });
        }
    };

    const resetModal = () => {
        setModalState({
            isAddModalOpen: false,
            isDeleteModalOpen: false,
            selectedSubCategory: null,
        });
        setFormData({ categoryId: '', subCategoryName: '' });
    };

    const tableColumns = [
        {
            name: 'Image',
            selector: row => row.image,
            center: true,
            cell: row => (
                <img
                    src={row.image}
                    alt={row.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                />
            )
        },

        {
            name: 'Sub-Category Name',
            selector: row => row.name,
            sortable: true,
            center: true,
        },
        {
            name: 'Category Name',
            selector: row => row.main_category?.name || 'N/A',
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
            cell: (row) => (
                <UncontrolledDropdown>
                    <DropdownToggle tag="span" className="p-2 cursor-pointer ">
                        <MoreVertical size={16} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            onClick={() => {
                                setModalState(prev => ({
                                    ...prev,
                                    isAddModalOpen: true,
                                    selectedSubCategory: row
                                }));
                                setFormData({
                                    categoryId: row.main_category._id,
                                    subCategoryName: row.name
                                });
                            }}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <FaPen className="mr-2" /> Edit
                        </DropdownItem>
                        {userData.role === 'admin' && (
                            <DropdownItem
                                onClick={() => {
                                    setModalState(prev => ({
                                        ...prev,
                                        isDeleteModalOpen: true,
                                        selectedSubCategory: row
                                    }));
                                }}
                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
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

    return (
        <div>
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h4>Sub Category List</h4>
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
                            {userData.role === 'admin' && (
                                <Media body className='text-end ms-3'>
                                    <Button className='btn btn-primary d-flex align-items-center'
                                        onClick={() => setModalState(prev => ({ ...prev, isAddModalOpen: true }))}
                                    >
                                        <PlusCircle />
                                        Add Sub-category
                                    </Button>
                                </Media>
                            )}
                        </Media>
                    </div>
                </Col>
            </Row>

            <DataTable
                columns={tableColumns}
                data={
                    (Array.isArray(tableState.data) ? tableState.data : []).filter(item =>
                        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                }
                pagination
                paginationServer
                progressPending={tableState.loading}
                progressComponent={<Loader />}
                paginationTotalRows={tableState.totalRows}
                onChangePage={(page) => {
                    setPagination(prev => ({ ...prev, page }));
                }}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPagination(prev => ({ ...prev, perPage: newPerPage, page }));
                }}
                paginationPerPage={pagination.perPage}
            />


            {/* Add Sub Category Modal */}
            <CommonModal
                isOpen={modalState.isAddModalOpen}
                name={modalState.selectedSubCategory ? "Update Sub Category" : "Add Sub Category"}
                toggler={resetModal}
                className="store_modal"
                size="md"
            >
                <Container>
                    <Form>
                        <FormGroup>
                            <Label>
                                Category <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="select"
                                value={formData.categoryId}
                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                disabled={modalState.selectedSubCategory}
                            >
                                <option value="">Select Category</option>
                                {categoriesData.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sub-Category Name<span className="text-danger">*</span></Label>
                            <Input
                                type="text"
                                value={formData.subCategoryName}
                                onChange={(e) => setFormData(prev => ({ ...prev, subCategoryName: e.target.value }))}
                                placeholder="Enter Sub Category Name"
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
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmitSubCategory}
                            >
                                {modalState.selectedSubCategory ? "Update SubCategory" : "Add SubCategory"}
                            </Button>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>

            {/* Delete Confirmation Modal */}
            <CommonModal
                isOpen={modalState.isDeleteModalOpen}
                title="Delete Sub Category"
                toggler={resetModal}
                className="delete_modal"
                size="md"
            >
                <Container>
                    <div className="text-center mb-4">

                        <h5>Are you sure you want to delete this sub-category  {modalState?.selectedSubCategory?.subCategoryName}?</h5>
                        <p className="text-muted">
                            {/* {modalState.selectedSubCategory?.subCategoryName} */}
                        </p>
                        <p className="text-danger">
                            This action cannot be undone.
                        </p>
                    </div>
                    <Row className="text-center">
                        <Col xs={6}>
                            <Button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={resetModal}
                            >
                                Cancel
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button
                                type="button"
                                className="btn btn-danger w-100"
                                onClick={handleDeleteSubCategory}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </CommonModal>
        </div>
    );
};

export default SubCategoriesTable;