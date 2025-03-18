'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Purchase } from "./purchaselist";

export default function AddPurchaseForm(){
    const router = useRouter()
    const [newPurchase, setNewPurchase] = useState<Purchase>({
        date: "",
        customer: "",
        product: "",
        price: 0,
        quantity: 1,
        payment: "Cash",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPurchase((prev) => ({ ...prev, [name]: value }));
    };

    const addPurchase = () => {
        router.push('/purchase')
    };
    return (
        <div className="p-10    ">
            <div className="mt-6 border m-8 p-4 rounded-lg shadow-md bg-white text-black">
                <h2 className="text-lg font-semibold mb-4">Add New Purchase</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={newPurchase.date}
                            onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Date"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Customer Name</label>
                        <input
                            type="text"
                            name="customer"
                            placeholder="Customer Name"
                            value={newPurchase.customer}
                            onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Product Name</label>
                        <input
                            type="text"
                            name="product"
                            placeholder="Product Name"
                            value={newPurchase.product}
                            onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newPurchase.price}
                            onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={newPurchase.quantity}
                            onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold mb-1 text-sm">Payment</label>
                        <select name="payment" value={newPurchase.payment} onChange={handleChange}
                            className="w-full text-sm text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md">
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank</option>
                        </select>
                    </div>


                </div>
                <button
                    onClick={addPurchase}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Add Purchase
                </button>
            </div>
        </div>
    )
}