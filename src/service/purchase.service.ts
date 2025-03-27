import Ipurchase from "@/interface/purchase"
import axiosInstance from "@/lib/axios"
import handleAxiosError from "@/lib/axios_error"


export const addPurchase=async(data:Ipurchase)=>{
    try {
        const response=await axiosInstance.post('/purchase/add',data)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}
export const fetch_purchase=async(userId:string|undefined)=>{
    try {
        const response=await axiosInstance.get(`/purchase/${userId}`)
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}