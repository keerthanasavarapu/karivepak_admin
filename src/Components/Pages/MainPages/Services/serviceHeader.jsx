import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import { H3, H5, H6, P } from '../../../../AbstractElements';
import axios from 'axios';
import { productBaseURL } from '../../../../Services/api/baseURL';
import CategoryCountCard from '../../../CategoryCountCard';
import { useDataContext } from '../../../../context/hooks/useDataContext';

function ProductsHeader() {
    const { productsData } = useDataContext();
    const [countData, setCountData] = useState([]);

    const getData = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        const userData = await JSON.parse(localStorage.getItem('UserData'))
        const userRole = JSON.parse(localStorage.getItem('role_name'));
        let user = userRole !== 'admin' ? { role: userRole, storeId: userData?._id } : {};
       
        try {
            await axios.get(`${productBaseURL}/products/get-product-counts/`, {
                params: user ,
                headers: {
                    Authorization: `${token}`,
                },
            }).then((response) => {
                if (response.status === 200) {
                    let updatedData = response?.data?.data;
                    // let updatedData = response.data.data.sort((a, b) =>
                    //     a.category.localeCompare(b.category));
                    // let updatedData = response.data.data;
                    // updatedData.forEach(function (item, i) {
                    //     if (item.category === "Total Products") {
                    //         updatedData.splice(i, 1);
                    //         updatedData.unshift(item);
                    //     }
                    // })
                    setCountData(updatedData);
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getData();
    }, [productsData]);


    return (
        <>
            <CategoryCountCard data={countData} />
        </>
    )
}

export default ProductsHeader
