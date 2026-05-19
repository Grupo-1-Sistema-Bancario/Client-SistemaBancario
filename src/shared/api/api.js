import axios from "axios";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json"
    }
});

const axiosAdmin = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

const axiosProduct = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL,
    timeout: 9000,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosAuth.interceptors.request.use((config) => {

    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosAdmin.interceptors.request.use((config) => {

    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosProduct.interceptors.request.use((config) => {

    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export {
    axiosAuth,
    axiosAdmin,
    axiosProduct
};