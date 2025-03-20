import Icustomer from "@/interface/customer"
import axiosInstance from "@/lib/axios"
import handleAxiosError from "@/lib/axios_error"


export const fetch_customer=async(userId:string|undefined)=>{
    try {
        const response=await axiosInstance.get(`/customer/${userId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const add_customer=async(userId:string|undefined,data:Icustomer)=>{
    try {
        const response=await axiosInstance.post(`/customer/add/${userId}`,data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const edit_customer=async(data:Partial<Icustomer>)=>{
    try {
        const response=await axiosInstance.put(`/customer/edit/${data._id}`,data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const delete_customer=async(customerId:string)=>{
    try {
        const response=await axiosInstance.delete(`/customer/delete/${customerId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}