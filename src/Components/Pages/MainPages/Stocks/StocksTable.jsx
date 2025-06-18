import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import { Btn, H4, Spinner, ToolTip } from "../../../../AbstractElements";
import {  spinnerData } from "./data";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import HeaderCard from "../../../Common/Component/HeaderCard";
import { Download, PlusSquare } from "react-feather";
import CommonModal from "../../../UiKits/Modals/common/modal";
// import * as XLSX from 'xlsx';

import { Edit2, Eye, EyeOff, Trash2 } from "react-feather";
import axios from "axios";

import Select, { components } from "react-select";
// import Dropdown from 'react-dropdown';
import "react-dropdown/style.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { baseURL, productBaseURL } from "../../../../Services/api/baseURL";

const StocksTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [stocksdata, setstocksData] = useState([]);
  const [AddModal, SetAddmodal] = useState(false);
  const [editData, seteditdata] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("active");
  const [selectedItemName, setselectedItemName] = useState();
  const [quantity, setQuntity] = useState();

  const [StoresData, setStoresData] = useState([]);
  const [ItemsData, setItemsData] = useState([]);
  const [selectedStore, setSelectedStore] = useState();
  const [values, setValues] = useState({});
  const [selectedItem, setSelectedItem] = useState();
  const [collectionName, setcollectionName] = useState();
  const [tooltip, setTooltip] = useState(false);
  const toggle = () => setTooltip(!tooltip);
  const controlStyles = {
    border: "1px solid black",
    padding: "5px",
    background: "#ff0000",
    color: "white",
  };

  const AddMOdalToggle = () => {
    setValues({})
    SetAddmodal(!AddModal);
    seteditdata(null);
    setQuntity();
    setSelectedItem();
    setSelectedStore();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${selectedRows.map(
          (r) => r.title
        )}?`
      )
    ) {
      setToggleDelet(!toggleDelet);

      setData(
        data.filter((item) =>
          selectedRows.filter((elem) => elem.id === item.id).length > 0
            ? false
            : true
        )
      );
      setSelectedRows("");
    }
  };

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };
  const fetchItems = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const stocksData = await axios.get(
        `${baseURL}/api/admin/get-all-stocks`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setstocksData(stocksData.data.data);

      const itemsDatas = await axios.get(
        `${productBaseURL}/products/get-products`,
        {
          // headers: {
          //     Authorization: `${token}`,
          // }
        }
      );
      setItemsData(itemsDatas?.data?.data || []);
    } catch (error) {
      console.log(error, "error from items getting");
    }
  };
  const postItems = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const obj = {
        product_id: values.product_id,
        store_id: values.store_id,
        quantity: values.quantity,
        selling_price: values.selling_price,
        purchase_price: values.purchase_price,

      };

      const itemsData = await axios.post(
        `${baseURL}/
api/admin/add-stock`,
        obj,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      fetchItems();
      SetAddmodal(!AddModal);
      Swal.fire({
        title: "Stock Added!",
        icon: "success",
        confirmButtonColor: "#d3178a",
      });
    } catch (error) {
      console.log(error, "error from items getting");
    }
  };
  const editItems = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const obj = {
       product_id: values.product_id,
        store_id: values.store_id,
        quantity: values.quantity,
        selling_price: values.selling_price,
        purchase_price: values.purchase_price,
      };

      const itemsData = await axios.patch(
        `${baseURL}/
api/admin/update-stock/${editData._id}`,
        obj,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      fetchItems();
      SetAddmodal(!AddModal);
      Swal.fire({
        title: "Stock Updated!",
        icon: "success",
        confirmButtonColor: "#d3178a",
      });
    } catch (error) {
      console.log(error, "error from items getting");
    }
  };
  const inactiveItem = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const obj = {
        status: editData.status === "inactive" ? "active" : "inactive",
      };

      const itemsData = await axios.patch(
        `${baseURL}/
api/admin/update-stock-status/${editData._id}`,
        obj,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      fetchItems();
      setDeleteModal(!deleteModal);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);
  const handleEdit = () => {
    if (editData !== null) {
      editItems();
    } else {
      postItems();
    }
  };

  const orderColumns = [
    {
      name: "Store Name",
      selector: (row) => row.store_id.storeName,
      sortable: true,
      center: true,
      cell: (row) => (
        <>
          <div
            className="font-medium flex items-center"
            id={`${row.status === "active" ? "active " : "inactive"}`}
          >
            {row.store_id.status === "active" ? (
              <div className="w-2 h-2 mr-3 bg-[#008800] rounded-full"></div>
            ) : (
              <div className="w-2 mr-3 h-2 bg-[#ff0000] rounded-full"></div>
            )}
            {row.store_id.storeName}
          </div>
        </>
      ),
    },
    {
      name: "Product",
      selector: (row) => row.product_id.productName,
      sortable: true,
      center: true,
      cell: (row) => (
        <p style={{ fontWeight: "500" }} className="flex flex-row items-center">
          {row?.product_id?.status === "active" ? (
            <div className="w-2 h-2 mr-3 bg-[#008800] rounded-full"></div>
          ) : (
            <div className="w-2 mr-3 h-2 bg-[#ff0000] rounded-full"></div>
          )}
          {row?.product_id?.productName}
        </p>
      ),
    },
    {
      name: "Stock Status",
      selector: (row) => `${row.stock_status}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <div className="d-flex align-items-center">
          {row.status === "active" ? (
            <div className="w-2 h-2 mr-3 bg-[#008800] rounded-full"></div>
          ) : (
            <div className="w-2 mr-3 h-2 bg-[#ff0000] rounded-full"></div>
          )}

          <p
            style={{ fontWeight: "500" }}
            className={`text-${
              row.stock_status === "in-stock" ? "[#008800]" : "[#ff0000]"
            }`}
          >
            {row?.stock_status === "in-stock" ? "In-Stock" : "Out Of Stock"}
          </p>
        </div>
      ),
    },
    {
      name: "Quantity",
      selector: (row) => `${row.quantity}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <div className="d-flex justify-content-end align-items-center">
          <p style={{ fontWeight: "500" }}>{row.quantity}</p>
        </div>
      ),
    },
    // {
    //     name: 'Discount',
    //     selector: row => `${row.discount}`,
    //     cell: (row) => (
    //         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //             <p style={{ fontWeight: '500' }}>{row.discount}</p>
    //         </div>
    //     ),
    //     sortable: true,
    //     center: true,
    // },
    // {
    //     name: 'Added By',
    //     selector: row => `${row.addedby}`,
    //     sortable: true,
    //     center: true,
    //     cell: (row) => (
    //         <div className='d-flex justify-content-center align-items-center'>
    //             <p className='text-center font-medium'>{row.addedby}</p>
    //         </div>
    //     ),

    // },
    {
      name: "Actions",
      cell: (row) => (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginLeft: "20px" }}
        >
          <span
            className="rounded-2"
            style={{
              cursor: "pointer",
              marginRight: "10px",
              border: "1px solid #cc5500",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Eye color="#cc5500" size={16} />
          </span>
          <div
            onClick={() => {
              seteditdata(row);

              setValues({
                quantity:row.quantity,
                purchase_price:row.purchase_price,
                selling_price:row.selling_price,
                product_id:row?.product_id?._id,
                store_id:row?.store_id?._id
              })
              setSelectedItem(row.product_id._id);
              setSelectedStore(row.store_id._id);
              setQuntity(row.available_quantity);
              SetAddmodal(!AddModal);
            }}
            className="rounded-2"
            style={{
              cursor: "pointer",
              marginRight: "10px",
              border: "1px solid #008000",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Edit2 color="#008000" size={16} />
          </div>
          <div
            onClick={() => {
              seteditdata(row);
              setDeleteModal(!deleteModal);
            }}
            className="rounded-2"
            style={{
              cursor: "pointer",
              border: "1px solid #ff0000",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trash2 color="#ff0000" size={16} />
          </div>
        </div>
      ),
      sortable: false,
      center: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {},
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "500",
        textAlign: "center",
      },
    },
    cells: {
      style: {
        textAlign: "start",
      },
    },
  };

  const filteredCollections = stocksdata.filter((item) =>
    item?.stock_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Fragment>
      <Row xxl={12} className="pb-4">
        <Col xxl={8}>
          <H4>Stocks List</H4>
        </Col>
        <Col xxl={4}>
          <Row xxl={12}>
            <Col xxl={6}>
              <Form className="search-file form-inline">
                <div
                  className="mb-0 form-group border border-1 rounded-2"
                  style={{
                    backgroundColor: "#f8f9fc",
                    width: "185px",
                    height: "35px",
                  }}
                >
                  <i
                    className="fa fa-search "
                    style={{ marginInline: "5px", marginTop: "12px" }}
                  ></i>
                  <input
                    className="form-control border-none outline-none focus:outline-none"
                    type="text"
                    style={{
                      paddingLeft: "2px",
                      paddingTop: "10px",
                      width: "140px",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                    }}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search..."
                  />
                </div>
              </Form>
            </Col>

            <Col xxl={6}>
              <button type="button"
                className="d-flex justify-content-center align-items-center rounded-2 bg-primary px-1 cursor-pointer"
                style={{ width: "145px", height: "35px" }}
                onClick={AddMOdalToggle}
              >
                <PlusSquare size={20} />
                <p style={{ fontSize: "14px", marginLeft: "5px" }}>
                  Add Stocks
                </p>
              </button>
            </Col>
          </Row>
        </Col>
      </Row>

      {selectedRows.length !== 0 && (
        <div
          className={`d-flex align-items-center justify-content-between bg-light-info p-2`}
        >
          <H4 attrH4={{ className: "text-muted m-0" }}>
            Delete Selected Stock..!
          </H4>
          <Btn attrBtn={{ color: "danger", onClick: () => handleDelete() }}>
            Delete
          </Btn>
        </div>
      )}
      {stocksdata?.length !== 0 ? (
        <DataTable
          data={stocksdata || []}
          columns={orderColumns}
          // striped={true}
          center={true}
          pagination
          // expandableRows
          // expandableRowsComponent={ExpandedComponent}
          customStyles={customStyles}
          // selectableRows
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleDelet}
        />
      ) : (
        <>
          {spinnerData.map((spinner) => (
            <Col
              xxl="12"
              key={spinner.id}
              className="flex justify-center items-center"
            >
              <div className="loader-box">
                <Spinner attrSpinner={{ className: spinner.spinnerClass }} />
              </div>
            </Col>
          ))}
        </>
      )}

      <CommonModal
        isOpen={AddModal}
        title={editData !== null ? "Update Stock" : "Add Stock"}
        toggler={AddMOdalToggle}
        size="lg"
      >
        <Container>
          <Form>
            <>
              <Row xxl={12} className="mt-2">
                <Col xxl={6} className="flex flex-col">
                  {/* <FormGroup> */}
                  <Label className="font-medium text-base">Stores</Label>
                  <Input
                    type="select"
                    className="border-[#e1e3ef] text-lg font-medium rounded-md focus:ring-0 focus:outline-none"
                    onChange={(e) => {
                        setValues({
                          ...values,
                          store_id: e.target.value,
                        });
                      }}
                      value={values.store_id}
                  >
                    <option value="">Select Store</option>
                    {StoresData.map((item) => (
                      <option
                        key={item._id}
                        value={item._id}
                        className="text-base font-medium"
                      >
                        {item.storeName}
                      </option>
                    ))}
                  </Input>
                  {/* </FormGroup> */}
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">Product</Label>
                    <Input
                      invalid={false}
                      type="select"
                      onChange={(e) => {
                        setValues({ ...values, product_id: e.target.value });
                      }}
                      value={values.product_id}
                    >
                      <option>Select Product</option>
                      {ItemsData.map((item) => (
                        <>
                          <option
                            value={item._id}
                            placeholder={"Select Item"}
                            className="text-base font-medium"
                          >
                            {item.productName}
                          </option>
                        </>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Purchase Price
                    </Label>
                    <InputGroup className="mb-3">
                      <InputGroupText>{"$"}</InputGroupText>
                      <Input
                        className="form-control"
                        type="number"
                        aria-label="Amount (to the nearest dollar)"
                        onChange={(e) => {
                          setValues({
                            ...values,
                            purchase_price: e.target.value,
                          });
                        }}
                        value={values.purchase_price}
                        min={1}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="font-medium text-base">
                      Selling Price
                    </Label>
                    <InputGroup className="mb-3">
                      <InputGroupText>{"$"}</InputGroupText>
                      <Input
                        className="form-control"
                        type="number"
                        aria-label="Amount (to the nearest dollar)"
                        onChange={(e) => {
                          setValues({
                            ...values,
                            selling_price: e.target.value,
                          });
                        }}
                        value={values.selling_price}
                        min={1}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                {/* <Col xxl={6} className='flex flex-col'>
                                    <Label className='font-medium text-base'>Items</Label>
                                    <select className='border-[#e1e3ef] text-lg font-medium rounded-md focus:ring-0 focus:outline-none' onChange={(e) => {
                                        const selected = e.target.value
                                        setSelectedItem(e.target.value)
                                        const name = ItemsData.find(item => item._id === selected)?.productName
                                        setselectedItemName(name)

                                    }}
                                        value={selectedItem}
                                    >
                                        <option value="">Select Item</option>

                                        {
                                            ItemsData.map(item => (
                                                <>
                                                    <option value={item._id} placeholder={"Select Item"} className='text-base font-medium'>{item.productName}</option>
                                                </>
                                            ))
                                        }
                                    </select>
                                </Col> */}
              </Row>
              <Col md={6}>
                <Label className="font-medium text-base">No. of Products</Label>
                <Input
                  type="number"
                  onChange={(e) => {
                    setValues({
                      ...values,
                      quantity: e.target.value,
                    });
                  }}
                  value={values.quantity}
                  placeholder="Enter Quantity"
                  min={1}
                />
              </Col>
            </>
            <Row>
              <Col xxl={12} className="text-center">
                <Button
                  onClick={handleEdit}
                  className="cursor-pointer mt-3 bg-[#ff0000] font-medium w-40 px-2 py-2 rounded-2xl text-white flex justify-center items-center"
                >
                  {editData !== null ? "Update Stock" : "Save Stock"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </CommonModal>

      <CommonModal
        isOpen={deleteModal}
        title=""
        toggler={() => {
          setDeleteModal(!deleteModal);
        }}
        size="md"
      >
        <Container className="flex flex-col justify-center items-center">
          <p>Do You Want To Change Status Of This Item? </p>
          <div className="flex flex-row space-x-8">
            <div
              onClick={() => setDeleteModal(!deleteModal)}
              className="border-1 border-[#ff0000] px-2 py-2 text-[#ff0000] rounded-xl cursor-pointer"
            >
              Cancel
            </div>
            <div
              onClick={inactiveItem}
              className="bg-[#ff0000] px-4 py-2 text-white rounded-xl cursor-pointer"
            >
              Yes
            </div>
          </div>
        </Container>
      </CommonModal>
    </Fragment>
  );
};
export default StocksTable;
