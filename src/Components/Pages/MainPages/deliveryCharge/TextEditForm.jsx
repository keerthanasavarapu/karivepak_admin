// TaxEditForm.js
import React from "react";

const TaxEditForm = ({ formData, handleInputChange }) => {
    return (
        <div className="d-flex align-items-center">
            <div className="mb-0 form-group position-relative search_outer d-flex gap-4 align-items-center me-2">
                <div className="flex flex-col">
                <label className="ml-2 font-[600] text-md">Delivery charge :</label>
                <input
                    className="form-control border-1 ms-2"
                    value={formData?.platformFee}
                    name="platformFee"
                    onChange={handleInputChange}
                    type="number"
                    placeholder="Enter rate"
                />
                </div>            
            </div>
        </div>
    );
};

export default TaxEditForm;
