import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import {
    getRolesApi,
    getUsersApi,
    getUserByIdApi,
    createUserApi,
    updateUserApi,
    deleteUserApi,
    changeStatusApi,
    resetPasswordApi,
} from "../../api/user.api";

/*
|--------------------------------------------------------------------------
| GET ROLES
|--------------------------------------------------------------------------
*/

export const getRoles = createAsyncThunk(

    "user/getRoles",

    async (_, thunkAPI) => {

        try {

            return await getRolesApi();

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load roles."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| GET USERS
|--------------------------------------------------------------------------
*/

export const getUsers = createAsyncThunk(

    "user/getUsers",

    async (params = {}, thunkAPI) => {

        try {

            return await getUsersApi(params);

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load users."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| GET USER
|--------------------------------------------------------------------------
*/

export const getUserById = createAsyncThunk(

    "user/getUserById",

    async (id, thunkAPI) => {

        try {

            return await getUserByIdApi(id);

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load user."

            );

        }

    }

);


/*
|--------------------------------------------------------------------------
| CREATE USER
|--------------------------------------------------------------------------
*/

export const createUser = createAsyncThunk(

    "user/createUser",

    async (payload, thunkAPI) => {

        try {

            const data = await createUserApi(payload);

            toast.success("User created successfully.");

            thunkAPI.dispatch(getUsers());

            return data;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to create user."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to create user."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| UPDATE USER
|--------------------------------------------------------------------------
*/

export const updateUser = createAsyncThunk(

    "user/updateUser",

    async ({ id, data }, thunkAPI) => {

        try {

            const response = await updateUserApi(

                id,

                data

            );

            toast.success(

                "User updated successfully."

            );

            thunkAPI.dispatch(

                getUsers()

            );

            return response;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to update user."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update user."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| DELETE USER
|--------------------------------------------------------------------------
*/

export const deleteUser = createAsyncThunk(

    "user/deleteUser",

    async (id, thunkAPI) => {

        try {

            await deleteUserApi(id);

            toast.success(

                "User deleted successfully."

            );

            thunkAPI.dispatch(

                getUsers()

            );

            return id;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to delete user."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete user."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeStatus = createAsyncThunk(

    "user/changeStatus",

    async ({ id, isActive }, thunkAPI) => {

        try {

            const response = await changeStatusApi(

                id,

                isActive

            );

            toast.success(

                `User ${

                    isActive

                        ? "Activated"

                        : "Deactivated"

                } Successfully.`

            );

            thunkAPI.dispatch(

                getUsers()

            );

            return response;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to change status."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to change status."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

export const resetPassword = createAsyncThunk(

    "user/resetPassword",

    async ({ id, password }, thunkAPI) => {

        try {

            const response = await resetPasswordApi(

                id,

                password

            );

            toast.success(

                "Password Reset Successfully."

            );

            return response;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to reset password."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to reset password."

            );

        }

    }

);