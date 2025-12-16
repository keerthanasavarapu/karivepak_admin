import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Col, Row, Button } from 'reactstrap';
import { Modal } from "react-bootstrap";
import TaxEditForm from "./TaxEditForm ";
import { baseURL } from "../../../../Services/api/baseURL";
import Loader from "../../../Loader/Loader";
import { Edit } from 'react-feather';
import axios from "axios";
import Swal from "sweetalert2";


const GstTable = () => {

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const token = JSON.parse(localStorage.getItem("token"));


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const initialformData = {
        cgst: 0,
        sgst: 0
    }

    const [formData, setFormData] = useState(initialformData)

    console.log(formData, "formdata")

    const fetchGst = async () => {
        try {

            const response = await axios.get(`${baseURL}/api/gst/admin/gst`, {
                headers: {
                    Authorization: `${token}`,

                }
            });
            const gst = response.data.gst
            setFormData({
                cgst: gst.cgst,
                sgst: gst.sgst
            })
            console.log(response.data, "gst resposne")
        } catch (error) {
            console.log(error, "error in update gst")

        }
    }

    useEffect(() => {
        fetchGst();
    }, [])

    const handleUpdateGst = async () => {
        try {
            const payload = {
                cgst: formData.cgst,
                sgst: formData.sgst
            }
            const response = await axios.put(`${baseURL}/api/gst/admin/gst`, payload, {
                headers: {
                    Authorization: `${token}`,

                }
            });
            if(response.data.success === true){
                setShow(false);
                Swal.fire({
                    icon:"success",
                    title:"Done",
                    text:"Gst updated successfully"
                });
                fetchGst();
            }
        
            console.log(response, "gst update resposne")
        } catch (error) {
            console.log(error, "error in update gst")

        }
    }


    return (
        <>
        <Fragment>
            <Row xxl={12} className='pb-2'>
                <Col md={12} className='d-flex justify-content-between align-items-center mb-3'>
                    <h4>GST</h4>

                    <div className="d-flex gap-2">
                        <Button size="sm" className="me-2" onClick={handleShow}>
                            <Edit size={14} />
                        </Button>

                        <Modal show={show} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Tax Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <TaxEditForm formData={formData} handleInputChange={handleInputChange} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                            type='button'
                            className='btn btn-primary d-flex align-items-center'
                            style={{ minWidth: '136px' }}

                        >

                            <span className="ms-2" onClick={() => handleUpdateGst()}>Update GST</span>
                        </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </Col>


            </Row>


        </Fragment>
        <div className="flex flex-col gap-3" >
                   <span className="font-[500] text-lg">Central Goods and Services Tax  -  {formData.cgst}%</span> 
                    <span className="font-[500] text-lg">State Goods and Services Tax  -  {formData.sgst}%</span>
                </div>
        </>
    );
};

export default GstTable;
