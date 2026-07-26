import { createSlice } from "@reduxjs/toolkit";
import { login, logout, restoreSession } from "./authThunk";

const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    checkingAuth: true, // session restore ke liye alag flag
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {}, // yahan se restoreSession hata diya
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(restoreSession.pending, (state) => {
                state.checkingAuth = true;
            })
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.checkingAuth = false;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.checkingAuth = false;
            });
    }
});

export default authSlice.reducer;