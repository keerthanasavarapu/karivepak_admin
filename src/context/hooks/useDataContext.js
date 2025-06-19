
import React, { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataContextProvider = ({ children }) => {
    const [productsData, changeProductsData] = useState([]);
    const [storeData, changeStoreData] = useState([]);
    const [dashboardOrdersData,  changeDashboardOrdersData] = useState([]);
    const [dashboardTopProducts, changeDashboardTopProducts] = useState([]);
    const [variantsData, changeVariantsData] = useState([]);
    const [categoryData, changeCategoryData] = useState([]);

    const setProductsData = (data) => {
        changeProductsData(data);
    }

    const setStoreData = (data) => {
        changeStoreData(data);
    } 

    const setDashboardOrdersData = (data) => {
        changeDashboardOrdersData(data);
    }

    const setAllVariantsData = (data) => {
        changeVariantsData(data);
    }

    const setDashboardTopProducts = (data) => {
        changeDashboardTopProducts(data)
    }

    const setCategoryData = (data) => {
        changeCategoryData(data);
    }

    const maincategory = (data)=>{
        const categoryData = data.filter((item) => item.parent === null);
        changeCategoryData(categoryData);
    }

    return (
        <DataContext.Provider
            value={{
                productsData,
                setProductsData,
                storeData,
                setStoreData,
                dashboardOrdersData,
                setDashboardOrdersData,
                variantsData,
                setAllVariantsData,
                dashboardTopProducts,
                setDashboardTopProducts,
                categoryData,
                setCategoryData,
                maincategory
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
