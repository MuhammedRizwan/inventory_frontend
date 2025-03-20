'use client'
import Table, { Column } from "@/components/table";
import { useState, useRef } from "react";


export interface Purchase {
    date: string;
    customer: string;
    product: string;
    price: number;
    quantity: number;
    payment: "Cash" | "Bank";
}

const initialData: Purchase[] = [
    { date: "2024-03-18", customer: "Alice", product: "Laptop", price: 1000, quantity: 1, payment: "Cash" },
    { date: "2024-03-19", customer: "Bob", product: "Mouse", price: 50, quantity: 2, payment: "Bank" },
    { date: "2024-03-15", customer: "Charlie", product: "Monitor", price: 300, quantity: 1, payment: "Bank" },
    { date: "2024-03-10", customer: "Diana", product: "Keyboard", price: 80, quantity: 3, payment: "Cash" },
    { date: "2024-03-05", customer: "Eve", product: "Headphones", price: 120, quantity: 2, payment: "Bank" },
];

export default function SalesReport() {
    const [data, setData] = useState<Purchase[]>(initialData);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredData, setFilteredData] = useState<Purchase[]>(initialData);
    const tableRef = useRef<HTMLDivElement>(null);

    const columns: Column<Purchase>[] = [
        { accessor: "date", header: "Date" },
        { accessor: "customer", header: "Customer" },
        { accessor: "product", header: "Product" },
        {
            accessor: "price",
            header: "Price",
            render: (row: Purchase) => <span>{`$${row.price.toFixed(2)}`}</span>
        },
        { accessor: "quantity", header: "Quantity" },
        {
            header: "Total",
            accessor: "date",
            render: (row: Purchase) => <span>{`$${(row.price * row.quantity).toFixed(2)}`}</span>
        },
        { accessor: "payment", header: "Payment Method" },
    ];

    const handleFilter = () => {
        const filtered = data.filter(item => {
            const itemDate = new Date(item.date);
            const filterStartDate = startDate ? new Date(startDate) : new Date(0);
            const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);

            return itemDate >= filterStartDate && itemDate <= filterEndDate;
        });

        setFilteredData(filtered);
    };

    const calculateTotal = () => {
        return filteredData.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Sales Report</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .report-header { text-align: center; margin-bottom: 20px; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<div class="report-header">');
            printWindow.document.write('<h1>Sales Report</h1>');
            if (startDate && endDate) {
                printWindow.document.write(`<p>Period: ${startDate} to ${endDate}</p>`);
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
                filteredData.forEach(row => {
                    printWindow.document.write('<tr>');
                    columns.forEach(col => {
                        if (col.render) {
                            // This is a simplified approach - custom renders won't work in print
                            if (col.header === "Price") {
                                printWindow.document.write(`<td>$${row.price.toFixed(2)}</td>`);
                            } else if (col.header === "Total") {
                                printWindow.document.write(`<td>$${(row.price * row.quantity).toFixed(2)}</td>`);
                            } else {
                                printWindow.document.write(`<td>${row[col.accessor]}</td>`);
                            }
                        } else {
                            printWindow.document.write(`<td>${row[col.accessor]}</td>`);
                        }
                    });
                    printWindow.document.write('</tr>');
                });
                printWindow.document.write('</tbody>');
                printWindow.document.write('</table>');

                printWindow.document.write(`<p style="text-align: right; margin-top: 20px;"><strong>Total: $${calculateTotal()}</strong></p>`);
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
        filteredData.forEach(row => {
            const rowData = columns.map(col => {
                if (col.header === "Price") {
                    return `$${row.price.toFixed(2)}`;
                } else if (col.header === "Total") {
                    return `$${(row.price * row.quantity).toFixed(2)}`;
                } else {
                    return row[col.accessor];
                }
            });
            csvContent += rowData.join(",") + "\r\n";
        });

        // Add total row
        csvContent += `,,,,,,Total: $${calculateTotal()}\r\n`;

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${startDate || 'all'}_to_${endDate || 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEmail = () => {
        // Create email body with table
        let emailBody = `Sales Report ${startDate ? 'from ' + startDate : ''} ${endDate ? 'to ' + endDate : ''}\n\n`;

        // Simple table for email
        emailBody += columns.map(col => col.header).join("\t") + "\n";
        filteredData.forEach(row => {
            const rowData = columns.map(col => {
                if (col.header === "Price") {
                    return `$${row.price.toFixed(2)}`;
                } else if (col.header === "Total") {
                    return `$${(row.price * row.quantity).toFixed(2)}`;
                } else {
                    return row[col.accessor];
                }
            });
            emailBody += rowData.join("\t") + "\n";
        });

        emailBody += `\nTotal: $${calculateTotal()}`;

        // Encode for mailto
        const mailtoLink = `mailto:?subject=Sales Report&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="p-6 min-h-screen text-black text-sm">
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>

                {/* Filter Controls */}
                {/* Filter and Export Controls in the Same Line */}
                <div className="mb-2 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-4 items-end justify-between">
                    {/* Date Filters */}
                    <div className="flex flex-wrap gap-4">
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
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="px-4 py-2 bg-indigo-600  font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-gray-600  font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2 bg-green-600  font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Excel
                        </button>
                        <button
                            onClick={handleEmail}
                            className="px-4 py-2 bg-blue-600  font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                        </button>
                    </div>
                </div>


                {/* Table */}
                <div ref={tableRef}>
                    <Table columns={columns} data={filteredData} />
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">
                                Showing {filteredData.length} of {data.length} entries
                                {startDate && endDate && ` from ${startDate} to ${endDate}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-800">Total: ${calculateTotal()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}