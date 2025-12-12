
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
import { FiTrash, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import { baseURL } from '../../../../Services/api/baseURL';
import Loader from '../../../Loader/Loader';
import { FaEye, FaPen, FaTrash, FaTrashAlt } from 'react-icons/fa';
import VariantDetailsView from './VariantDetailsView';


const ProductsTable = () => {
    // State Management
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState({
        data: [],
    });
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0,
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [maincategory, setMainCategory] = useState([]);
    const [selectedVariantForView, setSelectedVariantForView] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    // Tags modal state
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
    const [tagsModalProduct, setTagsModalProduct] = useState(null);
    const [tagsList, setTagsList] = useState([]);
    const [newTagInput, setNewTagInput] = useState('');
    const [tagsSubmitting, setTagsSubmitting] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'add',
        selectedProduct: null
    });
    console.log(modal.selectedProduct, "selected product")

    const [newTag, setNewTag] = useState("");

    const [formData, setFormData] = useState({
        productName: '',
        categoryId: '',
        subCategoryId: '',
        weight: '',
        weightUnit: '',
        quantity: 1,
        description: '',
        productDetails: [],
        image: [],
        imagePreview: [],
        tags: [],
        price: '',
        discountPrice: '',
        stock: ''
    });
    // Authentication
    const token = localStorage.getItem('token') ?
        JSON.parse(localStorage.getItem('token')) : null;
    const userRole = localStorage.getItem('role_name') ?
        JSON.parse(localStorage.getItem('role_name')) : null;

    // Fetch Products
    const fetchProducts = async (page = 1, limit = 10, search = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/products/get-all-prodducts`, {

                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response, "response of products")
            setProducts({
                data: response.data.products || [],
            });
            setPagination(prev => ({
                ...prev,
                totalRows: response?.data?.products?.length
            }));

            return response.data;
        } catch (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to fetch products'
            });
        }
        finally {
            setLoading(false);
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

            await fetchProducts(1);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load initial data!'
            });
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchInitialData();
        }
    }, [token, fetchInitialData]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchProducts(pagination?.page);
        }, 400);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, pagination?.page]);

    const openModal = (type, product = null) => {
        setModal({ isOpen: true, type, selectedProduct: product });

        if (product) {
            const weightMatch = /^(\d+)([a-zA-Z]+)$/.exec(product.weight);
            const weight = weightMatch ? weightMatch[1] : '';
            const weightUnit = weightMatch ? weightMatch[2] : '';

            setFormData({
                productName: product?.name || '',
                price: product?.price || '',
                discountPrice: product?.discountPrice || '',
                stock: product?.stock || '',
                weight,
                weightUnit,
                quantity: product?.quantity || 1,
                description: product?.description || '',
                categoryId: product?.main_category?._id || '',
                subCategoryId: product?.category?._id || '',
                image: [],
                imagePreview: Array.isArray(product?.image) ? product.image : [],
                tags: product.tags || []
            });

            if (product?.itemDetails) {
                try {
                    const parsed = JSON.parse(product.itemDetails);
                    if (Array.isArray(parsed)) setProductDetails(parsed);
                } catch (err) {
                    console.warn('Failed to parse itemDetails:', err);
                }
            }
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
            discountPrice: '',
            stock: '',
            weight: '',
            weightUnit: '',
            quantity: 1,
            description: '',
            categoryId: '',
            subCategoryId: '',
            image: [],
            imagePreview: [],
            tags: []
        });
        setProductDetails([{ id: Date.now(), details: [{ id: Date.now() + 1, key: '', value: '' }] }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validate description
        if (!formData.description?.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Description',
                text: 'Product description is required.'
            });
            return;
        }

        // ✅ Flatten and validate productDetails
        const flatDetails = productDetails
            .filter(detail => detail.key?.trim() && detail.value?.trim());

        // if (flatDetails.length === 0) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Missing Product Details',
        //         text: 'Please add at least one product detail (key + value).'
        //     });
        //     return;
        // }

        // ✅ Prepare FormData
        const data = new FormData();
        data.append('name', formData.productName);
        data.append('main_category', formData.categoryId);
        data.append('category', formData.subCategoryId);
        data.append('description', formData.description.trim());
        data.append('price', formData.price);
        data.append('discountPrice', formData.discountPrice);
        data.append('stock', formData.stock);
        data.append('weight', `${formData.weight}${formData.weightUnit}`);
        data.append('quantity', formData.quantity);
        data.append('itemDetails', JSON.stringify(flatDetails));
        data.append('tags', JSON.stringify(formData.tags));

        // ✅ Add images to FormData
        formData.image.forEach((file) => {
            data.append('image', file);
        });

        try {
            const endpoint = modal.type === 'add'
                ? `${baseURL}/api/products`
                : `${baseURL}/api/products/${modal.selectedProduct._id}`;

            const method = modal.type === 'add' ? 'post' : 'put';

            await axios[method](endpoint, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: modal.type === 'add' ? 'Product Added' : 'Product Updated',
                showConfirmButton: false,
                timer: 1500
            });

            closeModal();
            fetchProducts(pagination.page);
        } catch (error) {
            console.error('Submit Error:', error);

            if (error.response?.status === 413) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Image size must be less than 5MB.'
                });
                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to submit product'
            });
        }
    };


    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const handleToggleStatus = async () => {
        try {
            setLoading(true);

            const newStatus = !modal?.selectedProduct?.isActive;

            await axios.put(
                `${baseURL}/api/products/${modal.selectedProduct._id}/status`,
                { isActive: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}` // pass token in header
                    }
                }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Product ${newStatus ? "activated" : "deactivated"} successfully`,
                timer: 1500,
                showConfirmButton: false
            });

            closeModal();
            fetchProducts();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update product status"
            });
        } finally {
            setLoading(false);
        }
    };



    // Tags modal handlers
    const openTagsModal = (product) => {
        setTagsModalProduct(product);
        setTagsList(Array.isArray(product?.tags) ? product.tags : []);
        setNewTagInput('');
        setIsTagsModalOpen(true);
    };

    const closeTagsModal = () => {
        setIsTagsModalOpen(false);
        setTagsModalProduct(null);
        setTagsList([]);
        setNewTagInput('');
    };

    const handleAddTagFromInput = () => {
        const val = (newTagInput || '').trim();
        if (!val) return;
        setTagsList(prev => prev.includes(val) ? prev : [...prev, val]);
        setNewTagInput('');
    };

    const handleRemoveTagAt = (index) => {
        setTagsList(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitTags = async () => {
        if (!tagsModalProduct) return;
        setTagsSubmitting(true);
        try {
            await axios.post(`${baseURL}/api/products/${tagsModalProduct._id}/tags`, { tags: tagsList }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({ icon: 'success', title: 'Tags added', timer: 1400, showConfirmButton: false });
            closeTagsModal();
            fetchProducts(pagination.page);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to add tags' });
        } finally {
            setTagsSubmitting(false);
        }
    };

    const columns = [
        {
            name: 'Image',
            selector: row => row.image,
            center: true,
            cell: row => {
                const firstImage = Array.isArray(row.image) ? row.image[0] : row.image;
                const imageUrl = firstImage?.startsWith('/uploads') ? `${baseURL}${firstImage}` : firstImage;

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
        },
        {
            name: 'Product Name',
            selector: row => row.name,
            cell: row => (
                <span
                    className="text-inherit hover:text-blue-600 hover:underline hover:cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        setSelectedVariantForView(row);
                        setIsViewModalOpen(true);
                    }}
                >
                    {row.name}
                </span>
            ),
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
            name: 'Discount Price (₹)',
            selector: row => row.discountPrice,
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
        {
            name: 'Description',
            sortable: false,
            wrap: true,
            cell: row => (
                <div className="line-clamp-2 max-w-xs text-sm text-gray-700">
                    {row.description}
                </div>
            )
        },


        {
            name: 'Created Date',
            selector: row => moment(row.createdAt).format('DD/MM/YYYY'),
            sortable: true,
            center: true,
        },
        {
            name: 'Deleted',
            selector: (row) => row.isActive,
            cell: row => (
                <div className={`p-2 rounded-lg text-semibold ${row?.isActive ? "bg-blue-500" : "bg-red-500"}`}>
                    {row.isActive ? "Active" : "In Active"}
                </div>
            ),
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <div
                    className="d-flex justify-content-end align-items-center"
                    style={{ marginRight: "20px" }}
                >
                    <div className="cursor-pointer">
                        <UncontrolledDropdown className="action_dropdown">
                            <DropdownToggle className="action_btn">
                                <MoreVertical color="#000" size={16} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem
                                    onClick={() => {
                                        setSelectedVariantForView(row);
                                        setIsViewModalOpen(true);
                                    }}>
                                    View
                                    <FaEye />
                                </DropdownItem>
                                <DropdownItem onClick={() => openTagsModal(row)}>
                                    Add Tags
                                    <FaPen />
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => openModal('edit', row)}
                                >
                                    Update
                                    <FaPen />
                                </DropdownItem>
                                <DropdownItem
                                    className="delete_item"
                                    onClick={() => openModal('toggleStatus', row)}
                                >
                                    {row?.isActive ? "Mark as Inactive" : "Mark as Active"}
                                </DropdownItem>

                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </div>
            ),
            right: true,
        },
    ];

    const filteredSubCategories = useMemo(() => {
        return subCategories.filter(
            sub => sub?.main_category?._id === formData.categoryId
        );
    }, [subCategories, formData.categoryId]);

    const filteredProducts = (products.data || []).filter(item =>
        (item.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    const handleImageUpload = async (e) => {
        const newFiles = Array.from(e.target.files);

        const existingCount = formData.image?.length || 0;
        const totalCount = existingCount + newFiles.length;

        // 🔥 Validate total count
        if (totalCount > 5) {
            Swal.fire({
                icon: "warning",
                title: "Limit Exceeded",
                text: `You can upload max 5 images.
Current images: ${existingCount}
Trying to upload: ${newFiles.length}`,
            });
            return;
        }

        // Image compression function
        const compressImage = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;

                    img.onload = () => {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        const MAX_WIDTH = 1000;
                        const scaleSize = MAX_WIDTH / img.width;

                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;

                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob(
                            (blob) => {
                                resolve(new File([blob], file.name, { type: file.type }));
                            },
                            file.type,
                            0.6
                        );
                    };
                };
            });
        };

        // Compress all new images
        const compressedFiles = await Promise.all(newFiles.map((file) => compressImage(file)));

        const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            image: [...prev.image, ...compressedFiles],
            imagePreview: [...prev.imagePreview, ...newPreviews],
        }));
    };


    const handleRemoveImage = (index) => {
        setFormData(prev => {
            const updatedImages = [...prev.image];
            const updatedPreviews = [...prev.imagePreview];

            updatedImages.splice(index, 1);
            updatedPreviews.splice(index, 1);

            return {
                ...prev,
                image: updatedImages,
                imagePreview: updatedPreviews
            };
        });
    };



    const [productDetails, setProductDetails] = useState([{ key: '', value: '' },]);

    const handleChange = (index, field, value) => {
        setProductDetails((prev) =>
            prev.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            )
        );


    };

    const handleAddDetail = () => {
        setProductDetails((prev) => [...prev, { key: '', value: '' }]);
    };

    const handleDeleteDetail = (index) => {
        setProductDetails((prev) => prev.filter((_, i) => i !== index));
    };


    console.log(formData, "formdataa")

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
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                progressPending={loading}
                progressComponent={<Loader />}
            />


            {/* Modal for Add/Edit Product */}
            <Modal
                centered
                isOpen={modal.isOpen && ['add', 'edit'].includes(modal.type)}
                toggle={closeModal}
                className="store_modal"
                size="lg"
            >
                <ModalHeader toggle={closeModal}>
                    {modal.type === 'add' ? 'Add Product' : 'Edit Product'}
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={onFormSubmit}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Category <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        type="select"
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                categoryId: e.target.value,
                                                subCategoryId: '',
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
                            </Col>

                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Sub Category <span className="text-danger">*</span>
                                    </Label>
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
                            </Col>
                        </Row>


                        <FormGroup>
                            <Label>
                                Product Name <span className="text-danger">*</span>
                            </Label>
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
                            <Label>
                                Weight <span className="text-danger">*</span>
                            </Label>
                            <div className="d-flex gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="Enter weight"
                                    value={formData.weight}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            weight: e.target.value,
                                        }))
                                    }
                                    required
                                />
                                <Input
                                    type="select"
                                    value={formData.weightUnit}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            weightUnit: e.target.value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select Unit</option>
                                    <option value="g">grams</option>
                                    <option value="kg">kgs</option>
                                    <option value="ml">ml</option>
                                    <option value="L">L</option>
                                </Input>
                            </div>
                        </FormGroup>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Price <span className="text-danger">*</span>
                                    </Label>
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

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Discount Price
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                discountPrice: e.target.value,
                                            }))
                                        }

                                    />
                                </FormGroup>

                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Stock <span className="text-danger">*</span>
                                    </Label>
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
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>
                                        Tags
                                    </Label>



                                    <div className="d-flex">
                                        <Input
                                            type="text"
                                            placeholder="Enter tag"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            className="ms-2"
                                            onClick={() => {
                                                if (!newTag.trim()) return;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    tags: [...prev.tags, newTag.trim()]
                                                }));
                                                setNewTag("");
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="d-flex gap-2 mt-4 flex-wrap">
                                        {formData.tags?.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="badge bg-light text-dark d-inline-flex align-items-center"
                                                style={{ padding: "6px 8px" }}
                                            >
                                                <span className="me-2">{tag}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link p-0"
                                                    onClick={() =>
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            tags: prev.tags.filter((_, i) => i !== index)
                                                        }))
                                                    }
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup>
                            <Label>
                                Description <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="textarea"
                                rows="4"
                                placeholder="Enter product description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                required
                            />
                        </FormGroup>


                        {/* Product Details Section */}
                        <FormGroup className="mt-4">
                            <Row className="align-items-center mb-3">
                                <Col md={6}>
                                    <Label className="fw-bold mb-0">
                                        Product Details
                                    </Label>
                                </Col>
                                <Col md={6} className="text-end">
                                    <Button
                                        type="button"
                                        className="d-flex align-items-center ms-auto"
                                        size="sm"
                                        onClick={handleAddDetail}
                                    >
                                        <FiPlus className="me-1" /> Add Row
                                    </Button>
                                </Col>
                            </Row>


                            {productDetails.map((detail, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-2 mb-2">
                                    {/* Title input */}
                                    <div className="w-full md:w-5/12">
                                        <Input
                                            type="text"
                                            placeholder="Enter Title"
                                            value={detail.key}
                                            onChange={(e) => handleChange(index, 'key', e.target.value)}

                                        />
                                    </div>

                                    {/* Description input */}
                                    <div className="w-full md:w-5/12">
                                        <Input
                                            type="text"
                                            placeholder="Enter Description"
                                            value={detail.value}
                                            onChange={(e) => handleChange(index, 'value', e.target.value)}

                                        />
                                    </div>

                                    {/* Delete Button */}
                                    <div className="w-full md:w-1/12 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDetail(index)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs p-1 rounded w-9 h-8 flex items-center justify-center"
                                        >
                                            <FiTrash size={12} />
                                        </button>
                                    </div>
                                </div>

                            ))}
                        </FormGroup>



                        <FormGroup>
                            <Label>
                                Images <span className="text-danger">*</span>
                            </Label>
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
                                        <div key={index} style={{ position: "relative" }}>
                                            <img
                                                src={preview}
                                                alt={`Preview ${index}`}
                                                style={{ maxWidth: "120px", borderRadius: "8px" }}
                                            />

                                            {/* ❌ Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: "absolute",
                                                    top: "-5px",
                                                    right: "-5px",
                                                    background: "red",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "22px",
                                                    height: "22px",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    lineHeight: "22px"
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </FormGroup>

                        <Row className="text-center p-2">
                            <Button type="submit">
                                {modal.type === 'add' ? 'Add Product' : 'Update Product'}
                            </Button>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Modal for Add Tags */}
            <Modal
                centered
                isOpen={isTagsModalOpen}
                toggle={closeTagsModal}
                className="store_modal"
                size="md"
            >
                <ModalHeader toggle={closeTagsModal}>Add Tags</ModalHeader>
                <ModalBody>
                    <div className="mb-2">
                        <Label className="fw-bold">Product</Label>
                        <div>{tagsModalProduct?.name || '—'}</div>
                    </div>

                    <div className="mb-3">
                        <Label className="fw-bold">Tags</Label>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {(!tagsList || tagsList.length === 0) && <div className="text-muted">No tags</div>}
                            {(tagsList || []).map((t, i) => (
                                <div key={i} className="badge bg-light text-dark d-inline-flex align-items-center" style={{ padding: '6px 8px' }}>
                                    <span className="me-2">{t}</span>
                                    <button type="button" className="btn btn-sm btn-link p-0" onClick={() => handleRemoveTagAt(i)}>×</button>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex">
                            <Input type="text" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} placeholder="Enter tag" />
                            <Button type="button" className="ms-2" onClick={handleAddTagFromInput}>Add</Button>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeTagsModal}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmitTags} disabled={tagsSubmitting}>{tagsSubmitting ? 'Saving...' : 'Submit'}</Button>
                </ModalFooter>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal centered isOpen={modal.isOpen && modal.type === 'toggleStatus'} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>
                    {modal?.selectedProduct?.isActive ? "Mark as Inactive" : "Mark as Active"}
                </ModalHeader>

                <Container>
                    <div className="text-center mb-4">
                        <h5>
                            Are you sure you want to
                            <span className="font-danger">
                                {modal?.selectedProduct?.isActive ? " deactivate " : " activate "}
                            </span>
                            the product
                            <span className="font-danger">{modal?.selectedProduct?.productName}</span>?
                        </h5>

                        <p className="text-danger">This action will update product status.</p>

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
                                <button
                                    type="button"
                                    className="btn btn-red w-100"
                                    onClick={handleToggleStatus}
                                    style={{ backgroundColor: '#dc3545', color: '#fff' }}
                                    disabled={loading}
                                >
                                    Confirm
                                </button>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </Modal>


            <Modal
                isOpen={isViewModalOpen}
                toggle={() => setIsViewModalOpen(false)}
                size="lg"
            >
                <ModalHeader toggle={() => setIsViewModalOpen(false)}>
                    Product Details
                </ModalHeader>
                <ModalBody>
                    {selectedVariantForView && (
                        <VariantDetailsView
                            variantId={selectedVariantForView._id}
                            token={token}
                            onEdit={(variant) => {
                                setIsViewModalOpen(false);
                                openModal('edit', variant);
                            }}
                            onDelete={(variant) => {
                                setIsViewModalOpen(false);
                                openModal('delete', variant);
                            }}
                        />
                    )}
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ProductsTable;
