import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DataTable from "react-data-table-component";
import {
  Btn,
  H1,
  H4,
  H6,
  Image,
  P,
  Spinner,
  ToolTip,
} from "../../../../AbstractElements";
// import { orderColumns, products, spinnerData } from './data';
import {
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Media,
  Button,
  DropdownToggle,
  UncontrolledAccordion,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  CardTitle,
  CardText,
} from "reactstrap";
import {
  Download,
  MoreVertical,
  PlusCircle,
  PlusSquare,
  Trash,
} from "react-feather";
import axios from "axios";
import "react-dropdown/style.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  baseURL,
  imageURL,
  productBaseURL,
  variantsBaseURL,
} from "../../../../Services/api/baseURL";
import endPoints from "../../../../Services/EndPoints";
import dummyImg from "../../../../assets/images/product/2.png";
import Loader from "../../../Loader/Loader";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const VariantsTable = () => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [filteredProductsData, setFilteredProductsData] = useState([]);
  const [editData, seteditdata] = useState([]);
  const [subCollectionData, setSubCollectionData] = useState([])
  const [collectionData, setCollectionData] = useState([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [BasicTab, setBasicTab] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [subCollectionValue, setSubCollectionValue] = useState("");
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editPrice, setEditPrice] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [userRole, setUserRole] = useState('');


  useEffect(() => {
    fetchStores();
  }, [])

  const usersData = JSON.parse(localStorage.getItem('UserData'))
  const usersRole = JSON.parse(localStorage.getItem('role_name'));

  const fetchStores = async () => {
    setIsLoading(true);
    const userData = await JSON.parse(localStorage.getItem('UserData'))
    const userRole = JSON.parse(localStorage.getItem('role_name'));
    const storeId = userData?._id;
    setUserRole(userRole);
    if (userRole === 'store') {
      console.log('store id', storeId)
      setIsLoading(false)
      return;
    }

    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const stores = await axios.get(`${baseURL}/api/store/get-all-stores`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      let filteredData = stores?.data?.data.filter((item) => item.status === "active");
      setStoreList(filteredData || []);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      console.error(error);
    }
  };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const fetchCategoryList = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const collectData = await axios.get(
        `${baseURL}/api/admin/get-collections?page=1&limit=1000`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      let data = collectData?.data?.data.filter(
        (item) => item.status === "active"
      );
      setCollectionData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubcollectionsList = async () => {
    const token = await JSON.parse(localStorage.getItem("token"));
    let limit = 1000;
    try {
      const response = await axios.get(
        `${baseURL}/api/admin/get-sub-collections?page=1&limit=${limit}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      let data = response?.data?.data.filter(
        (item) => item.status === "active"
      );

      setSubCollectionData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const products = await axios.get(`${variantsBaseURL}/variants`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const productsData = products?.data?.data;

      if (productsData.length > 0) {

        setIsLoading(false)
        setFilteredProductsData(productsData.reverse())

        const userData = await JSON.parse(localStorage.getItem('UserData'))
        const userRole = JSON.parse(localStorage.getItem('role_name'));
        if (userRole === 'store') {
          const storeId = userData?._id;
          filterDataWithStores(productsData.reverse(), storeId)
        } else {
          filterDataWithStores(productsData.reverse(), storeId)
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }
  // };

  const fetchTopItems = async () => {
    setIsLoading(true);
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const products = await axios.get(`${variantsBaseURL}/variants`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const productsData = products?.data?.data;

      if (productsData.length > 0) {
        setIsLoading(false);
        const filteredProductsData = productsData
          .filter((item) => item.isTopSellingProduct)
          .reverse();
        setFilteredProductsData(filteredProductsData);
        filterDataWithStores(filteredProductsData, storeId);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const inactiveItem = async (id) => {
    const token = await JSON.parse(localStorage.getItem("token"));
    try {
      const status = editData.status === "inactive" ? "active" : "inactive";

      let formData = new FormData();
      formData.append("status", status);

      const itemsData = await axios.patch(
        `${baseURL}/products/update-product-status/${editData._id}`,
        formData,
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
    fetchCategoryList();
    fetchSubcollectionsList();
  }, []);

  const handleNavigate = () => {
    navigate("/product/create");
  };

  const handleNavigateEdit = (id) => {
    navigate(`/product/edit/${id}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const handleAll = () => {
    setBasicTab(1);
    setSubCollectionValue("");
    setSelectedCollectionId(null);
    fetchItems();
  };

  const handleTopSelling = () => {
    setBasicTab(2);
    setSubCollectionValue("");
    setSelectedCollectionId(null);
    fetchTopItems();
  };

  const handleTabs = async (data, index) => {
    setBasicTab(index + 3);
    setSelectedCollectionId(data?._id);
    setSubCollectionValue();
    getFilteredData(data?._id, "");
  };

  const handleSubCollectionChange = (e) => {
    let value = e.target.value;
    setSubCollectionValue(value);
    getFilteredData("", value);
  };

  const filterDataWithStores = (data, storeId) => {
    console.log(data);
    // Flatten and filter the data in a single step
    const tempData = data
      .flatMap((v) =>
        v.storePricing.map((store) => ({
          // Spread the properties of the product variant object first
          ...v,

          // Explicitly include these properties from the store object
          sellingPrice: store.sellingPrice,
          discount: store.discount,
          finalSellingPrice: store.finalSellingPrice,
          storeId: store.storeId,
        }))
      )
      .filter((item) => {
        // Check if the variant name includes the search term (case-insensitive)
        const matchesVariantName = item?.variantName
          ?.toLowerCase()
          .includes(searchTerm?.toLowerCase());
        // Check if the storePricing contains the specified storeId
        const matchesStoreId = item.storeId === storeId;
        // Return true if both conditions are met
        return matchesVariantName && matchesStoreId;
      });
    setFilteredProducts(tempData);
  };

  const handleStores = async (e) => {
    setIsLoading(true);

    let storeIdToFilter = e.target.value;
    setStoreId(storeIdToFilter);
    /*
        console.log(filteredProductsData);
        // Flatten and filter the data in a single step
        const tempData = filteredProductsData.flatMap(v =>
            v.storePricing.map(store => ({
                // Spread the properties of the product variant object first
                ...v,
               
                // Explicitly include these properties from the store object
                sellingPrice: store.sellingPrice,
                discount: store.discount,
                finalSellingPrice: store.finalSellingPrice,
                storeId: store.storeId,
               
            }))
        ).filter(item => {
            // Check if the variant name includes the search term (case-insensitive)
            const matchesVariantName = item?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase());
            // Check if the storePricing contains the specified storeId
            const matchesStoreId = item.storeId === storeIdToFilter;
            // Return true if both conditions are met
            return matchesVariantName && matchesStoreId;
        });
        
  
        setFilteredProducts(tempData);*/
    filterDataWithStores(filteredProductsData, storeIdToFilter);
    setIsLoading(false);
  };

  const getFilteredData = async (category, subcategory) => {
    setIsLoading(true);
    try {
      const token = await JSON.parse(localStorage.getItem("token"));
      let params = {};
      if (subcategory) {
        params = {
          subcategory_id: subcategory,
        };
      } else {
        params = {
          category_id: category,
        };
      }

      const response = await axios.get(`${variantsBaseURL}/variants`, {
        params: params,
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response?.status === 200 && response) {
        setFilteredProductsData(response?.data?.data.reverse());
        filterDataWithStores(response?.data?.data.reverse(), storeId);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  /*  const filteredProducts = filteredProductsData.filter(item =>
        item?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase())
        // item?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        // item?.brand?.brandName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        // item?.subCategory?.sub_collection_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        // item?.tags.some(tag => tag.label.toLowerCase().includes(searchTerm?.toLowerCase()))
    );*/
  /*
     const data=filteredProductsData.flatMap(v => 
        v.storePricing.map(store => ({ 
            storeId: store.storeId,
            sellingPrice: store.sellingPrice,
            discount: store.discount,
            finalSellingPrice: store.finalSellingPrice
        }))
      );
  
      const tempData =data.filter(item => {
        // Check if the variant name includes the search term (case-insensitive)
        const matchesVariantName = item?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase());
        // Check if the storePricing array contains the specified storeId
        const matchesStoreId = item?.storePricing?.some(store => store.storeId === "6633704ad56ddbcef19f1600");
        // Return true if both conditions are met
        return matchesVariantName && matchesStoreId;
    });
      
    setFilteredProducts(tempData); */
  /*
    useEffect(() => {
        const storeIdToFilter = "6633704ad56ddbcef19f1600"; // Replace this with the desired storeId
        console.log(filteredProductsData);
        // Flatten and filter the data in a single step
        const tempData = filteredProductsData.flatMap(v =>
            v.storePricing.map(store => ({
                ...store,
                sellingPrice: store.sellingPrice,
                discount: store.discount,
                finalSellingPrice: store.finalSellingPrice,
                variantName: v.variantName,
                variantId:v._id,
  
            }))
        ).filter(item => {
            // Check if the variant name includes the search term (case-insensitive)
            const matchesVariantName = item?.variantName?.toLowerCase().includes(searchTerm?.toLowerCase());
            // Check if the storePricing contains the specified storeId
            const matchesStoreId = item.storeId === storeIdToFilter;
            // Return true if both conditions are met
            return matchesVariantName && matchesStoreId;
        });
  
        setFilteredProducts(tempData);
    }, [filteredProductsData, searchTerm]);
  */
  const deleteVariant = async (id) => {
    if (window.confirm(`Are you sure you want to delete this Variant ?`)) {
      try {
        const token = await JSON.parse(localStorage.getItem("token"));
        await axios
          .delete(`${productBaseURL}/products/delete/${id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "Product Variant Deleted Successfully",
            });
            fetchItems();
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFieldChange = (e, row, field) => {
    const updatedProducts = filteredProducts.map((product) => {
      if (product._id === row._id) {
        return {
          ...product,
          [field]: e.target.value,
        };
      }
      return product;
    });
    setFilteredProducts(updatedProducts);
  };

  const handleDiscountChange = (e, row) =>
    handleFieldChange(e, row, "discount");
  const handleSellingPriceChange = (e, row) =>
    handleFieldChange(e, row, "sellingPrice");

  const orderColumns = [
    {
      name: "Bar Code",
      selector: (row) => row?.variantCode,
      // sortable: true,
      center: true,
      width: "150px",
      cell: (row) => row?.variantCode,
    },
    {
      name: "Variant",
      selector: (row) => `${row?.variantName}`,
      width: "350px",
      //   center: true,
      cell: (row) => (
        <>
          <Media className="d-flex align-items-center justify-content-center">
            <Image
              attrImage={{
                className: "img-30 me-3",
                src: row?.variantImage
                  ? `${imageURL}${row?.variantImage}`
                  : dummyImg,
                alt: "Generic placeholder image",
              }}
            />
            <Media body className="align-self-center">
              <div>{row?.variantName}</div>
            </Media>
          </Media>
        </>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Brand Name",
      selector: (row) => row?.products?.brand?.brandName,
      sortable: true,
      center: true,
      cell: (row) => row?.products?.brand?.brandName,
    },
    {
      name: "Quantity",
      selector: (row) => row?.quantity,
      sortable: true,
      center: true,
      cell: (row) => (
        <div
          style={{
            marginLeft: "30px",
          }}
        >
          {row?.quantity ? row?.quantity : 0}
        </div>
      ),
    },
    {
      name: "Selling Price",
      selector: (row) => row?.sellingPrice,
      sortable: true,
      center: true,
      cell: (row) => {
        return editPrice ? (
          <input
            type="number"
            value={row.sellingPrice}
            onBlur={(e) => handleSellingPriceBlur(e, row)}
            onChange={(e) => handleSellingPriceChange(e, row)}
          />
        ) : (
          <div style={{ alignItems: "center", marginLeft: "30px" }}>
            {row?.sellingPrice ? row.sellingPrice : 0}
          </div>
        );
      },
    },
    {
      name: "Discount",
      selector: (row) => row?.discount,
      sortable: true,
      center: true,
      cell: (row) => {
        return editPrice ? (
          <input
            type="number"
            value={row.discount}
            onChange={(e) => handleDiscountChange(e, row)}
            onBlur={(e) => handleDiscountBlur(e, row)}
          />
        ) : (
          <div style={{ alignItems: "center", marginLeft: "30px" }}>
            {row?.discount ? row.discount : 0}
          </div>
        );
      },
    },
    {
      name: "Final Selling Price",
      selector: (row) => row?.finalSellingPrice,
      sortable: true,
      center: true,
      cell: (row) => (
        <div style={{ alignItems: "center", marginLeft: "30px" }}>
          {row?.finalSellingPrice ? row.finalSellingPrice : 0}
        </div>
      ),
    },
    {
      name: "Sub Category",
      selector: (row) => `${row?.products?.subCategory?.sub_collection_name}`,
      sortable: true,
      center: true,
      cell: (row) => (
        <div style={{ alignItems: "center", marginRight: "30px" }}>
          {row?.products?.subCategory?.sub_collection_name}
        </div>
      ),
    },
  ];

  const handleCheckboxChange = (e) => {
    setEditPrice(e.target.checked);
  };

  const updateStorePrice = async (id, updatedValues, row) => {
    console.log(
      "Updating store price for id --->",
      id,
      "with values -->",
      updatedValues
    );
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await axios.put(
        `${variantsBaseURL}/update-storePrice/${id}`,
        updatedValues,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.success) {
        const updatedProducts = filteredProducts.map((product) =>
          product._id === row._id
            ? { ...product, finalSellingPrice: updatedValues.finalSellingPrice }
            : product
        );
        setFilteredProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error while updating store price", error);
    }
  };

  const handlePriceChange = (e, row, field) => {
    // console.log("row----->",row)
    const id = row._id;
    const storeId = row.storeId;
    const discount = field === "discount" ? e.target.value : row.discount;
    const sellingPrice =
      field === "sellingPrice" ? e.target.value : row.sellingPrice;
    const finalSellingPrice = sellingPrice - (discount * sellingPrice) / 100;

    const updatedValues = {
      storeId,
      sellingPrice,
      discount,
      finalSellingPrice,
    };

    updateStorePrice(id, updatedValues, row);
  };

  const handleSellingPriceBlur = (e, row) =>
    handlePriceChange(e, row, "sellingPrice");
  const handleDiscountBlur = (e, row) => handlePriceChange(e, row, "discount");

  return (
    <Fragment>
      <Row xxl={12} className="pb-2">
        <Row>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div>
              <Nav tabs className="product_variant_tabs mb-3">
                <NavItem>
                  <NavLink
                    className={BasicTab === 1 ? "active" : ""}
                    onClick={() => handleAll()}
                  >
                    All Products
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                                    <NavLink className={BasicTab === 2 ? 'active' : ''} onClick={() => handleTopSelling()}>
                                        Top Selling Products
                                    </NavLink>
                                </NavItem> */}
                {collectionData.length > 0 &&
                  collectionData
                    .sort((a, b) =>
                      a.collection_name.localeCompare(b.collection_name)
                    )
                    .slice(0, 20)
                    .map((data, index) => {
                      return (
                        <>
                          <NavItem key={data?._id}>
                            <NavLink
                              className={BasicTab === index + 3 ? "active" : ""}
                              onClick={() => handleTabs(data, index)}
                            >
                              {data.collection_name}
                            </NavLink>
                          </NavItem>
                        </>
                      );
                    })}
              </Nav>
            </div>
          </Col>
          <Col md={12} lg={12} xl={12} xxl={12}>
            <div className="file-content file-content1 d-flex justify-content-between align-items-center">
              <div className="form-group position-relative search_outer d-flex align-items-center">
                <i className="fa fa-search"></i>
                <input
                  className="form-control border-0"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e)}
                  type="text"
                  placeholder="Search..."
                  style={{ flex: "1", marginRight: "15px" }} // Adjust the margin as needed
                />
              </div>
              <div
                className="d-flex align-items-center"
                style={{ gap: "15px" }}
              >
                <Input
                  type="select"
                  name="subCategory"
                  value={subCollectionValue}
                  onChange={(e) => handleSubCollectionChange(e)}
                >
                  <option>Select Sub Category</option>
                  {selectedCollectionId
                    ? subCollectionData.length > 0 &&
                    subCollectionData
                      .filter(
                        (item) =>
                          item?.collection_id?._id === selectedCollectionId
                      )
                      .map((data) => (
                        <option key={data?._id} value={data?._id}>
                          {data?.sub_collection_name}
                        </option>
                      ))
                    : subCollectionData.map((data) => (
                      <option key={data?._id} value={data?._id}>
                        {data?.sub_collection_name}
                      </option>
                    ))}
                </Input>
                {usersRole === 'admin' ? (
                  <Input
                    type="select"
                    name="store"
                    onChange={(e) => handleStores(e)}
                  >
                    <option value="">Select Store</option>
                    {storeList &&
                      storeList.length > 0 &&
                      storeList.map((store) => (
                        <option key={store._id} value={store._id}>
                          {store.storeName}
                        </option>
                      ))}
                  </Input>
                ) : (
                  <Input
                    type="select"
                    name="store"
                    value={usersData._id}
                    disabled
                  >
                    <option value={usersData._id}>
                      {usersData.storeName}
                    </option>
                  </Input>
                )}
                <label
                  className="d-flex align-items-center"
                  style={{ margin: "0 15px" }}
                >
                  Edit Price
                  <input
                    style={{
                      width: "30px",
                      height: "30px",
                      marginLeft: "10px",
                    }}
                    type="checkbox"
                    checked={editPrice}
                    onChange={handleCheckboxChange}
                  />
                </label>
              </div>
            </div>
          </Col>
        </Row>
      </Row>

      {filteredProducts?.length > 0 && (
        <DataTable
          data={filteredProducts || []}
          columns={orderColumns}
          pagination
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleDelet}
          progressPending={isLoading}
          progressComponent={<Loader />}
        />
      )}

      {!isLoading && filteredProducts?.length === 0 && (
        <p className="text-center my-5">Please select store to retrieve data</p>
      )}
    </Fragment>
  );
};
export default VariantsTable;
