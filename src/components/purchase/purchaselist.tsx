'use client'
import { useState } from "react";
import Table, { Column } from "../table";


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
];
export default function PurchaseList() {
    const [data, setData] = useState<Purchase[]>(initialData);

    const columns: Column<Purchase>[] = [
        { accessor: "date", header: "Date" },
        { accessor: "customer", header: "Customer" },
        { accessor: "product", header: "Product" },
        {
            accessor: "price",
            header: "Price",
            render: (row: Purchase) => <span>{`$${row.price}`}</span>,
        },
        { accessor: "quantity", header: "Quantity" },
        {
            header: "Total",
            render: (row: Purchase) => <span>{`$${row.price * row.quantity}`}</span>,
            accessor: "date",
        },
        { accessor: "payment", header: "Payment" },
    ];

    return (
        <div className="p-10 flex justify-center h-screen">
            <div className="w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between m-2">
                    <h2 className="text-xl font-bold text-gray-800">📦 Purchase List</h2>
                </div>
                <Table columns={columns} data={data} />
            </div>
        </div>
    );
}
