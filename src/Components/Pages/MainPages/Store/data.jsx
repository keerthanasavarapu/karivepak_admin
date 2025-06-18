import React from 'react';
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
import { Edit2, Eye, EyeOff, Trash2 } from 'react-feather';
import { centerCrop } from 'react-image-crop';
import { Link } from 'react-router-dom';


export const products = [
    {
        id: 1,
        Storename: 'Tom Wines',
        name: 'Tom',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        email: 'tom@gmail.com',
        phonenumber: '4578747874',
        password: '4578@gb',
        storeImage: '',
        city: 'Melborne',
        zipcode: 45785,
        isactive: 'active',
        location: '123 tom avenue,church street',
        storeRating: '4.2',
        coordinates: ''

    },
    {
        id: 2,
        Storename: 'scooby Wines',
        name: 'shaggy',
        addedBy: 'Ravi',
        status: 'inactive',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        email: 'shagger@gmail.com',
        phonenumber: '4578747874',
        password: '4578@gb',
        storeImage: '',
        city: 'adelide',
        zipcode: 45785,
        isactive: 'inactive',
        location: '123 tom avenue,church street',
        storeRating: '4.2',
        coordinates: ''

    },
    {
        id: 3,
        Storename: 'Warner WineMart',
        name: 'David Warner',
        addedBy: 'Ravi',
        status: 'active',
        createdBy: '14/01/2024',
        UpdatedBy: '22/01/2024',
        email: 'davwarn@gmail.com',
        phonenumber: '4578747874',
        password: '4578@gb',
        storeImage: '',
        city: 'sydney',
        zipcode: 45785,
        isactive: 'active',
        location: '123 tom avenue,church street',
        storeRating: '4.2',
        coordinates: ''

    },
]

export const orderColumns = [
    {
        name: 'Store Name',
        selector: row => row['Storename'],
        sortable: true,
        center: true,
        cell: (row) => (
            <p className='flex  justify-start font-medium  items-center'>
                {row.status === 'active' ? (<div className='w-2 h-2 mr-3   bg-[#008800] rounded-full' />) : (<div className='w-2 mr-3  h-2 bg-[#ff0000] rounded-full' />)} {row.Storename}
            </p>
        )
    },
    {
        name: 'Phone Number',
        selector: row => row['phonenumber'],
        sortable: true,
        center: true,
        cell: (row) => (
            <p style={{ fontWeight: '500' }}>
                {row.phonenumber}
            </p>
        )
    },
    {
        name: 'City',
        selector: row => `${row.city}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.city}</p>

            </div>
        )
    },
    {
        name: 'Zipcode',
        selector: row => `${row.zipcode}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center'>
                <p style={{ fontWeight: '500' }}>{row.zipcode}</p>

            </div>
        )
    },
    {
        name: 'Location',
        selector: row => `${row.location}`,
        cell: (row) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ fontWeight: '500' }}>{row.location}</p>
            </div>
        ),
        sortable: true,
        center: true,
    },
    // {
    //     name: 'Updated Date',
    //     selector: row => `${row.UpdatedBy}`,
    //     sortable: true,
    //     center: true,
    //     cell: (row) => (
    //         <div className='d-flex justify-content-center align-items-center'>
    //             <p className='text-center font-medium'>{row.UpdatedBy}</p>
    //         </div>
    //     ),

    // },
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

export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]