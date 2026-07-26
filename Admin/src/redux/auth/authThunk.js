import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { saveTokens, saveUser, clearTokens, getAccessToken } from "../../utils/storage";

// JWT payload decode karo (permissions aur expiry dono yahin se milte hain)
const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};

const isTokenExpired = (payload) => {
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
};

export const login = createAsyncThunk(
    "auth/login",
    async (payload, thunkAPI) => {
        try {
            const response = await api.post("/auth/login", payload);
            const data = response.data.data;

            const decoded = decodeToken(data.accessToken);

            // Backend jo bhi user bheje, permissions token se merge kar do
            const mergedUser = {
                ...data.user,
                permissions: decoded?.permissions || [],
            };

            saveTokens(data.accessToken, data.refreshToken || null, payload.remember);
            saveUser(mergedUser, payload.remember);

            return {
                accessToken: data.accessToken,
                user: mergedUser,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login Failed"
            );
        }
    }
);



export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, thunkAPI) => {
        try {
            const token = getAccessToken();
            const decoded = decodeToken(token);

            if (!token || isTokenExpired(decoded)) {
                clearTokens();
                return thunkAPI.rejectWithValue("No valid token");
            }

            const response = await api.get("/auth/me");

            // /auth/me ka response permissions nahi bhejta — token se le lo
            const mergedUser = {
                ...response.data.data,
                permissions: decoded?.permissions || [],
            };

            return {
                accessToken: token,
                user: mergedUser,
            };
        } catch (err) {
            clearTokens();
            return thunkAPI.rejectWithValue("Restore Failed");
        }
    }
);



export const logout = createAsyncThunk(

    "auth/logout",

    async (_, thunkAPI) => {

        try {

            await api.post("/auth/logout");

        } catch (e) {

            console.log(e);

        }

        clearTokens();

        return true;

    }

);