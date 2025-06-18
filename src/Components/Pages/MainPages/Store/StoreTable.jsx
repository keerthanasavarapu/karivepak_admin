import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  H6,
  Spinner,
} from "../../../../AbstractElements";
import { spinnerData } from "./data";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Media,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { ArrowRight, MoreHorizontal, PlusCircle } from "react-feather";
import CommonModal from "../../../UiKits/Modals/common/modal";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GOOGLE_MAP_API_KEY, baseURL, imageURL } from "../../../../Services/api/baseURL";
import { useNavigate } from "react-router";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { fromLatLng, setKey } from "react-geocode";
import dummyImg from '../../../../assets/images/product/1.png'
import defaultImage from '../../../../assets/images/defaultImg.svg'
import { FaPen, FaTrashAlt } from "react-icons/fa";
import CreatableSelect from 'react-select/creatable';
import { useDataContext } from "../../../../context/hooks/useDataContext";
import nostore from '../../../../../src/assets/images/nostore.svg';
import { MarginBottom } from "../../../../Constant";
import { suburbsList } from "./suburbsData";

const StoreTable = () => {
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem('role_name'));
  const userData = JSON.parse(localStorage.getItem('UserData'));
  const { storeData, setStoreData } = useDataContext();
  const [searchTerm, setSearchTerm] = useState("");
  // const [storeData, setStoreData] = useState([]);
  const [AddModal, SetAddmodal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [addExcel, setAddExcel] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [zipcodes, setZipCodes] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [zipcodesSubs, setZipCodesSubs] = useState([{ zipcode: "", suburbs: [] }]);



  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const AddModalToggle = () => {
    formik.resetForm();
    setImage("");
    setEditData(null);
    setStoreName();
    setZipCodes([]);
    SetAddmodal(!AddModal);
  };
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleZipCodeChange = (newValue, actionMeta) => {
    // setZipCodes(newValue);
    // formik.setFieldValue('zipCode', newValue);

    if (newValue.length === 0) {
      setZipCodes(newValue);
      formik.setFieldValue('zipCode', newValue);
      return;
    }
    let updatedCodes = getSuburbs(newValue);
    // console.log(updatedCodes, "Updated Codes")
    setZipCodes(updatedCodes);
    formik.setFieldValue('zipCode', updatedCodes);
  };

  const uploadImage = async (event) => {
    let file = event.target.files[0];
    let img = URL?.createObjectURL(file);
    formik.setFieldValue("image", file);
    setImage(img);
  };

  const navigateViewStore = (id, name) => {
    navigate(`/store/${name}/${id}`);
  };

  const formik = useFormik({
    initialValues: {
      storeName: "",
      storeNumber: "",
      storeManager: "",
      phoneNumber: "",
      address: "",
      image: "",
      email: "",
      city: "",
      state: "",
      country: "",
      primary_zip_code: "",
      password: "",
      zipCode: [],
      location: {},
    },
    validationSchema: Yup.object({
      storeName: Yup.string()
        .min(3, "Please enter min 3 characters")
        .required("Required"),
      storeManager: Yup.string()
        .min(3, "Please enter min 3 characters")
        .required("Required"),
      phoneNumber: Yup.string()
        // .min(10, "too short")
        // .max(10, "too long")
        .matches(phoneRegExp, "Phone number is not valid")
        .required("Required"),
      address: Yup.string().required("Required"),
      zipCode: Yup.array().required("Required"),
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
    }),
    onSubmit: async (values) => {
      const token = await JSON.parse(localStorage.getItem("token"));
      try {
        let response;
        const formData = new FormData();
        formik.values.storeName &&
          formData.append("storeName", formik.values.storeName);
        formik.values.storeManager &&
          formData.append("storeManager", formik.values.storeManager);
        formik.values.storeNumber &&
          formData.append("storeNumber", formik.values.storeNumber);
        formik.values.phoneNumber &&
          formData.append("phone", formik.values.phoneNumber);
        formik.values.address &&
          formData.append("storeAddress", formik.values.address);
        formik.values.location &&
          formData.append("location", JSON.stringify(formik.values.location));
        formik.values.image && formData.append("storeImage", formik.values.image);
        formik.values.email && formData.append("email", formik.values.email);
        formik.values.password && formData.append("password", formik.values.password);
        formik.values.city && formData.append("city", formik.values.city);
        formik.values.state && formData.append("state", formik.values.state);
        formik.values.country && formData.append("country", formik.values.country);
        formik.values.primary_zip_code && formData.append("primary_zip_code", formik.values.primary_zip_code)
        // formik.values.zipCode &&
        //   formData.append("zipCode", formik.values.zipCode);
        const newZipCode = formik.values.zipCode.map((code) => {
          const { __isNew__, ...rest } = code;
          return rest;
        });

        formData.append("zipCode", JSON.stringify(newZipCode));

        setLoading(true);

        !storeId
          ? (response = await axios.post(
            `${baseURL}/api/store/add-store`,
            formData,
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          ))
          : (response = await axios.patch(
            `${baseURL}/api/store/update-store/${storeId}`,
            formData,
            {
              headers: {
                Authorization: `${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          ));

        if (response.status === 200) {
          SetAddmodal(!AddModal);
          setStoreId("");
          fetchStores();
          Swal.fire({
            title: response?.data.message,
            icon: "success",
            confirmButtonColor: "#d3178a",
          });
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: error?.response?.data.message,
          icon: "error",
          confirmButtonColor: "#d3178a",
        });
        setLoading(false);
      }
    },
  });

  const fetchStores = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    setIsLoading(true)
    try {
      const stores = await axios.get(`${baseURL}/api/store/get-all-stores`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      // let data = stores?.data?.data.filter((item) => item.status === "active");
      // userRole === 'store' ? data = data.filter((item) => item?._id === userData?._id ) : data;
      // setStoreData(data || []);
      let filteredData = stores?.data?.data
      // .filter((item) => item.status === "active");
      if (userRole === 'store') {
        filteredData = filteredData?.filter((item) => item?._id === userData?._id);
      }
      setStoreData(filteredData || []);
      setIsLoading(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false)

    }
  };

  const getEditData = async (storeId) => {
    const token = await JSON.parse(localStorage.getItem("token"));
    if (storeId) {
      setStoreId(storeId);
      try {
        const response = await axios.get(
          `${baseURL}/api/store/get-store/${storeId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 200) {
          let data = response?.data.data;
          data.storeName && formik.setFieldValue("storeName", data.storeName);
          data.storeNumber &&
            formik.setFieldValue("storeNumber", data.storeNumber);
          data.storeManager &&
            formik.setFieldValue("storeManager", data.storeManager);
          data.phone && formik.setFieldValue("phoneNumber", data.phone);
          data.storeAddress && formik.setFieldValue("address", data.storeAddress);
          data.image && formik.setFieldValue("image", data.image);
          data.zipCode && formik.setFieldValue("zipCode", data.zipCode);
          data?.zipCode && setZipCodes(data.zipCode);
          data?.email && formik.setFieldValue("email", data.email);
          data?.password && formik.setFieldValue("password", data.password);
          data?.city && formik.setFieldValue("city", data.city);
          data?.state && formik.setFieldValue("state", data.state);
          data?.country && formik.setFieldValue("country", data.country);
          data?.primary_zip_code && formik.setFieldValue("primary_zip_code", data.primary_zip_code);
        }
      } catch (error) {
        console.error(error);
      }
    }
    // setEditData(data);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (userRole === 'admin') {
      formik.setFieldValue("password", '123456',  false);
    }
  }, [userRole])

  const inactiveItem = async (item) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You really want to ${item.status === 'inactive' ? 'activate' : 'inactivate'} this store!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    })
    // .then((result) => {
    if (result.isConfirmed) {
      // }
      // });

      // if (
      //   window.confirm(
      //     `Are you sure you want to delete this Store?`
      //   )
      // ) {
      const token = await JSON.parse(localStorage.getItem("token"));
      try {
        // console.log(editData.status)
        const obj = {
          status: editData.status === 'inactive' ? "active" : "inactive"
        };
        //// Obj has no value, changing status in backend

        const res = await axios.patch(
          `${baseURL}/api/store/update-store-status/${item._id}`,
          obj,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res?.status === 200) {
          // Swal.fire({
          //   icon: "success",
          //   title: res?.data?.message
          // });
          Swal.fire({
            title: "Done!",
            // text: `Your store has been made ${res?.data?.data?.status}.`,
            icon: "success"
          });

        }

        fetchStores();
      } catch (err) {
        console.log(err);
      }
    }

  };

  const filteredStore = storeData.filter(
    (item) =>
      !searchTerm ||
      item?.storeName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item?.storeAddress?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const deleteImage = () => {
    formik.setFieldValue("image", "");
    setImage("");
  };
  const handleZipCodeSubChange = (selectedOptions, index) => {
    const updatedZipCodes = [...zipcodes];
    updatedZipCodes[index].suburbs = selectedOptions;
    setZipCodes(updatedZipCodes);
    formik.setFieldValue('zipCode', updatedZipCodes);
  };
  return (
    <Fragment>
      {/* <div className="file-content">
        <Row xxl={12} className="pb-4">
          <H4>Store Places</H4>
          <Row xxl={12}>
            <Col xxl={6}>
              <Form className="search-file form-inline">
                <div className="mb-0 form-group">
                  <i
                    className="fa fa-search "
                    style={{ marginInline: "5px", marginTop: "12px" }}
                  ></i>
                  <input
                    className="form-control form-control-plaintext border-none outline-none focus:outline-none"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search..."
                  />
                </div>
              </Form>
            </Col>
            <Col xxl={6}>
              <Button
                className="d-flex justify-content-center align-items-center rounded-2 bg-primary px-1 cursor-pointer"
                style={{ width: "145px", height: "35px" }}
                onClick={AddModalToggle}
              >
                <PlusSquare size={20} />
                <p style={{ fontSize: "14px", marginLeft: "5px" }}>Add Store</p>
              </Button>
            </Col>
          </Row>
        </Row>
      </div> */}
      <CardHeader className="py-3">
        <Row className="align-items-center">
          <Col lg={6} md={6}>
            {userRole === 'admin' && <h5 className="fw-bolder">Store Places</h5>}
            {userRole === 'store' && <h5 className="fw-bolder">My Store</h5>}

          </Col>
          <Col lg={6} md={6}>
            <div className="file-content">
              <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                <i className='fa fa-search'></i>
                <input className='form-control border-0' value={searchTerm} onChange={(e) => handleSearch(e)} type='text' placeholder='Search...' />
              </div>
              {
                userRole === 'admin' && <Button onClick={AddModalToggle} className='btn btn-primary d-flex align-items-center ms-3' >
                  <PlusCircle />
                  Add New Store
                </Button>
              }
            </div>
          </Col>
        </Row>
      </CardHeader>

      <CardBody>
        {storeData && storeData.length > 0 && (
          <>
            <Col lg="12">
              <Row>
                <Col xl="12" md="12">
                  <Row className="store_card_outer">
                    {
                      filteredStore.map((item, i) => {
                        return (
                          <Col sm={12} md={4} key={i}>
                            <Card className={`store_card ${item.status === 'inactive' && 'inactiveCard'}`}
                            // "store_card"
                            >
                              <CardBody>
                                <Media>
                                  <img className="store_logo_img" src={item.storeImage ? imageURL + item?.storeImage : dummyImg} />
                                  <Media body>
                                    <H6 attrH6={{ className: 'f-w-500' }}>{item.storeName ? item.storeName : "N/A"}
                                      {userRole === 'admin' && <UncontrolledDropdown className='action_dropdown'>
                                        <DropdownToggle className='action_btn'
                                        >
                                          <MoreHorizontal color="#1D2433" />
                                        </DropdownToggle>
                                        {item.status === 'inactive' ?
                                          <DropdownMenu>
                                            <DropdownItem onClick={() => {
                                              setEditData(item);
                                              inactiveItem(item);
                                            }} className='inactive_item'>
                                              Activate
                                            </DropdownItem>
                                          </DropdownMenu>
                                          :
                                          <DropdownMenu>
                                            <DropdownItem onClick={() => {
                                              getEditData(item?._id);
                                              SetAddmodal(true);
                                            }} >
                                              Edit Store Details
                                              <FaPen />
                                            </DropdownItem>
                                            <DropdownItem onClick={() => {
                                              setEditData(item);
                                              inactiveItem(item);
                                            }} className='delete_item text-danger' >
                                              Deactivate
                                              {/* <FaTrashAlt /> */}
                                            </DropdownItem>
                                          </DropdownMenu>}

                                      </UncontrolledDropdown>}
                                    </H6>
                                    {item.status === 'inactive' ?
                                      (<>
                                        <p className="store_text mt-1">{item?.storeAddress ? item?.storeAddress : "N/A"}</p>
                                        <p className="ml-5 text-danger">Currently Inactive</p>
                                      </>)
                                      :
                                      <>
                                        <p className='total_pro' >Total Products: {item.totalStockCount ? item.totalStockCount : 0}  </p>
                                        <p className="store_text">{item?.storeAddress ? item?.storeAddress : "N/A"}</p>
                                        <div className="d-flex justify-content-end">
                                          <Button onClick={() => navigateViewStore(item?._id, item?.storeName)} className="viewStore_btn">View Store <ArrowRight /> </Button>
                                        </div>
                                      </>
                                    }
                                  </Media>
                                </Media>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })
                    }
                  </Row>
                </Col>
              </Row>
            </Col>
          </>
        )
        }

        {
          !isLoading && filteredStore.length === 0 &&
          <>
            <div className="d-flex flex-wrap flex-column w-100 align-items-center">
              <img src={nostore} alt="" />
              <h6 className="mb-0 fw-bolder my-3">No store has been added yet</h6>
              <span className="my-2">Please add a store to proceed.</span>
              <div>
                <Button onClick={AddModalToggle} className='btn btn-primary d-flex align-items-center ms-3' >
                  <PlusCircle height={15} width={15} />
                  <span className="ms-1"> Add New Store</span>
                </Button>
              </div>
            </div>
          </>
        }


        {isLoading && spinnerData.map((spinner) => (

          <Col
            xxl="12"
            key={spinner.id}
            className="flex justify-center items-center"
          >
            <div className="loader-box">
              <Spinner attrSpinner={{ className: spinner.spinnerClass }} />
            </div>
          </Col>

        ))}


      </CardBody>


      <CommonModal
        isOpen={AddModal}
        title={storeId ? "Update Store" : "Add a new Store"}
        toggler={AddModalToggle}
        size="lg"
        className="store_modal"
      >
        <Container>
          <Form onSubmit={formik.handleSubmit}>
            <>
              <Row className="mb-3 align-items-center">
                <Col xl={4}>
                  <div className="d-flex align-items-center store_img_wrapper">
                    <div>
                      <img
                        style={{
                          maxWidth: "100%",
                          borderRadius: "50%",
                          width: "80px",
                          height: "80px",
                        }}
                        src={image ? image : defaultImage}
                      />
                    </div>
                    <div className="ms-2">
                      <h6 className="mb-0">Store Picture</h6>
                      <p className="mb-0">PNG, JPEF & PNG</p>
                    </div>
                  </div>

                </Col>
                <Col xl={8}>
                  <div className="d-flex align-items-center justify-content-end">
                    <label className="upload_label" for="upload">
                      <Input
                        id="upload"
                        type="file"
                        onChange={(e) => uploadImage(e)}
                        accept="image/png, image/gif, image/jpeg"
                      />
                      Upload
                    </label>
                  </div>

                </Col>
              </Row>
              <Row>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Store Name <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="storeName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.storeName}
                    />
                    {formik.touched.storeName && formik.errors.storeName ? (
                      <span className="error text-danger">
                        {formik.errors.storeName}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Store Number
                    </Label>
                    <Input
                      name="storeNumber"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.storeNumber}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Store Manager <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="storeManager"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.storeManager}
                    />
                    {formik.touched.storeManager &&
                      formik.errors.storeManager ? (
                      <span className="error text-danger">
                        {formik.errors.storeManager}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Contact Number <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="phoneNumber"
                      type="number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phoneNumber}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                      <span className="error text-danger">
                        {formik.errors.phoneNumber}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Email <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <span className="error text-danger">
                        {formik.errors.email}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Password <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      readOnly={userRole === 'admin'}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <span className="error text-danger">
                        {formik.errors.password}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  {/* <FormGroup>
                                        <Label className='font-medium text-base'>Store Address <span className='text-danger'>*</span></Label>
                                        <Input
                                            name='address'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.address}
                                        />
                                        {formik.touched.address && formik.errors.address ? (
                                            <span className="error text-danger">{formik.errors.address}</span>
                                        ) : (
                                            ""
                                        )}
                                    </FormGroup> */}
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Store Address <span className="text-danger">*</span>
                    </Label>

                    {AutoComplete(formik, zipcodes, setZipCodes)}

                    {formik.touched.address && formik.errors.address ? (
                      <span className="error text-danger">
                        {formik.errors.address}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </Col>
                <Col xl={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Postcode <span className="text-danger">*</span>
                    </Label>
                    {/* <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      disabled
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values?.zipCode}
                      placeholder="Select Zip Code"
                    >
                    </input> */}
                    <CreatableSelect
                      value={zipcodes}
                      isMulti
                      // options={zipCodeOptions}
                      name='zipCode'
                      onChange={handleZipCodeChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.zipCode && formik.errors.zipCode ? (
                      <span className="error text-danger">
                        {formik.errors.zipCode}
                      </span>
                    ) : (
                      ""
                    )}

                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* Column for labels */}
                {/*  <Col xs="12" style={{fontWeight:"bold"}}>
          <label className="font-medium text-base"> PostCode Labels</label>
          {zipcodes.map((zipcode, index) => (
            <div key={index}>
              <div>{zipcode.label}</div>
              
            </div>
          ))}
        </Col> */}
                {/* Column for CreatableSelect */}
                <Col xs="12">
                  {/*  <label className="font-medium text-base">Suburbs</label> */}
                  {zipcodes.map((zipcode, index) => (
                    <div key={index} style={{ marginBottom: "18px" }}>
                      <CreatableSelect
                        value={zipcode.suburbs}
                        isMulti
                        options={zipcode.suburbs}
                        onChange={(selectedOptions) => handleZipCodeSubChange(selectedOptions, index)}
                        onBlur={formik.handleBlur}
                      />

                    </div>
                  ))}
                </Col>
              </Row>
            </>
            <Row>
              <Col xl={12} className="modal_btm d-flex justify-content-end">
                <Button
                  className="cancel_Btn"
                  onClick={() => SetAddmodal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className=" ms-2"
                >
                  {!loading && (storeId ? "Update Store" : "Add Store")}
                  {loading && (storeId ? "Updating Store" : "Adding Store")}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </CommonModal>
      <CommonModal
        isOpen={deleteModal}
        title=""
        toggler={() => {
          setDeleteModal(!deleteModal);
        }}
        size="md"
      >
        <Container className="flex flex-col justify-center items-center">
          <p>Do You Want To Change Status Of This Item? </p>
          <div className="flex flex-row space-x-8">
            <div
              onClick={() => setDeleteModal(!deleteModal)}
              className="border-1 border-[#ff0000] px-2 py-2 text-[#ff0000] rounded-xl cursor-pointer"
            >
              Cancel
            </div>
            <div
              onClick={inactiveItem}
              className="bg-[#ff0000] px-4 py-2 text-white rounded-xl cursor-pointer"
            >
              Yes
            </div>
          </div>
        </Container>
      </CommonModal>
    </Fragment >
  );
};
export default StoreTable;

const extractDetails = (description) => {
  const regex = /^(.+),\s([A-Z]{2,3})\s(\d{4})$/;
  const match = description.match(regex);

  if (match) {
    const [_, suburb, state, postalCode] = match;
    return { suburb, state, postalCode };
  }
  return { suburb: '', state: '', postalCode: '' };
};

const getSuburbs = (zipCodes) => {
  // console.log(zipCodes, "Pincode11")
  const pincode = zipCodes[zipCodes.length - 1];
  // console.log(zipCodes.pop(), "Pincode")
  // if (pincode.length === 0) {
  //   return [];
  // }
  const suburbsListData = suburbsList.filter((sub) => {
    const { postalCode } = extractDetails(sub);
    // console.log(postalCode, pincode, "PostalCode")
    return postalCode === pincode?.value || 0;
  });
  // console.log(suburbsListData, "Suburbs")
  const suburbOptions = suburbsListData.map((suburb) => ({
    label: suburb,
    value: suburb
  }));

  const updatedZipCodes = [...zipCodes];
  updatedZipCodes[zipCodes.length - 1].suburbs = suburbOptions;
  //   setZipCodes(updatedZipCodes);
  //   formik.setFieldValue('zipCode', updatedZipCodes);
  // console.log(updatedZipCodes, "updated");

  { // Mistaket
    // const newZips = {
    //   label: pincode.value,
    //   value: pincode.value,
    //   suburbs: suburbOptions
    // }
    // const updatedZipCodes = [...zipCodes, newZips];
    // setZipCodes(updatedZipCodes);
    ///// ewrite common fn for both zipCodes and suburbs
  }

  return updatedZipCodes;
  // suburbsListData;
}

const AutoComplete = (formik, zipcodes, setZipCodes,) => {
  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: GOOGLE_MAP_API_KEY,
  });
  setKey(GOOGLE_MAP_API_KEY);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [primaryZipCode, setPrimaryZipCode] = useState("");
  const [suburbs, setSuburbs] = useState([]);

  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "IN" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };
  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );
    if (formik.values.address) {
      setAddress(formik.values.address || '');
    }
  }, []);

  useEffect(() => {
    setAddress(formik.values.address || '');
    setCity(formik.values.city || '');
    setState(formik.values.state || '');
    setCountry(formik.values.country || '');
    setPrimaryZipCode(formik.values.primary_zip_code || "");
  }, [formik.values]);

  const handleChange = (address) => {
    setAddress(address);
    formik.setFieldValue('address', address);
  };

  const extractDetails = (description) => {
    const regex = /^(.+),\s([A-Z]{2,3})\s(\d{4})$/;
    const match = description.match(regex);

    if (match) {
      const [_, suburb, state, postalCode] = match;
      return { suburb, state, postalCode };
    }
    return { suburb: '', state: '', postalCode: '' };
  };

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        getAndSetLocationDetails(latLng.lat, latLng.lng);
      })
      .catch((error) => console.error("Error", error));
  };

  const getAndSetLocationDetails = (newLat, newLng) => {
    fromLatLng(newLat, newLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        formik.setFieldValue("address", address);
        const locationObject = {
          type: "Point",
          coordinates: [response.results[0]?.geometry?.location.lng, response.results[0]?.geometry?.location.lat] // Specify longitude and latitude in the array
        };
        formik.setFieldValue('location', locationObject);
        let city, state, country, pincode;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              case "postal_code":
                pincode = response.results[0].address_components[i].long_name;

                // if(zipcodes.length == 0) {
                //   formik.setFieldValue("zipCode", [{
                //     label: pincode,
                //     value: pincode
                //   }]);
                // }

                if (!zipcodes.find((code) => code.value === pincode)) {
                  // console.log(suburbsList, pincode)

                  const suburbsListData = suburbsList.filter((sub) => {
                    const { postalCode } = extractDetails(sub);
                    return postalCode === pincode;
                  });

                  if (suburbsListData) {
                    const suburbs = suburbsListData || [];
                    // results[0].postcode_localities || [];
                    setSuburbs(suburbs);
                    const suburbOptions = suburbs.map((suburb) => ({
                      label: suburb,
                      value: suburb
                    }));
                    const newZipCode = {
                      label: pincode,
                      value: pincode,
                      suburbs: suburbOptions
                    };
                    const updatedZipCodes = [...zipcodes, newZipCode];
                    setZipCodes(updatedZipCodes);
                    formik.setFieldValue('zipCode', updatedZipCodes);
                  } else {
                    const newZipCode = {
                      label: pincode,
                      value: pincode,
                      suburbs: []
                    };

                    const updatedZipCodes = [...zipcodes, newZipCode];
                    setZipCodes(updatedZipCodes);
                    formik.setFieldValue('zipCode', updatedZipCodes);
                  }
                  // });
                }
                break;
              default:
                break;
            }
          }
        }
        setAddress(address ? address : "");
        setCity(city ? city : "");
        setState(state ? state : "");
        setCountry(country ? country : "");
        formik.setFieldValue("city", city);
        formik.setFieldValue("state", state);
        formik.setFieldValue("country", country);
        formik.setFieldValue("primary_zip_code", pincode);
        formik.values.address = address;
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        className="map-input"
        searchOptions={{ componentRestrictions: { country: 'au' } }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="store_address">
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input w-100 form-control",
              })}
            />
            {
              // 
              suggestions && suggestions.length > 0 &&
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div

                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span className="suggestion_text">{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
};
