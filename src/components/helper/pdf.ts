
// /**
//  * Create a PDF document with the given content
//  * Using PDF.js library
//  * 
//  * @param {string|Array} content - Text content to include in the PDF
//  * @param {string} [title] - Optional title for the document
//  * @returns {Promise<Blob>} - Resolves to a PDF blob that can be downloaded
//  */
// async function createPDF(content, title = null) {
//     try {
//         // Using jsPDF library
//         // Include: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();
        
//         let yPosition = 20;
//         const pageWidth = doc.internal.pageSize.getWidth();
        
//         // Add title if provided
//         if (title) {
//             doc.setFontSize(18);
//             doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
//             yPosition += 15;
//             doc.setFontSize(12);
//         }
        
//         // Add content
//         if (typeof content === 'string') {
//             content = [content];
//         }
        
//         content.forEach(paragraph => {
//             const textLines = doc.splitTextToSize(paragraph, pageWidth - 20);
//             textLines.forEach(line => {
//                 // Check if we need a new page
//                 if (yPosition > 270) {
//                     doc.addPage();
//                     yPosition = 20;
//                 }
                
//                 doc.text(line, 10, yPosition);
//                 yPosition += 7;
//             });
            
//             yPosition += 5; // Space between paragraphs
//         });
        
//         // Return the PDF as a blob
//         const pdfBlob = doc.output('blob');
//         return pdfBlob;
//     } catch (error) {
//         console.error('Error creating PDF:', error);
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
//  }