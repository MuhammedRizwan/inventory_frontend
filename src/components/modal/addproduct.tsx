import Iproduct from "@/interface/product";
import { add_product } from "@/service/product.service";
import { RootState } from "@/store/persist_store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


interface AddProductProps {
    products: Iproduct[];
    setIsModalOpen: (open: boolean) => void;
    setProducts: (products: Iproduct[]) => void;
}

export default function AddProduct({ products, setIsModalOpen, setProducts }: AddProductProps) {
    const user=useSelector((state:RootState)=>state.user.user)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<Iproduct>();

    const onSubmit = async(data: Iproduct) => {
        try {
            const response=await add_product(user?._id,data)
            if(response.success){
                setProducts([ response.data,...products]);
                setIsModalOpen(false);
                reset();
                toast.success(response.message)
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h2>

                <form className="w-full space-y-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Product Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Product name is required" })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter product name"
                        />
                        <span className="text-red-500 text-xs h-4">{errors.name?.message || " "}</span>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Description</label>
                        <textarea
                            {...register("description", {
                                required: "Description is required",
                                minLength: { value: 5, message: "Description must be at least 5 characters" },
                            })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter description"
                        />
                        <span className="text-red-500 text-xs h-4 block">{errors.description?.message ||" "}</span>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Price</label>
                        <input
                            type="number"
                            {...register("price", {
                                required: "Price is required",
                                min: { value: 1, message: "Price must be greater than 0" },
                                validate: (value) => !isNaN(value) || "Price must be a number",
                            })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter price"
                        />
                        <span className="text-red-500 text-xs h-4">{errors.price?.message ||""}</span>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Quantity</label>
                        <input
                            type="text"
                            {...register("quantity", {
                                required: "Quantity is required",
                                min: { value: 1, message: "Quantity must be at least 1" },
                                validate: (value) => !isNaN(value) || "Quantity must be a number",
                            })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter quantity"
                        />
                        <span className="text-red-500 text-xs h-4">{errors.quantity?.message || " "}</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600  py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}
