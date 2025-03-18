'use client'
import { useState } from "react";
import AddProduct from "../modal/addproduct";
import Table from "../table";
import EditableRow from "../editablerow";


export interface Product {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
}

const initialProducts: Product[] = [
    { id: 1, name: "Laptop", description: "High-end gaming laptop", quantity: 5, price: 1500 },
    { id: 2, name: "Smartphone", description: "Latest model with AI features", quantity: 10, price: 800 },
    { id: 3, name: "Headphones", description: "Noise-canceling over-ear headphones", quantity: 15, price: 200 },
];
export default function ProductList() {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Product>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            setProducts(products.filter(product => product.id !== id));
        }
    };
    
    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setEditData(product);
    };
    const handleCancel=()=>{
        setEditingId(null);
        setEditData({});
    }
    
    const handleSave = () => {
        if (editingId !== null) {
            setProducts(products.map(product =>
                product.id === editingId ? { ...product, ...editData } : product
            ));
            setEditingId(null);
            setEditData({});
        }
    };
    
    const productFields = [
        { key: "name" as keyof Product, label: "Name", type: "text" },
        { key: "description" as keyof Product, label: "Description", type: "text" },
        { key: "quantity" as keyof Product, label: "Quantity", type: "number" },
        { key: "price" as keyof Product, label: "Price", type: "number" },
    ];
    const columns = [
        { header: "Name", accessor: "name" as keyof Product },
        { header: "Description", accessor: "description" as keyof Product },
        { header: "Quantity", accessor: "quantity" as keyof Product },
        { header: "Price ($)", accessor: "price" as keyof Product },
        {
            header: "Actions",
            accessor: "id" as keyof Product,
            render: (product: Product) => (
                editingId === product.id ? (
                    <EditableRow<Product> item={product} onSave={handleSave} onCancel={handleCancel} fields={productFields} />
                    
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
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
                    <h2 className="text-xl font-bold text-gray-800">📦 Inventory List</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-700 text-white px-6 py-1 text-sm rounded-md hover:bg-green-950 transition-colors duration-200 shadow-md"
                    >
                        Add
                    </button>
                </div>

                <Table columns={columns} data={products} />
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
