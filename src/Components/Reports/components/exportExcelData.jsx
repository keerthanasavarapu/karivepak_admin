import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportExcelData = (stockData, subCollectionName, storeName,activeTabName) => {
    // console.log(stockData,subCollectionName,storeName,activeTabName,"234567")
    
    
    if (!stockData || !Array.isArray(stockData)) {
        console.error("Invalid stock data");
        return;
    }
    const formattedData = stockData.map(item => (
        {
            // category_id: item.category_id,
            productName: item?.product_info[0]?.productName || "NA",
            category: item?.category_info[0]?.collection_name || "NA",
            subCategory: item?.subcategory_info[0]?.sub_collection_name || "NA",
            storeName: storeName || "NA",
            number_of_products: item?.number_of_products || "NA",
            minimum_qty: item?.minimum_qty || "NA",

            // quantity: item.category_info[0].quantity,
           
            // product_id:item.product_id,
           
            // reason_for_inventory: item.reason_for_inventory,
            
          
        }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const workbook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(workbook, worksheet, subCollectionName);


    const csvData = XLSX.utils.sheet_to_csv(worksheet)

    // const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const dataBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    
    const filename = `${storeName}_${activeTabName}_${subCollectionName}_inventory.csv`;

    saveAs(dataBlob, filename);
};

export default exportExcelData;
