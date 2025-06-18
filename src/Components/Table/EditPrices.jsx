import { useState, useEffect } from "react";
import CommonModal from "../UiKits/Modals/common/modal";
import { Button, Col, Container, Form, Input, Label, Row, Table } from "reactstrap";
import './table.css'
import axios from "axios";
import { baseURL } from "../../Services/api/baseURL";
import { toast } from "react-toastify";





export const EditPrices = ({ row, table }) => {
    const meta = table.options.meta;
    const [openPriceModal, setPriceOpenModal] = useState(false);

    const [rowData, setRowData] = useState(null);
    const [isPriceShow, setIsPriceShow] = useState(true);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [storeData, setStoreData] = useState([])
    const [storeId, setStoreId] = useState([]);
    const [priceData, setPriceData] = useState([])

    const [discount, setDiscount] = useState(0);
    const [finalSellingPrice, setFinalSellingPrice] = useState(0);
    console.log(rowData, "rowData")
    console.log(priceData, "priceData")

    useEffect(() => {
        setFinalSellingPrice(sellingPrice - (sellingPrice * discount / 100));
    }, [sellingPrice, discount])

    const handleSave = () => {
        if (parseInt(sellingPrice) === 0) {
            toast.error("Please enter valid values");
            return;
        }

        if (parseInt(finalSellingPrice) === 0) {
            toast.error("Please enter valid values");
            return;
        }

        if (storeId === "") {
            toast.error("Please Select Store Name");
            return;
        }

        if (storeId) {
            const isExist = priceData?.find((data) => data.storeId === storeId);
            if (isExist) {
                toast.error("Store Price Already Exist");
                return;
            }
        }

        const newPrice = {
            discount: parseFloat(discount),
            sellingPrice: parseFloat(sellingPrice),
            storeId: storeId,
            finalSellingPrice: parseFloat(finalSellingPrice)
        }

        let updatedPriceData

        if (priceData === undefined || priceData.length === 0) {
            updatedPriceData = [newPrice]
        } else {
            updatedPriceData = [...priceData, newPrice]
        }

        setPriceData(updatedPriceData);
        setSellingPrice(0);
        setDiscount(0);
        setFinalSellingPrice(0);
        setStoreId([""]);
        // setFinalSellingPrice(sellingPrice - (sellingPrice * discount / 100));
    }

    const toggleModal = () => {
        setPriceOpenModal(!openPriceModal);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedRowData = { ...rowData };
        if (!updatedRowData.storePricing) {
            updatedRowData.storePricing = [];
        }
        updatedRowData.storePricing = priceData;
        console.log(updatedRowData, "updatedRowData")
        meta?.updateRow(row.index, updatedRowData);
        setPriceOpenModal(false);
        setPriceData([]);
        setSellingPrice(0);
        setDiscount(0);
        setFinalSellingPrice(0);
        setIsPriceShow(false);
    }

    const handleClose = () => {
        setPriceOpenModal(!openPriceModal);
        setPriceData([]);
        setSellingPrice(0);
        setDiscount(0);
        setFinalSellingPrice(0);
        setIsPriceShow(false);
    }

    const handleDiscount = (e) => {
        setDiscount(e.target.value);
        // setFinalSellingPrice(sellingPrice - e.target.value);
        setFinalSellingPrice(sellingPrice - (sellingPrice * discount / 100));
    }

    // const handleEdit = (index) => {
    //     console.log("index", index)
    //     const editPriceData = [...priceData];
    //     const selectedData = editPriceData[index];
    //     console.log(selectedData, "selectedData")
    //     // setSellingPrice(selectedData.sellingPrice);
    //     // setDiscount(selectedData.discount);
    //     // setFinalSellingPrice(selectedData.finalSellingPrice);
    //     // setStoreId(selectedData.storeId);
    //     // updatedPriceData.splice(index, 1);
    //     // setPriceData(updatedPriceData);
    // }

    const handleEdit = (e, index) => {
        e.preventDefault();
        setIsPriceShow(true)
        console.log("index", index)
        const editPriceData = [...priceData];
        const selectedData = editPriceData[index];
        console.log(selectedData, "selectedData")
        setSellingPrice(selectedData.sellingPrice);
        setDiscount(selectedData.discount);
        setFinalSellingPrice(selectedData.finalSellingPrice);
        setStoreId(selectedData.storeId);
        editPriceData.splice(index, 1);
        setPriceData(editPriceData);
    }

    const handleDelete = (index) => {
        const updatedPriceData = [...priceData];
        updatedPriceData.splice(index, 1);
        setPriceData(updatedPriceData);
    }

    useEffect(() => {
        fetchStores();
    }, [])

    const handleDeleteOffer = (index) => {
        // const updatedOffersData = [...offersData];
        // updatedOffersData.splice(index, 1);
        // setOffersData(updatedOffersData);
    };

    const fetchStores = async () => {
        const token = await JSON.parse(localStorage.getItem("token"));
        try {
            const stores = await axios.get(`${baseURL}/api/store/get-all-stores`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            let filteredData = stores?.data?.data.filter((item) => item.status === "active");
            setStoreData(filteredData || []);
        } catch (error) {
            console.log(error);
            console.error(error);
        }
    };


    return (
        <div className="edit-cell-container">
            {meta?.editedRows[row.id] ? (
                <div className="edit-cell-action">
                    <button type="button" className='btn btn-secondary' onClick={() => {
                        setPriceOpenModal(!openPriceModal);
                        setRowData(row?.original);
                        setPriceData(row?.original?.storePricing);
                    }}
                        name="done"
                    >
                        Add Prices
                    </button>
                </div>
            ) : (
                <div className="edit-cell-action">
                    <button className='btn btn-secondary' name="done" disabled={true}
                    >
                        Click Edit
                    </button>
                </div>
            )}



            <CommonModal isOpen={openPriceModal} title={"Store Pricing"} className="store_modal" toggler={toggleModal} size="lg">
                <Container>
                    <Form >
                        <>
                            <div className='flex justify-between py-3'>
                                <h6 className={`text-[#1D2433] font-semibold`}>Prices</h6>
                                <button type='button' className='text-[#D3178A]'
                                    onClick={() => setIsPriceShow(true)}
                                >+ Add Store Prices</button>
                            </div>
                            {
                                isPriceShow &&
                                <Row className='items-end border p-2 rounded-3xl'>
                                    <Col lg={3}>
                                        <Label htmlFor="storeName">STORE NAME</Label>
                                        <Input id="storeName" type='select' onChange={(e) => setStoreId(e.target.value)} >
                                            <option value=''>select store</option>
                                            {storeData && storeData.length > 0 && storeData.map((data) => (
                                                <option key={data._id} value={data._id}>{data.storeName}</option>
                                            ))}
                                        </Input>
                                    </Col>
                                    <Col lg={2}>
                                        <Label htmlFor="sellingPrice">SELLING PRICE</Label>
                                        <Input id="sellingPrice" type='number' min={0} value={sellingPrice}
                                            onChange={(e) => {
                                                setSellingPrice(e.target.value)
                                                // setFinalSellingPrice(sellingPrice - (sellingPrice * discount / 100));
                                            }}
                                        />
                                    </Col>
                                    <Col lg={2}>
                                        <Label htmlFor="discount">DISCOUNT</Label>
                                        <Input id="discount" type='number'
                                            min={0}
                                            value={discount}
                                            onChange={
                                                // handleDiscount}
                                                (e) => {
                                                    setDiscount(e.target.value)
                                                    // setFinalSellingPrice(sellingPrice - (sellingPrice * discount / 100));
                                                }}
                                        />
                                    </Col>
                                    <Col lg={3}>
                                        <Label htmlFor="finalSellingPrice">FINAL SELLING PRICE</Label>
                                        <Input id="finalSellingPrice" type='number'
                                            min={0}
                                            // value={sellingPrice - discount}
                                            // value={sellingPrice - (sellingPrice * discount / 100)}
                                            value={finalSellingPrice}
                                            disabled={true}
                                        // onChange={(e) => setFinalSellingPrice(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm={2} className="d-flex  align-items-end">
                                        <button type='button' className='btn btn-secondary w-100' onClick={() => handleSave()}>Save</button>
                                    </Col>
                                </Row>
                            }

                            <Row className='offer_table_container'>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th >STORE NAME</th>
                                            <th >SELLING PRICE</th>
                                            <th >DISCOUNT</th>
                                            <th >FINAL SELLING PRICE</th>
                                            {/* <th >STATE</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {priceData && priceData.length > 0 && priceData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{storeData.find(store => store._id === data.storeId)?.storeName}</td>
                                                <td>{data.sellingPrice}</td>
                                                <td>{data.discount}</td>
                                                <td>{data.finalSellingPrice}</td>
                                                <td>
                                                    <button
                                                        onClick={(e) => handleEdit(e, index)}
                                                        name="edit" className='me-2'>
                                                        <i className="fa fa-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(index)}
                                                        name="remove">
                                                        <i className="fa fa-trash-o"></i>
                                                    </button>
                                                    {/* <button type='button' className='bg-transparent ' onClick={() => handleDeleteOffer(index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M16.875 3.75H13.125V2.8125C13.125 2.3981 12.9604 2.00067 12.6674 1.70765C12.3743 1.41462 11.9769 1.25 11.5625 1.25H8.4375C8.0231 1.25 7.62567 1.41462 7.33265 1.70765C7.03962 2.00067 6.875 2.3981 6.875 2.8125V3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.78906L4.53125 16.9109C4.58672 17.9598 5.39062 18.75 6.40625 18.75H13.5938C14.6145 18.75 15.4023 17.9773 15.4688 16.9141L16.2109 5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM7.52227 16.25H7.5C7.33803 16.2501 7.18234 16.1873 7.06575 16.0749C6.94916 15.9624 6.88077 15.8091 6.875 15.6473L6.5625 6.89727C6.55659 6.73151 6.61678 6.57019 6.72981 6.4488C6.84285 6.32742 6.99947 6.25591 7.16523 6.25C7.33099 6.24409 7.49231 6.30428 7.6137 6.41731C7.73508 6.53035 7.80659 6.68697 7.8125 6.85273L8.125 15.6027C8.12798 15.6848 8.11474 15.7667 8.08605 15.8437C8.05737 15.9206 8.01378 15.9912 7.95781 16.0513C7.90183 16.1114 7.83455 16.1599 7.75981 16.194C7.68508 16.2281 7.60436 16.2471 7.52227 16.25ZM10.625 15.625C10.625 15.7908 10.5592 15.9497 10.4419 16.0669C10.3247 16.1842 10.1658 16.25 10 16.25C9.83424 16.25 9.67527 16.1842 9.55806 16.0669C9.44085 15.9497 9.375 15.7908 9.375 15.625V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V15.625ZM11.875 3.75H8.125V2.8125C8.12453 2.77133 8.13229 2.73048 8.14783 2.69236C8.16337 2.65423 8.18637 2.61959 8.21548 2.59048C8.24459 2.56137 8.27923 2.53837 8.31736 2.52283C8.35548 2.50729 8.39633 2.49953 8.4375 2.5H11.5625C11.6037 2.49953 11.6445 2.50729 11.6826 2.52283C11.7208 2.53837 11.7554 2.56137 11.7845 2.59048C11.8136 2.61959 11.8366 2.65423 11.8522 2.69236C11.8677 2.73048 11.8755 2.77133 11.875 2.8125V3.75ZM13.125 15.6473C13.1192 15.8091 13.0508 15.9624 12.9343 16.0749C12.8177 16.1873 12.662 16.2501 12.5 16.25H12.4773C12.3953 16.2471 12.3146 16.228 12.2399 16.1939C12.1652 16.1598 12.098 16.1113 12.0421 16.0512C11.9861 15.9911 11.9426 15.9205 11.9139 15.8436C11.8852 15.7666 11.872 15.6848 11.875 15.6027L12.1875 6.85273C12.1904 6.77066 12.2095 6.68996 12.2436 6.61525C12.2777 6.54054 12.3262 6.47328 12.3863 6.41731C12.4464 6.36134 12.5169 6.31776 12.5939 6.28905C12.6708 6.26035 12.7527 6.24708 12.8348 6.25C12.9168 6.25292 12.9975 6.27199 13.0722 6.3061C13.147 6.34021 13.2142 6.3887 13.2702 6.4488C13.3262 6.50891 13.3697 6.57945 13.3984 6.65639C13.4272 6.73334 13.4404 6.81519 13.4375 6.89727L13.125 15.6473Z" fill="#1D2433" fill-opacity="0.8" />
                                                        </svg>
                                                    </button> */}
                                                </td>
                                                {/* <td>
                                                    <Button variant="warning" onClick={() => handleDeleteOffer(index)}>Edit</Button>
                                                    <Button variant="danger" onClick={() => handleDeleteOffer(index)}>Delete</Button>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                {
                                    priceData && priceData.length === 0 &&
                                    <p className="my-5 text-center">No Store Prices Found</p>
                                }
                            </Row>

                        </>
                        <Row>
                            <Col xxl={12} className='text-right mt-4'>
                                <Button className='cancel_Btn' type='button' onClick={() => handleClose()}>
                                    Cancel
                                </Button>
                                <Button type='button' onClick={handleSubmit} className='cursor-pointer bg-[#ff0000] font-medium w-40 ms-2 px-2 py-2 rounded-2xl text-white flex justify-center items-center'>
                                    Save Details
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </CommonModal>
        </div>
    )
}