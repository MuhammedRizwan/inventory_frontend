"use client";

import { login } from "@/service/user.service";
import { AppDispatch } from "@/store/persist_store";
import { setUser } from "@/store/userslice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function Login() {
  const router = useRouter()
  const dispatch=useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{email:string,password:string}>();

  const onSubmit = async (data:{email:string,password:string}) => {
    setIsLoading(true)
    try {
      const response = await login(data)
      if (response.success) {
       dispatch(setUser(response.data))
       toast.success(response.message)
       router.push('/dashboard')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-5 md:p-20">
      <div className="flex w-full max-w-4xl shadow-2xl shadow-black border border-gray-300 rounded-lg overflow-hidden">

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full flex flex-col">
            <div className="h-full flex flex-col justify-center items-center text-center p-6 w-full">
              <h1 className="text-black text-3xl font-bold">Welcome Back</h1>
              <p className="text-black mt-2">
                Sign in to continue your journey with us.
              </p>
            </div>

            <form className="w-full space-y-1" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <label className="text-gray-700  font-semibold text-sm mb-1">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full text-black text-sm px-4 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your email"
                />
                <p className="text-red-500 text-xs h-4">{errors.email?.message as string || " "}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm mb-1">Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your password"
                />
                <p className="text-red-500 text-xs h-4">{errors.password?.message as string || " "}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 rounded-md transition duration-300 shadow-md ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 min-h-[500px] bg-[url('/images/sign_in.webp')] bg-cover bg-center bg-no-repeat">
          <div className="h-full flex flex-col justify-center items-center text-center p-6 w-full bg-black/50">
            <h1 className=" text-3xl font-bold">Join With Us</h1>
            <p className="text-gray-300 m-2">
              Sign up with us we can grow up together.
            </p>
            <Link href={'/signup'} className="border border-white px-3 rounded-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
