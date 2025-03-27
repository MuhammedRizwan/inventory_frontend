'use client';

import Iproduct from '@/interface/product';
import { useEffect, useState, useTransition } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/persist_store';
import { delete_product, edit_product, fetch_product } from '@/service/product.service';
import toast from 'react-hot-toast';
import Table from '../table';
import AddProduct from '../modal/addproduct';
import { useForm } from 'react-hook-form';

export default function ProductList() {
    const user = useSelector((state: RootState) => state.user.user);
    const [products, setProducts] = useState<Iproduct[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        clearErrors
    } = useForm<Partial<Iproduct>>();

    useEffect(() => {
        startTransition(async () => {
            try {
                const response = await fetch_product(user?._id);
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(errorMessage);
            }
        });
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                const response = await delete_product(id);
                if (response.success) {
                    toast.success(response.message);
                    setProducts(prev_products => prev_products.filter(product => product._id !== id));
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                toast.error(errorMessage);
            }
        }
    };

    const handleEdit = (product: Iproduct) => {
        setEditingId(product._id as string);
        Object.keys(product).forEach(key => {
            setValue(key as keyof Iproduct, product[key as keyof Iproduct]);
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        clearErrors();
    };

    const handleSave = handleSubmit(async (data) => {
        if (editingId !== null) {
            try {
                const updatedProduct = { ...data, _id: editingId };
                const response = await edit_product(updatedProduct);
                if (response.success) {
                    setProducts(products.map(product =>
                        product._id === editingId ? { ...product, ...response.data } : product
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
            accessor: 'name' as keyof Iproduct,
            render: (product: Iproduct) => (
                editingId === product._id ? (
                    <>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.name?.message || " "}</p>
                    </>
                ) : (
                    <>{product.name}</>
                )
            )
        },
        {
            header: 'Description',
            accessor: 'description' as keyof Iproduct,
            render: (product: Iproduct) => (
                editingId === product._id ? (
                    <>
                        <input
                            {...register('description', { required: 'Description is required' })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.description?.message || " "}</p>
                    </>
                ) : (
                    <>{product.description}</>
                )
            )
        },
        {
            header: 'Quantity',
            accessor: 'quantity' as keyof Iproduct,
            render: (product: Iproduct) => (
                editingId === product._id ? (
                    <>
                        <input
                            type="number"
                            {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.quantity?.message || " "}</p>
                    </>
                ) : (
                    <>{product.quantity}</>
                )
            )
        },
        {
            header: 'Price ($)',
            accessor: 'price' as keyof Iproduct,
            render: (product: Iproduct) => (
                editingId === product._id ? (
                    <>
                        <input
                            type="number"
                            {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Price must be greater than 0' } })}
                            className="w-full text-gray-800 p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-red-500 text-xs h-2">{errors.price?.message || " "}</p>
                    </>
                ) : (
                    <>${product.price.toFixed(2)}</>
                )
            )
        },
        {
            header: 'Actions',
            accessor: '_id' as keyof Iproduct,
            render: (product: Iproduct) => (
                editingId === product._id ? (
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
                            onClick={() => handleEdit(product)}
                            className={`bg-blue-500 text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md 
                                ${editingId !== null ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(product._id as string)}
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
                    <h2 className="text-xl font-bold text-gray-800">📦 Inventory List</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-700 px-6 py-1 text-sm rounded-md hover:bg-green-950 transition-colors duration-200 shadow-md"
                    >
                        Add
                    </button>
                </div>

                {isPending ? (
                    <p className="text-center text-gray-500">Loading products...</p>
                ) : (
                    <Table columns={columns} data={products} />
                )}
            </div>

            {isModalOpen && (
                <AddProduct
                    products={products}
                    setIsModalOpen={setIsModalOpen}
                    setProducts={setProducts}
                />
            )}
        </div>
    );
}
