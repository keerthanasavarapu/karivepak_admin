
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Container,
} from 'reactstrap';
import {
    PlusCircle,
    MoreVertical,
    Edit,
    Trash2
} from 'react-feather';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { baseURL } from '../../../../Services/api/baseURL';
import Loader from '../../../Loader/Loader';
import { FaTrash } from 'react-icons/fa';


const ProductsTable = () => {
    // State Management
    const [products, setProducts] = useState({
        data: [],
        loading: false,
        totalRows: 0,
        perPage: 10,
        currentPage: 1
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [maincategory, setMainCategory] = useState([]);
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'add', // 'add', 'edit', 'delete'
        selectedProduct: null
    });
    console.log(modal.selectedProduct, "selected product")
    const [formData, setFormData] = useState({
        productName: '',
        categoryId: '',
        subCategoryId: '',
        weight: "",
        // description: '',
        image: [],               // for storing file object
        imagePreview: [],          // for showing preview if needed
        price: '',                 // number input
        stock: ''                  // number input
    });


    // Authentication
    const token = localStorage.getItem('token') ?
        JSON.parse(localStorage.getItem('token')) : null;
    const userRole = localStorage.getItem('role_name') ?
        JSON.parse(localStorage.getItem('role_name')) : null;


    // Fetch Products
    const fetchProducts = async (page = 1, limit = 10, search = '') => {
        setProducts(prev => ({ ...prev, loading: true }));
        try {
            const response = await axios.get(`${baseURL}/api/products`, {
                params: { page, limit, search },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response, "response of products")
            setProducts({
                data: response.data.products || [],
                loading: false,
                totalRows: response.data.total || 0,
                perPage: limit,
                currentPage: page
            });

            return response.data;
        } catch (error) {
            setProducts(prev => ({ ...prev, loading: false }));
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to fetch products'
            });
        }
    };



    // Fetch Categories & Subcategories, then Products
    const fetchInitialData = useCallback(async () => {
        try {
            const [categoriesRes, subCategoriesRes] = await Promise.all([
                axios.get(`${baseURL}/api/maincategory`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${baseURL}/api/category`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setCategories(categoriesRes.data.mainCategories || []);
            setSubCategories(subCategoriesRes.data.categories || []);

            // Fetch products after categories are set
            await fetchProducts(1);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load initial data!'
            });
        }
    }, [token]);

    // Initial Load
    useEffect(() => {
        if (token) {
            fetchInitialData();
        }
    }, [token, fetchInitialData]);


    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchProducts(1, products.perPage, searchTerm);
        }, 400);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, products.perPage]);


    const openModal = (type, product = null) => {
        setModal({
            isOpen: true,
            type,
            selectedProduct: product
        });
        console.log(product, "product")

        if (product) {
            setFormData({
                productName: product?.name || '',
                price: product?.price || '',
                stock: product?.stock || '',
                weight: product?.weight || "",
                // description: product.description || '',
                categoryId: product?.main_category?._id || '',
                subCategoryId: product?.category?._id || '',
                image: [], // clear file input
                imagePreview: Array.isArray(product?.image) ? product.image : []
            });
        } else {
            resetForm();
        }
    };


    const closeModal = () => {
        setModal({ isOpen: false, type: 'add', selectedProduct: null });
        resetForm();
    };
    const resetForm = () => {
        setFormData({
            productName: '',
            price: '',
            stock: '',
            weight: "",
            // description: '',
            categoryId: '',
            subCategoryId: '',
            image: [],
            imagePreview: []
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append('name', formData.productName); // ✅ match backend field "name"
        data.append('main_category', formData.categoryId); // ✅ match backend field "main_category"
        data.append('category', formData.subCategoryId); // Subcategory (if needed by backend)
        // if (formData.description) data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('weight', formData.weight);
        data.append('stock', formData.stock);

        formData.image.forEach((imageFile) => {
            data.append('image', imageFile);
        });

        try {
            const endpoint = modal.type === 'add'
                ? `${baseURL}/api/products`
                : `${baseURL}/api/products/${modal.selectedProduct._id}`;

            const method = modal.type === 'add' ? 'post' : 'put';

            await axios[method](endpoint, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                icon: 'success',
                title: modal.type === 'add' ? 'Product Added' : 'Product Updated',
                showConfirmButton: false,
                timer: 1500,
            });

            closeModal();
            fetchProducts(products.currentPage);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to submit product',
            });
        }
    };


    // Delete/Status Change Handler
    const handleDeleteProduct = async () => {
        try {
            await axios.delete(`${baseURL}/api/products/${modal.selectedProduct._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                icon: 'success',
                title: 'Product Deleted',
                showConfirmButton: false,
                timer: 1500
            });

            closeModal();
            fetchProducts(products.currentPage);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to delete product'
            });
        }
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.image,
            center: true,
            cell: row => {
                const firstImage = Array.isArray(row.image) ? row.image[0] : row.image;

                const imageUrl =
                    firstImage?.startsWith('/uploads') ? `${baseURL}${firstImage}` : firstImage;

                return firstImage ? (
                    <img
                        src={imageUrl}
                        alt={row.productName}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                ) : (
                    'No Image'
                );
            }
        }
        ,
        {
            name: 'Product Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.main_category?.name || 'N/A',
            sortable: true,
        },
        {
            name: 'Sub Category',
            selector: row => row.category?.name || 'N/A',
            sortable: true,
        },
        {
            name: 'Price (₹)',
            selector: row => row.price,
            sortable: true,
            center: true,
        },
        {
            name: 'Stock',
            selector: row => row.stock,
            sortable: true,
            center: true,
        },
        {
            name: 'Weight',
            selector: row => row.weight,
            sortable: true,
            center: true,
        },
        // {
        //     name: 'Description',
        //     selector: row => row.description,
        //     sortable: false,
        //     wrap: true,
        // },
        {
            name: 'Created Date',
            selector: row => moment(row.createdAt).format('DD/MM/YYYY'),
            sortable: true,
            center: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="d-flex">
                    <Button
                        size="sm"
                        className="me-2"
                        onClick={() => openModal('edit', row)}
                    >
                        <Edit size={14} />
                    </Button>
                    {userRole === 'Admin' && (
                        <Button
                            size="sm"
                            onClick={() => openModal('delete', row)}
                        >
                            <Trash2 size={14} />
                        </Button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];


    const filteredSubCategories = useMemo(() => {
        return subCategories.filter(
            sub => sub?.main_category?._id === formData.categoryId
        );
    }, [subCategories, formData.categoryId]);



    const filteredProducts = (products.data || []).filter(item =>
        (item.productName || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Exceeded',
                text: 'You can upload a maximum of 5 images.',
            });
            return;
        }

        const previews = files.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            image: files,
            imagePreview: previews,
        }));
    };

    console.log(formData, "formdata")

    return (
        <div>
            {/* Header and Search */}
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <h4>Products</h4>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '200px' }}
                        />
                        {userRole === 'admin' && (
                            <Button
                                className='btn btn-primary d-flex align-items-center'
                                onClick={() => openModal('add')}
                            >
                                <PlusCircle size={16} className="me-1" /> Add Product
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={filteredProducts}
                progressPending={products.loading}
                progressComponent={<Loader />}
                pagination
                paginationServer
                paginationTotalRows={products.totalRows}
                onChangePage={(page) => fetchProducts(page, products.perPage, searchTerm)}
                onChangeRowsPerPage={(newPerPage, page) => fetchProducts(page, newPerPage, searchTerm)}
            />


            {/* Modal for Add/Edit Product */}
            <Modal centered isOpen={modal.isOpen && ['add', 'edit'].includes(modal.type)} toggle={closeModal} className="store_modal">
                <ModalHeader toggle={closeModal}>
                    {modal.type === 'add' ? 'Add Product' : 'Edit Product'}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Category<span className="text-danger">*</span></Label>
                            <Input
                                type="select"
                                value={formData.categoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        categoryId: e.target.value,
                                        subCategoryId: '' // reset subcategory when category changes
                                    }))
                                }
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>


                        <FormGroup>
                            <Label>Sub Category<span className="text-danger">*</span></Label>
                            <Input
                                type="select"
                                value={formData.subCategoryId}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        subCategoryId: e.target.value,
                                    }))
                                }
                                disabled={!formData.categoryId}
                                required
                            >
                                <option value="">Select Sub Category</option>
                                {filteredSubCategories.map((subCat) => (
                                    <option key={subCat._id} value={subCat._id}>
                                        {subCat.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>


                        <FormGroup>
                            <Label>Product Name<span className="text-danger">*</span></Label>
                            <Input
                                type="text"
                                value={formData.productName}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        productName: e.target.value,
                                    }))
                                }
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Weight<span className="text-danger">*</span></Label>
                            <Input
                                type="text"
                                value={formData.weight}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        weight: e.target.value,
                                    }))
                                }
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Price<span className="text-danger">*</span></Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        price: e.target.value,
                                    }))
                                }
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Stock<span className="text-danger">*</span></Label>
                            <Input
                                type="number"
                                value={formData.stock}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        stock: e.target.value,
                                    }))
                                }
                                required
                            />
                        </FormGroup>

                        {/* <FormGroup>
                            <Label>Description</Label>
                            <Input
                                type="textarea"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </FormGroup> */}

                        <FormGroup>
                            <Label>Images <span className="text-danger">*</span></Label>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                required={modal.type === 'add'}
                            />

                            {formData.imagePreview && formData.imagePreview.length > 0 && (
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {formData.imagePreview.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            style={{ maxWidth: '120px', borderRadius: '8px' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </FormGroup>


                        <Row className="text-center">
                            <Button type="submit">
                                {modal.type === 'add' ? 'Add Product' : 'Update Product'}
                            </Button>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal centered isOpen={modal.isOpen && modal.type === 'delete'} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Delete Product</ModalHeader>

                <Container>
                    <div className="text-center mb-4">

                        <h5>Are you sure you want to delete this product <span className='font-danger'>{modal?.selectedProduct?.productName}</span>?</h5>
                        <p className="text-muted">
                            {/* {modal.selectedProduct.productName} */}
                        </p>
                        <p className="text-danger">
                            This action cannot be undone.
                        </p>
                        <Row className="text-center">
                            <Col xs={6}>
                                <Button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                            </Col>
                            <Col xs={6}>
                                <Button
                                    type="button"
                                    className="btn btn-danger w-100"
                                    onClick={handleDeleteProduct}

                                >
                                    Confirm Delete
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* <ModalFooter>
                    <Button color="danger" onClick={handleDeleteProduct}>
                        Confirm Delete
                    </Button>
                    <Button color="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                </ModalFooter> */}
                </Container>
            </Modal>
        </div>
    );
};

export default ProductsTable;
