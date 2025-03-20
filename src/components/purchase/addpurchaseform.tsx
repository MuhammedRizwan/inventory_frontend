"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Purchase } from "./purchaselist";
import { fetch_customer } from "@/service/customer.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/persist_store";
import { fetch_product } from "@/service/product.service";

export default function AddPurchaseForm() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Purchase>();
    const [customers, setCustomers] = useState<{ id: string, name: string }[]>([]);
    const [products, setProducts] = useState<{ id: string, name: string, price: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerResponse, productResponse] = await Promise.all([
                    fetch_customer(user?._id),
                    fetch_product(user?._id),
                ]);

                if (customerResponse.success) setCustomers(customerResponse.data);
                if (productResponse.success) setProducts(productResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user?._id) fetchData();
    }, [user?._id]);

    const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProduct = products.find(product => product.name === event.target.value);
        if (selectedProduct) {
            setValue("price", selectedProduct.price); 
        }
    };

    const onSubmit = (data: Purchase) => {
        console.log("Purchase Data:", data);
        // router.push('/purchase');
    };

    return (
        <div className="p-10">
            <div className="mt-6 border m-8 p-4 rounded-lg shadow-md bg-white text-black">
                <h2 className="text-lg font-semibold mb-4">Add New Purchase</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Date</label>
                        <input
                            type="date"
                            {...register("date", { required: "Date is required" })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Customer Name</label>
                        <select
                            {...register("customer", { required: "Customer is required" })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.name}>{customer.name}</option>
                            ))}
                        </select>
                        {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Product Name</label>
                        <select
                            {...register("product", { required: "Product is required" })}
                            onChange={handleProductChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                        {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Price</label>
                        <input
                            type="number"
                            {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            readOnly 
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Quantity</label>
                        <input
                            type="number"
                            {...register("quantity", { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" } })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Payment</label>
                        <select
                            {...register("payment", { required: "Payment method is required" })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                        </select>
                        {errors.payment && <p className="text-red-500 text-xs mt-1">{errors.payment.message}</p>}
                    </div>

                    <div className="col-span-2 md:col-span-3">
                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 py-2 px-4 rounded hover:bg-blue-600 transition"
                        >
                            Add Purchase
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
