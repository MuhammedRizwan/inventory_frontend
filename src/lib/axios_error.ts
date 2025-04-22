import { store } from "@/store/persist_store";
import { clearUser } from "@/store/userslice";
import axios from "axios";

export default function handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            console.warn("Unauthorized or Forbidden. Redirecting to login...");
            window.location.href = "/"; 
            store.dispatch(clearUser())
            throw new Error("Unauthorized or Forbidden. Redirecting to login...");
        }

        console.error("Axios error:", error.response?.data);
        throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    } else {
        console.error("Unexpected error:", error);
        throw new Error("An unexpected error occurred.");
    }
}
