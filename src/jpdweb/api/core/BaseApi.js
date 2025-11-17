import axios from "axios"

export const apiclient = axios.create({
    baseURL: "http://localhost:9090",
    withCredentials: true, // ✅ BẮT BUỘC để gửi cookies
    headers: {
        'Content-Type': 'application/json'
    }
})