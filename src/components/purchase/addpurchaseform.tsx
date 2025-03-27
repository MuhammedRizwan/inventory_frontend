"use client";
import axios from "axios";
import Ipurchase from "@/interface/purchase";
import Iproduct from "@/interface/product";
import Icustomer from "@/interface/customer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetch_customer } from "@/service/customer.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/persist_store";
import { fetch_product } from "@/service/product.service";
import { addPurchase } from "@/service/purchase.service";

export default function AddPurchaseForm() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user.user);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Ipurchase>();
    const [customers, setCustomers] = useState<Icustomer[]>([]);
    const [products, setProducts] = useState<Iproduct[]>([]);
    const [maxQuantity, setMaxQuantity] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerResponse, productResponse] = await axios.all([
                    fetch_customer(user?._id),
                    fetch_product(user?._id),
                ]);

                if (customerResponse.success) setCustomers(customerResponse.data);
                if (productResponse.success) setProducts(productResponse.data);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
                toast.error(errorMessage);
            }
        };

        if (user?._id) fetchData();
    }, [user?._id]);

    const handleProductChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProduct = products.find(product => product.name === event.target.value);
        if (selectedProduct) {
            setValue("price", selectedProduct.price);
            setMaxQuantity(selectedProduct.quantity);
        }
    };

    const validateQuantity = (value: number) => {
        if (value > maxQuantity) {
            return `Quantity cannot exceed ${maxQuantity}`;
        }
        return true;
    };

    const validateDate = (value: Date) => {
        const selectedDate = new Date(value);
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        if (selectedDate > today) {
            return "Date cannot be in the future";
        }
        if (selectedDate < oneMonthAgo) {
            return "Date cannot be older than one month";
        }
        return true;
    }

    const onSubmit = async (data: Ipurchase) => {
        try {
            const customerData = customers.find(customer => customer.name === data.customer)
            const productData = products.find(product => product.name === data.product)
            const purchaseData = {
                userId: user?._id,
                date: data.date,
                customer: customerData?._id,
                product: productData?._id,
                price: data.price,
                quantity: data.quantity,
                payment: data.payment
            }
            const response = await addPurchase(purchaseData)
            if (response.success) {
                toast.success(response.message)
                router.push('/purchase');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        }
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
                            {...register("date", { required: "Date is required", validate: validateDate })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.date?.message || " "}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Customer Name</label>
                        <select
                            {...register("customer", { required: "Customer is required" })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                                <option key={customer._id} value={customer.name}>{customer.name}</option>
                            ))}
                        </select>
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.customer?.message}</p>
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
                                <option key={product._id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.product?.message}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Price</label>
                        <input
                            type="number"
                            {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            readOnly
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.price?.message}</p>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Quantity</label>
                        <input
                            type="number"
                            {...register("quantity", { required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" }, validate: validateQuantity })}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.quantity?.message}</p>
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
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.payment?.message}</p>
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
