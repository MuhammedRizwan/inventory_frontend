"use client";

import Iuser from "@/interface/user";
import { signup } from "@/service/user.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Iuser>();

  const onSubmit = async (data: Iuser) => {
    try {
      setIsLoading(true)
      const response = await signup(data)
      if (response.success) {
        toast.success(response.message)
        router.push('/')
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

        <div className="hidden md:flex w-1/2 min-h-[500px] bg-[url('/images/sign_up.webp')] bg-cover bg-center bg-no-repeat">
          <div className="h-full flex flex-col justify-center items-center text-center p-6 w-full bg-black/50">
            <h1 className=" text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-300 m-2">
              Sign in to continue if you already signed up.
            </p>
            <Link href={'/'} className="border border-white px-3 rounded-sm">Sign In</Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-5">
          <div className="w-full flex flex-col">
            <div className="h-full flex flex-col justify-center items-center text-center p-3 w-full">
              <h1 className="text-black text-3xl font-bold">Join With Us</h1>
              <p className="text-black mt-2 font-semibold text-sm">
                Sign up to continue your journey with us.
              </p>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm">Name</label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your name"
                />
                <p className="text-red-500 text-xs h-4">{errors.name?.message as string}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm">Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your email"
                />
                <p className="text-red-500 text-xs h-4">{errors.email?.message as string}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm">Mobile</label>
                <input
                  type="text"
                  {...register("mobile", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Mobile number must be exactly 10 digits",
                    },
                  })}
                  className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your mobile number"
                />
                <p className="text-red-500 text-xs h-4">{errors.mobile?.message as string}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm">Password</label>
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
                <p className="text-red-500 text-xs h-4">{errors.password?.message as string}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold text-sm">Confirm Password</label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })}
                  className="w-full text-black text-sm px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Confirm your password"
                />
                <p className="text-red-500 text-xs h-4">{errors.confirmPassword?.message as string}</p>
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

      </div>
    </div>
  );
}
