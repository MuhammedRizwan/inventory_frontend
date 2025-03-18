'use client'
import { useState } from "react";
import Table from "../table";
import EditableRow from "../editablerow";
import AddCustomer from "../modal/addcustomer";

export interface Customer {
    id: number;
    name: string;
    address: string;
    number: string;
}

const initialCustomers: Customer[] = [
    { id: 1, name: "John Doe", address: "123 Main St, New York, NY", number: "123-456-7890" },
    { id: 2, name: "Jane Smith", address: "456 Elm St, Los Angeles, CA",number: "987-654-3210" },
    { id: 3, name: "Alice Johnson", address: "789 Oak St, Chicago, IL", number: "555-123-4567" },
];

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Customer>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (confirmDelete) {
            setCustomers(customers.filter(customer => customer.id !== id));
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingId(customer.id);
        setEditData(customer);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = () => {
        if (editingId !== null) {
            setCustomers(customers.map(customer =>
                customer.id === editingId ? { ...customer, ...editData } : customer
            ));
            setEditingId(null);
            setEditData({});
        }
    };

    const customerFields = [
        { key: "name" as keyof Customer, label: "Name", type: "text" },
        { key: "address" as keyof Customer, label: "Address", type: "text" },
        { key: "mobile" as keyof Customer, label: "Mobile", type: "text" },
    ];
    const columns = [
        { header: "Name", accessor: "name" as keyof Customer },
        { header: "Address", accessor: "address" as keyof Customer },
        { header: "Mobile Number", accessor: "number" as keyof Customer },
        {
            header: "Actions",
            accessor: "id" as keyof Customer,
            render: (customer: Customer) => (
                editingId === customer.id ? (

                    <EditableRow<Customer> item={customer} onSave={handleSave} onCancel={handleCancel} fields={customerFields} />

                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(customer)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(customer.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                        >
                            Delete
                        </button>
                    </div>
                )
            ),
        },
    ];

    return (
        <div className="p-10 flex justify-center">
            <div className="w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between m-2">
                    <h2 className="text-xl font-bold text-gray-800">👥 Customer List</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-700 text-white px-6 py-1 text-sm rounded-md hover:bg-green-950 transition-colors duration-200 shadow-md"
                    >
                        Add Customer
                    </button>
                </div>
                <Table columns={columns} data={customers} />
            </div>

            {isModalOpen && (
                <AddCustomer
                    customers={customers}
                    setIsModalOpen={setIsModalOpen}
                    setCustomers={setCustomers}
                />
            )}
        </div>
    );
}
