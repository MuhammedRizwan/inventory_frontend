"use client";
import { useState, useEffect } from "react";
import { RootState } from "@/store/persist_store";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { fetch_customer } from "@/service/customer.service";
import { fetch_purchase } from "@/service/purchase.service";
import { fetch_product } from "@/service/product.service";
import Icustomer from "@/interface/customer";
import { Purchase } from "@/interface/purchase";
import Iproduct from "@/interface/product";
import LoadingSpinner from "@/components/loading/spinner";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.user.user);
    const [customers, setCustomers] = useState<Icustomer[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [products, setProducts] = useState<Iproduct[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            if (!user?._id) return;

            try {
                setLoading(true);

                const customerResponse = await fetch_customer(user._id);
                if (customerResponse.success) {
                    setCustomers(customerResponse.data);
                } else {
                    toast.error(customerResponse.message || "Failed to fetch customers");
                }


                const purchaseResponse = await fetch_purchase(user._id);
                if (purchaseResponse.success) {
                    setPurchases(purchaseResponse.data);
                } else {
                    toast.error(purchaseResponse.message || "Failed to fetch purchases");
                }

                // Fetch products
                const productResponse = await fetch_product(user._id);
                if (productResponse.success) {
                    setProducts(productResponse.data);
                } else {
                    toast.error(productResponse.message || "Failed to fetch products");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?._id]);

    const purchaseData = () => {
        const monthlyTotals: { [key: string]: number } = {};
        purchases.forEach(purchase => {
            const date = new Date(purchase.date);
            const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
            const total = purchase.price * purchase.quantity;
            monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + total;
        });

        const labels = Object.keys(monthlyTotals).sort();
        const data = labels.map(label => monthlyTotals[label]);

        return {
            labels,
            datasets: [
                {
                    label: "Total Purchases ($)",
                    data,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };


    const productData = () => {
        const labels = products.map(product => product.name);
        const quantities = products.map(product => product.quantity);

        return {
            labels,
            datasets: [
                {
                    label: "Product Quantities",
                    data: quantities,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };


    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Monthly Purchase Totals" },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Product Quantity Distribution" },
        },
    };

    const totalPurchases = purchases.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalProducts = products.length;
    const totalCustomers = customers.length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">📊 Inventory Management Dashboard</h1>

                <div className="bg-white text-black p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Company Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p><span className="font-medium text-gray-600">Name:</span> {user?.name || "N/A"}</p>
                        <p><span className="font-medium text-gray-600">Email:</span> {user?.email || "N/A"}</p>
                        <p><span className="font-medium text-gray-600">Mobile:</span> {user?.mobile || "N/A"}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Purchases</h3>
                        <p className="text-2xl font-bold text-green-600">${totalPurchases.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                        <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
                        <p className="text-2xl font-bold text-purple-600">{totalCustomers}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-64"> 
                            <Bar data={purchaseData()} options={barOptions} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="h-64 flex justify-center">
                            <Pie data={productData()} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}