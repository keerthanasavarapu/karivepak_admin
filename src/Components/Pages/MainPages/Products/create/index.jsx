import React, { Fragment, useEffect, useState } from 'react'
import { Breadcrumbs, H3 } from '../../../../../AbstractElements'
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import CreatableSelect from 'react-select/creatable';
import { Table } from '../../../../Table';
import axios from 'axios';
import { baseURL, productBaseURL } from '../../../../../Services/api/baseURL';
import { useFormik } from 'formik';
import { useProductVariantContext } from '../../../../../context/hooks/useProductVariant';
// import { options, options2, options3, options4 } from './OptionDatas';
import * as Yup from 'yup'; // Import Yup for validation
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router';

function CreateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, setData, setOriginalData } = useProductVariantContext();
    const [collectionData, setCollectionData] = useState([]);
    const [subCollectionData, setSubCollectionData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isDarkMode = localStorage.getItem("mix_background_layout")

    const lightModeColors = {
        primary: '#007bff',
        secondary: '#6c757d',
        text: '#212529',
        background: '#ffffff',
    };

    const darkModeColors = {
        primary: '#0d6efd',
        secondary: '#3F444D',
        text: 'white',
        background: '#262932',
    };

    const colors = (isDarkMode === 'dark-only') ? darkModeColors : lightModeColors;

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: colors.background,
            borderColor: colors.secondary,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? colors.primary : colors.background,
            color: state.isSelected ? colors.text : colors.text,
        }),
    };


    useEffect(() => {
        UserData();
        setData([
            {
                variantCode: '',
                variantImage: '',
                // sellingPrice: 0,
                purchasePrice: 0,
                quantity: 0,
                // discount: 0,
                // finalSellingPrice: 0,
                isTopSellingProduct: false,
                vol: "",
                offers: [],
                alcohol_percentage: 0,
                isOfferApplied: false,
                status: "active",
                label: "none",
                description : ""
            }
        ]);
        setOriginalData([{
            variantCode: '',
            variantImage: '',
           // sellingPrice: 0,
            purchasePrice: 0,
            quantity: 0,
           // discount: 0,
           // finalSellingPrice: 0,
            isTopSellingProduct: false,
            vol: "",
            alcohol_percentage: 0,
            isOfferApplied: false,
            offers: [],
            status: "active",
            label: "",
            description : ""
        }]);
    }, [])

    const UserData = async () => {
        const token = await JSON.parse(localStorage.getItem('token'));
        setToken(token)
    }

    const validationSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        // subCategory: Yup.string().required('Subcategory is required'),
        brand: Yup.string().required('Brand is required'),
        productName: Yup.string().required('Product Name is required'),
        description: Yup.string()
            .required('Product Description is required')
            .min(80, 'Product Description must be at least 80 characters'),
        // tags: Yup.array().min(1, 'At least one tag is required'),
    });

    const formik = useFormik({
        initialValues: {
            category: "",
            subCategory: "",
            brand: "",
            productName: "",
            description: "",
            tags: [],
            variants: data
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values, "values")
            try {

                if (values.tags) {
                    const changedTags = values.tags.map(item => ({
                        value: item.value,
                        tag: (item.label !== undefined) ? item.label : item.value
                    }));
                    // tag: item.label ? item.label : item.value
                    // if (changedTags)
                    // values.tags = changedTags
                    values.tags = changedTags
                }
                // console.log(values, "val")
                if (values.variants.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'At least one variant must be added',
                    });
                    return;
                }

                const isEmptyVariant = values.variants.some(variant => {
                    return Object.values(variant).some(value => value === '');
                });

                if (isEmptyVariant) {
                    Swal.fire({
                        icon: 'error',
                        title: 'All variant fields must be filled',
                    });
                    return;
                }

                setIsLoading(true);

                let res;
                if (id) {
                    let data = values?.variants;
                    let obj = {
                        variantCode: data?.variantCode,
                        variantName: data?.variantName,
                       // // sellingPrice: data?.sellingPrice,
                        purchasePrice: data?.purchasePrice,
                        quantity: data?.quantity,
                        //// discount: data?.discount,
                      //  // finalSellingPrice: data?.finalSellingPrice,
                    }

                    if (data?.variantImage) {
                        obj.VariantImage = data?.variantImage;
                    }
                    res = await axios.patch(`${productBaseURL}/products/update-product/${id}`, formik.values, {
                        headers: {
                            Authorization: `${token}`,
                        }
                    });
                }
                else {
                    res = await axios.post(`${productBaseURL}/products/add`, formik.values, {
                        headers: {
                            Authorization: `${token}`,
                        }
                    });
                }

                if (res?.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: res?.data?.message
                    })

                    navigate('/products');
                    formik.resetForm();
                    setSelectedTags([])
                    setData([])
                    setOriginalData([]);
                    setIsLoading(false);
                }
            }
            catch (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.message?.details[0]?.message
                })
                console.error(error);
                setIsLoading(false);
            }
        }
    });

    const colourOptions = [
        { value: 'Blended', label: 'Blended', },
        { value: 'Scotch', label: 'Scotch' },
        { value: 'Spirit', label: 'Spirit' },
        { value: 'Whisky', label: 'Whisky' },
        { value: 'Wines', label: 'Wines' },
        { value: 'White Wine', label: 'White Wine' },
        { value: '10 Pack', label: '10 Pack' },
        { value: 'Bourbon Mix', label: 'Bourbon Mix' },
        { value: 'White Wine', label: 'White Wine' },
        { value: 'International Beer', label: 'International Beer' },
        { value: 'Lager', label: 'Lager' },
        { value: 'Rum', label: 'Rum' },
    ];

    const fetchCategoryList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`,
                }
            })
            let data = collectData?.data?.data.filter((item) => item.status === "active")
            setCollectionData(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubcollectionsList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const response = await axios.get(`${baseURL}/api/admin/get-sub-collections?page=1&limit=1000`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            let data = response?.data?.data.filter((item) => item.status === "active")
            setSubCollectionData(data)

        } catch (error) {
            console.log(error)
        }
    }

    const fetchBrandList = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const response = await axios.get(`${baseURL}/api/brand/get-brand`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (response.data.success) {
                setBrandData(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategoryList();
        fetchSubcollectionsList();
        fetchBrandList();

        if (id) {
            getEditVariantData();
        }

    }, []);

    useEffect(() => {
        formik.setValues({
            ...formik.values,
            variants: data
        });
    }, [data]);

    const handleTagsChange = (newValue, actionMeta) => {
        setSelectedTags(newValue);
        formik.setFieldValue('tags', newValue);
    };

    const handleReset = () => {
        formik.resetForm();
        setSelectedTags([])
        setData([])
        setOriginalData([])
    }

    const getEditVariantData = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const response = await axios.get(`${productBaseURL}/products/get-product/${id}`, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            if (response?.data?.success) {
                let data = response?.data?.data;
                // console.log(data, "data");
                if (data[0]) {
                    formik.setFieldValue("category", data[0]?.category?._id);
                    formik.setFieldValue("subCategory", data[0]?.subCategory?._id);
                    formik.setFieldValue("brand", data[0]?.brand?._id);
                    formik.setFieldValue("productName", data[0]?.productName);
                    formik.setFieldValue("description", data[0]?.description);
                    formik.setFieldValue("tags", data[0]?.tags);
                    const changedTags = data[0].tags.map(item => ({
                        value: item.value,
                        label: item.tag
                    }));

                    // console.log(changedTags, "changed tags")
                    setSelectedTags(changedTags)
                    // setSelectedTags((data[0]?.tags) ? {

                    //     value: data[0].tags.value,
                    //     label: data[0].tags.tag,
                    // } : null);
                    // console.log(selectedTags, "selectedTags")
                    setData(data[0]?.variants);
                    setOriginalData(data[0]?.variants);
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    // console.log("formik values", formik.values);

    return (
        <Fragment>
            <Form className='theme-form product-form' onSubmit={formik.handleSubmit}>
                <Container fluid={true}>
                    <div className='page-title'>
                        <Row>
                            <Col xs='6'>
                                <H3>{id ? "Update Product" : "Add a New Product"}</H3>
                            </Col>
                            <Col xs='6'>
                                <div className='text-right'>
                                    {!id && <Button onClick={() => handleReset()} className='me-3 reset_btn'>Reset All</Button>}
                                    <Button className='save_btn' type='submit' >{!isLoading && (id ? "Update Details" : "Save Details")}
                                        {isLoading && (id ? "Updating..." : "Saving...")}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
                <Container fluid={true}>
                    <Row>
                        <Col sm='12'>
                            <Card>
                                <CardBody>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Product Name <span className='text-danger'>*</span> </Label>
                                                <Input type='text' placeholder='Enter Product Name' name='productName' onChange={formik.handleChange} value={formik.values.productName} onBlur={formik.handleBlur}>
                                                </Input>
                                                {formik.touched.productName && formik.errors.productName ? (
                                                    <span className="error text-danger">{formik.errors.productName}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Brand <span className='text-danger'>*</span> </Label>
                                                <Input type='select' name='brand' onChange={formik.handleChange} value={formik.values.brand} onBlur={formik.handleBlur}>
                                                    <option>Select Brand</option>
                                                    {
                                                        brandData.length > 0 &&
                                                        brandData.map((data) => {
                                                            return (
                                                                <>
                                                                    <option key={data?._id} value={data?._id}>{data?.brandName}</option>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                {formik.touched.brand && formik.errors.brand ? (
                                                    <span className="error text-danger">{formik.errors.brand}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Category <span className='text-danger'>*</span> </Label>
                                                <Input type='select' name='category' onChange={formik.handleChange} value={formik.values.category} onBlur={formik.handleBlur}
                                                >
                                                    <option>Select Category</option>
                                                    {
                                                        collectionData.length > 0 &&
                                                        collectionData.map((data) => {
                                                            return (
                                                                <>
                                                                    <option key={data?._id} value={data?._id}>{data?.collection_name}</option>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                                {formik.touched.category && formik.errors.category ? (
                                                    <span className="error text-danger">{formik.errors.category}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </FormGroup>
                                        </Col>
                                        {
                                            formik.values.category && (
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label>Subcategory <span className='text-danger'>*</span> </Label>
                                                        <Input type='select' name='subCategory' onChange={formik.handleChange} value={formik.values.subCategory} onBlur={formik.handleBlur}>
                                                            <option>Select Sub Category</option>
                                                            {
                                                                subCollectionData.length > 0 &&
                                                                subCollectionData.filter((item => item?.collection_id?._id === formik.values.category)).map((data) => {
                                                                    return (
                                                                        <>
                                                                            <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </Input>
                                                        {formik.touched.subCategory && formik.errors.subCategory ? (
                                                            <span className="error text-danger">{formik.errors.subCategory}</span>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                            )
                                        }


                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Product Description <span className='text-danger'>*</span> </Label>
                                                <Input type='textarea' rows={4} placeholder='Enter Product Description' name='description' onChange={formik.handleChange} value={formik.values.description} onBlur={formik.handleBlur}>
                                                </Input>
                                                {formik.touched.description && formik.errors.description ? (
                                                    <span className="error text-danger">{formik.errors.description}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className='tags_div'>
                                                <Label className="col-form-label">Tags
                                                    {/* <span className='text-danger'>*</span> */}
                                                </Label>
                                                <CreatableSelect className='my-select' isMulti options={colourOptions} value={selectedTags}
                                                    name='tags' onChange={handleTagsChange} styles={customStyles} onBlur={formik.handleBlur} />
                                                {/* {
                                                        colourOptions.map((data) => (
                                                            <span>{data.label}</span>
                                                        ))
                                                    } */}
                                                {/* {formik.touched.tags && formik.errors.tags ? (
                                                    <span className="error text-danger">{formik.errors.tags}</span>
                                                ) : (
                                                    ""
                                                )} */}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>

                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row >
                        <Col sm='12'>
                            <div className='mb-5'>
                                <Table />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </Fragment>
    )
}

export default CreateProduct
