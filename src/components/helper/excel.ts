
// /**
//  * Create an Excel spreadsheet with the given data
//  * Using SheetJS (xlsx) library
//  * 
//  * @param {Array} data - Array of rows containing data to write
//  * @param {string} [sheetName='Sheet1'] - Name for the worksheet
//  * @param {Array} [headers] - Column headers
//  * @returns {Blob} - Excel file as a Blob that can be downloaded
//  */
// function createExcel(data, sheetName = 'Sheet1', headers = null) {
//     try {
//         // Using SheetJS/xlsx library
//         // Include: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
        
//         const XLSX = window.XLSX;
        
//         // Prepare worksheet data
//         let worksheetData = [];
        
//         // Add headers if provided
//         if (headers) {
//             worksheetData.push(headers);
//         }
        
//         // Add data rows
//         worksheetData = worksheetData.concat(data);
        
//         // Create worksheet
//         const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
//         // Create workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
//         // Generate Excel file
//         const excelBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
//         return excelBlob;
//     } catch (error) {
//         console.error('Error creating Excel file:', error);
//         throw error;
//     }
// }
// // Helper function to download a blob as a file
// function downloadBlob(blob, fileName) {
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName;
//     link.click();
    
//     setTimeout(() => {
//         URL.revokeObjectURL(link.href);
//     }, 100);
// }
