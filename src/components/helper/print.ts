
// /**
//  * Print document or HTML content
//  * 
//  * @param {string|HTMLElement} content - HTML content or element to print
//  * @param {Object} [options] - Print options
//  * @returns {boolean} - True if print dialog was opened successfully
//  */
// function printDocument(content, options = {}) {
//     try {
//         // Method 1: For printing HTML content
//         if (typeof content === 'string' || content instanceof HTMLElement) {
//             // Create a new window for printing
//             const printWindow = window.open('', '_blank');
            
//             if (!printWindow) {
//                 throw new Error('Could not open print window. Pop-up blocker might be enabled.');
//             }
            
//             // Prepare content
//             printWindow.document.write(`
//                 <!DOCTYPE html>
//                 <html>
//                 <head>
//                     <title>${options.title || 'Print Document'}</title>
//                     <style>
//                         body { font-family: Arial, sans-serif; margin: 20px; }
//                         @media print {
//                             body { margin: 0; }
//                             @page { size: auto; margin: 10mm; }
//                         }
//                         ${options.styles || ''}
//                     </style>
//                 </head>
//                 <body>
//                     ${typeof content === 'string' ? content : content.outerHTML}
//                 </body>
//                 </html>
//             `);
            
//             printWindow.document.close();
            
//             // Wait for resources to load
//             printWindow.onload = function() {
//                 printWindow.focus();
//                 printWindow.print();
                
//                 // Close the window after printing (optional)
//                 if (!options.keepWindowOpen) {
//                     printWindow.close();
//                 }
//             };
            
//             return true;
//         }
//         // Method 2: For printing an existing file (PDF, etc.)
//         else if (content instanceof Blob) {
//             // Create a URL for the blob
//             const fileURL = URL.createObjectURL(content);
            
//             // Open the file in a new window and print it
//             const printWindow = window.open(fileURL);
            
//             if (!printWindow) {
//                 throw new Error('Could not open print window. Pop-up blocker might be enabled.');
//             }
            
//             printWindow.onload = function() {
//                 printWindow.print();
                
//                 // Revoke the URL and close the window after printing
//                 if (!options.keepWindowOpen) {
//                     setTimeout(() => {
//                         URL.revokeObjectURL(fileURL);
//                         printWindow.close();
//                     }, 100);
//                 }
//             };
            
//             return true;
//         }
        
//         return false;
//     } catch (error) {
//         console.error('Error printing document:', error);
//         return false;
//     }
// }
