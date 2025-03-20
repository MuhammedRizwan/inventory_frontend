'use client'
import Table from "@/components/table";
import { useState, useRef, useEffect } from "react";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface Transaction {
    id: number;
    customerId: number;
    date: string;
    description: string;
    amount: number;
    type: 'payment' | 'purchase' | 'refund';
    status: 'completed' | 'pending' | 'cancelled';
}

// Sample customers data
const sampleCustomers: Customer[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "123-456-7890" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "234-567-8901" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "345-678-9012" }
];

// Sample transactions data
const sampleTransactions: Transaction[] = [
    { id: 1, customerId: 1, date: "2024-03-01", description: "Purchase - Laptop", amount: 1200, type: 'purchase', status: 'completed' },
    { id: 2, customerId: 1, date: "2024-03-05", description: "Payment - Invoice #001", amount: 500, type: 'payment', status: 'completed' },
    { id: 3, customerId: 1, date: "2024-03-10", description: "Purchase - Accessories", amount: 150, type: 'purchase', status: 'completed' },
    { id: 4, customerId: 2, date: "2024-03-02", description: "Purchase - Smartphone", amount: 800, type: 'purchase', status: 'completed' },
    { id: 5, customerId: 2, date: "2024-03-08", description: "Payment - Invoice #002", amount: 800, type: 'payment', status: 'completed' },
    { id: 6, customerId: 3, date: "2024-03-15", description: "Purchase - Headphones", amount: 200, type: 'purchase', status: 'completed' },
    { id: 7, customerId: 3, date: "2024-03-16", description: "Purchase - Charger", amount: 50, type: 'purchase', status: 'completed' },
    { id: 8, customerId: 3, date: "2024-03-20", description: "Refund - Faulty Charger", amount: 50, type: 'refund', status: 'completed' },
    { id: 9, customerId: 1, date: "2024-03-18", description: "Payment - Invoice #003", amount: 850, type: 'payment', status: 'pending' }
];

export default function CustomerLedger() {
    const [customers] = useState<Customer[]>(sampleCustomers);
    const [transactions] = useState<Transaction[]>(sampleTransactions);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // Update filtered transactions when customer selection changes
    useEffect(() => {
        if (selectedCustomerId) {
            const customerTxns = transactions.filter(t => t.customerId === selectedCustomerId);
            setFilteredTransactions(customerTxns);

            // Set customer details
            const customer = customers.find(c => c.id === selectedCustomerId) || null;
            setCustomerDetails(customer);
        } else {
            setFilteredTransactions([]);
            setCustomerDetails(null);
        }
    }, [selectedCustomerId, customers, transactions]);

    const columns = [
        { header: "Date", accessor: "date" as keyof Transaction },
        { header: "Description", accessor: "description" as keyof Transaction },
        {
            header: "Type",
            accessor: "type" as keyof Transaction,
            render: (transaction: Transaction) => {
                const typeClasses = {
                    'payment': 'bg-green-100 text-green-800',
                    'purchase': 'bg-blue-100 text-blue-800',
                    'refund': 'bg-amber-100 text-amber-800'
                };
                return (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeClasses[transaction.type]}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                );
            }
        },
        {
            header: "Status",
            accessor: "status" as keyof Transaction,
            render: (transaction: Transaction) => {
                const statusClasses = {
                    'completed': 'bg-green-100 text-green-800',
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'cancelled': 'bg-red-100 text-red-800'
                };
                return (
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClasses[transaction.status]}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                );
            }
        },
        {
            header: "Amount",
            accessor: "amount" as keyof Transaction,
            render: (transaction: Transaction) => {
                const prefix = transaction.type === 'payment' ? '-' :
                    transaction.type === 'refund' ? '-' : '';
                return <span className={transaction.type === 'payment' ? 'text-red-600' :
                    transaction.type === 'refund' ? 'text-red-600' :
                        'text-green-600'}>
                    {prefix}${transaction.amount.toFixed(2)}
                </span>;
            }
        }
    ];

    const handleFilter = () => {
        if (!selectedCustomerId) return;

        const customerTxns = transactions.filter(t => {
            if (t.customerId !== selectedCustomerId) return false;

            const txnDate = new Date(t.date);
            const filterStartDate = startDate ? new Date(startDate) : new Date(0);
            const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);

            return txnDate >= filterStartDate && txnDate <= filterEndDate;
        });

        setFilteredTransactions(customerTxns);
    };

    const calculateBalance = () => {
        if (!filteredTransactions.length) return 0;

        return filteredTransactions.reduce((balance, transaction) => {
            if (transaction.type === 'purchase') {
                return balance + transaction.amount;
            } else {
                return balance - transaction.amount;
            }
        }, 0);
    };

    const handlePrint = () => {
        if (!customerDetails) return;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Customer Ledger</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
                body { font-family: Arial, sans-serif; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .report-header { text-align: center; margin-bottom: 20px; }
                .customer-details { margin: 20px 0; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; }
                .balance { text-align: right; margin-top: 20px; font-weight: bold; }
                .payment { color: #e53e3e; }
                .purchase { color: #2f855a; }
                .refund { color: #e53e3e; }
            `);
            printWindow.document.write('</style></head><body>');
            printWindow.document.write('<div class="report-header">');
            printWindow.document.write('<h1>Customer Ledger</h1>');
            if (startDate || endDate) {
                printWindow.document.write(`<p>Period: ${startDate || 'All time'} to ${endDate || 'Present'}</p>`);
            }
            printWindow.document.write('</div>');

            // Customer Details
            printWindow.document.write('<div class="customer-details">');
            printWindow.document.write(`<h2>${customerDetails.name}</h2>`);
            printWindow.document.write(`<p>Email: ${customerDetails.email}</p>`);
            printWindow.document.write(`<p>Phone: ${customerDetails.phone}</p>`);
            printWindow.document.write('</div>');

            // Transactions Table
            printWindow.document.write('<table>');
            printWindow.document.write('<thead><tr>');
            columns.forEach(col => {
                printWindow.document.write(`<th>${col.header}</th>`);
            });
            printWindow.document.write('</tr></thead>');

            printWindow.document.write('<tbody>');
            filteredTransactions.forEach(transaction => {
                printWindow.document.write('<tr>');
                columns.forEach(col => {
                    if (col.header === "Amount") {
                        const prefix = transaction.type === 'payment' ? '-' :
                            transaction.type === 'refund' ? '-' : '';
                        const amountClass = transaction.type === 'payment' || transaction.type === 'refund' ?
                            'payment' : 'purchase';
                        printWindow.document.write(`<td class="${amountClass}">${prefix}$${transaction.amount.toFixed(2)}</td>`);
                    } else if (col.header === "Type") {
                        printWindow.document.write(`<td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>`);
                    } else if (col.header === "Status") {
                        printWindow.document.write(`<td>${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</td>`);
                    } else {
                        printWindow.document.write(`<td>${transaction[col.accessor]}</td>`);
                    }
                });
                printWindow.document.write('</tr>');
            });
            printWindow.document.write('</tbody>');
            printWindow.document.write('</table>');

            // Balance
            const balance = calculateBalance();
            printWindow.document.write(`<div class="balance">Current Balance: $${balance.toFixed(2)}</div>`);

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleExportExcel = () => {
        if (!customerDetails) return;

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add customer details
        csvContent += `Customer Name,${customerDetails.name}\r\n`;
        csvContent += `Email,${customerDetails.email}\r\n`;
        csvContent += `Phone,${customerDetails.phone}\r\n\r\n`;

        // Add headers
        csvContent += columns.map(col => col.header).join(",") + "\r\n";

        // Add rows
        filteredTransactions.forEach(transaction => {
            const rowData = columns.map(col => {
                if (col.header === "Amount") {
                    const prefix = transaction.type === 'payment' ? '-' :
                        transaction.type === 'refund' ? '-' : '';
                    return `${prefix}$${transaction.amount.toFixed(2)}`;
                } else if (col.header === "Type" || col.header === "Status") {
                    return (transaction[col.accessor] as string).charAt(0).toUpperCase() + (transaction[col.accessor] as string).slice(1);
                } else {
                    return transaction[col.accessor];
                }
            });
            csvContent += rowData.join(",") + "\r\n";
        });

        // Add balance row
        csvContent += `\r\nCurrent Balance,$${calculateBalance().toFixed(2)}\r\n`;

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `customer_ledger_${customerDetails.name.replace(/\s+/g, '_')}_${startDate || 'all'}_to_${endDate || 'present'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        alert("PDF export functionality would require a library like jsPDF. In a production environment, this button would generate a PDF document with the customer ledger.");
    };

    const handleEmail = () => {
        if (!customerDetails) return;

        // Create email body with customer details and transactions
        let emailBody = `Customer Ledger for ${customerDetails.name}\n`;
        emailBody += `Email: ${customerDetails.email}\n`;
        emailBody += `Phone: ${customerDetails.phone}\n\n`;

        if (startDate || endDate) {
            emailBody += `Period: ${startDate || 'All time'} to ${endDate || 'Present'}\n\n`;
        }

        // Table headers
        emailBody += columns.map(col => col.header).join("\t") + "\n";

        // Table rows
        filteredTransactions.forEach(transaction => {
            const rowData = columns.map(col => {
                if (col.header === "Amount") {
                    const prefix = transaction.type === 'payment' ? '-' :
                        transaction.type === 'refund' ? '-' : '';
                    return `${prefix}$${transaction.amount.toFixed(2)}`;
                } else if (col.header === "Type" || col.header === "Status") {
                    return (transaction[col.accessor] as string).charAt(0).toUpperCase() + (transaction[col.accessor] as string).slice(1);
                } else {
                    return transaction[col.accessor];
                }
            });
            emailBody += rowData.join("\t") + "\n";
        });

        // Balance
        emailBody += `\nCurrent Balance: $${calculateBalance().toFixed(2)}`;

        // Encode for mailto
        const mailtoLink = `mailto:?subject=Customer Ledger for ${customerDetails.name}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    };

    return (
        <div className="p-6 min-h-screen text-black text-sm">
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 Customer Ledger</h1>

                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
                    <select
                        value={selectedCustomerId || ''}
                        onChange={(e) => setSelectedCustomerId(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Select a customer --</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} - {customer.email}
                            </option>
                        ))}
                    </select>
                </div>

                {customerDetails && (
                    <>
                        <div className="mb-6 p-4 bg-white border rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">{customerDetails.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Email:</span> {customerDetails.email}
                                </div>
                                <div>
                                    <span className="text-gray-500">Phone:</span> {customerDetails.phone}
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 p-4 bg-gray-100 rounded-lg flex flex-wrap gap-4 items-end justify-between">
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

                            <div className="flex flex-wrap gap-3 items-end">
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
                                    onClick={handleExportPDF}
                                    className="px-4 py-2 bg-red-600  font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Export PDF
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

                        <div className="mb-6" ref={tableRef}>
                            {filteredTransactions.length > 0 ? (
                                <Table columns={columns} data={filteredTransactions} />
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No transactions found for this customer in the selected date range.</p>
                                </div>
                            )}
                        </div>

                        {filteredTransactions.length > 0 && (
                            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Showing {filteredTransactions.length} transactions
                                            {startDate && endDate && ` from ${startDate} to ${endDate}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-gray-800">
                                            Current Balance: ${calculateBalance().toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!selectedCustomerId && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No customer selected</h3>
                        <p className="mt-1 text-sm text-gray-500">Please select a customer to view their transaction history.</p>
                    </div>
                )}
            </div>
        </div>
    );
}