"use client";
import Table from "@/components/table";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { RootState } from "@/store/persist_store";
import { useSelector } from "react-redux";
import { fetch_customer } from "@/service/customer.service";
import { fetch_purchase } from "@/service/purchase.service";
import Icustomer from "@/interface/customer";
import { Purchase } from "@/interface/purchase";
import { printReport } from "@/utils/print.utils";
import { exportToPDF } from "@/utils/pdf.utils";
import { exportToExcel } from "@/utils/excel.utils";
import { emailReport } from "@/utils/email.utils";



export default function CustomerLedger() {
    const user = useSelector((state: RootState) => state.user.user);
    const [customers, setCustomers] = useState<Icustomer[]>([]);
    const [transactions, setTransactions] = useState<Purchase[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredTransactions, setFilteredTransactions] = useState<Purchase[]>([]);
    const [customerDetails, setCustomerDetails] = useState<Icustomer | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // Fetch customers and transactions from backend
    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;

            try {
                // Fetch customers
                const customerResponse = await fetch_customer(user._id);
                if (customerResponse.success) {
                    setCustomers(customerResponse.data);
                } else {
                    toast.error(customerResponse.message || "Failed to fetch customers");
                }

                // Fetch purchases
                const purchaseResponse = await fetch_purchase(user._id);
                if (purchaseResponse.success) {
                    setTransactions(purchaseResponse.data);
                } else {
                    toast.error(purchaseResponse.message || "Failed to fetch transactions");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                toast.error(errorMessage);
            }
        };
        fetchData();
    }, [user?._id]);

    // Filter transactions when customer selection changes
    useEffect(() => {
        if (selectedCustomerId) {
            const customerTxns = transactions.filter(t => t.customer._id === selectedCustomerId);
            setFilteredTransactions(customerTxns);
            const customer = customers.find(c => c._id === selectedCustomerId) || null;
            setCustomerDetails(customer);
        } else {
            setFilteredTransactions([]);
            setCustomerDetails(null);
        }
    }, [selectedCustomerId, customers, transactions]);

    const columns = [
        {
            accessor: "date" as keyof Purchase,
            header: "Date",
            render: (row: Purchase) => <span>{new Date(row.date).toLocaleDateString()}</span>,
        },
        {
            header: "Product",
            accessor: "product" as keyof Purchase,
            render: (transaction: Purchase) => <span>{transaction.product?.name}</span>,
        },
        {
            header: "Price",
            accessor: "price" as keyof Purchase,
            render: (transaction: Purchase) => <span>${transaction.price.toFixed(2)}</span>,
        },
        { header: "Quantity", accessor: "quantity" as keyof Purchase },
        {
            header: "Total",
            accessor: "price" as keyof Purchase,
            render: (transaction: Purchase) => <span>${(transaction.price * transaction.quantity).toFixed(2)}</span>,
        },
        { header: "Payment Method", accessor: "payment" as keyof Purchase },
    ];

    const handleFilter = () => {
        if (!selectedCustomerId) return;

        const customerTxns = transactions.filter(t => {
            if (t.customer._id !== selectedCustomerId) return false;
            const txnDate = new Date(t.date);
            const filterStartDate = startDate ? new Date(startDate) : new Date(0);
            const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);
            return txnDate >= filterStartDate && txnDate <= filterEndDate;
        });

        setFilteredTransactions(customerTxns);
    };

    const calculateTotal = () => {
        if (!filteredTransactions.length) return 0;
        return filteredTransactions.reduce((total, transaction) => {
            return total + transaction.price * transaction.quantity;
        }, 0);
    };

    const exportOptions = { startDate, endDate };
    const summary = [{ label: "Total", value: `$${calculateTotal().toFixed(2)}` }];

    const handlePrintWithCustomer = () => {
        if (!customerDetails) return;
        printReport(
            "Customer Ledger",
            columns,
            filteredTransactions,
            summary,
            exportOptions,
            {
                header: `
                    <div class="customer-details">
                        <h2>${customerDetails.name}</h2>
                        <p>Email: ${customerDetails.email}</p>
                        <p>Phone: ${customerDetails.mobile}</p>
                    </div>
                `,
                styles: `
                    .customer-details { margin: 20px 0; padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; }
                `,
            }
        );
    };

    const handleExportExcelWithCustomer = () => {
        if (!customerDetails) return;
        exportToExcel(
            "Customer Ledger",
            columns,
            filteredTransactions,
            summary,
            exportOptions,
            {
                prepend: [
                    `Customer Name,${customerDetails.name}`,
                    `Email,${customerDetails.email}`,
                    `Phone,${customerDetails.mobile}`,
                    "",
                ],
            }
        );
    };

    const handleExportPDFWithCustomer = () => {
        if (!customerDetails) return;
        exportToPDF(
            "Customer Ledger",
            columns,
            filteredTransactions,
            summary,
            exportOptions,
            {
                prependFn: (doc: any) => {
                    doc.setFontSize(14);
                    doc.text(customerDetails.name, 20, 50);
                    doc.setFontSize(10);
                    doc.text(`Email: ${customerDetails.email}`, 20, 60);
                    doc.text(`Phone: ${customerDetails.mobile}`, 20, 70);
                    return 80; // Start table below customer details
                },
            }
        );
    };

    const handleEmailWithCustomer = () => {
        if (!customerDetails) return;
        emailReport(
            `Customer Ledger for ${customerDetails.name}`,
            columns,
            filteredTransactions,
            summary,
            exportOptions,
            {
                prepend: [
                    `Customer Name: ${customerDetails.name}`,
                    `Email: ${customerDetails.email}`,
                    `Phone: ${customerDetails.mobile}`,
                    "",
                ],
            }
        );
    };

    return (
        <div className="p-6 min-h-screen text-black text-sm">
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 Customer Ledger</h1>

                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
                    <select
                        value={selectedCustomerId || ""}
                        onChange={(e) => setSelectedCustomerId(e.target.value || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Select a customer --</option>
                        {customers.map(customer => (
                            <option key={customer._id} value={customer._id}>
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
                                <div><span className="text-gray-500">Email:</span> {customerDetails.email}</div>
                                <div><span className="text-gray-500">Phone:</span> {customerDetails.mobile}</div>
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
                                        className="px-4 py-2 bg-indigo-600 font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        Apply Filter
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 items-end">
                                <button
                                    onClick={handlePrintWithCustomer}
                                    className="px-4 py-2 bg-gray-600 font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print
                                </button>
                                <button
                                    onClick={handleExportPDFWithCustomer}
                                    className="px-4 py-2 bg-red-600 font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Export PDF
                                </button>
                                <button
                                    onClick={handleExportExcelWithCustomer}
                                    className="px-4 py-2 bg-green-600 font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Export Excel
                                </button>
                                <button
                                    onClick={handleEmailWithCustomer}
                                    className="px-4 py-2 bg-blue-600 font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
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
                                            Total: ${calculateTotal().toFixed(2)}
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