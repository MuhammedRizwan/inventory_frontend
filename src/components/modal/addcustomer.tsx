import Icustomer from "@/interface/customer";
import { add_customer } from "@/service/customer.service";
import { RootState } from "@/store/persist_store";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


interface AddCustomerProps {
    customers: Icustomer[];
    setIsModalOpen: (open: boolean) => void;
    setCustomers: (customers: Icustomer[]) => void;
}


export default function AddCustomer({ customers, setIsModalOpen, setCustomers }: AddCustomerProps) {
    const user =useSelector((state:RootState)=>state.user.user)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Icustomer>();

    const onSubmit = async(data: Icustomer) => {
        try {
            const response=await add_customer(user?._id,data)
            if(response.success){
                setCustomers([ response.data,...customers]);
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
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Customer</h2>

                <form className="w-full space-y-1" onSubmit={handleSubmit(onSubmit)}>
                    {/** Name Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Customer Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Customer name is required" })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter customer name"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.name?.message || " "}</p>
                    </div>

                    {/** Email Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/, message: "Invalid email format" },
                            })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter email"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.email?.message || " "}</p>
                    </div>

                    {/** Phone Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Phone</label>
                        <input
                            type="tel"
                            {...register("mobile", {
                                required: "Phone number is required",
                                pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" },
                            })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter phone number"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.mobile?.message || " "}</p>
                    </div>

                    {/** Address Field */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-semibold text-sm mb-1">Address</label>
                        <textarea
                            {...register("address", { required: "Address is required" })}
                            className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                            placeholder="Enter address"
                        />
                        <p className="text-red-500 text-xs mt-1 h-4">{errors.address?.message || " "}</p>
                    </div>

                    {/** Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600  py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
                    >
                        Add Customer
                    </button>
                </form>
            </div>
        </div>
    );
}
