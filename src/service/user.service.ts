import Iuser from "@/interface/user";
import axiosInstance from "@/lib/axios"
import handleAxiosError from "@/lib/axios_error";



export const login = async (data: { email: string, password: string }) => {
    try {
        const response = await axiosInstance.post("/login", data)
        return response.data
    } catch (error) {
       handleAxiosError(error)
    }
}

export const signup=async (data:Iuser)=>{
    try {
        const response=await axiosInstance.post("/signup",data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}