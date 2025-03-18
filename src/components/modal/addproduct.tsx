import { FormEvent, useState } from "react";
import { Product } from "../product/productlist";


interface AddProductProps {
    products: Product[];
    setIsModalOpen: (open: boolean) => void;
    setProducts: (products: Product[]) => void;
}

export default function AddProduct({ products, setIsModalOpen, setProducts }: AddProductProps) {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        quantity: "",
        price: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newProduct.name || !newProduct.description || !newProduct.quantity || !newProduct.price) {
            alert("All fields are required!");
            return;
        }

        const productToAdd: Product = {
            id: products.length ? products[products.length - 1].id + 1 : 1,
            name: newProduct.name,
            description: newProduct.description,
            quantity: Number(newProduct.quantity),
            price: Number(newProduct.price),
        };

        setProducts([...products, productToAdd]);
        setIsModalOpen(false);
        setNewProduct({ name: "", description: "", quantity: "", price: "" });
    };

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>

                <form className="w-full space-y-3" onSubmit={handleAddProduct}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">description</label>
                        <textarea
                            name="description"
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter your description"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">price</label>
                        <input
                            type="text"
                            name="description"
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter your price"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">quatity</label>
                        <input
                            type="text"
                            name="quatity"
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter your quatity"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div >
    );
}
