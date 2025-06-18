import { debounce } from "lodash";
import moment from "moment";
import { Fragment, useEffect, useRef, useState } from "react";
import { MoreVertical, PlusCircle } from "react-feather";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { Button, Card, CardBody, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, InputGroup, InputGroupText, Label, Row, UncontrolledDropdown } from "reactstrap";
import { baseURL } from "../../../../Services/api/baseURL";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup'
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import CommonModal from "../../../UiKits/Modals/common/modal";
import Loader from "../../../Loader/Loader";

const CouponsTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [AddModal, SetAddmodal] = useState(false);
    const [data, setData] = useState([])
    const [token, setToken] = useState(null);
    const [id, setId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {
            setToken(token);
            return;
        }
        setToken(null);
    }, []);

    const formik = useFormik({
        initialValues: {
            coupan_name: "",
            description: "",
            validFrom: "",
            validTill: "",
            coupan_value: "",
            coupan_value_type: "dollar",
            minimum_purchase_amount: 0,
            minimum_quantity_items: 0,
            purchase_requirement: "no_minimum_requirements",
            status: ""
        },
        validationSchema: Yup.object({
            coupan_name: Yup.string()
                .transform(value => value?.toUpperCase())
                .required('Coupon Name is required'),
            description: Yup.string().required('Description is required'),
            validFrom: Yup.date()
                .min(moment().subtract(1, 'day').toDate(), 'Start Date cannot be in the past')
                .required('Start Date is required'),
            validTill: Yup.date()
                .min(
                    Yup.ref('validFrom'),
                    'End Date cannot be before Start Date'
                )
                .required('End Date is required'),
            coupan_value: Yup.number().required('Coupon Value is required'),
            coupan_value_type: Yup.string().required('Coupon Value Type is required'),
            status: Yup.string().required('Status is required'),
            // minimum_purchase_amount: Yup.string().required('Minimum Purchase Amount is required'),
            // minimum_quantity_items: Yup.string().required('Minimum Item Quantity is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const token = await JSON.parse(localStorage.getItem("token"));

            let updatedValus = {
                ...values,
                coupan_name: values?.coupan_name?.toUpperCase()
            }

            try {
                let response;
                if (id) {
                    response = await axios.put(`${baseURL}/api/admin/coupan/${id}`,
                        updatedValus,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        })
                }
                else {
                    response = await axios.post(`${baseURL}/api/admin/coupan/create`,
                        updatedValus,
                        {
                            headers: {
                                Authorization: `${token}`,
                                "Content-Type": "multipart/form-data",
                            }
                        });
                    console.log("response", response);
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

    const toggleModal = () => {
        formik.resetForm();
        setId("");
        SetAddmodal(!AddModal);
        setLoading(false);
    };

    const debouncedSearch = useRef(
        debounce(async (searchTerm) => {
            setSearchTerm(searchTerm);
        }, 300)
    ).current;

    const getEditData = async (id) => {

        let endPoint = `/api/admin/coupan/${id}`;

        const response = await axios.patch(`${baseURL}${endPoint}`, {}, {
            headers: {
                Authorization: `${token}`,
            }
        });

        let data = response?.data?.data;

        if (response?.data?.success) {
            console.log(" data.validFrom ", data.validFrom);
            data.coupan_name && formik.setFieldValue("coupan_name", data.coupan_name);
            data.coupan_value && formik.setFieldValue("coupan_value", data.coupan_value);
            data.coupan_value_type && formik.setFieldValue("coupan_value_type", data.coupan_value_type);
            data.description && formik.setFieldValue("description", data.description);
            data.validFrom && formik.setFieldValue("validFrom", moment(data.validFrom).format("YYYY-MM-DD"));
            data.validTill && formik.setFieldValue("validTill", moment(data.validTill).format("YYYY-MM-DD"));
            data.status && formik.setFieldValue("status", data.status);
            data.minimum_purchase_amount && formik.setFieldValue("minimum_purchase_amount", data.minimum_purchase_amount);
            data.minimum_quantity_items && formik.setFieldValue("minimum_quantity_items", data.minimum_quantity_items);
            data.purchase_requirement && formik.setFieldValue("purchase_requirement", data.purchase_requirement);


        }
    }

    

    const deleteCoupon = async (id) => {
        if (window.confirm("Do You Want To Delete this Coupon?")) {
            const token = await JSON.parse(localStorage.getItem("token"))
            try {
                const data = await axios.delete(`${baseURL}/api/admin/coupan/${id}`, {
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
    }, [searchTerm]);

    const orderColumns = [
        {
            name: 'TITLE',
            selector: row => `${row.title}`,
            sortable: true,
            center: true,
            cell: (row) => (
                row?.title
            )
        },
        {
            name: 'CATEGORY',
            selector: row => `${row.category}`,
            sortable: true,
            center: true,
            cell: (row) => (
                (row?.category )
            )
        },
        {
            name: 'Start Date',
            selector: row => `${row.validFrom}`,
            sortable: true,
            center: true,
            cell: (row) => (
                moment(row?.validFrom).format("DD MMM YYYY")
            )
        },
        {
            name: 'End Date',
            selector: row => row?.validTill,
            sortable: true,
            center: false,
            cell: (row) => (
                moment(row?.validTill).format("DD MMM YYYY")
            )
        },
        {
            name: 'DESCRIPTION',
            selector: row => row?.description,
            sortable: true,
            center: false,
            cell: (row) => (
                row?.description
            )
        },
        {
            name: 'STATUS',
            selector: row => `${row.updatedAt}`,
            sortable: true,
            center: true,
            cell: (row) => (
                <span style={{ fontSize: '13px' }} className={`badge ${row?.status === "active" ? "badge-light-success" : "badge-danger"}`}>
                    {row?.status}
                </span>
            ),
        },
        {
            name: 'Posted By',
            selector: row => row.userId?._id ? row.userId._id : 'Deleted User', // Display ID if it exists, otherwise 'Deleted User'
            sortable: true,
            center: true,
            cell: (row) => (
                row?.userId?._id ? (
                    <span style={{ fontSize: '13px' }}>
                        ID: {row.userId._id.slice(-6).toUpperCase()}
                    </span>
                ) : (
                    <span style={{ fontSize: '13px', fontStyle: 'italic', color: 'gray' }}>
                        Deleted User
                    </span>
                )
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
                                SetAddmodal(true)
                            }}>
                                Edit
                                <FaPen />
                            </DropdownItem>
                            <DropdownItem className='delete_item' onClick={() => deleteCoupon(row?._id)} >
                                Delete
                                <FaTrashAlt />
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
            sortable: false,
            center: true,
        }
    ];

    const getData = async () => {
        const token = await JSON.parse(localStorage.getItem("token"))
        try {
            setIsLoading(true);
            // let endPoint = '/api/admin/coupan';

            // const response = await axios.get(`${baseURL}${endPoint}?search_string=${searchTerm}`, {
            //     headers: {
            //         Authorization: `${token}`,
            //     }
            // });
            const response = await axios.get(`${baseURL}/api/postings`);
console.log(response, "response");

if (response.status === 200 && response.data) {
    setData(response.data);  // Assign the "data" array from the response to setData
    setIsLoading(false);
} else {
    setIsLoading(false);
    // Optionally handle the case when response.data.data is missing
}

        
        } catch (error) {
            console.log(error)
            setIsLoading(true);

        }
    }
    console.log(data,"data......................")
    return (
        <Fragment>
            <Container fluid={true} style={{ paddingTop: '30px' }}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody style={{ padding: '15px' }}>
                                <Row xxl={12} className='pb-2'>
                                    <Row>
                                        <Col md={6} lg={6} xl={6} xxl={6}>
                                            <div>
                                                <h5 className='mb-0 font-bold'>
                                                    Posts
                                                </h5>
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
                                                    Add Posts
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
                            />

                            <CommonModal isOpen={AddModal} title={id ? 'Update Coupon' : 'Add Coupon'} className="store_modal" toggler={toggleModal} size="lg">
                                <Container>
                                    <Form className="theme-form" onSubmit={formik.handleSubmit}>
                                        <Row>
                                            <Col xl={12}>
                                                <FormGroup>
                                                    <Label className="font-semibold text-base">
                                                        Coupon Name <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        name="coupan_name"
                                                        placeholder="Enter coupon name"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.coupan_name.toUpperCase()}
                                                    />
                                                    {formik.touched.coupan_name && formik.errors.coupan_name ? (
                                                        <span className="error text-danger">{formik.errors.coupan_name}</span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col xl={12}>
                                                <FormGroup>
                                                    <Label className="font-semibold text-base">
                                                        Coupon Discount <span className="text-danger">*</span>
                                                    </Label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="number"
                                                            className="w-5/6"
                                                            name="coupan_value"
                                                            min={1}
                                                            max={100}
                                                            placeholder="Enter discount"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.coupan_value}
                                                        />
                                                        <select
                                                            type="select"
                                                            name="coupan_value_type"
                                                            className="w-1/6"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.coupan_value_type}
                                                        >
                                                            <option value="dollar" label="$" selected />
                                                            <option value="percent" label="%" />
                                                        </select>
                                                    </div>
                                                    {formik.touched.coupan_value && formik.errors.coupan_value ? (
                                                        <span className="error text-danger">{formik.errors.coupan_value}</span>
                                                    ) : (
                                                        ""
                                                    )}

                                                </FormGroup>
                                            </Col>
                                            <Col xl={12}>
                                                <FormGroup>
                                                    <Label className="font-semibold text-base">
                                                        Description <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.description}
                                                        placeholder="Enter Description"
                                                    />
                                                    {formik.touched.description && formik.errors.description ? (
                                                        <span className="error text-danger">{formik.errors.description}</span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col xl={12}>
                                                <Row className="pe-0">
                                                    <Col xl={6}>
                                                        <FormGroup>
                                                            <Label className="font-semibold text-base">
                                                                Start Date <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                name="validFrom"
                                                                placeholder="Select Date"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.validFrom}
                                                            />
                                                            {formik.touched.validFrom && formik.errors.validFrom ? (
                                                                <span className="error text-danger">{formik.errors.validFrom}</span>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <FormGroup>
                                                            <Label className="font-semibold text-base">
                                                                End Date <span className="text-danger">*</span>
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                name="validTill"
                                                                placeholder="Select Date"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.validTill}
                                                            />
                                                            {formik.touched.validTill && formik.errors.validTill ? (
                                                                <span className="error text-danger">{formik.errors.validTill}</span>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl={12}>
                                                <Row className="pe-0">
                                                    <Col xl={12}>
                                                        <FormGroup>
                                                            <Label className="font-semibold text-base">
                                                                Minimum Purchase Requirements <span className="text-danger">*</span>
                                                            </Label>
                                                            <div className="flex flex-column justify-center">

                                                                <Label>
                                                                    <Input
                                                                        type="radio" className="me-2"
                                                                        id="no_minimum_requirements"
                                                                        name="purchase_requirement"
                                                                        label=""
                                                                        onChange={() => {
                                                                            formik.setFieldValue('purchase_requirement', 'no_minimum_requirements');
                                                                            formik.setFieldValue('minimum_purchase_amount', 0);
                                                                            formik.setFieldValue('minimum_quantity_items', 0);
                                                                        }}
                                                                        checked={formik.values.purchase_requirement === 'no_minimum_requirements'}
                                                                    />
                                                                    No minimum requirements
                                                                </Label>
                                                                <Label>
                                                                    <Input
                                                                        type="radio" className="me-2"
                                                                        id="minimum_purchase_amount"
                                                                        name="purchase_requirement"
                                                                        onChange={() => {
                                                                            formik.setFieldValue('purchase_requirement', 'minimum_purchase_amount');
                                                                            formik.setFieldValue('minimum_purchase_amount', 0);
                                                                            formik.setFieldValue('minimum_quantity_items', 0);
                                                                        }}
                                                                        checked={formik.values.purchase_requirement === 'minimum_purchase_amount'}
                                                                    />
                                                                    Minimum purchase amount ($)
                                                                </Label>
                                                                <Label>
                                                                    <Input
                                                                        type="radio" className="me-2"
                                                                        id="minimum_quantity_items"
                                                                        name="purchase_requirement"
                                                                        onChange={() => {
                                                                            formik.setFieldValue('purchase_requirement', 'minimum_quantity_items');
                                                                            formik.setFieldValue('minimum_purchase_amount', 0);
                                                                            formik.setFieldValue('minimum_quantity_items', 1);
                                                                        }}
                                                                        checked={formik.values.purchase_requirement === 'minimum_quantity_items'}
                                                                    />
                                                                    Minimum quantity of items
                                                                </Label>
                                                            </div>
                                                        </FormGroup>
                                                    </Col>
                                                    {formik.values.purchase_requirement === 'minimum_purchase_amount' && (
                                                        <Col xl={6}>
                                                            <FormGroup>
                                                                <Label className="font-semibold text-base">
                                                                    Minimum Purchase Amount <span className="text-danger">*</span>
                                                                </Label>
                                                                <InputGroup>
                                                                    <InputGroupText>
                                                                        $
                                                                    </InputGroupText>
                                                                    <Input
                                                                        type="number"
                                                                        min={0}
                                                                        className="rouned-top-0 rounded-left-0"
                                                                        name="minimum_purchase_amount"
                                                                        placeholder="Enter Minimum Purchase Amount"
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        value={formik.values.minimum_purchase_amount}
                                                                    />
                                                                </InputGroup>
                                                                <p className="font-medium mb-0 p-1">Applied to all Products.</p>
                                                                {formik.touched.minimum_purchase_amount && formik.errors.minimum_purchase_amount ? (
                                                                    <span className="error text-danger">{formik.errors.minimum_purchase_amount}</span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                    )}
                                                    {formik.values.purchase_requirement === 'minimum_quantity_items' && (
                                                        <Col xl={6}>
                                                            <FormGroup>
                                                                <Label className="font-semibold text-base">
                                                                    Minimum Quantity of items <span className="text-danger">*</span>
                                                                </Label>
                                                                <Input
                                                                    type="number"
                                                                    name="minimum_quantity_items"
                                                                    placeholder="Enter minimum quantity"
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    value={formik.values.minimum_quantity_items}
                                                                />
                                                                {formik.touched.minimum_quantity_items && formik.errors.minimum_quantity_items ? (
                                                                    <span className="error text-danger">{formik.errors.minimum_quantity_items}</span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </FormGroup>
                                                        </Col>
                                                    )}
                                                </Row>
                                            </Col>
                                            <Col xl={12}>
                                                <FormGroup>
                                                    <Label className="font-semibold text-base">
                                                        Status <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        type="select"
                                                        name="status"
                                                        placeholder="Select Status"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.status}
                                                    >
                                                        <option disabled label="Select Status"></option>
                                                        <option value={"active"} label="Active"></option>
                                                        <option value={"expired"} label="Expired"></option>
                                                    </Input>
                                                    {formik.touched.status && formik.errors.status ? (
                                                        <span className="error text-danger">{formik.errors.status}</span>
                                                    ) : (
                                                        ""
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col xl={12} className="modal_btm d-flex justify-content-end">
                                                <Button className="cancel_Btn" onClick={() => SetAddmodal(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={loading} className="ms-2 btn btn-primary">
                                                    {id ? "Update Coupon" : "Add Coupon"}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Container>
                            </CommonModal>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
export default CouponsTable;