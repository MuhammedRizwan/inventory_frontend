"use client";
import Table from "@/components/table";
import Iproduct from "@/interface/product";
import { fetch_product } from "@/service/product.service";
import { RootState } from "@/store/persist_store";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { printReport } from "@/utils/print.utils";
import { exportToPDF } from "@/utils/pdf.utils";
import { exportToExcel } from "@/utils/excel.utils";
import { emailReport } from "@/utils/email.utils";


export default function ProductReport() {
    const user = useSelector((state: RootState) => state.user.user);
    const [products, setProducts] = useState<Iproduct[]>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredProducts, setFilteredProducts] = useState<Iproduct[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    const fetchProductData = async () => {
        try {
            const response = await fetch_product(user?._id);
            if (response.success) {
                setFilteredProducts(response.data);
                setProducts(response.data);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [user?._id]);

    const columns = [
        { header: "ID", accessor: "id" as keyof Iproduct },
        { header: "Name", accessor: "name" as keyof Iproduct },
        { header: "Description", accessor: "description" as keyof Iproduct },
        { header: "Quantity", accessor: "quantity" as keyof Iproduct },
        {
            header: "Price ($)",
            accessor: "price" as keyof Iproduct,
            render: (product: Iproduct) => <span>${product.price.toFixed(2)}</span>,
        },
        {
            header: "Total Value",
            accessor: "_id" as keyof Iproduct,
            render: (product: Iproduct) => <span>${(product.price * product.quantity).toFixed(2)}</span>,
        },
        {
            accessor: "createdAt" as keyof Iproduct,
            header: "Date",
            render: (row: Iproduct) => <span>{new Date(row.createdAt as Date).toLocaleDateString()}</span>,
        },
    ];

    const handleFilter = () => {
        const filtered = products.filter(item => {
            if (!item.createdAt) return true;
            const itemDate = new Date(item.createdAt);
            const filterStartDate = startDate ? new Date(startDate) : new Date(0);
            const filterEndDate = endDate ? new Date(endDate) : new Date(8640000000000000);
            return itemDate >= filterStartDate && itemDate <= filterEndDate;
        });
        setFilteredProducts(filtered);
    };

    const calculateTotalValue = () => {
        return filteredProducts.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    const calculateTotalItems = () => {
        return filteredProducts.reduce((sum, item) => sum + item.quantity, 0);
    };

    const exportOptions = { startDate, endDate };
    const summary = [
        { label: "Total Items", value: calculateTotalItems().toString() },
        { label: "Total Inventory Value", value: `$${calculateTotalValue()}` },
    ];

    return (
        <div className="p-6 min-h-screen text-black text-sm">
            <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">📦 Product Inventory Report</h1>

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
                            onClick={() => printReport("Product Inventory Report", columns, filteredProducts, summary, exportOptions)}
                            className="px-4 py-2 bg-gray-600 font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>
                        <button
                            onClick={() => exportToPDF("Product Inventory Report", columns, filteredProducts, summary, exportOptions)}
                            className="px-4 py-2 bg-red-600 font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Export PDF
                        </button>
                        <button
                            onClick={() => exportToExcel("Product Inventory Report", columns, filteredProducts, summary, exportOptions)}
                            className="px-4 py-2 bg-green-600 font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Excel
                        </button>
                        <button
                            onClick={() => emailReport("Product Inventory Report", columns, filteredProducts, summary, exportOptions)}
                            className="px-4 py-2 bg-blue-600 font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email
                        </button>
                    </div>
                </div>

                <div ref={tableRef}>
                    {filteredProducts.length > 0 ? (
                        <Table columns={columns} data={filteredProducts} />
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No products found in the selected date range.</p>
                        </div>
                    )}
                </div>

                {filteredProducts.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Showing {filteredProducts.length} of {products.length} products
                                    {startDate && endDate && ` from ${startDate} to ${endDate}`}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-md font-medium text-gray-800">
                                    Total Items: <span className="font-bold">{calculateTotalItems()}</span>
                                </p>
                                <p className="text-lg font-medium text-gray-800">
                                    Total Value: <span className="font-bold">${calculateTotalValue()}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}