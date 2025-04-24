"use client";
import { useEffect, useState } from "react";
import Table, { Column } from "../table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/persist_store";
import { fetch_purchase } from "@/service/purchase.service";
import toast from "react-hot-toast";
import { Purchase } from "@/interface/purchase";
import LoadingSpinner from "../loading/spinner";



export default function PurchaseList() {
    const user = useSelector((state: RootState) => state.user.user);
    const [data, setData] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPurchaseData = async () => {
        try {
            setLoading(true);
            const response = await fetch_purchase(user?._id);
            if (response.success) {
                setData(response.data);
            } else {
                toast.error(response.message || "Failed to fetch purchases");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPurchaseData();
        }
    }, [user?._id]);

    const columns: Column<Purchase>[] = [
        {
            accessor: "date",
            header: "Date",
            render: (row: Purchase) => <span>{new Date(row.date).toLocaleDateString()}</span>,
        },
        {
            accessor: "customer",
            header: "Customer",
            render: (row: Purchase) => <span>{row.customer?.name}</span>,
        },
        {
            accessor: "product",
            header: "Product",
            render: (row: Purchase) => <span>{row.product?.name}</span>,
        },
        {
            accessor: "price",
            header: "Price",
            render: (row: Purchase) => <span>${row?.price.toFixed(2)}</span>,
        },
        {
            accessor: "quantity",
            header: "Quantity",
        },
        {
            header: "Total",
            render: (row: Purchase) => <span>${(row.price * row.quantity).toFixed(2)}</span>,
            accessor: "_id"
        },
        {
            accessor: "payment",
            header: "Payment",
        },
    ];

    return (
        <div className="p-10 flex justify-center h-screen">
            <div className="w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between m-2">
                    <h2 className="text-xl font-bold text-gray-800">📦 Purchase List</h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <LoadingSpinner />
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center text-gray-500">No purchases found.</div>
                ) : (
                    <Table columns={columns} data={data} />

                )}
            </div>
        </div>
    );
}