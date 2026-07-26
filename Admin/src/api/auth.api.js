import api from "./axios";

export const loginApi = (payload) =>
    api.post("/auth/login", payload);

export const refreshApi = (refreshToken) =>
    api.post("/auth/refresh-token", {
        refreshToken,
    });

export const logoutApi = () =>
    api.post("/auth/logout");

export const meApi = () =>
    api.get("/auth/me");



export const getProfileApi = async () => {

    const { data } = await api.get("/auth/me");

    return data;

};