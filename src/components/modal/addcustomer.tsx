import { FormEvent, useState } from "react";
import { Customer } from "../customer/customerlist";



interface AddCustomerProps {
    customers: Customer[];
    setIsModalOpen: (open: boolean) => void;
    setCustomers: (customers: Customer[]) => void;
}

export default function AddCustomer({ customers, setIsModalOpen, setCustomers }: AddCustomerProps) {
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCustomer = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.address) {
            alert("All fields are required!");
            return;
        }

        const customerToAdd: Customer = {
            id: customers.length ? customers[customers.length - 1].id + 1 : 1,
            name: newCustomer.name,
            number: newCustomer.phone,
            address: newCustomer.address,
        };

        setCustomers([...customers, customerToAdd]);
        setIsModalOpen(false);
        setNewCustomer({ name: "", email: "", phone: "", address: "" });
    };

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Customer</h2>

                <form className="w-full space-y-3" onSubmit={handleAddCustomer}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Customer Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleChange}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter customer name"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={newCustomer.email}
                            onChange={handleChange}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleChange}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Address</label>
                        <textarea
                            name="address"
                            value={newCustomer.address}
                            onChange={handleChange}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter address"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        Add Customer
                    </button>
                </form>
            </div>
        </div>
    );
}
