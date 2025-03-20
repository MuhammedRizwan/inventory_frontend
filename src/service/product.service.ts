import Iproduct from "@/interface/product"
import axiosInstance from "@/lib/axios"
import handleAxiosError from "@/lib/axios_error"


export const fetch_product=async(userId:string|undefined)=>{
    try {
        const response=await axiosInstance.get(`/product/${userId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const add_product=async(userId:string|undefined,data:Iproduct)=>{
    console.log(userId,data)
    try {
        const response=await axiosInstance.post(`/product/add/${userId}`,data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const edit_product=async(data:Partial<Iproduct>)=>{
    try {
        const response=await axiosInstance.put(`/product/edit/${data._id}`,data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const delete_product=async(productId:string)=>{
    try {
        const response=await axiosInstance.delete(`/product/delete/${productId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}