import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import {

    getFeeHeadsApi,
    getFeeHeadByIdApi,
    createFeeHeadApi,
    updateFeeHeadApi,
    deleteFeeHeadApi,

} from "../../../api/feeHead.api";

/*
|--------------------------------------------------------------------------
| GET FEE HEADS
|--------------------------------------------------------------------------
*/

export const getFeeHeads = createAsyncThunk(

    "feeHead/getFeeHeads",

    async (params = {}, thunkAPI) => {

        try {

            return await getFeeHeadsApi(params);

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load fee heads."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getFeeHeadById = createAsyncThunk(

    "feeHead/getFeeHeadById",

    async (id, thunkAPI) => {

        try {

            return await getFeeHeadByIdApi(id);

        }

        catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load fee head."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createFeeHead = createAsyncThunk(

    "feeHead/createFeeHead",

    async (payload, thunkAPI) => {

        try {

            const response = await createFeeHeadApi(payload);

            toast.success(
                "Fee Head created successfully."
            );

            thunkAPI.dispatch(
                getFeeHeads()
            );

            return response;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to create fee head."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to create fee head."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateFeeHead = createAsyncThunk(

    "feeHead/updateFeeHead",

    async ({ id, data }, thunkAPI) => {

        try {

            const response = await updateFeeHeadApi(

                id,

                data

            );

            toast.success(
                "Fee Head updated successfully."
            );

            thunkAPI.dispatch(
                getFeeHeads()
            );

            return response;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to update fee head."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update fee head."

            );

        }

    }

);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteFeeHead = createAsyncThunk(

    "feeHead/deleteFeeHead",

    async (id, thunkAPI) => {

        try {

            await deleteFeeHeadApi(id);

            toast.success(
                "Fee Head deleted successfully."
            );

            thunkAPI.dispatch(
                getFeeHeads()
            );

            return id;

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to delete fee head."

            );

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete fee head."

            );

        }

    }

);


