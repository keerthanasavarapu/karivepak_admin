import { useState } from 'react';
import CommonModal from '../UiKits/Modals/common/modal';
import { Button, Col, Container, Form, FormGroup, Table, Input, InputGroup, InputGroupText, Label, Media, Row, UncontrolledDropdown } from 'reactstrap';
import { Image } from '../../AbstractElements';
import { imageURL } from '../../Services/api/baseURL';
import dummyImg from '../../assets/images/product/2.png';
import { toast } from 'react-toastify';

export const EditCell = ({ row, table }) => {
  const meta = table.options.meta;
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [offerType, setOfferType] = useState('dollar');
  const [isShow, setIsShow] = useState(false);
  const [offersData, setOffersData] = useState([]);
  const [isOfferApplied, setIsOfferApplied] = useState(rowData?.isOfferApplied);

  // const setEditedRows = (e) => {
  //   const elName = e.currentTarget.name;
  //   meta?.setEditedRows((old) => ({
  //     ...old,
  //     [row.id]: !old[row.id],
  //   }));
  //   // if (elName !== 'edit') {
  //   //   meta?.revertData(row.index, e.currentTarget.name === 'cancel');
  //   // }
  //   if (elName !== "edit") {
  //     e.currentTarget.name === "cancel" ? meta?.revertData(row.index) : meta?.updateRow(row.index);
  //   }
  // };

  const setEditedRows = (e) => {
    e.preventDefault();
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== 'edit') {
      meta?.revertData(row.index, e.currentTarget.name === 'cancel');
    }
  };

  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  const toggleModal = () => {
    setOpenModal(!openModal)
  }

  const handleSave = () => {
    if (parseInt(quantity) === 0 || parseFloat(offerPrice) === 0) {
      toast.error("Quantity and offer price cannot be 0");
      return;
    }

    const newOffer = {
      quantity: parseInt(quantity),
      offerPrice: parseFloat(offerPrice),
      offerType: offerType,
      isActive: false
  };
    // const updatedRowData = { ...rowData };
    // if (!updatedRowData.offers) {
    //   updatedRowData.offers = [];
    // }
    // updatedRowData.offers.push(newOffer);
    // meta?.updateRow(row.index, updatedRowData);
    // setRowData(row?.original);


    // const updatedOffersData = [...offersData, newOffer];

    let updatedOffersData;
    if (offersData === undefined) {
      updatedOffersData = [newOffer];
    } else {
      updatedOffersData = [...offersData, newOffer];
    }
    setOffersData(updatedOffersData);
    setOfferPrice(0);
    setQuantity(0);
  };

  // const handleDeleteOffer = (index) => {
  //   const updatedRowData = { ...rowData };
  //   updatedRowData.offers.splice(index, 1);
  //   meta?.updateRow(row.index, updatedRowData);
  // };

  // const handleIsActiveChange = (index) => {
  //   const updatedRowData = { ...rowData };
  //   updatedRowData.offers[index].isActive = !updatedRowData.offers[index].isActive;
  //   meta?.updateRow(row.index, updatedRowData);
  //   setRowData(updatedRowData);
  // };

  const handleOfferAppliedChange = () => {
    setIsOfferApplied(!isOfferApplied);
  }

  const handleDeleteOffer = (index) => {
    const updatedOffersData = [...offersData];
    updatedOffersData.splice(index, 1);
    setOffersData(updatedOffersData);
  };

  const handleIsActiveChange = (index) => {
    const updatedOffersData = offersData.map((offer, i) => {
      if (i === index) {
        return { ...offer, isActive: true };
      } else {
        return { ...offer, isActive: false };
      }
    });
    setOffersData(updatedOffersData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedRowData = { ...rowData };
    if (!updatedRowData.offers) {
      updatedRowData.offers = [];
    }
    updatedRowData.offers = offersData;
    updatedRowData.isOfferApplied = isOfferApplied;
    meta?.updateRow(row.index, updatedRowData);
    setOpenModal(false);
    setQuantity(0);
    setOfferPrice(0);
  };

  // const handleClose = () => {
  //   setOpenModal(false);
  //   setQuantity(0);
  //   setOfferPrice(0);
  //   let updatedRowData = { ...rowData };
  //   console.log(updatedRowData, "1updatedRowData")
  //   updatedRowData.offers = [];
  //   meta?.updateRow(row.index, updatedRowData);
  //   setRowData(updatedRowData);
  // };

  const handleClose = () => {
    setOpenModal(false);
    setRowData(null);
    setQuantity(0);
    setOfferPrice(0);
    setOffersData(rowData?.offers);
  };

  const isRequiredValueEmpty = row.requiredValue === "";

  const handleOfferModeChange = () => {
    const newOfferType = offerType === 'dollar' ? 'percent' : 'dollar';
    setOfferType(newOfferType);
  };

  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="edit-cell-action">
          <button type='button' onClick={() => {
            setOpenModal(!openModal);
            setRowData(row?.original);
            setOffersData(row?.original?.offers);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8.00001 9.5C8.82844 9.5 9.50001 8.82843 9.50001 8C9.50001 7.17157 8.82844 6.5 8.00001 6.5C7.17159 6.5 6.50001 7.17157 6.50001 8C6.50001 8.82843 7.17159 9.5 8.00001 9.5Z" fill="#0162DD" />
              <path d="M14.6997 9.375L14.685 9.36312L13.6988 8.58969C13.6363 8.54028 13.5865 8.47676 13.5533 8.40434C13.5202 8.33193 13.5047 8.25269 13.5081 8.17313V7.81187C13.505 7.73282 13.5207 7.65415 13.5539 7.58233C13.5871 7.51051 13.6368 7.44759 13.6991 7.39875L14.685 6.625L14.6997 6.61312C14.8518 6.48646 14.9538 6.30983 14.9876 6.11483C15.0214 5.91984 14.9847 5.71918 14.8841 5.54875L13.5494 3.23938C13.5479 3.2372 13.5465 3.2349 13.5453 3.2325C13.4442 3.06443 13.2874 2.93708 13.1021 2.87257C12.9169 2.80806 12.7149 2.81047 12.5313 2.87937L12.5203 2.88344L11.361 3.35C11.2878 3.37959 11.2086 3.39136 11.13 3.38435C11.0514 3.37734 10.9756 3.35175 10.9088 3.30969C10.8063 3.2451 10.7021 3.18406 10.5963 3.12656C10.5276 3.08935 10.4687 3.03654 10.4243 2.97238C10.3798 2.90821 10.3511 2.8345 10.3403 2.75719L10.1656 1.52L10.1619 1.4975C10.1239 1.30587 10.021 1.13318 9.87068 1.00844C9.72033 0.883692 9.53162 0.814505 9.33626 0.8125H6.66376C6.46566 0.813134 6.27413 0.883661 6.12293 1.01166C5.97172 1.13965 5.87054 1.31691 5.8372 1.51219L5.83439 1.52969L5.66033 2.76938C5.64965 2.84647 5.62112 2.92001 5.57701 2.98413C5.53291 3.04826 5.47444 3.1012 5.40626 3.13875C5.29939 3.19625 5.19501 3.25719 5.09376 3.32063C5.0271 3.36243 4.95146 3.38783 4.87307 3.39473C4.79468 3.40163 4.71577 3.38983 4.64283 3.36031L3.48252 2.89156L3.47158 2.88719C3.28766 2.81821 3.08538 2.81589 2.89993 2.88064C2.71448 2.94539 2.5576 3.0731 2.45658 3.24156L2.45252 3.24844L1.11595 5.55937C1.01521 5.72998 0.978443 5.93086 1.01222 6.12609C1.046 6.32131 1.14812 6.49816 1.30033 6.625L1.31502 6.63688L2.30127 7.41031C2.36372 7.45972 2.41357 7.52324 2.4467 7.59566C2.47984 7.66807 2.49533 7.74731 2.49189 7.82688V8.18812C2.49502 8.26718 2.47934 8.34585 2.44615 8.41767C2.41296 8.48949 2.36319 8.55241 2.30095 8.60125L1.31502 9.375L1.30033 9.38688C1.14827 9.51354 1.04623 9.69017 1.01246 9.88517C0.978677 10.0802 1.01536 10.2808 1.11595 10.4513L2.45064 12.7606C2.45218 12.7628 2.45354 12.7651 2.4547 12.7675C2.55583 12.9356 2.71264 13.0629 2.89788 13.1274C3.08312 13.1919 3.28511 13.1895 3.46877 13.1206L3.4797 13.1166L4.63814 12.65C4.71132 12.6204 4.79047 12.6086 4.86909 12.6156C4.94771 12.6227 5.02354 12.6482 5.09033 12.6903C5.19283 12.7551 5.29699 12.8161 5.40283 12.8734C5.47145 12.9106 5.53036 12.9635 5.57482 13.0276C5.61927 13.0918 5.64803 13.1655 5.65876 13.2428L5.83251 14.48L5.83626 14.5025C5.87436 14.6944 5.97747 14.8674 6.1282 14.9922C6.27894 15.1169 6.46809 15.1859 6.66376 15.1875H9.33626C9.53437 15.1869 9.7259 15.1163 9.8771 14.9883C10.0283 14.8603 10.1295 14.6831 10.1628 14.4878L10.1656 14.4703L10.3397 13.2306C10.3505 13.1534 10.3793 13.0798 10.4237 13.0156C10.4681 12.9515 10.5269 12.8986 10.5953 12.8612C10.7022 12.8038 10.8066 12.7428 10.9078 12.6794C10.9745 12.6376 11.0501 12.6122 11.1285 12.6053C11.2069 12.5984 11.2858 12.6102 11.3588 12.6397L12.5191 13.1069L12.53 13.1112C12.7139 13.1804 12.9162 13.1827 13.1017 13.118C13.2872 13.0532 13.4441 12.9254 13.545 12.7569C13.5463 12.7545 13.5476 12.7522 13.5491 12.75L14.8838 10.4409C14.9847 10.2704 15.0216 10.0694 14.9879 9.8741C14.9541 9.67879 14.852 9.50186 14.6997 9.375ZM10.4972 8.1175C10.4744 8.60143 10.3116 9.06832 10.0284 9.4614C9.7452 9.85448 9.3539 10.1568 8.90207 10.3316C8.45025 10.5064 7.95736 10.5462 7.48336 10.4461C7.00935 10.346 6.57464 10.1103 6.23209 9.76773C5.88954 9.42514 5.65391 8.9904 5.55386 8.51638C5.4538 8.04236 5.49363 7.54948 5.66851 7.09768C5.84338 6.64587 6.14575 6.25461 6.53887 5.97147C6.93198 5.68833 7.39889 5.52551 7.88283 5.50281C8.23025 5.48752 8.57706 5.54468 8.9012 5.67067C9.22533 5.79667 9.5197 5.98873 9.76559 6.23465C10.0115 6.48057 10.2035 6.77496 10.3295 7.09911C10.4554 7.42326 10.5125 7.77008 10.4972 8.1175Z" fill="#0162DD" />
            </svg>
          </button>
          <button className='btn btn-secondary' onClick={setEditedRows} name="done" disabled={isRequiredValueEmpty}
          >
            Save
          </button>
          {/* {' '}
          <button onClick={setEditedRows} name="cancel">
            ⚊
          </button> */}
        </div>
      ) : (
        <div className="edit-cell-action">
          <button onClick={setEditedRows} name="edit" className='me-2'>
            <i className="fa fa-pencil"></i>
          </button>
          <button onClick={removeRow} name="remove">
            <i className="fa fa-trash-o"></i>
          </button>
        </div>
      )}


      <CommonModal isOpen={openModal} title={"Settings"} className="store_modal" toggler={toggleModal} size="lg">
        <Container>
          <Form >
            <>
              <div className='flex mb-0 items-center justify-between border-b pb-3'>
                <Media className='d-flex'><Image attrImage={{ className: 'img-30 me-3', src: `${rowData?.variantImage ? imageURL + rowData?.variantImage : dummyImg}`, alt: 'Generic placeholder image' }} />
                  <Media body className="align-self-center">
                    <div className='ellipses_text_1'>{rowData?.variantName}</div>
                  </Media>
                </Media>
                <div className='product_switch'>
                  <Label className='switch mb-0'>
                    <Input
                      id={rowData?._id}
                      checked={isOfferApplied}
                      onChange={handleOfferAppliedChange}
                      type={"checkbox"}
                      className={`form-control`}
                    />
                    <span className='switch-state'></span>
                  </Label>
                </div>
              </div>
              <div className='flex justify-between py-3'>
                <h6 className={`text-[#1D2433] font-semibold`}>Offers</h6>
                <button type='button' className='text-[#D3178A]' onClick={() => setIsShow(true)} >+ Create Offer</button>
              </div>
              {
                isShow &&
                <Row className='items-end border p-3 rounded-3xl'>
                  <Col lg={5}>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type='number' min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </Col>
                  <Col lg={5}>
                    <Label htmlFor="offerMode" className='flex justify-between items-center'>
                      Offer Mode
                      <Media>
                        <Media body className={`text-end switch-sm product_switch flex items-center`}>
                          %
                          <Label className="switch mt-0 mx-3">
                            <Input id="offerMode" type="checkbox" checked={offerType === 'dollar'} onChange={handleOfferModeChange} />
                            <span className={`switch-state`}></span>
                          </Label>
                          $ {/* Display '$' or '%' based on the offer type */}
                        </Media>
                      </Media>
                    </Label>
                    <InputGroup>
                      <Input id="offerText" type='number' min={0} value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} />
                      <InputGroupText>{offerType === 'percent' ? '%' : '$'}</InputGroupText>
                    </InputGroup>
                  </Col>
                  <Col lg={2} className="d-flex align-items-end">
                    <button type='button' className='btn btn-secondary w-100' onClick={() => handleSave()}>Save</button>
                  </Col>
                </Row>
              }

              <Row className='offer_table_container'>
                <Table>
                  <thead>
                    <tr>
                      <th>QUANTITY</th>
                      <th >PRICE/ PERCENTAGE</th>
                      <th >OFFER TEXT</th>
                      <th >ACTIVE</th>
                      <th >STATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offersData?.map((offer, index) => (
                      <tr key={index}>
                        <td className='vertical-middle'>{offer.quantity}</td>
                        <td>{offer.offerPrice}</td>
                        <td>{offer.offerType === 'percent' ? (offer.quantity + ` at ` + offer.offerPrice + '% OFF') : (offer.quantity + ` for ` + `$` + offer.offerPrice)}</td>
                        <td>
                          <div className='product_switch'>
                            <Label className='switch mb-0'>
                              <Input
                                id={`isActive_${index}`}
                                type="checkbox"
                                checked={offer.isActive}
                                onChange={() => handleIsActiveChange(index)}
                                className={`form-control`}
                              />
                              <span className='switch-state'></span>
                            </Label>
                          </div>

                        </td>
                        <td>
                          <button type='button' className='bg-transparent ' onClick={() => handleDeleteOffer(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M16.875 3.75H13.125V2.8125C13.125 2.3981 12.9604 2.00067 12.6674 1.70765C12.3743 1.41462 11.9769 1.25 11.5625 1.25H8.4375C8.0231 1.25 7.62567 1.41462 7.33265 1.70765C7.03962 2.00067 6.875 2.3981 6.875 2.8125V3.75H3.125C2.95924 3.75 2.80027 3.81585 2.68306 3.93306C2.56585 4.05027 2.5 4.20924 2.5 4.375C2.5 4.54076 2.56585 4.69973 2.68306 4.81694C2.80027 4.93415 2.95924 5 3.125 5H3.78906L4.53125 16.9109C4.58672 17.9598 5.39062 18.75 6.40625 18.75H13.5938C14.6145 18.75 15.4023 17.9773 15.4688 16.9141L16.2109 5H16.875C17.0408 5 17.1997 4.93415 17.3169 4.81694C17.4342 4.69973 17.5 4.54076 17.5 4.375C17.5 4.20924 17.4342 4.05027 17.3169 3.93306C17.1997 3.81585 17.0408 3.75 16.875 3.75ZM7.52227 16.25H7.5C7.33803 16.2501 7.18234 16.1873 7.06575 16.0749C6.94916 15.9624 6.88077 15.8091 6.875 15.6473L6.5625 6.89727C6.55659 6.73151 6.61678 6.57019 6.72981 6.4488C6.84285 6.32742 6.99947 6.25591 7.16523 6.25C7.33099 6.24409 7.49231 6.30428 7.6137 6.41731C7.73508 6.53035 7.80659 6.68697 7.8125 6.85273L8.125 15.6027C8.12798 15.6848 8.11474 15.7667 8.08605 15.8437C8.05737 15.9206 8.01378 15.9912 7.95781 16.0513C7.90183 16.1114 7.83455 16.1599 7.75981 16.194C7.68508 16.2281 7.60436 16.2471 7.52227 16.25ZM10.625 15.625C10.625 15.7908 10.5592 15.9497 10.4419 16.0669C10.3247 16.1842 10.1658 16.25 10 16.25C9.83424 16.25 9.67527 16.1842 9.55806 16.0669C9.44085 15.9497 9.375 15.7908 9.375 15.625V6.875C9.375 6.70924 9.44085 6.55027 9.55806 6.43306C9.67527 6.31585 9.83424 6.25 10 6.25C10.1658 6.25 10.3247 6.31585 10.4419 6.43306C10.5592 6.55027 10.625 6.70924 10.625 6.875V15.625ZM11.875 3.75H8.125V2.8125C8.12453 2.77133 8.13229 2.73048 8.14783 2.69236C8.16337 2.65423 8.18637 2.61959 8.21548 2.59048C8.24459 2.56137 8.27923 2.53837 8.31736 2.52283C8.35548 2.50729 8.39633 2.49953 8.4375 2.5H11.5625C11.6037 2.49953 11.6445 2.50729 11.6826 2.52283C11.7208 2.53837 11.7554 2.56137 11.7845 2.59048C11.8136 2.61959 11.8366 2.65423 11.8522 2.69236C11.8677 2.73048 11.8755 2.77133 11.875 2.8125V3.75ZM13.125 15.6473C13.1192 15.8091 13.0508 15.9624 12.9343 16.0749C12.8177 16.1873 12.662 16.2501 12.5 16.25H12.4773C12.3953 16.2471 12.3146 16.228 12.2399 16.1939C12.1652 16.1598 12.098 16.1113 12.0421 16.0512C11.9861 15.9911 11.9426 15.9205 11.9139 15.8436C11.8852 15.7666 11.872 15.6848 11.875 15.6027L12.1875 6.85273C12.1904 6.77066 12.2095 6.68996 12.2436 6.61525C12.2777 6.54054 12.3262 6.47328 12.3863 6.41731C12.4464 6.36134 12.5169 6.31776 12.5939 6.28905C12.6708 6.26035 12.7527 6.24708 12.8348 6.25C12.9168 6.25292 12.9975 6.27199 13.0722 6.3061C13.147 6.34021 13.2142 6.3887 13.2702 6.4488C13.3262 6.50891 13.3697 6.57945 13.3984 6.65639C13.4272 6.73334 13.4404 6.81519 13.4375 6.89727L13.125 15.6473Z" fill="#1D2433" fill-opacity="0.8" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {
                  offersData?.length === 0 &&
                  <p className='my-5 text-center'>No Offers Found</p>
                }
                <div>

                </div>
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
  );
};
