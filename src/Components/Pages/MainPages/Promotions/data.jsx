import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Media, UncontrolledDropdown } from 'reactstrap';
import { Download, DownloadCloud, Edit2, Eye, EyeOff, MoreVertical, Trash2 } from 'react-feather';
import { FaDownload, FaEye, FaPen, FaRegEye, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';




export const products = [
    {
        _id: ' #SK2540',
        customer: 'Neal Matthews',
        phoneNo: '+61 123 456 789',
        date: '22 Oct, 2020',
        total: '$129.99',
        payment: `••• 1234`,
        discardFrom: 'Go Booze Store 1',
        address: '169 Alex Way, Irvine, Northern Territory 7453, Australia',
        status: 'Processing',
    },
    {
        _id: ' #SK2540',
        customer: 'Neal Matthews',
        phoneNo: '+61 123 456 789',
        date: '22 Oct, 2020',
        total: '$129.99',
        payment: `••• 1234`,
        discardFrom: 'Go Booze Store 1',
        address: '169 Alex Way, Irvine, Northern Territory 7453, Australia',
        status: 'Processing',
    },
    {
        _id: ' #SK2540',
        customer: 'Neal Matthews',
        phoneNo: '+61 123 456 789',
        date: '22 Oct, 2020',
        total: '$129.99',
        payment: `••• 1234`,
        discardFrom: 'Go Booze Store 1',
        address: '169 Alex Way, Irvine, Northern Territory 7453, Australia',
        status: 'Processing',
    },
]


export const orderColumns = [
    {
        name: '#ORDER_ID',
        selector: row => row['sequence_number'],
        sortable: true,
        center: true,
        cell: (row) => (
            row?.sequence_number
        )
    },
    {
        name: 'CUSTOMER NAME',
        selector: row => `${row.customer}`,
        sortable: true,
        center: true,
        cell: (row) => (
            <div className=''>
                <p className='mb-0'>{row.customer}</p>
                <p>{row.phoneNo}</p>
            </div>
        )
    },
    {
        name: 'ORDER DATE',
        selector: row => `${row.date}`,
        sortable: true,
        center: true,
        cell: (row) => (
            row.date
        )
    },
    {
        name: 'TOTAL',
        selector: row => `${row.total}`,
        cell: (row) => (
            row.total
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'PAYMENT DETAILS',
        selector: row => `${row.payment}`,
        cell: (row) => (
            row.payment
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'DISCARD FROM',
        selector: row => `${row.discardFrom}`,
        cell: (row) => (
            row.discardFrom
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'DELIVERY ADDRESS',
        selector: row => `${row.address}`,
        cell: (row) => (
            row.address
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'ORDER STATUS',
        selector: row => `${row.status}`,
        cell: (row) => (
            row.status
        ),
        sortable: true,
        center: true,
    },
    {
        name: 'Actions',
        cell: (row) => (
            <div className='d-flex justify-content-end align-items-center' style={{ marginRight: '20px' }}>
                <div
                    className='cursor-pointer'
                >
                    <UncontrolledDropdown className='action_dropdown'>
                        <DropdownToggle className='action_btn'
                        >
                            <MoreVertical color='#000' size={16} />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem >
                                Edit
                                <FaPen />
                            </DropdownItem>
                            <DropdownItem >
                                View
                                <FaRegEye />
                            </DropdownItem>
                            <DropdownItem >
                                Invoice
                                <FaDownload />
                            </DropdownItem>
                            <DropdownItem className='delete_item' >
                                Delete
                                <FaTrashAlt />
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
        ),
        sortable: false,
        center: true,
    }
]