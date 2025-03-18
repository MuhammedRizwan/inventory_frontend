'use client'
import Table from "@/components/table";
import { useState, useRef } from "react";

export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    createdAt?: string; // Adding date field for filtering
}

// Sample data with dates added
const initialProducts: Product[] = [
    { id: 1, name: "Laptop", description: "High-end gaming laptop", quantity: 5, price: 1500, createdAt: "2024-03-10" },
    { id: 2, name: "Smartphone", description: "Latest model with AI features", quantity: 10, price: 800, createdAt: "2024-03-15" },
    { id: 3, name: "Headphones", description: "Noise-canceling over-ear headphones", quantity: 15, price: 200, createdAt: "2024-03-18" },
];

export default function ProductReport() {
    const [products] = useState<Product[]>(initialProducts);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
    const tableRef = useRef<HTMLDivElement>(null);

    const columns = [
        { header: "ID", accessor: "id" as keyof Product },
        { header: "Name", accessor: "name" as keyof Product },
        { header: "Description", accessor: "description" as keyof Product },
        { header: "Quantity", accessor: "quantity" as keyof Product },
        { 
            header: "Price ($)", 
            accessor: "price" as keyof Product,
            render: (product: Product) => <span>${product.price.toFixed(2)}</span>
        },
        { 
            header: "Total Value", 
            accessor: "id" as keyof Product,
            render: (product: Product) => <span>${(product.price * product.quantity).toFixed(2)}</span>
        },
        { 
            header: "Date Added", 
            accessor: "createdAt" as keyof Product 
        },
    ];

    const handleFilter = () => {
        const filtered = products.filter(item => {
            if (!item.createdAt) return true; // Include items without dates
            
            const itemDate = new Date(item.createdAt);
            const filterStartDate = startDate ? new Date(startDate) : new Date(0);
            const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);
            
            return itemDate >= filterStartDate && itemDate <= filterEndDate;
        });
        
        setFilteredProducts(filtered);
    };

    const calculateTotalValue = () => {
        return filteredProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    };

    const calculateTotalItems = () => {
        return filteredProducts.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Product Inventory Report</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .report-header { text-align: center; margin-bottom: 20px; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<div class="report-header">');
            printWindow.document.write('<h1>Product Inventory Report</h1>');
            if (startDate || endDate) {
                printWindow.document.write(`<p>Period: ${startDate || 'All time'} to ${endDate || 'Present'}</p>`);
            }
            printWindow.document.write('</div>');
            
            if (tableRef.current) {
                printWindow.document.write('<table>');
                printWindow.document.write('<thead><tr>');
                columns.forEach(col => {
                    printWindow.document.write(`<th>${col.header}</th>`);
                });
                printWindow.document.write('</tr></thead>');
                
                printWindow.document.write('<tbody>');
                filteredProducts.forEach(product => {
                    printWindow.document.write('<tr>');
                    columns.forEach(col => {
                        if (col.header === "Price ($)") {
                            printWindow.document.write(`<td>$${product.price.toFixed(2)}</td>`);
                        } else if (col.header === "Total Value") {
                            printWindow.document.write(`<td>$${(product.price * product.quantity).toFixed(2)}</td>`);
                        } else {
                            printWindow.document.write(`<td>${product[col.accessor] || ''}</td>`);
                        }
                    });
                    printWindow.document.write('</tr>');
                });
                printWindow.document.write('</tbody>');
                printWindow.document.write('</table>');
                
                printWindow.document.write(`
                    <div style="margin-top: 20px; text-align: right;">
                        <p><strong>Total Items: ${calculateTotalItems()}</strong></p>
                        <p><strong>Total Inventory Value: $${calculateTotalValue()}</strong></p>
                    </div>
                `);
            }
            
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleExportExcel = () => {
        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += columns.map(col => col.header).join(",") + "\r\n";
        
        // Add rows
        filteredProducts.forEach(product => {
            const rowData = columns.map(col => {
                if (col.header === "Price ($)") {
                    return `$${product.price.toFixed(2)}`;
                } else if (col.header === "Total Value") {
                    return `$${(product.price * product.quantity).toFixed(2)}`;
                } else {
                    return product[col.accessor] || '';
                }
            });
            csvContent += rowData.join(",") + "\r\n";
        });
        
        // Add summary rows
        csvContent += `\r\nTotal Items,${calculateTotalItems()}\r\n`;
        csvContent += `Total Inventory Value,$${calculateTotalValue()}\r\n`;
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `product_report_${startDate || 'all'}_to_${endDate || 'present'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        alert("PDF export functionality would require a library like jsPDF. In a production environment, this button would generate a PDF document with the inventory data.");
        
        // In a real implementation, you would use something like:
        // import jsPDF from 'jspdf';
        // import 'jspdf-autotable';
        // 
        // const doc = new jsPDF();
        // doc.text("Product Inventory Report", 14, 16);
        // doc.autoTable({
        //   head: [columns.map(col => col.header)],
        //   body: filteredProducts.map(product => columns.map(col => {
        //     if (col.header === "Price ($)") {
        //       return `$${product.price.toFixed(2)}`;
        //     } else if (col.header === "Total Value") {
        //       return `$${(product.price * product.quantity).toFixed(2)}`;
        //     } else {
        //       return product[col.accessor] || '';
        //     }
        //   })),
        // });
        // doc.save(`product_report_${startDate || 'all'}_to_${endDate || 'present'}.pdf`);
    };

    const handleEmail = () => {
        // Create email body with table
        let emailBody = `Product Inventory Report ${startDate ? 'from ' + startDate : ''} ${endDate ? 'to ' + endDate : ''}\n\n`;
        
        // Table headers
        emailBody += columns.map(col => col.header).join("\t") + "\n";
        
        // Table rows
        filteredProducts.forEach(product => {
            const rowData = columns.map(col => {
                if (col.header === "Price ($)") {
                    return `$${product.price.toFixed(2)}`;
                } else if (col.header === "Total Value") {
                    return `$${(product.price * product.quantity).toFixed(2)}`;
                } else {
                    return product[col.accessor] || '';
                }
            });
            emailBody += rowData.join("\t") + "\n";
        });
        
        // Summary
        emailBody += `\nTotal Items: ${calculateTotalItems()}\n`;
        emailBody += `Total Inventory Value: $${calculateTotalValue()}`;
        
        // Encode for mailto
        const mailtoLink = `mailto:?subject=Product Inventory Report&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="p-6 min-h-screen">
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 Product Inventory Report</h1>
                
                {/* Filter Controls */}
                <div className="mb-6 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button 
                        onClick={handleFilter}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Apply Filter
                    </button>
                </div>
                
                {/* Export Controls */}
                <div className="mb-6 flex flex-wrap gap-3">
                    <button 
                        onClick={handlePrint}
                        className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export Excel
                    </button>
                    <button 
                        onClick={handleEmail}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email
                    </button>
                </div>
                
                {/* Table */}
                <div ref={tableRef}>
                    <Table columns={columns} data={filteredProducts} />
                </div>
                
                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Showing {filteredProducts.length} of {products.length} products
                                {startDate && endDate && ` from ${startDate} to ${endDate}`}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-md font-medium text-gray-800">Total Items: <span className="font-bold">{calculateTotalItems()}</span></p>
                            <p className="text-lg font-medium text-gray-800">Total Value: <span className="font-bold">${calculateTotalValue()}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}