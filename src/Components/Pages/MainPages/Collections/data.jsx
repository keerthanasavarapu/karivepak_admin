import React, { useEffect } from 'react';
import { Media } from 'reactstrap';
import { H6, Image } from '../../../../AbstractElements';
import user1 from '../../../../assets/images/user/1.jpg';
import user2 from '../../../../assets/images/user/2.png';
import user3 from '../../../../assets/images/user/3.jpg';
import user4 from '../../../../assets/images/user/3.png';
import user5 from '../../../../assets/images/user/4.jpg';
import user6 from '../../../../assets/images/user/5.jpg';
import user7 from '../../../../assets/images/user/6.jpg';
import user8 from '../../../../assets/images/user/7.jpg';
import user9 from '../../../../assets/images/user/8.jpg';
import user10 from '../../../../assets/images/user/9.jpg';
import user11 from '../../../../assets/images/user/10.jpg';
import user12 from '../../../../assets/images/user/11.png';
import user13 from '../../../../assets/images/logo/Coopers Extra Stout 6btls 1.svg';
import { Edit2, Eye, Trash2 } from 'react-feather';
import { centerCrop } from 'react-image-crop';
import axios from 'axios';



export const products = [
    {
        id: 1,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
    {
        id: 2,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'Inactive',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
    {
        id: 3,
        collectionName: 'Beers & Ciders',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',

    },
]






export const orderColumns = [
    {
        name: 'Collection Name',
        selector: row => row['collectionName'],
        sortable: true,
        center: true,
        cell: (row) => (
            <p style={{ fontWeight: '500' }}>
                {row.collectionName}
            </p>
        )
    },
    {
        name: 'Added By',
        selector: row => `${row.addedBy}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.addedBy}</p>

            </div>
        )
    },
    {
        name: 'Status',
        selector: row => `${row.status}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.status}</p>

            </div>
        )
    },
    {
        name: 'Created Date',
        selector: row => `${row.createdBy}`,
        cell: (row) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ fontWeight: '500' }}>{row.createdBy}</p>
            </div>
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'Updated Date',
        selector: row => `${row.UpdatedBy}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-center align-items-center'>
                <p className='text-center font-medium'>{row.UpdatedBy}</p>
            </div>
        ),

    },
    {
        name: 'Actions',
        cell: (row) => (
            <div className='d-flex justify-content-center align-items-center' style={{ marginLeft: '20px' }}>

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
export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]