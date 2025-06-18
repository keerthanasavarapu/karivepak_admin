import React from 'react';
import { Media } from 'reactstrap';
import { H6, Image } from '../../../../AbstractElements';

import { Edit2, Eye, EyeOff, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';


export const products = [
    {
        id: 1,
        itemname: 'Blue Label',
        collectionname: 'Spirits',
        subcollectionname: 'Whisky',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        price: 500,
        addedby: 'Ram',
        discount: 15,
        ItemImage: '',


    },
    {
        id: 2,
        itemname: 'Budwiser',
        collectionname: 'Beers & Ciders',
        subcollectionname: 'Beer',
        status: 'inactive',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        price: 300,
        addedby: 'Ram',
        discount: 15,
        ItemImage: '',


    },
    {
        id: 3,
        itemname: 'Magic Moments',
        collectionname: 'spirits',
        subcollectionname: 'Vodka',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        price: 400,
        addedby: 'Ram',
        discount: 15,
        ItemImage: '',


    },
]






export const orderColumns = [
    {
        name: 'Item Name',
        selector: row => row['itemname'],
        sortable: true,
        center: true,
        cell: (row) => (
            <p className='flex  justify-start font-medium  items-center'>
                {row.status === 'active' ? (<div className='w-2 h-2 mr-3   bg-[#008800] rounded-full' />) : (<div className='w-2 mr-3  h-2 bg-[#ff0000] rounded-full' />)} {row.itemname}
            </p>
        )
    },
    {
        name: 'Collection',
        selector: row => row['collectionname'],
        sortable: true,
        center: true,
        cell: (row) => (
            <p style={{ fontWeight: '500' }}>
                {row.collectionname}
            </p>
        )
    },
    {
        name: 'Sub-Collection',
        selector: row => `${row.subcollectionname}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.subcollectionname}</p>

            </div>
        )
    },
    {
        name: 'Price',
        selector: row => `${row.price}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.price}</p>

            </div>
        )
    },
    {
        name: 'Discount',
        selector: row => `${row.discount}`,
        cell: (row) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ fontWeight: '500' }}>{row.discount}</p>
            </div>
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'Added By',
        selector: row => `${row.addedby}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-center align-items-center'>
                <p className='text-center font-medium'>{row.addedby}</p>
            </div>
        ),

    },
    {
        name: 'Actions',
        cell: (row) => (
            <div className='d-flex justify-content-center align-items-center' style={{ marginLeft: '20px' }}>
                <Link to={'/pages/mainpages/Store/StoreDetails/:layout'}>
                    <span className='rounded-2' style={{ cursor: 'pointer', marginRight: '10px', border: '1px solid #cc5500', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Eye color='#cc5500' size={16} />
                    </span>
                </Link>
                <span className='rounded-2' style={{ cursor: 'pointer', marginRight: '10px', border: '1px solid #008000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Edit2 color='#008000' size={16} />
                </span>
                <span className='rounded-2' style={{ cursor: 'pointer', border: '1px solid #ff0000', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Trash2 color='#ff0000' size={16} />
                </span>
            </div>
        ),
        sortable: false,
        center: true,
    }
]
export const Select = ({ label, value, options, onChange }) => {
    return (
        <label>
            {label}
            <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </label>
    );
};
export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]