import { useState, useEffect, ChangeEvent } from "react";
import "./table.css";
import axios from "axios";
import { imageURL, productBaseURL } from "../../Services/api/baseURL";
import { Input, Label, Media, Spinner } from "reactstrap";
import upload from '../../assets/images/uploadimage.svg';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const TableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue || "");
  const [validationMessage, setValidationMessage] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    UserData()
  }, [])

  const UserData = async () => {
    const token = await JSON.parse(localStorage.getItem('UserData'))
    setToken(token)
  }

  const onBlur = (e) => {
    displayValidationMessage(e);
    tableMeta?.updateData(row.index, column.id, value);
  };

  const onFileChange = async (e) => {
    setLoading(true);
    try {
      const token = await JSON.parse(localStorage.getItem('token'))
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const formData = new FormData();
      formData.append("Image", selectedFile);
      const response = await axios.post(`${productBaseURL}/variants/upload`, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      if (response.data.success) {
        tableMeta?.updateData(row.index, column.id, response?.data?.data?.image);
        setLoading(false);
        toast.success("Image Uploaded Succesfully!", {
          position: "top-right"
        });
      }
    }
    catch (e) {
      console.error(e);
      setLoading(false);
    }

  };


  // const onSelectChange = (e) => {
  //   const newValue = e.target.checked;
  //   setValue(newValue);
  //   tableMeta?.updateData(row.index, column.id, newValue);
  // };

  console.log("columnMeta", columnMeta);

  const onSelectChange = (e) => {
    let newValue;
    if (column.id === 'status') {
      newValue = e.target.checked ? "active" : "inactive";
    } else {
      newValue = e.target.checked;
    }
    setValue(newValue);
    tableMeta?.updateData(row.index, column.id, newValue);
  };

  const displayValidationMessage = (e) => {
    if (e.target.validity.valid) {
      setValidationMessage("");
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
      setValidationMessage(e.target.validationMessage);
    }
  };

  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "file" ? (
      <div>
        <label htmlFor={tableMeta?.editedRows[row.id]} className="positive-relative upload_product_img">
          <img src={upload} /> Upload Image
          <input
            id={tableMeta?.editedRows[row.id]}
            type="file"
            onChange={onFileChange}
            className={`form-control-file ${isInvalid ? 'is-invalid' : ''}`}
            required
          />
        </label>

      </div>
    ) :
      columnMeta?.type === "checkbox" ? (
        <>
          <Media>
            <Media body className='text-end icon-state product_switch'>
              <Label className='switch mb-0'>
                <Input
                  id={tableMeta?.editedRows[row.id]}
                  checked={column.id === "status" ? (value === "active" ? true : false) : value}
                  onChange={onSelectChange}
                  type={columnMeta?.type || "checkbox"}
                  className={`form-control`}
                />
                <span className='switch-state'></span>
              </Label>
            </Media>
          </Media>
        </>
      ) :
        columnMeta?.type === "select" ? (
          <select onChange={(e) => setValue(e.target.value)} onBlur={onBlur} className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            value={value}>
            {columnMeta?.options?.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : columnMeta?.type === "textarea" ? (
          <div> <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={columnMeta?.type || "text"}
            className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            required
            step="any"
            rows={1}
          />
            {validationMessage && <span className="validation-message text-danger">{validationMessage}</span>}
          </div>
        ) : (
          <div> <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            type={columnMeta?.type || "text"}
            className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
            required
            step="any"
            min={0}
          />
            {validationMessage && <span className="validation-message text-danger">{validationMessage}</span>}
          </div>
        );


  }
  else {
    if (typeof value === 'boolean') {
      return <span>{value ? 'Yes' : 'No'}</span>;
    }
    if (column.id === "variantImage") {
      return value &&
        <>
          <span className="flex align-items-center line-clamp-1"> <img style={{ width: "37px", height: "50px" }} src={imageURL + value} alt={value} />{value}</span>
        </>
    }
    return <span >{value}</span>;
  }
};
