import React, { Fragment, useCallback, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Breadcrumbs, Btn, H1, H4, H6, Image, P, Spinner, ToolTip } from '../../../../../AbstractElements';
import { Col, Container, Form, FormGroup, Input, Label, Row, Card, CardBody, TabContent, TabPane, Nav, NavItem, NavLink, Media, Button, DropdownToggle, UncontrolledAccordion, DropdownMenu, DropdownItem, UncontrolledDropdown, CardTitle, CardText, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';
import { MoreVertical, PlusCircle, Trash, ChevronDown, ChevronUp, Upload } from 'react-feather';
import axios from 'axios';
import 'react-dropdown/style.css';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL, imageURL, productBaseURL } from '../../../../../Services/api/baseURL';
import dummyImg from '../../../../../assets/images/product/2.png';
import Loader from '../../../../Loader/Loader';
import CategoryCountCard from '../../../../CategoryCountCard';
import "./style.scss"
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import moment from 'moment';
import { debounce } from 'lodash';

const ViewStore = () => {
  const navigate = useNavigate();
  const { storeName } = useParams();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [selectedRows, setSelectedRows] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [subCollectionData, setSubCollectionData] = useState([])
  const [collectionData, setCollectionData] = useState([])
  const [countData, setCountData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  const [show, setShow] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductVariant, setSelectedProductVariant] = useState(null);
  const [calculatedValue, setCalculatedValue] = useState(1);
  const [stockId, setStockId] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [addLoading, setAddLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      store_id: id,
      category_id: "",
      sub_category_id: "",
      product_id: "",
      // purchase_price: null,
      // selling_price: null,
      // discount: null,
      // gst: null,
      // final_selling_price: null,
      number_of_products: null,
      minimum_qty: null,
      reason_for_inventory: "",
    },
    validationSchema: Yup.object({
      category_id: Yup.string().required('Category is required'),
      sub_category_id: Yup.string().required('Subcategory is required'),
      product_id: Yup.string().required('Product is required'),
      // variant_id: Yup.string().required('Variant is required'),
      // variant_qty : Yup.string().required('Product is required'),
      // purchase_price: Yup.number().moreThan(0, 'Please enter valid purchase price'),
      // selling_price: Yup.number().moreThan(0, 'Please enter valid selling price'),
      // discount: Yup.number().test('maxDiscount', 'Discount cannot be greater than 100', function (value) {
      //   return value <= 100;
      // }),
      // gst: Yup.number().test('maxGST', 'GST cannot be greater than 100', function (value) {
      //   return value <= 100;
      // }).notOneOf([100], 'Tax cannot be 100').required('Tax Rate is required'),
      // final_selling_price: Yup.number().required('Final Selling Price is required'),
      number_of_products: Yup.number().moreThan(0, 'Please enter valid No. of product').required('Product is required'),
      minimum_qty: Yup.number().moreThan(0, 'Please enter valid No. of Quantity').required('Minimum Quantity is required'),
      reason_for_inventory: Yup.string().required('Please select Reason for Inventory'),
    }),
    onSubmit: async (values) => {
      const token = await JSON.parse(localStorage.getItem("token"));
      let resp;
      setAddLoading(true);
      try {
        if (stockId) {
          resp = await axios.patch(`${baseURL}/api/admin/update-stock/${stockId}`, formik.values, {
            headers: {
              Authorization: `${token}`
            }
          });
        }
        else {
          resp = await axios.post(`${baseURL}/api/admin/add-stock`, formik.values, {
            headers: {
              Authorization: `${token}`
            }
          });
        }

        if (resp?.status === 200) {
          Swal.fire({
            icon: "success",
            title: resp?.data?.message
          });
          setShow(false);
          fetchStocksList();
          getCountData();
          setAddLoading(false);
        }
      }
      catch (error) {
        setAddLoading(false);
      }
    }
  });

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleChange = (name, value) => {
    formik.setFieldValue(name, value);
    formik.setFieldValue("product_id", "");
    setSelectedProduct(null);
  }

  const getCountData = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      await axios.get(`${baseURL}/api/admin/get-store-counts/${id}`, {
        headers: {
          Authorization: `${token}`,
        }
      }).then((response) => {
        if (response.status === 200) {
          let updatedData = response?.data?.data;
          setCountData(updatedData[0]);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCategoryList = async () => {
    const token = await JSON.parse(localStorage.getItem("token"))
    try {
      const collectData = await axios.get(`${baseURL}/api/admin/get-collections?page=1&limit=1000`, {
        headers: {
          Authorization: `${token}`,
        }
      });
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

  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"))
    try {
      const products = await axios.get(`${productBaseURL}/products/get-products`, {
        headers: {
          Authorization: `${token}`,
        }
      })
      if (products) {
        setProductsData(products.data.data)
        setIsLoading(false)
      }

    } catch (error) {
      setIsLoading(false)
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchStocksList = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"))
    try {

      let params = {};

      if (subCollectionValue) {
        params = {
          subCategory_id: subCollectionValue
        };
      }
      else if (searchTerm) {
        params = {
          search_string: searchTerm
        }
      }
      else {
        params = {
          category_id: selectedCollectionId
        };
      }

      const resp = await axios.get(`${baseURL}/api/admin/get-stocks-by-storeId/${id}`, {
        params: params,
        headers: {
          Authorization: `${token}`,
        }
      })

      if (resp?.status === 200) {
        setStockData(resp?.data.data);
        console.log(stockData, "Stock")
        setTotalRows(resp?.data?.total);
        setIsLoading(false);
      }

    } catch (error) {
      setIsLoading(false);
      console.log(error, 'error from items getting')
    }
  }

  const handlePageChange = (page) => {
    fetchStocksList(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setIsLoading(true);
    const resp = await axios.get(`${baseURL}/api/admin/get-stocks-by-storeId/${id}?page=${page}&limit=${newPerPage}`, {
      headers: {
        Authorization: `${token}`,
      }
    })
    setStockData(resp?.data.data);
    setPerPage(newPerPage);
    setIsLoading(false);
  };

  useEffect(() => {
    getCountData();
    fetchCategoryList();
    fetchSubcollectionsList();
    fetchItems();
    fetchStocksList();
  }, []);

  const debounceList = debounce(fetchStocksList, 300);

  useEffect(() => {
    debounceList();
  }, [selectedCollectionId, subCollectionValue, searchTerm])

  const handleNavigateEdit = (id) => {
    navigate(`/product/edit/${id}`);
  }

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), []);

  const handleAll = () => {
    setBasicTab(1);
    setSelectedCollectionId(null);
    setSubCollectionValue("");
    fetchStocksList()
  }

  const handleTabs = async (data, index) => {
    setBasicTab(index + 2);
    setSelectedCollectionId(data?._id);
    setSubCollectionValue("");
  }

  const handleSubCollectionChange = (e) => {
    let value = e.target.value;
    setSubCollectionValue(value)
  }

  const handleProductToggle = () => {
    setShowProducts(!showProducts);
  }

  const handleVariantToggle = () => {
    setShowVariants(!showVariants);
  }

  const handleProductData = (data) => {
    setCalculatedValue(null);
    setSelectedProductVariant(null);
    setShowVariants(false);
    formik.setFieldValue('product_id', data?._id);
    setSelectedProduct(data);
    setShowProducts(false);
  }

  const uploadCsv = async (file) => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    const store_id = id
    if (store_id !== undefined || store_id !== "") {
      try {
        const formData = new FormData();
        formData.append('csv', file)
        const res = await axios.post(`${baseURL}/api/csv/import-stock/${store_id}`,
          formData, {
          headers: {
            Authorization: `${token}`,
          }
        })
        if (res) {
          fetchStocksList();
          getCountData();
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err)
        setIsLoading(false)
      }
    }
  }

  const getFilteredData = async (category, subcategory) => {
    // setIsLoading(true);
    // try {
    //   const token = await JSON.parse(localStorage.getItem("token"));

    //   let params = {};

    //   if (subcategory) {
    //     params = {
    //       subcategory: subcategory
    //     };
    //   } else {
    //     params = {
    //       category: category
    //     };
    //   }

    //   const response = await axios.get(`${productBaseURL}/variants/variants`, {
    //     params: params,
    //     headers: {
    //       Authorization: `${token}`,
    //     }
    //   });

    //   if (response?.data?.success) {
    //     setProductsData(response?.data?.data);
    //     setIsLoading(false);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setIsLoading(false);
    // }
  }

  const getEditData = async (stockId) => {
    const token = await JSON.parse(localStorage.getItem("token"));
    if (stockId) {

      try {
        const response = await axios.get(
          `${baseURL}/api/admin/get-stocks-by-stockId/${stockId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 200) {
          let resp = response?.data.data;
          let data = resp;
          data?.category_id && formik.setFieldValue('category_id', data?.category_id);
          data?.sub_category_id && formik.setFieldValue("sub_category_id", data.sub_category_id);
          data?.product_id &&
            formik.setFieldValue("product_id", data.product_id);
          data.number_of_products &&
            formik.setFieldValue("number_of_products", data.number_of_products);
          data.minimum_qty && formik.setFieldValue("minimum_qty", data.minimum_qty);
          data.reason_for_inventory && formik.setFieldValue("reason_for_inventory", data.reason_for_inventory);
          setSelectedProduct(data?.product_info[0])
        }
      } catch (error) {
        console.error(error);
      }
    }
    // setEditData(data);
  };

  const handleModalToggle = () => {
    formik.resetForm();
    setStockId("");
    setSelectedProduct(null);
    setShow(!show)
  }



  // const filteredProducts = productsData.filter(item =>
  //   item?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //   item?.products?.brand?.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //   item?.products?.subCategory?.sub_collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //   item?.products?.tags.some(tag => tag.label.toLowerCase().includes(searchTerm?.toLowerCase()))
  // );

  const filteredProducts = productsData.filter(item => {
    if (formik.values.category_id && formik.values.sub_category_id) {
      return (
        item.category?._id === formik.values.category_id &&
        item.subCategory?._id === formik.values.sub_category_id
      );
    }
    else if (formik.values.category_id) {
      return item.category?._id === formik.values.category_id;
    }
    else {
      return true;
    }
  });

  const handleViewInventoryLog = async(id) => {
    navigate(`/viewInventoryLog/${id}`);
  }

  const deleteStock = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Stock ?`)) {
      try {
        const token = await JSON.parse(localStorage.getItem("token"))
        await axios.delete(`${baseURL}/api/admin/stock/delete/${id}`, {
          headers: {
            Authorization: `${token}`,
          }
        }).then((res) => {
          Swal.fire({
            icon: "success",
            title: res?.data?.message,
          })
          getCountData();
          fetchStocksList();
        })
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  const tableColumns = [
    // {
    //   name: 'PRODUCT ID',
    //   selector: row => row['product_id'],
    //   sortable: true,
    //   center: false,
    // },
    {
      name: 'PRODUCT',
      selector: row => row['product_id'],
      cell: (row) => (
        <>

          <Media className='d-flex'><Image attrImage={{ className: 'img-30 me-3', src: `${row?.product_info[0]?.variants.length > 0 ? imageURL + row?.product_info[0]?.variants[0]?.variantImage : dummyImg}`, alt: 'Generic placeholder image' }} />
            <Media body className="align-self-center">
              <div>{row?.product_info[0]?.productName}</div>
            </Media>
          </Media>
        </>
      ),
      sortable: true,
      center: true,
    },
    {
      name: 'NO. OF PRODUCTS',
      selector: row => row['number_of_products'],
      sortable: true,
      center: false,
    },
    {
      name: 'SUB CATEGORY',
      selector: row => `${row.sub_category_id}`,
      cell: (row) => (
        <>
          {row?.subcategory_info[0]?.sub_collection_name}
        </>
      ),
      sortable: true,
      center: true,
    },
    {
      name: 'CREATED DATE',
      selector: row => `${row.designation}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <>
          {moment(row?.createdAt).format('DD MMM, YYYY')}
        </>
      ),
    },
    {
      name: 'STOCK',
      selector: row => row['priority'],
      cell: (row) => (
        <>
          <span style={{ fontSize: '13px' }} className={row?.number_of_products === 0 ? 'badge badge-light-danger' : row?.number_of_products < row?.quantity ? 'badge badge-light-warning' : 'badge badge-light-success'}>
            {row?.number_of_products === 0 ? 'Out of Stock' : row?.number_of_products < row?.quantity ? 'Low Stock' : 'In-Stock'}
          </span>

        </>
      )
      ,
      sortable: true,
      center: true,
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
                <DropdownItem onClick={() => {
                  getEditData(row?._id);
                  setStockId(row?._id);
                  setShow(true);
                }}>
                  Edit
                  <FaPen />
                </DropdownItem>
                <DropdownItem className='delete_item' onClick={() => deleteStock(row?._id)}>
                  Delete
                  <FaTrashAlt />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      ),
      right: true,
    }
  ];

  return (
    <Fragment>
      <Breadcrumbs mainTitle={storeName !== (undefined || 'undefined') ? storeName : "View Store"} parent='Store' title={storeName !== (undefined || 'undefined') ? storeName : "View Store"} />
      <CategoryCountCard data={countData} />

      <Card>


        <CardBody style={{ padding: '15px' }}>

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
                      collectionData.length > 0 && (
                        collectionData.sort((a, b) =>
                          a.collection_name.localeCompare(b.collection_name)).slice(0, 20).map((data, index) => {
                            return (
                              <>
                                <NavItem key={data?._id}>
                                  <NavLink className={BasicTab === (index + 2) ? 'active' : ''} onClick={() => handleTabs(data, index)}>
                                    {data.collection_name}
                                  </NavLink>
                                </NavItem>
                              </>
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
                    <input className='form-control border-0' onChange={(e) => debouncedHandleSearch(e.target.value)} type='text' placeholder='Search...' />
                  </div>
                  <div className='d-flex'>
                    <Input type='select' className='ms-3' name='subCategory' value={subCollectionValue} onChange={(e) => handleSubCollectionChange(e)} >
                      <option>Select Sub Category</option>
                      {
                        selectedCollectionId ? (
                          subCollectionData.length > 0 && subCollectionData.filter((item) => item?.collection_id?._id === selectedCollectionId).map((data) => {
                            return (
                              <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                            );
                          })
                        ) : (
                          subCollectionData.map((data) => {
                            return (
                              <option key={data?._id} value={data?._id}>{data?.sub_collection_name}</option>
                            );
                          })
                        )
                      }
                    </Input>
                    <Button className='btn btn-primary d-flex align-items-center ms-3' onClick={handleModalToggle}>
                      <PlusCircle />
                      Add New Stock
                    </Button>
                    {/* {
                  userRole === 'admin' && */}
                    <Label htmlFor='csv' className='btn mb-0 btn-primary d-flex align-items-center ms-3 btn btn-secondary'>
                      <Input
                        id='csv'
                        type='file'
                        accept=".csv"
                        className='d-none'
                        onChange={(e) => uploadCsv(e.target.files[0])}
                      />
                      <Upload />
                      Import from CSV
                    </Label>
                    <Button className='btn btn-primary d-flex align-items-center ms-3' onClick={()=>handleViewInventoryLog(id)}>
                      View Inventory Log                        
                    </Button>
                    {/* } */}
                  </div>
                </div>
              </Col>
            </Row>
          </Row>

          <DataTable
            data={stockData || []}
            columns={tableColumns}
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleDelet}
            progressPending={isLoading}
            progressComponent={<Loader />}
            pagination
          // paginationServer
          // paginationTotalRows={totalRows}
          // onChangeRowsPerPage={handlePerRowsChange}
          // onChangePage={handlePageChange}
          />

        </CardBody>

      </Card>


      <Modal isOpen={show} toggle={handleModalToggle} className={"stock_modal"} size='lg' centered>
        <ModalHeader className='d-flex' toggle={handleModalToggle}>
          {stockId ? 'Update Stock' : 'Add Stock'}  {formik.values.number_of_products < formik.values.minimum_qty && <Badge className='ms-2' color="warning">
            Low Stock
          </Badge>}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <Container>
              <Row xxl={12} className='mt-2'>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Category <span className='text-danger'>*</span> </Label>
                    <Input
                      type="select"
                      name='category_id'
                      onChange={(e) => handleChange('category_id', e.target.value)}
                      onBlur={formik.handleBlur}
                      value={formik.values.category_id}
                      invalid={formik.touched.category_id && formik.errors.category_id ? true : false}
                    >
                      <option value="">Select Category</option>
                      {
                        collectionData.length !== 0 && collectionData.map(item => (
                          <>
                            <option key={item?._id} value={item._id} >{item.collection_name}</option>
                          </>
                        ))
                      }
                    </Input>
                    {formik.touched.category_id && formik.errors.category_id ? (
                      <span className="error text-danger">{formik.errors.category_id}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Subcategory <span className='text-danger'>*</span></Label>
                    <Input
                      type="select"
                      name='sub_category_id'
                      onChange={(e) => handleChange('sub_category_id', e.target.value)}
                      // onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.sub_category_id}
                      invalid={formik.touched.sub_category_id && formik.errors.sub_category_id}
                    >
                      <option>Select Sub Category</option>
                      {
                        subCollectionData.length > 0 &&
                        subCollectionData.filter((item => item?.collection_id?._id === formik.values.category_id)).map((data) => {
                          return (
                            <>
                              <option key={data?._id} value={data?._id} >{data?.sub_collection_name}</option>
                            </>
                          )
                        })
                      }
                    </Input>
                    {formik.touched.sub_category_id && formik.errors.sub_category_id ? (
                      <span className="error text-danger">{formik.errors.sub_category_id}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Product <span className='text-danger'>*</span></Label>
                    <div className='position-relative'>
                      <div className='form-control select-product' onClick={() => handleProductToggle()}>
                        {selectedProduct ? (
                          <Row className='product_data mb-0 p-0 border-0'>
                            <Col lg={2}>
                              <div className='product_img'>
                                <img src={selectedProduct?.variants[0]?.variantImage ? imageURL + selectedProduct?.variants[0]?.variantImage : dummyImg} />
                              </div>
                            </Col>
                            <Col lg={10}>
                              <div className='product_text'>
                                {selectedProduct?.productName}
                              </div>
                            </Col>
                          </Row>
                        ) : 'Select Product'}
                        {showProducts ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {
                        showProducts && (
                          <div className='product_wrapper'>
                            {
                              filteredProducts.map((data) => {
                                return (
                                  <>
                                    <Row key={data?._id} className='product_data' onClick={() => handleProductData(data)}>
                                      <Col lg={2}>
                                        <div className='product_img'>
                                          <img src={dummyImg} />
                                        </div>
                                      </Col>
                                      <Col lg={10}>
                                        <div className='product_text'>
                                          {data.productName}
                                        </div>
                                      </Col>
                                    </Row>
                                  </>
                                )
                              })
                            }
                            {
                              filteredProducts.length === 0 && <p className='mb-0 text-center'>No Data Found</p>
                            }
                          </div>
                        )
                      }
                    </div>
                    {formik.touched.product_id && formik.errors.product_id ? (
                      <span className="error text-danger">{formik.errors.product_id}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>

                {/* <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Purchase Price</Label>
                    <InputGroup >
                      <InputGroupText>{'$'}</InputGroupText>
                      <Input className="form-control" name='purchase_price'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.purchase_price}
                        invalid={formik.touched.purchase_price && formik.errors.purchase_price}
                        type="text" placeholder='Enter Purchase Price' aria-label="Amount (to the nearest dollar)" />
                    </InputGroup>
                    {formik.touched.purchase_price && formik.errors.purchase_price ? (
                      <span className="error text-danger">{formik.errors.purchase_price}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Selling Price </Label>
                    <InputGroup >
                      <InputGroupText>{'$'}</InputGroupText>
                      <Input className="form-control" name='selling_price'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.selling_price && formik.errors.selling_price}
                        value={formik.values.selling_price} type="text" placeholder='Enter Selling Price' aria-label="Amount (to the nearest dollar)" />
                    </InputGroup>
                    {formik.touched.selling_price && formik.errors.selling_price ? (
                      <span className="error text-danger">{formik.errors.selling_price}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Discount </Label>
                    <InputGroup >
                      <Input name='discount'
                        min={0}
                        max={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.discount} placeholder='Enter Discount'
                        invalid={formik.touched.discount && formik.errors.discount} />
                      <InputGroupText>{'%'}</InputGroupText>
                    </InputGroup>
                    {formik.touched.discount && formik.errors.discount ? (
                      <span className="error text-danger">{formik.errors.discount}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Tax Rate <span className='text-danger'>*</span></Label>
                    <InputGroup>
                      <Input name='gst'
                        min={0}
                        max={100}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.gst && formik.errors.gst}
                        value={formik.values.gst} placeholder='Enter Tax Rate' />
                      <InputGroupText>{'%'}</InputGroupText>
                    </InputGroup>
                    {formik.touched.gst && formik.errors.gst ? (
                      <span className="error text-danger">{formik.errors.gst}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Final Selling Price <span className='text-danger'>*</span></Label>
                    <InputGroup>
                      <InputGroupText>{'$'}</InputGroupText>
                      <Input disabled className="form-control" name='final_selling_price'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.final_selling_price}
                        invalid={formik.touched.final_selling_price && formik.errors.final_selling_price} type="text" placeholder='Auto Calculated Value' aria-label="Amount (to the nearest dollar)" />
                    </InputGroup>
                    {formik.touched.final_selling_price && formik.errors.final_selling_price ? (
                      <span className="error text-danger">{formik.errors.final_selling_price}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col> */}
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>No. of Product <span className='text-danger'>*</span></Label>
                    <Input placeholder='Enter No. of Product' name='number_of_products'
                      type='number'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.number_of_products}
                      invalid={formik.touched.number_of_products && formik.errors.number_of_products} />
                    {formik.touched.number_of_products && formik.errors.number_of_products ? (
                      <span className="error text-danger">{formik.errors.number_of_products}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className='font-medium text-base'>Required Minimum Quantity <span className='text-danger'>*</span></Label>
                    <Input placeholder='Enter Minimum Quantity'
                      name='minimum_qty'
                      type='number'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.minimum_qty}
                    />
                    {formik.touched.minimum_qty && formik.errors.minimum_qty ? (
                      <span className="error text-danger">{formik.errors.minimum_qty}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Reason for Inventory <span className='text-danger'>*</span> </Label>
                    <Input type='select' name='reason_for_inventory' onChange={formik.handleChange} value={formik.values.reason_for_inventory} onBlur={formik.handleBlur}
                    >
                      <option>Select Reason for Inventory</option>
                      <option value='Stock Received'>Stock Received</option>
                      <option value='Transfer'>Transfer</option>
                      <option value='Damaged'>Damaged</option>
                      <option value='Others'>Others</option>
                    </Input>
                    {formik.touched.reason_for_inventory && formik.errors.reason_for_inventory ? (
                      <span className="error text-danger">{formik.errors.reason_for_inventory}</span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  {
                    selectedProduct && selectedProduct?.variants && selectedProduct?.variants.length > 0 &&
                    <>
                      {
                        <>
                          <Table border responsive>
                            <thead>
                              <tr>
                                <th>
                                  Quantity
                                </th>
                                <th>
                                  Product
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                selectedProduct?.variants.map((data, index) => {
                                  return (
                                    <>
                                      <tr>
                                        <td scope="row">
                                          <span className='quantity_count'>
                                            {data.quantity !== 0 ? (parseInt(formik.values.number_of_products / data.quantity) !== NaN ? parseInt(formik.values.number_of_products / data.quantity) : 0) : 0} *
                                          </span>
                                        </td>
                                        <td>
                                          <div className='d-flex align-items-center'>
                                            <div className='product_img'>
                                              <img style={{ width: '30px', height: '30px' }} src={data?.variantImage ? imageURL + data?.variantImage : dummyImg} />
                                            </div>
                                            <div className='product_text ms-2'>
                                              {data?.variantName}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )
                                })
                              }

                            </tbody>
                          </Table>
                        </>
                      }
                    </>
                  }
                </Col>
              </Row>
            </Container>
            <ModalFooter>
              <Button className='cancel_Btn' onClick={handleModalToggle} >Cancel</Button>
              <Button className='Save_Btn' disabled={addLoading} type='submit'> {stockId ? 'Update Stock' : 'Add Stock'}</Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment >
  )
}
export default ViewStore