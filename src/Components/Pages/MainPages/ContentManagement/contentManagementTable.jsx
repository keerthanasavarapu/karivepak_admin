import React, { Fragment, useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component';
import { Button, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Media, Nav, NavItem, NavLink, Row, UncontrolledDropdown } from 'reactstrap';
import { MoreVertical, PlusCircle } from 'react-feather';
import CommonModal from '../../../UiKits/Modals/common/modal';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { baseURL, imageURL } from '../../../../Services/api/baseURL';
import dummyImg from '../../../../assets/images/product/2.png';
import { Image } from '../../../../AbstractElements';
import { FaPen, FaTrashAlt, FaExchangeAlt } from 'react-icons/fa';
import { debounce } from 'lodash';
import Loader from '../../../Loader/Loader';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
//import GIF from 'gif.js';
//import { parseGIF, decompressFrames } from 'gifuct-js';
//import gifshot from 'gifshot';

export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]

function ContentManagementTable() {
    const [editData, setEditData] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [data, setData] = useState([])
    const [deleteModal, setDeleteModal] = useState(false);
    const [token, setToken] = useState(null);
    const [image, setImage] = useState("");
    const [id, setId] = useState("");
    const [BasicTab, setBasicTab] = useState('storePartner');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImages, setSelectedImages] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const inputRef = useRef();
    const [images, setImages] = useState([]);
    const imgRefs = useRef([]);
    const [cropList, setCropList] = useState([]);


    const banner_types = {
        subscribe_banner: "Subscribe Banner",
        festival_banner: "Festival Banner",
        landing_page_banner: "Landing Page Banner",
        category_search_banner: "Category Search Page Banner",
        none: ""
    };

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
        setId("");
        SetAddmodal(!AddModal);
        setFiles([]);
        setSrc("");
        setImage("");
        setCrop();
        setLoading(false);
        setSelectedImage("");
        setImages([]);
    };

    const debouncedSearch = React.useRef(
        debounce(async (searchTerm) => {
            setSearchTerm(searchTerm);
        }, 300)
    ).current;

    function capitalize(word) {
        const lower = word?.toLowerCase();
        return word?.charAt(0).toUpperCase() + lower?.slice(1);
    }

    const getEditData = async (data) => {
        if (data) {
            data.device_type && formik.setFieldValue("device_type", data.device_type);
            data.banner_type && formik.setFieldValue("banner_type", data.banner_type);

            if (data?.image) {
                const imgSrc = imageURL + data?.image;
                setFiles(data?.image);
                setSelectedImage(imgSrc)
            }
            if (data?.images && data.images.length > 0) {
                const imgList = [];
                data.images.forEach((img) => { imgList.push(imageURL + img) });
                setFiles(imgList);
                setSelectedImages(imgList)
            }

        }
    }

    const getData = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            setIsLoading(true);
            let endPoint = '/api/banner';

            const response = await axios.get(`${baseURL}${endPoint}?page=${currentPage}&limit=${perPage}&search_string=${searchTerm}`, {
                headers: {
                    Authorization: `${token}`,
                }
            });

            if (response?.data.success) {
                console.log("At line 115", response);
                setData(response?.data?.data);
                setTotalRows(response?.data.total);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error)
            setIsLoading(true);

        }
    }

    const deleteBrand = async (id) => {
        {
            const token = await JSON.parse(localStorage.getItem("token"))
            try {
                const data = await axios.delete(`${baseURL}/api/banner/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                    }
                })
                getData();
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
        getData();
    }, [BasicTab, currentPage, perPage, searchTerm]);

    const inactiveItem = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            const obj = {
                status: editData.status === "inactive" ? "active" : 'inactive'
            }

            const itemsData = await axios.patch(`${baseURL}/api/admin/update-collection-status/${editData._id}`, obj, {
                headers: {
                    Authorization: `${token}`,
                }
            })

            getData()
            setDeleteModal(!deleteModal)
        }
        catch (err) {
            console.log(err)
        }
    }

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

    const handleClickPreview = (imageUrl) => {
        console.log(imageUrl)
        setSelectedImages(imageUrl)
        setIsPreview(!isPreview);
    };

    const formik = useFormik({
        initialValues: {
            device_type: "",
            banner_type: "",
            title: "",
            image: "",
            content: ""
        },
        validationSchema: Yup.object({
            device_type: Yup.string().required('Device Type is required'),
            banner_type: Yup.string().required('Banner Type is required'),
            // email: Yup.string()('Invalid email').required('Email is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            // src && src !== null && onCropComplete(crop);
            const token = await JSON.parse(localStorage.getItem("token"));
            try {
                const formData = new FormData();
                values.device_type && formData.append('device_type', values.device_type);
                values.banner_type && formData.append('banner_type', values.banner_type);

                if (files) {
                    console.log("files", files);
                    files.forEach((image, index) => {
                        formData.append(`image_[${index}]`, image);
                    })
                }

                // files.length > 0 &&
                //     files.forEach((image, index) => {
                //         formData.append(`identityImages[${index}]`, image);
                //     });

                let response;

                if (id) {

                    response = await axios.patch(`${baseURL}/api/banner/${id}/status`,
                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }
                else {

                    response = await axios.post(`${baseURL}/api/banner`,

                        formData,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        });
                }

                if (response?.data?.success) {
                    setLoading(false)
                    formik.resetForm();
                    toggleModal();
                    getData();
                    Swal.fire({
                        title: response?.data?.message,
                        icon: "success",
                        confirmButtonColor: "#d3178a",
                    });
                }
            } catch (error) {
                setLoading(false);
                Swal.fire({
                    title: error?.response?.data?.message,
                    icon: "error",
                    confirmButtonColor: "#d3178a",
                });
            }
        },
    });

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ aspect: formik.values.banner_type === "category_search_banner" ? 11 / 1 : 16 / 5 });
    const imgRef = useRef(null);

    const handleFileSelection = (event) => {
        const selectedFiles = Array.from(event.target.files);
        handleFiles(selectedFiles);
    };

    const handleFiles = (fileList) => {
        const newFiles = [];
        const fileReaders = [];
        const newSrcList = [];
        const newCropList = [];

        // Filter the files based on the category
        const filteredFiles = (formik.values.banner_type === "landing_page_banner") ? fileList : [fileList[0]];

        filteredFiles.forEach((file, index) => {
            const reader = new FileReader();
            fileReaders.push(reader);

            reader.onload = (e) => {
                newFiles.push(file);
                newSrcList.push(e.target.result);
                newCropList.push({ aspect: 16 / 4 });

                if (newFiles.length === fileList.length) {
                    setFiles(newFiles);
                    setImages(newSrcList);
                    setCropList(newCropList);
                }
            };

            reader.readAsDataURL(file);
        });
    };
    /*
        const handleFiles = (fileList) => {
            if (fileList.length > 0) {
                const file = fileList[0];
                const reader = new FileReader();
                reader.addEventListener('load', () => setImages([reader.result]));
                reader.readAsDataURL(file);
            }
           
        };
     */

    const onImageLoaded = (image, index) => {
        const { naturalWidth: width, naturalHeight: height } = image.currentTarget;
        const aspectRatio =
            formik.values.device_type === "website"
                ? (formik.values.banner_type === "festival_banner"
                    ? 2.17 / 1
                    : 2.06 / 1)
                : (formik.values.banner_type === "festival_banner"
                    ? 1 / 1
                    : formik.values.banner_type === "landing_page_banner"
                        ? 2.37 / 1
                        : 2.37 / 1);

        const crop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 100,
                },
                aspectRatio,
                width,
                height
            ),
            width,
            height
        )
        setCropList(prevCropList => {
            const newCropList = [...prevCropList];
            newCropList[index] = crop;
            return newCropList;
        });
    };

    const onCropComplete = async (crop, index) => {
        const image = imgRefs.current[index];
        if (!image) return;

        const mimeType = image.src.startsWith('data:') ?
            image.src.match(/^data:([^;]+);base64,/)[1] :
            'image/jpeg';

        let blobImg;
        if (mimeType === 'image/gif') {
            blobImg = base64ToBlob(`banner_${index}.gif`, image.src, 'image/gif');
        } else {
            blobImg = await generateCroppedImage(image, crop, `banner_${index}.jpeg`, 'image/jpeg');
        }

        setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            newFiles[index] = blobImg;
            return newFiles;
        });
    };


    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = await JSON.parse(localStorage.getItem("token"))
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'You are not authenticated. Please log in.'
                })
                return;
            }
            const obj = {
                status: currentStatus === "inactive" ? "active" : "inactive",
            };

            const response = await axios.patch(
                `${baseURL}/api/banner/${id}/status`,
                obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Status updated successfully:", response.data);
            getData();
            setDeleteModal(!deleteModal);
        } catch (err) {
            console.error("Error toggling status:", err);
            Swal.fire({
                icon: "warning",
                title: "Note",
                text: err?.response?.data?.message
            })
        }
    };


    const base64ToBlob = (fileName, base64, mime) => {
        const parts = base64.split(',');
        const byteString = atob(parts[1]);
        const mimeType = parts[0].match(/:(.*?);/)[1];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ia], { type: mimeType });
        blob.name = fileName;
        return blob;
    };


    const generateCroppedImage = (image, crop, fileName, mimeType) => {
        console.log("filename: ", fileName)
        console.log('mimeType', mimeType)
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        // New lines to be addefd
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas?.toBlob(
                (blob) => {
                    blob.name = fileName;
                    resolve(blob);
                },
                mimeType,
                1
            );
        });

    };


    const orderColumns = [
        {
            name: 'Device Type',
            selector: row => `${row.device_type}`,
            sortable: true,
            center: true,
            cell: (row) => (
                capitalize(row?.device_type)
            )
        },
        {
            name: 'Banner Type',
            selector: row => `${row.banner_type}`,
            sortable: true,
            center: true,
            cell: (row) => (
                row?.banner_type ? banner_types[row?.banner_type] : "N/A"
            )
        },
        {
            name: 'Preview',
            selector: row => row['full_name'],
            sortable: true,
            center: false,
            cell: (row) => (
                <>
                    <Media className='d-flex align-items-center'>
                        <Image attrImage={{ className: ' rounded-circle w-[30px] h-[30px]', src: `${row?.image || dummyImg}`, alt: 'Brand image' }} />
                        <span onClick={() => { handleClickPreview(row.image) }} className='ms-2 link-primary cursor-pointer'>   {capitalize('Click here to preview')}</span>
                    </Media>
                </>

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
            name: 'STATUS',
            selector: row => `${row.updatedAt}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <span
                    style={{ fontSize: '13px' }}
                    className={`badge ${row.status === 'active' ? 'badge-light-success' : 'badge-light-danger'
                        }`}
                >
                    {row.status == 'active' ? 'Active' : 'Inactive'}
                </span>
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
                            {/* <DropdownItem onClick={() => {
                                formik.resetForm();
                                getEditData(row);
                                setId(row?._id);
                                SetAddmodal(true)
                            }}>
                                Edit
                                <FaPen />
                            </DropdownItem> */}
                            <DropdownItem className='delete_item' onClick={(rowData) => {
                                deleteBrand(row?._id);
                            }}>
                                Delete
                                <FaTrashAlt />
                            </DropdownItem>
                            <DropdownItem onClick={() => {
                                toggleStatus(row?._id, row?.status);
                            }} className='d-flex gap-2  '>
                                <FaExchangeAlt />
                                {row?.status === 'active' ? 'Deactivate' : 'Activate'}

                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
            sortable: false,
            center: true,
        }
    ];

    console.log(selectedImages)
    return (
        <Fragment>
            <CardBody style={{ padding: '15px' }}>
                <Row xxl={12} className='pb-2'>
                    <Row>
                        <Col md={6} lg={6} xl={6} xxl={6}>
                            <div>
                                <h4 className='mb-0'>
                                    Hero’s Banner
                                </h4>
                            </div>
                        </Col>
                        <Col md={6} lg={6} xl={6} xxl={6}>
                            <div className="file-content file-content1 justify-content-end">
                                {/* <div className='mb-0 form-group position-relative search_outer d-flex align-items-center'>
                                    <i className='fa fa-search' style={{ top: 'unset' }}></i>
                                    <input className='form-control border-0' style={{ maxWidth: '195px' }} onChange={(e) => debouncedSearch(e.target.value)} type='text' placeholder='Search...' />
                                </div> */}
                                <Button className='btn btn-primary d-flex align-items-center ms-3' onClick={toggleModal}>
                                    <PlusCircle />
                                    Add Banner
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Row>
            </CardBody>


            <DataTable
                data={data}
                columns={orderColumns}
                striped={true}
                center={true}
                pagination
                paginationServer
                progressComponent={<Loader />}
                progressPending={isLoading}
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />

            <CommonModal isOpen={AddModal} title={id ? 'Update Banner' : 'Add a New Banner'} className="store_modal" toggler={toggleModal} size="xl">
                <Container>
                    <Form onSubmit={formik.handleSubmit}>
                        <Row>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Device Type <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        type="select"
                                        name="device_type"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.device_type}
                                    >
                                        <option value="" disabled selected label="Select Device Type" />
                                        <option value="mobile" label="Mobile" />
                                        <option value="website" label="Website" />
                                    </Input>
                                    {formik.touched.device_type && formik.errors.device_type ? (
                                        <span className="error text-danger">{formik.errors.device_type}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Banner Type <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        type="select"
                                        name="banner_type"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.banner_type}
                                    >
                                        <option value="" disabled selected label="Select Banner Type" />
                                        <option value="landing_page_banner" label="Landing Page Banner (16:9)" />
                                        <option value="festival_banner" label="Festival Banner (16:9)" />
                                        <option value="subscribe_banner" label="Subscribe Banner (16:9)" />
                                        <option value="category_search_banner" label="Category Search Page Banner (11:1)" />
                                        {/* <option value="none" label="None" /> */}
                                    </Input>
                                    {formik.touched.banner_type && formik.errors.banner_type ? (
                                        <span className="error text-danger">{formik.errors.banner_type}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                            {/* <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Select Theme Type <span className="text-danger">*</span>
                                    </Label>
                                    <Input
                                        type="select"
                                        name="theme_type"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.theme_type}
                                    >
                                        <option value="" disabled selected label="Select Theme Type" />
                                        <option value="light" label="Light" />
                                        <option value="dark" label="Dark" />
                                    </Input>
                                    {formik.touched.theme_type && formik.errors.theme_type ? (
                                        <span className="error text-danger">{formik.errors.theme_type}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col> */}
                            {/* <Col xl={12}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Title
                                    </Label>
                                    <Input
                                        name="banner_title"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.banner_title}
                                        placeholder="Enter Banner Title"
                                    />
                                    {formik.touched.banner_title && formik.errors.banner_title ? (
                                        <span className="error text-danger">{formik.errors.banner_title}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col> */}
                            <Col xl={6}>
                                <FormGroup>
                                    <Label className="font-medium text-base">
                                        Banner Image <span className="text-danger">*</span>
                                    </Label>
                                    <CardBody>
                                        <Form>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileSelection}
                                                hidden
                                                accept="image/png, image/jpeg, image/gif"
                                                ref={inputRef}
                                            />
                                            <button type="button" className='btn btn-secondary' onClick={() => inputRef.current.click()}>
                                                Browse Files
                                            </button>
                                        </Form>
                                    </CardBody>
                                    {formik.touched.identityImages && formik.errors.identityImages ? (
                                        <span className="error text-danger">{formik.errors.identityImages}</span>
                                    ) : (
                                        ""
                                    )}
                                </FormGroup>
                            </Col>
                            <Col xl={12}>
                                <div className='mt-3'>
                                    {
                                        images.length > 0 ? (images.map((image, index) => (
                                            <ReactCrop
                                                key={index}
                                                crop={cropList[index]}
                                                onChange={newCrop => setCropList(prevCrops => {
                                                    const newCrops = [...prevCrops];
                                                    newCrops[index] = newCrop;
                                                    return newCrops;
                                                })}
                                                onComplete={() => onCropComplete(cropList[index], index)}
                                                aspect={16 / 4}
                                                keepSelection={true}
                                                minWidth={1920}
                                                minHeight={500}
                                            >
                                                <img
                                                    ref={el => (imgRefs.current[index] = el)}
                                                    src={image}
                                                    onLoad={(e) => onImageLoaded(e, index)}
                                                    alt=''
                                                />
                                            </ReactCrop>)))

                                            :
                                            /* 
                                               src ? <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={() => onCropComplete(crop)} aspect={16 / 4} keepSelection={true} minWidth={1920} minHeight={500}  >
                                               <img ref={imgRef} src={src} onLoad={onImageLoaded} alt=''  />
                                           </ReactCrop>
                                               :*/
                                            <img src={selectedImage} alt='' />
                                    }
                                </div></Col>
                            <Col xl={12} className="modal_btm d-flex justify-content-end">
                                <Button className="cancel_Btn" onClick={() => { setImages([]); SetAddmodal(false) }}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className='btn btn-primary d-flex align-items-center ms-3'>
                                    {id ? "Update Banner" : "Add Banner"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>

            <CommonModal isOpen={isPreview} className="store_modal" toggler={() => setIsPreview(!isPreview)} size="lg">
                <Container>
                    <Row>
                        {/* {selectedImages?.length > 0 ? selectedImages.map((image, index) => (
                        <Col xl={12} md={12} sm={12} key={index}>
                          <img src={image} className='w-100' alt={`banner-${index}`} />
                        </Col>
                     )) :  */}
                        <Col xl={12} md={12} sm={12} >
                            <img src={selectedImages} className='w-100' alt={`banner`} />
                        </Col>
                        {/* } */}
                    </Row>
                </Container>
            </CommonModal>
        </Fragment>
    )
}

export default ContentManagementTable;
