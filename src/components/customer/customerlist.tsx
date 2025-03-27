'use client'
import { useEffect, useState, useTransition } from "react";
import Table from "../table";
import AddCustomer from "../modal/addcustomer";
import { useForm } from "react-hook-form";
import Icustomer from "@/interface/customer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/persist_store";
import toast from "react-hot-toast";
import { delete_customer, edit_customer, fetch_customer } from "@/service/customer.service";
import LoadingSpinner from "../loading/spinner";



export default function CustomerList() {
    const user = useSelector((state: RootState) => state.user.user);
    const [customers, setCustomers] = useState<Icustomer[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        clearErrors
    } = useForm<Partial<Icustomer>>();

    useEffect(() => {
        startTransition(async () => {
            try {
                const response = await fetch_customer(user?._id);
                if (response.success) {
                    setCustomers(response.data);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(errorMessage);
            }
        });
    }, []);

    const handleDelete = async (customerId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
        if (confirmDelete) {
            try {
                const response = await delete_customer(customerId);
                if (response.success) {
                    toast.success(response.message);
                    setCustomers(prev_customers => prev_customers.filter(customer => customer._id !== customerId));
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(errorMessage);
            }
        }
    };

    const handleEdit = (customer: Icustomer) => {
        setEditingId(customer._id as string);
        Object.keys(customer).forEach(key => {
            setValue(key as keyof Icustomer, customer[key as keyof Icustomer]);
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        clearErrors();
    };

    const handleSave = handleSubmit(async (data) => {
        if (editingId !== null) {
            try {
                const updatedCustomer = { ...data, _id: editingId };
                const response = await edit_customer(updatedCustomer);
                if (response.success) {
                    setCustomers(customers.map(customer =>
                        customer._id === editingId ? { ...customer, ...data } : customer
                    ));
                    setEditingId(null);
                    toast.success(response.message);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(errorMessage);
            }
        }
    });
    const columns = [
        {
            header: 'Name',
            accessor: 'name' as keyof Icustomer,
            render: (customer: Icustomer) => (
                editingId === customer._id ? (
                    <>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.name?.message || " "}</p>
                    </>
                ) : (
                    <>{customer.name}</>
                )
            )
        },
        {
            header: 'email',
            accessor: 'email' as keyof Icustomer,
            render: (customer: Icustomer) => (
                editingId === customer._id ? (
                    <>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/, message: "Invalid email format" },
                            })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.email?.message || " "}</p>
                    </>
                ) : (
                    <>{customer.address}</>
                )
            )
        },
        {
            header: 'mobile',
            accessor: 'mobile' as keyof Icustomer,
            render: (customer: Icustomer) => (
                editingId === customer._id ? (
                    <>
                        <input
                            type="number"
                            {...register("mobile", {
                                required: "Phone number is required",
                                pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" },
                            })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.mobile?.message || " "}</p>
                    </>
                ) : (
                    <>{customer.mobile}</>
                )
            )
        },
        {
            header: 'address',
            accessor: 'address' as keyof Icustomer,
            render: (customer: Icustomer) => (
                editingId === customer._id ? (
                    <>
                        <input
                            {...register('address', { required: 'Address is required' })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.address?.message || " "}</p>
                    </>
                ) : (
                    <>{customer.address}</>
                )
            )
        },
        {
            header: 'Actions',
            accessor: '_id' as keyof Icustomer,
            render: (customer: Icustomer) => (
                editingId === customer._id ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-sm px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-sm px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            disabled={editingId !== null}
                            onClick={() => handleEdit(customer)}
                            className={`bg-blue-500 text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md 
                                ${editingId !== null ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(customer._id as string)}
                            className="bg-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                        >
                            Delete
                        </button>
                    </div >
                )
            ),
        },
    ];

    return (
        <div className="p-10 flex justify-center h-screen">
            <div className="w-full p-8 bg-white rounded-xl shadow-lg">
                <div className="flex justify-between m-2">
                    <h2 className="text-xl font-bold text-gray-800">👥 Customer List</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-700 px-6 py-1 text-sm rounded-md hover:bg-green-950 transition-colors duration-200 shadow-md"
                    >
                        Add
                    </button>
                </div>

                {isPending ? (
                    <div className="flex items-center justify-center min-h-screen">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <Table columns={columns} data={customers} />
                )}
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