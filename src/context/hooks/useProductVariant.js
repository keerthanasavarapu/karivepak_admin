
import React, { createContext, useContext, useEffect, useState } from 'react';
import { data as defaultData, Student } from '../../Components/Table/data';
import { baseURL, productBaseURL } from '../../Services/api/baseURL';
import axios from 'axios';
import Swal from 'sweetalert2';


const ProductVariantContext = createContext();

export const useProductVariantContext = () => useContext(ProductVariantContext);

export const ProductVariantContextProvider = ({ children }) => {
    const [data, setData] = useState([...defaultData]);
    const [originalData, setOriginalData] = useState([...defaultData]);
    const [editedRows, setEditedRows] = useState({});
    const [pageCount, setPageCount] = useState(0);

    const getProductVariants = async () => {
        // const token = await JSON.parse(localStorage.getItem("token"));

        // const response = await axios.get(`${productBaseURL}/variants/variants`, {
        //     headers: {
        //         'Authorization': token,
        //     }
        // });
        // if (response?.data?.success) {
        //     setData(response?.data?.data.reverse());
        //     setOriginalData(response?.data?.data.reverse());
        // }
    }

    const updateRow = async (id, postData) => {
        // const token = await JSON.parse(localStorage.getItem("token"));

        // const formData = new FormData();

        // postData?.variantCode && formData.append("variantCode", postData?.variantCode);
        // postData?.variantName && formData.append("variantName", postData?.variantName);
        // postData?.sellingPrice && formData.append("sellingPrice", postData?.sellingPrice);
        // postData?.purchasePrice && formData.append("purchasePrice", postData?.purchasePrice);
        // postData?.quantity && formData.append("quantity", postData?.quantity);
        // postData?.discount && formData.append("discount", postData?.discount);
        // postData?.finalSellingPrice && formData.append("finalSellingPrice", postData?.finalSellingPrice);
        // postData.Image && formData.append('Image', postData.Image);

        // try {
        //     const response = await axios.post(`${productBaseURL}/variants/create-variants`, formData, {
        //         headers: {
        //             'Authorization': token,
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     });

        //     if (response?.data.success) {
        //         getProductVariants();
        //     }

        //     console.log("response", response);

        // } catch (error) {
        //     console.error("Error:", error);
        // }
    };

    useEffect(() => {
        getProductVariants()
    }, [])

    return (
        <ProductVariantContext.Provider
            value={{
                data,
                setData,
                originalData,
                setOriginalData,
                editedRows,
                setEditedRows,
                updateRow,
                pageCount, setPageCount
            }}
        >
            {children}
        </ProductVariantContext.Provider>
    );
};
