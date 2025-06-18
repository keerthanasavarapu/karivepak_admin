import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { baseURL } from "../../../../Services/api/baseURL";
import { useParams } from 'react-router';
import Loader from '../../../Loader/Loader';

const InventoryLog = () => {
    const { id } = useParams();
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
      product: '',
      category: '',
      subcategory: '',
      numberOfProducts: '',
      minimumQty: '',
      reasonForInventory: '',
      updatedAt: ''
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // Months are zero-based
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    };

  const uniqueDates = () => {
    const dates = inventory.map(record => formatDate(record.updatedAt));
    return [...new Set(dates)].sort();
  };

    const uniqueValues = (key) => [...new Set(inventory.map(record => record[key]))].sort();

    const handleFilterChange = (e) => {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value
      });
    };

    const filteredInventory = inventory.filter(record => {
      return (
        (filters.product === '' || record.product_name === filters.product) &&
        (filters.category === '' || record.category_name === filters.category) &&
        (filters.subcategory === '' || record.subcategory_name === filters.subcategory) &&
        (filters.numberOfProducts === '' || record.number_of_products.toString() === filters.numberOfProducts) &&
        (filters.minimumQty === '' || record.minimum_qty.toString() === filters.minimumQty) &&
        (filters.reasonForInventory === '' || record.reason_for_inventory === filters.reasonForInventory) &&
        (filters.updatedAt === '' || formatDate(record.updatedAt) === filters.updatedAt)
      );
    });
  

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = await JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(`${baseURL}/api/admin/get-stock-inventory/${id}`, {
            headers: {
              Authorization: `${token}`,
            }
          }); // Adjust the URL as necessary
          console.log(response.data.data);
          setInventory(response.data.data); 
          
        } catch (error) {
          console.error('Error fetching stock data:', error);
        } finally {
            setLoading(false);
        }
      };
  
      fetchData();
    }, [id]);
  
    return (
        <div className="p-4">
        {!loading  ? ( inventory.length>0 ? ( 
         
          <>
            <h4 className='text-2xl font-bold mb-4'>Inventory Log for store : {inventory[0].store_name}</h4>
            <div className="overflow-auto">
            <table className="min-w-full bg-white border border-gray-200" >
              <thead>
              <tr>
              <th className="px-2 py-2 border-b">
              <select
                name="product"
                value={filters.product}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value="">Products</option>
                {uniqueValues('product_name').map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
              
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value="">Categories</option>
                {uniqueValues('category_name').map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
              
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="subcategory"
                value={filters.subcategory}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value=""> Subcategories</option>
                {uniqueValues('subcategory_name').map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
              
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="numberOfProducts"
                value={filters.numberOfProducts}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value="">Number of Products</option>
                {uniqueValues('number_of_products').map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
              
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="minimumQty"
                value={filters.minimumQty}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value=""> Minimum Quantity</option>
                {uniqueValues('minimum_qty').map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}
              </select>
             
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="reasonForInventory"
                value={filters.reasonForInventory}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value=""  className="w-full">Reason for Inventory</option>
                {uniqueValues('reason_for_inventory').map((value, index) => (
                  <option key={index} value={value} >{value}</option>
                ))}
              </select>
              
            </th>
            <th className="px-2 py-2 border-b">
              <select
                name="updatedAt"
                value={filters.updatedAt}
                onChange={handleFilterChange}
                className="w-full"
              >
                <option value="">Updated At</option>
                {uniqueDates().map((value, index) => (
                  <option key={index} value={value}>{value}</option>
                ))}

              </select>
              
            </th>
          </tr>
              </thead>
              <tbody>
              {filteredInventory.map((record) => (
                <tr key={record._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{record.product_name}</td>
                  <td className="px-4 py-2 border-b">{record.category_name}</td>
                  <td className="px-4 py-2 border-b">{record.subcategory_name}</td>
                  <td className="px-4 py-2 border-b">{record.number_of_products}</td>
                  <td className="px-4 py-2 border-b">{record.minimum_qty}</td>
                  <td className="px-4 py-2 border-b">{record.reason_for_inventory ? record.reason_for_inventory : "NA"}</td>
                  <td className="px-4 py-2 border-b">{new Date(record.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </>
      ) : <p className='text-2xl font-bold mb-4'>No Inventory Records Found.</p>) : (
        <Loader />
      )}
    </div>

  );
};



export default InventoryLog