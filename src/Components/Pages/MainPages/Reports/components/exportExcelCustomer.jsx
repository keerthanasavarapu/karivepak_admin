import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';


const exportExcelCustomer = (filteredData) => {

    if (!filteredData || !Array.isArray(filteredData)) {
        console.error("Invalid customer Data.")
        return
    }

    const formattedData = filteredData.map(item => ({
        "DELIVERY PERSON ID": item?._id ?? "NA",
        "NAME":item?.name ?? "NA",
        "ONLINE":item?.online ? "Online" :"Offline",
        "EMAIL": item?.email ?? "NA",
        "MOBILE":item?.mobile_number ?? "NA",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook,worksheet)

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const filename = "customer_Data.xlsx";

    saveAs(dataBlob, filename);
}

export default exportExcelCustomer;