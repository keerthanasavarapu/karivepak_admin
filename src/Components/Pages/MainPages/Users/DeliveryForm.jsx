import React, { useState } from 'react';
import {
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import CommonModal from '../../../UiKits/Modals/common/modal';

const DeliveryForm = ({
    isModalOpen,
    toggleModal,
    editData,
    onSubmit,
    loading
}) => {
    const [formData, setFormData] = useState({
        name: editData ? editData.name : '',
        mobile: editData ? editData.mobile_number : ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <CommonModal
            isOpen={isModalOpen}
            title={editData ? "Edit Delivery Person" : "Add Delivery Person"}
            className="delivery_modal"
            toggler={toggleModal}
            size="md"
        >
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Col xxl={12}>
                        <FormGroup>
                            <Label className="font-medium text-base">
                                Full Name <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label className="font-medium text-base">
                                Mobile Number <span className="text-danger">*</span>
                            </Label>
                            <Input
                                type="tel"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleInputChange}
                                placeholder="Enter mobile number"
                                pattern="[0-9]{10}"
                                maxLength="10"
                                required
                            />
                        </FormGroup>
                        <Row className="text-center">
                            <Button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Loading..."
                                ) : (
                                    editData ? "Update Delivery Person" : "Add Delivery Person"
                                )}
                            </Button>
                        </Row>
                    </Col>
                </Form>
            </Container>
        </CommonModal>
    );
};

export default DeliveryForm;