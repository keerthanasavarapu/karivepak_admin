import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from 'moment';

const exportToExcel = (data, filename, reportType) => {
    
    let formattedData;
    let sheetName;
    if (reportType === 'orders') {
        formattedData = data.map(item => ({
            orderId: item?.sequence_number,
            customerName: `${item?.users?.first_name || 'N/A'} ${item?.users?.last_name || 'N/A'}`,
            orderDate: moment(item.createdAt).format('DD MMM, YYYY'),
            total: item.order_value ? `$${item.order_value.toFixed(2)}` : "N/A",
            numberOfItems: item?.products?.length || 0,
            deliveryAddress: `${item?.address?.addressFullName}, ${item.address.houseNo}, ${item.address.roadName}, ${item.address.locality}, ${item.address.city}, ${item.address.country}, ${item.address.addressPincode}, ${item.address.addressPhoneNumber}`,
            store: item?.store?.storeName || 'N/A',
            orderStatus: item.order_status
        }));
        sheetName = "Orders";
    } else if (reportType === 'sells') {
        formattedData = data.map((item, index) => ({
            Ranks: `#${index + 1}`,
            productName: item?.order_Variants?.variantName || 'N/A',
            brandName: item?.productDetails?.brand?.brandName.toUpperCase() || 'N/A',
            category: capitalizeFirstLetter(item?.productDetails?.category.collection_name) || 'N/A',
            subcategory: capitalizeFirstLetter(item?.productDetails?.subCategory.sub_collection_name) || 'N/A',
            numberOfSolds: item?.totalItemsSold || 0,
            stock: item?.stockDetails?.totalStock || 0,
            totalRevenue: `$${item?.totalRevenue || 0}`,
            status: capitalizeFirstLetter(item.status)
        }));
        sheetName = "Sells";
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${filename}.xlsx`);
};

export default exportToExcel;
