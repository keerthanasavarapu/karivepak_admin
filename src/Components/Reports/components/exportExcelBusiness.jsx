import * as XLSX from 'xlsx';

const exportExcelBusiness = (data) => {
    // Format the data for Excel export
    const excelData = data.map((business, index) => {
        return {
            'S.No': index + 1,
            'Business Name': business.businessName || 'NA',
            'Store Name': business.storeName || 'NA',
            'Platform Fee (%)': business.platformFee || 'NA',
            'Contact Email': business.contactEmail || 'NA',
            'Contact Phone': business.contactPhone || 'NA',
            'Wallet Balance': business.walletBalance?.toFixed(2) || '0.00',
            'Bank Name': business.bankName || 'NA',
            'Account Number': business.accountNumber || 'NA',
            'IFSC': business.ifsc || 'NA',
            'City': business.businessAddress?.city || 'NA',
            'State': business.businessAddress?.state || 'NA',
            'Country': business.businessAddress?.country || 'NA',
            'Created At': new Date(business.createdAt).toLocaleDateString(),
        };
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Business Profiles');

    // Generate Excel file
    XLSX.writeFile(workbook, 'Business_Profiles_' + new Date().toISOString().split('T')[0] + '.xlsx');
};

export default exportExcelBusiness;