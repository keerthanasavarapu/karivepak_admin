import React, { Fragment, useCallback, useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component';
import { Spinner } from '../../../../AbstractElements';
import { Button, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Media, Nav, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap';
import { MoreVertical, PlusCircle } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal'
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { GOOGLE_MAP_API_KEY, baseURL, imageURL } from '../../../../Services/api/baseURL';
import dummyImg from '../../../../assets/images/product/2.png';
import { Image } from '../../../../AbstractElements';
import { FaPen } from 'react-icons/fa';
import defaultImage from '../../../../assets/images/defaultImg.svg'
import Select from 'react-select';
import { debounce } from 'lodash';
import Loader from '../../../Loader/Loader';
import addstore from '../../../../assets/images/Add Photo.svg'
import crossicon from '../../../../assets/images/cross.svg';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { fromLatLng, setKey } from 'react-geocode';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]

function RoleManagementTable() {
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: GOOGLE_MAP_API_KEY,
    });
    setKey(GOOGLE_MAP_API_KEY);
    const [selectedRows, setSelectedRows] = useState([]);
    const [stores, setStores] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [editData, setEditData] = useState();
    const [data, setData] = useState([]);
    const [selectedStore, setSelectedStore] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('active');
    const [partnerData, setPartnerData] = useState([])
    const [deleteModal, setDeleteModal] = useState(false);
    const [token, setToken] = useState(null);
    const [image, setImage] = useState("");
    const [id, setId] = useState("");
    const [BasicTab, setBasicTab] = useState('deliveryPartner');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const inputRef = useRef();
    const [loading, setLoading] = useState(false);
    const userRole = JSON.parse(localStorage.getItem("role_name"));
    const usersData = JSON.parse(localStorage.getItem('UserData'))

    // console.log(userRole)


    // const local_data = localStorage.getItem("UserData");
    // const userDataFromStorage = JSON.parse(local_data);
    // const user_id =userDataFromStorage._id
    // console.log(user_id)
    // console.log(userDataFromStorage)




    const isDarkMode = localStorage.getItem("mix_background_layout")

    const lightModeColors = {
        primary: '#007bff',
        secondary: '#dee2e6',
        text: '#212529',
        background: '#ffffff',
    };

    const darkModeColors = {
        primary: '#0d6efd',
        secondary: '#3F444D',
        text: 'white',
        background: 'transparent',
    };

    const darkModeCustomStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#222' : '#333',
            color: state.isSelected ? 'white' : 'lightgray',
        }),
        // Add other custom styles for dark mode as needed
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

    const validatePhoneNumber = (number) => {
        const regexWithZero = /^0\d{9}$/; // Phone number starts with 0 and is 10 digits long
        const regexWithoutZero = /^[1-9]\d{8}$/; // Phone number does not start with 0 and is 9 digits long
        return regexWithZero.test(number) || regexWithoutZero.test(number);
      };

    const formik = useFormik({
        initialValues: {
            full_name: "",
            phone: "",
            email: "",
            image: "",
            store_id: [],
            identityImages: files,
            address: "",
            location: {}
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Contact number is required').test('is-valid-phone-number', 'Phone Number must be a valid format', validatePhoneNumber),
            email: Yup.string().email('Invalid email').required('Email is required'),
            store_id: Yup.array().min(1, 'Select at least one store').required('Store is required'),
            address: Yup.string().required('Address is required'),

            // identityImages: Yup.array().min(1, 'Upload at least one identity proof').required('Identity proof is required')
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const token = await JSON.parse(localStorage.getItem("token"));
            try {
                const formData = new FormData();
                values.full_name && formData.append('full_name', values.full_name);
                values.email && formData.append('email', values.email)
                values.phone && formData.append('phone', values.phone);
                values.image && formData.append('image', values.image);
                values.store_id && formData.append('store_id', JSON.stringify(values.store_id))
                files.length > 0 &&
                    files.forEach((image, index) => {
                        formData.append(`identityImages[${index}]`, image);
                    });
                values.address && formData.append('address', values.address);
                values.location && formData.append('location', JSON.stringify(values.location));

                let response;

                if (id) {

                    // let endPoint;
                    // BasicTab === 'storePartner' ?
                    // endPoint = 'partner/update-partner' :
                    // endPoint = 'add-delivery-partner'

                    response = await axios.patch(`${baseURL}/api/partner/update-partner/${id}`,
                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }

                else {

                    let endPoint;
                    BasicTab === 'storePartner' ?
                        endPoint = 'add-store-manager' :
                        endPoint = 'add-delivery-partner'

                    response = await axios.post(`${baseURL}/api/partner/${endPoint}`,
                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }
                setLoading(false);
                formik.resetForm();
                toggleModal();
                getPartners();
                Swal.fire({
                    title: response.data.message,
                    icon: "success",
                    confirmButtonColor: "#d3178a",
                });
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    title: "Error uploading data",
                    // error.response.data.message,
                    icon: "error",
                    confirmButtonColor: "#d3178a",
                })
                console.log(error, 'post')
            }
        },
    });

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
        setSelectedStore([]);
        setId("");
        SetAddmodal(!AddModal);
        setFiles([]);
        setPreviews([]);
        setImage("");
        setLoading(false);
    }

    const debouncedSearch = React.useRef(
        debounce(async (searchTerm) => {
            setSearchTerm(searchTerm);
        }, 300)
    ).current;

    function capitalize(word) {
        const lower = word.toLowerCase();
        return word.charAt(0).toUpperCase() + lower.slice(1);
    }

    const getEditData = async (id) => {
        try {
            const response = await axios.get(`${baseURL}/api/partner/get-partner/${id}`, {
                headers: {
                    Authorization: `${token}`,
                }
            });

            if (response?.data.success) {
                let data = response?.data?.data;

                let tempPhone = data.phone
            console.log(tempPhone, tempPhone, "tempPhone");
                if (tempPhone.startsWith("+61")){
                    // console.log(tempPhone.substring(3), "tempPhone.substring(3)");
                    formik.setFieldValue("phone", tempPhone.substring(3));
                }else{
                    data.phone && formik.setFieldValue("phone", data.phone);
                }
                data.full_name && formik.setFieldValue("full_name", data.full_name);
                data.email && formik.setFieldValue("email", data.email);
                // data.phone && formik.setFieldValue("phone", data.phone);
                // tempPhone && formik.setFieldValue("phone", tempPhone);
                // data.identityImages.length > 0 && formik.setFieldValue('identityImages', data.identityImages);
                data.image && formik.setFieldValue("image", data.image);
                data?.address && formik.setFieldValue("address", data?.address);
                // data?.location && formik.setFieldValue("location", data?.location);
                setImage(imageURL + data.image);
                if (data.identityImages && data.identityImages.length > 0) {
                    setFiles(data.identityImages);
                }
                if (data.identityImages && data.identityImages.length > 0) {
                    setPreviews(data.identityImages.map(image => imageURL + image));
                }
                if (data.store_id && data.store_id.length > 0) {
                    let storeOptions = data.store_id.map(store => ({
                        value: store._id,
                        label: store.storeName
                    }));
                    setSelectedStore(storeOptions);
                    formik.setFieldValue("store_id", (data.store_id.map(option => option._id)));
                }
            }
    console.log("formik vauess---------------", formik.values)

        }
        catch (error) {
            console.error(error)
        }
    }

    const getStoreData = async () => {
        try {

            const response = await axios.get(`${baseURL}/api/store/get-all-stores`, {
                headers: {
                    Authorization: `${token}`
                }
            });

            if (response?.data.success) {
                setStores(response?.data?.data);
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleStoreChange = (selectedOptions, actionMeta) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedStore(selectedOptions);
        formik.setFieldValue('store_id', selectedValues);
    }

    const getPartners = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            setIsLoading(true);
            let endPoint;
            if (BasicTab === 'storePartner') {
                endPoint = '/api/partner/get-store-managers';
            }
            else {
                endPoint = '/api/partner/get-delivery-partners'
            }

            const userData = await JSON.parse(localStorage.getItem('UserData'))
            let url = userRole !== 'admin' ? `${baseURL}${endPoint}?page=${currentPage}&storeId=${userData?._id}&limit=${perPage}&search_string=${searchTerm}` : `${baseURL}${endPoint}?page=${currentPage}&limit=${perPage}&search_string=${searchTerm}`;
            let params = {};
            const response = await axios.get(url, {
                params: params,
                headers: {
                    Authorization: `${token}`,
                }
            });



            if (response?.data.success) {
                setPartnerData(response?.data?.data);
                setTotalRows(response?.data.total);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error)
            setIsLoading(true);

        }
    }

    const handleChange = (address) => {
        formik.setFieldValue('address', address);
    };

    const handleSelect = (address) => {
        formik.setFieldValue('address', address);
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
                console.log(locationObject, "locationObject");
                formik.setFieldValue('location', locationObject);
            },
            (error) => {
                console.error(error);
            }
        );
    };


    useEffect(() => {
        getStoreData();
    }, []);

    useEffect(() => {
        getPartners();
    }, [BasicTab, currentPage, perPage, searchTerm]);

    const storeOptions = (userRole === 'store') ?
        [{ value: usersData?._id, label: usersData?.storeName }] :
        stores.map(store => ({
            value: store._id,
            label: store.storeName
        }));

    const uploadImage = async (event) => {
        let file = event.target.files[0];
        let img = URL?.createObjectURL(file);
        formik.setFieldValue("image", file);
        setImage(img);
    };

    const deleteImage = () => {
        formik.setFieldValue("image", "");
        setImage("")
    }

    const handleStatusChange = async (id) => {
        let data = {
            status: ''
        }
        let response = await axios.patch(`${baseURL}/api/partner/update-partner/${id}`,
            data,
            {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
        console.log(response, "res")
    }



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles([...files, ...droppedFiles]);
        generatePreviews([...files, ...droppedFiles]);
    };

    const handleFileSelection = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles([...files, ...selectedFiles]);
        generatePreviews([...files, ...selectedFiles]);
    };

    const generatePreviews = (fileList) => {
        const filePreviews = [];
        fileList.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreviews.push(e.target.result);
                if (filePreviews.length === fileList.length) {
                    setPreviews(filePreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);

        const updatedPreviews = [...previews];
        updatedPreviews.splice(index, 1);
        setPreviews(updatedPreviews);
    };

    console.log("formik vauess", formik.values)

    const orderColumns = [
        {
            name: "ID",
            selector: row => (
                <>
                    {row?._id}
                </>
            ),
            center: false,
        },
        {
            name: 'NAME',
            selector: row => row['full_name'],
            sortable: true,
            center: false,
            cell: (row) => (
                <>
                    <Media className='d-flex align-items-center'>
                        <Image attrImage={{ className: ' rounded-circle img-30', src: `${row?.image ? imageURL + row.image : dummyImg}`, alt: 'Brand image' }} />
                        <span className='ms-2'> {capitalize(row.full_name)}</span>
                    </Media>
                </>

            )
        },
        {
            name: 'CONTACT NO',
            selector: row => `${row.phone}`,
            sortable: true,
            center: true,
            cell: (row) => (
                row?.phone
            )
        },
        {
            name: 'CREATED DATE',
            selector: row => `${row.createdAt}`,
            cell: (row) => (
                moment(row.createdAt).format("DD MMM, YYYY")
            ),
            sortable: true,
            center: true,
        },
        {
            name: 'STORE NAME',
            selector: row => `${row.store_id}`,
            width: '220px',
            sortable: true,
            center: true,
            cell: (row) => {
                const { store_id } = row;
                const MAX_DISPLAY_TAGS = 2;
                if (store_id?.length > MAX_DISPLAY_TAGS) {
                    const pendingItemsCount = store_id?.length - MAX_DISPLAY_TAGS;
                    return (
                        <>
                            {store_id?.slice(0, MAX_DISPLAY_TAGS).map((tag, index) => (
                                <span key={index} style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                    {tag.storeName}
                                </span>
                            ))}
                            <span style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                + {pendingItemsCount}
                            </span>
                        </>
                    );
                } else {
                    return (
                        <>
                            {store_id?.map((tag, index) => (
                                <span key={index} style={{ border: "1px dashed #E1E6EF", padding: "10px 10px", borderRadius: "10px", marginRight: "5px" }}>
                                    {tag.storeName}
                                </span>
                            ))}
                        </>
                    );
                }
            }
        },
        {
            name: 'STATUS',
            selector: row => `${row.updatedAt}`,
            sortable: true,
            center: true,
            cell: (row) => (
                // <span style={{ fontSize: '13px' }} className={`badge badge-light-success`}>
                //     Active
                // </span>
                <p className={`text-${row.status === "inactive" ? "[#ff0000]" : "[#008800]"}`}>{row.status === "active" ? "Active" : "In-Active"}</p>
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
                                formik.resetForm();
                                getEditData(row?._id);
                                setId(row?._id);
                                setSelectedOption(row.status)
                                SetAddmodal(true)
                            }}>
                                Edit
                                <FaPen />
                            </DropdownItem>
                            {/* {userRole === "admin" && <DropdownItem className='delete_item'
                                onClick={() => {
                                    // deleteBrand
                                    handleStatusChange(row?._id);
                                }}
                            >
                                Change Status
                            </DropdownItem>} */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
            sortable: false,
            center: true,
        }
    ]
    return (
        <Fragment>
            <CardBody style={{ padding: '15px' }}>
                <Row xxl={12} className='pb-2'>
                    <Row>
                        <Col md={6} lg={6} xl={6} xxl={6}>
                            <div>
                                <Nav tabs className='product_variant_tabs'>
                                    {/* <NavItem>
                                        <NavLink className={BasicTab === 'storePartner' ? 'active' : ''} onClick={() => setBasicTab('storePartner')} >
                                            Store Partners
                                        </NavLink>
                                    </NavItem> */}
                                    <NavItem>
                                        <NavLink className={BasicTab === 'deliveryPartner' ? 'active' : ''} onClick={() => setBasicTab('deliveryPartner')} >
                                            Delivery Partners
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </div>
                        </Col>
                        <Col md={6} lg={6} xl={6} xxl={6}>
                            <div className="file-content file-content1 justify-content-end">
                                <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                    <i className='fa fa-search' style={{ top: 'unset' }}></i>
                                    <input className='form-control border-0' style={{ maxWidth: '195px' }} onChange={(e) => debouncedSearch(e.target.value)} type='text' placeholder='Search...' />
                                </div>
                                <Button className='btn btn-primary d-flex align-items-center ms-3' onClick={toggleModal}>
                                    <PlusCircle />
                                    {BasicTab === 'storePartner' ? 'Add Store Partners' : 'Add Delivery Partners'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Row>
            </CardBody>


            <DataTable
                data={partnerData}
                columns={orderColumns}
                striped={true}
                center={true}
                clearSelectedRows={toggleDelet}
                pagination
                paginationServer
                progressComponent={<Loader />}
                progressPending={isLoading}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />


            <CommonModal isOpen={AddModal} title={id ? BasicTab === 'storePartner' ? 'Update Store Partners' : 'Update Delivery Partners' : BasicTab === 'storePartner' ? 'Add Store Partners' : 'Add Delivery Partners'} className="store_modal" toggler={toggleModal} size="lg">
                <Container>
                    <Form onSubmit={formik.handleSubmit}>
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
                                        <h6 className="mb-0">Profile Picture</h6>
                                        <p className="mb-0">PNG, JPEF & PNG</p>
                                    </div>
                                </div>

                            </Col>
                            <Col xl={8}>
                                <div className="d-flex align-items-center justify-content-end">
                                    <label className="upload_label mb-0" for="upload">
                                        <Input
                                            id="upload"
                                            type="file"
                                            onChange={(e) => uploadImage(e)}
                                            accept="image/png, image/gif, image/jpeg"
                                        />
                                        Upload Picture
                                    </label>
                                    <Button onClick={deleteImage} className="cancel_Btn upload_label ms-2" for="upload">
                                        Delete
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Name <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        name="full_name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.full_name}
                                        placeholder='Enter Name'
                                    />
                                    {formik.touched.full_name && formik.errors.full_name ? (
                                        <span className="error text-danger">
                                            {formik.errors.full_name}
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
                                    <InputGroup>
                                        <InputGroupText>
                                            +61
                                        </InputGroupText>
                                        <Input
                                            name="phone"
                                            type="number"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phone}
                                            placeholder='Enter Contact No'
                                        />
                                    </InputGroup>
                                    {formik.touched.phone && formik.errors.phone ? (
                                        <span className="error text-danger">
                                            {formik.errors.phone}
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Email Address <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        name="email"
                                        type='email'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        placeholder='Enter Email Address'
                                    />
                                    {formik.touched.email &&
                                        formik.errors.email ? (
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
                                        Store <span className="text-danger">*</span>
                                    </Label>

                                    <Select
                                        placeholder='Select Store'
                                        value={selectedStore}
                                        isMulti
                                        name='store_id'
                                        onBlur={formik.handleBlur}
                                        options={storeOptions}
                                        onChange={handleStoreChange}
                                        styles={customStyles}
                                    />

                                    {formik.touched.store_id && formik.errors.store_id ? (
                                        <span className="error text-danger">
                                            {formik.errors.store_id}
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Address <span className="text-danger">*</span>
                                    </Label>

                                    <PlacesAutocomplete
                                        value={formik.values.address}
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

                                    {formik.touched.store_id && formik.errors.store_id ? (
                                        <span className="error text-danger">
                                            {formik.errors.store_id}
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Identity Proof
                                        {/* <span className="text-danger">*</span> */}
                                    </Label>

                                    <CardBody>
                                        <Form>


                                            <div
                                                className="dropzone"
                                                onDragOver={handleDragOver}
                                                onDrop={handleDrop}
                                            >
                                                <h1> <img src={addstore} /> </h1>
                                                <h1>Drag your file(s) to start uploading</h1>
                                                <h1>Or</h1>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileSelection}
                                                    hidden
                                                    accept="image/png, image/jpeg"
                                                    ref={inputRef}
                                                />
                                                <button type="button" onClick={() => inputRef.current.click()}>
                                                    Browse Files
                                                </button>
                                            </div>
                                            <div className="previews mt-3">
                                                <ul>
                                                    {previews.map((preview, idx) => (
                                                        <li className='d-flex justify-content-between mb-2' key={idx}>
                                                            <img width={40} height={40} src={preview} alt={`Preview ${idx}`} />
                                                            <button type='button' onClick={() => handleRemoveFile(idx)}><img src={crossicon} /></button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </Form>
                                    </CardBody>

                                    {formik.touched.identityImages && formik.errors.identityImages ? (
                                        <span className="error text-danger">
                                            {formik.errors.identityImages}
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
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
                                    // className="ms-2 Save_Btn"
                                    className="ms-2 btn btn-primary"
                                    disabled={loading}
                                >
                                    {id ? BasicTab === 'storePartner' ? 'Update Store Partners' : 'Update Delivery Partners' : BasicTab === 'storePartner' ? 'Add Store Partners' : 'Add Delivery Partners'}                                 </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>
        </Fragment >
    )
}

export default RoleManagementTable;
