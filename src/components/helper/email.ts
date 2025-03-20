// /**
//  * Send an email with optional attachments
//  * 
//  * @param {string} recipient - Email address of the recipient
//  * @param {string} subject - Subject line of the email
//  * @param {string} body - Body content of the email
//  * @param {Array} [attachments] - Array of file objects to attach
//  * @returns {Promise<boolean>} - Resolves to true if email was sent successfully
//  */
// async function sendEmail(recipient, subject, body, attachments = []) {
//     try {
//         // For browser-based applications using EmailJS service
//         // You would need to include the EmailJS library and configure your account
//         // https://www.emailjs.com/
        
//         const emailData = {
//             service_id: 'your_emailjs_service_id',
//             template_id: 'your_emailjs_template_id',
//             user_id: 'your_emailjs_user_id',
//             template_params: {
//                 recipient: recipient,
//                 subject: subject,
//                 message: body,
//                 // Attachments would need to be handled differently depending on your email service
//             }
//         };
        
//         const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(emailData)
//         });
        
//         if (response.ok) {
//             console.log('Email sent successfully!');
//             return true;
//         } else {
//             throw new Error('Failed to send email');
//         }
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return false;
//     }
// }



// Example usage:
// 1. Create and download a PDF
// createPDF("This is a test PDF document", "Test Document")
//   .then(pdfBlob => downloadBlob(pdfBlob, "document.pdf"));

// 2. Create and download an Excel file  
// const excelData = [["John", 30], ["Jane", 25]];
// const excelBlob = createExcel(excelData, "Users", ["Name", "Age"]);
// downloadBlob(excelBlob, "users.xlsx");

// 3. Print some HTML content
// printDocument("<h1>Hello World</h1><p>This is a test document</p>");

// 4. Send an email
// sendEmail("recipient@example.com", "Test Email", "This is a test email");

