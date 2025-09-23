import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Col, Row, Button } from 'reactstrap';
import { baseURL } from "../../../../Services/api/baseURL";
import Swal from 'sweetalert2';
import Loader from "../../../Loader/Loader";
import axios from "axios";
import exportExcelUser from '../Reports/components/exportExcelCustomer';
import DeliveryPersonForm from './DeliveryForm';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import {
    MoreVertical,
} from 'react-feather';
import {  FaEye} from 'react-icons/fa';

const DeliveryPersonTable = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryData, setDeliveryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 10,
        totalRows: 0,
    });
      const [modal, setModal] = useState({
            isOpen: false,
            type: 'add',
            selectedVariant: null
        });

        const handleDeliveryDelete=async(id)=>{
            try {
            const token = await JSON.parse(localStorage.getItem('token'));
            const response=await axios.delete(`${baseURL}/api/auth/delivery-persons/${id}`);
            console.log(response,"response of delivery delete");
                Swal.fire({
                    title:"Done",
                    text:response.data.message,
                    confirmButtonColor:"red"

                });
                fetchDeliveryPersons()
            } catch (error) {
                console.log(error,"error in delivery delete")
                Swal.fire({
                    title:"Done",
                    text:error.response.data.message,
                    confirmButtonColor:"red"

                });
            }
        }

    const columns = [
        {
            name: "Name",
            selector: row => row?.name,
            sortable: true,
        },
        {
            name: "Mobile",
            selector: row => row?.mobile_number,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row?.online,
            sortable: true,
            cell: (row) => (
                <span style={{ color: row?.online ? "green" : "red" }}>
                    {row?.online ? "Online" : "Offline"}
                </span>
            ),
        },
        {
            name: "Created",
            selector: (row) => row?.createdAt,
            sortable: true,
            cell: (row) => new Date(row?.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }),
        },
               {
                    name: 'Actions',
                    cell: row => (
                        <UncontrolledDropdown>
                            <DropdownToggle tag="span" className="p-2 cursor-pointer">
                                <MoreVertical color='#000' size={16} />
                            </DropdownToggle>
                            <DropdownMenu>

                                <DropdownItem
                                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                                    onClick={()=>handleDeliveryDelete(row._id)}
                                >
                                    <FaEye className='me-2' /> Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    ),
                    sortable: false,
                    center: true,
                    width: "100px",
                }
    ];

    const fetchDeliveryPersons = async (page) => {
        setIsLoading(true);
        try {
            const token = await JSON.parse(localStorage.getItem('token'));
            const response = await axios.get(`${baseURL}/api/auth/delivery-persons`, {
                params: {
                    page: page,
                    limit: pagination.perPage
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("getttdervv",response)
            if (response.status === 200) {
                setDeliveryData(response?.data?.deliveryPersons);
                setPagination(prev => ({
                    ...prev,
                    totalRows: response?.data?.total
                }));
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveryPersons(pagination.page);
    }, [pagination.page, pagination.perPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = deliveryData.filter((person) => {
        return person?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person?.mobile?.includes(searchTerm);
    });

    console.log(filteredData,"delivery ");
    

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleRowsPerPageChange = (rowsPerPage) => {
        setPagination({
            page: 1,
            perPage: rowsPerPage,
            totalRows: pagination.totalRows
        });
    };

    const handleSubmit = async (formData) => {
        setIsLoading(true);
        try {
            const token = await JSON.parse(localStorage.getItem('token'));
            await axios.post(`${baseURL}/api/auth/register-delivery-person`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsModalOpen(false);
            fetchDeliveryPersons(pagination.page);
            Swal.fire({
                icon: 'success',
                // title: modal.type === 'add' ? 'Delivery Person Added' : 'Delivery Person Updated',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error adding delivery person:', error);
            Swal.fire({
                icon:"info",
                title:"Note",
                text:error.response.data.message,
                confirmButtonText:"Ok"
            })
        } finally {
            setIsLoading(false);
        }
    };
    console.log(deliveryData,"delivery dataa")

    const downloadExcelData = () => {
        
        exportExcelUser(deliveryData);
    };

    return (
        <Fragment>
            <Row xxl={12} className='pb-2 pt-4'>
                <Col md={12} className='d-flex justify-content-between align-items-center mb-3'>
                    <h4>Delivery Persons</h4>
                    <div className="d-flex align-items-center">
                        <div className="mb-0 form-group position-relative search_outer d-flex align-items-center me-2">
                            <i className="fa fa-search"></i>
                            <input
                                className="form-control border-0 ms-2"
                                value={searchTerm}
                                onChange={handleSearch}
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                        <Button
                            type='button'
                            className='btn btn-primary me-2'
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add Delivery Person
                        </Button>
                        <Button
                            type='button'
                            className='btn btn-primary d-flex align-items-center'
                            style={{ minWidth: '136px' }}
                            onClick={downloadExcelData}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
                                <path d="M9.33882 8.82071L9.33871 8.82059L9.32968 8.82962L8.125 10.0341V5.75L11.687 5.75C11.6871 5.75 11.6872 5.75 11.6874 5.75C12.1348 5.75058 12.5637 5.92857 12.8801 6.24494C13.1965 6.56141 13.3745 6.99049 13.375 7.43803V15.562C13.3745 16.0095 13.1965 16.4386 12.8801 16.7551C12.5636 17.0715 12.1345 17.2495 11.687 17.25H2.31303C1.86549 17.2495 1.43641 17.0715 1.11994 16.7551C0.803539 16.4387 0.625547 16.0097 0.625 15.5622V7.43778C0.625547 6.99032 0.80354 6.56135 1.11994 6.24494C1.43631 5.92857 1.86523 5.75058 2.31263 5.75C2.31277 5.75 2.3129 5.75 2.31303 5.75L5.875 5.75V10.0341L4.67032 8.82962L4.67043 8.8295L4.66118 8.82071C4.44849 8.61864 4.16527 8.50765 3.87192 8.51141C3.57855 8.51516 3.29827 8.63337 3.09082 8.84082C2.88337 9.04827 2.76516 9.32856 2.76141 9.62191C2.75765 9.91527 2.86864 10.1985 3.07071 10.4112L3.07059 10.4113L3.07965 10.4204L6.20465 13.5454L6.20477 13.5455C6.41572 13.7563 6.70176 13.8747 7 13.8747C7.29824 13.8747 7.58428 13.7563 7.79523 13.5455L7.79535 13.5454L10.9204 10.4204L10.9205 10.4205L10.9293 10.4112C11.1314 10.1985 11.2423 9.91527 11.2386 9.62191C11.2348 9.32855 11.1166 9.04827 10.9092 8.84082C10.7017 8.63337 10.4214 8.51516 10.1281 8.51141C9.83473 8.50765 9.55151 8.61864 9.33882 8.82071ZM7.08839 0.786612C7.11183 0.810053 7.125 0.841847 7.125 0.875V4.75H6.875V0.875C6.875 0.841849 6.88817 0.810054 6.91161 0.786612C6.93505 0.763169 6.96685 0.75 7 0.75C7.03315 0.75 7.06495 0.76317 7.08839 0.786612Z" fill="white" stroke="white" />
                            </svg>
                            <span className="ms-2">Export Excel</span>
                        </Button>
                    </div>
                </Col>
            </Row>

            {isLoading ? (
                <Loader />
            ) : (
                <DataTable
                    style={{ textAlign: 'right' }}
                    data={filteredData}
                    columns={columns}
                    pagination
                    paginationServer
                    paginationTotalRows={pagination.totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    paginationPerPage={pagination.perPage}
                />
            )}

            <DeliveryPersonForm
                isModalOpen={isModalOpen}
                toggleModal={() => setIsModalOpen(!isModalOpen)}
                onSubmit={handleSubmit}
                loading={isLoading}
            />
        </Fragment>
    );
};

export default DeliveryPersonTable;