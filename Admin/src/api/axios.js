import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/storage";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    timeout: 15000,
    withCredentials: true,
});


// Attach token to every request
api.interceptors.request.use(
    (config) => {

        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    (error) => Promise.reject(error)
);


// Handle Unauthorized Responses
api.interceptors.response.use(

    (response) => response,

    (error) => {

        const status = error.response?.status;

        if (status === 401 || status === 403) {

            clearTokens();

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }

        }

        return Promise.reject(error);

    }

);


export default api;