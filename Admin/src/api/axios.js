import axios from "axios";
import { getAccessToken, clearTokens } from "../utils/storage";

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:5000/api/v1",

    timeout: 15000,
});

// Attach token to every request
api.interceptors.request.use(
    (config) => {

        const token = getAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

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

        // Token expired / Unauthorized
        if (status === 401 || status === 403) {

            // Clear local storage
            clearTokens();

            // Redirect to login page
            if (window.location.pathname !== "/login") {

                window.location.replace("/login");

            }

        }

        return Promise.reject(error);

    }

);

export default api;