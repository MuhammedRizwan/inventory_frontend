import axios from "axios";

export default function handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
    } else {
        console.error("Unexpected error:", error);
        throw new Error("An unexpected error occurred.");
    }
}
