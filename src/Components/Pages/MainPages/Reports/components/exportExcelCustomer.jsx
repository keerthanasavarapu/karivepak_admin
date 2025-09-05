import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';


const exportExcelCustomer = (filteredData) => {

    if (!filteredData || !Array.isArray(filteredData)) {
        console.error("Invalid customer Data.")
        return
    }

const formattedData = filteredData.map(item => {
    const subscriptions = item?.subscriptions ?? [];

    return {
        "User ID": item?.userId ?? "NA",
        "User Name": item?.userName ?? "NA",
        "User Email": item?.userEmail ?? "NA",
        "Mobile Number": item?.mobile ?? "NA",

        "SubscriptionId": subscriptions.length
            ? subscriptions.map(row => row?.subscriptionId || "NA").join(', ')
            : "NA",

        "Duration": subscriptions.length
            ? subscriptions.map(sub => `${sub.planName ?? "NA"} (${sub.planDuration ?? "NA"})`).join(', ')
            : "No Subscription",

        "Plan Price": subscriptions.length
            ? subscriptions.map(sub => `₹ ${sub.planPrice ?? "NA"}`).join(', ')
            : "NA",

        "Start Date": subscriptions.length
            ? subscriptions.map(sub =>
                sub?.startDate ? new Date(sub.startDate).toLocaleDateString() : "NA"
              ).join(', ')
            : "NA",

        "End Date": subscriptions.length
            ? subscriptions.map(sub =>
                sub?.endDate ? new Date(sub.endDate).toLocaleDateString() : "NA"
              ).join(', ')
            : "NA",

        "Payment Id": subscriptions.length
            ? subscriptions.map(sub => sub?.paymentId || "NA").join(', ')
            : "NA"
    };
});


    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook,worksheet)

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const filename = "customer_Data.xlsx";

    saveAs(dataBlob, filename);
}

export default exportExcelCustomer;