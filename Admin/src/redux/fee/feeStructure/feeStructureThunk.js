import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getFeeStructuresApi,
    getFeeStructureByIdApi,
    createFeeStructureApi,
    updateFeeStructureApi,
    deleteFeeStructureApi,
} from "../../../api/feeStructure.api";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getFeeStructures = createAsyncThunk(
    "feeStructure/getFeeStructures",

    async (params, thunkAPI) => {

        try {

            return await getFeeStructuresApi(params);

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch Fee Structures."

            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getFeeStructureById = createAsyncThunk(
    "feeStructure/getFeeStructureById",

    async (id, thunkAPI) => {

        try {

            return await getFeeStructureByIdApi(id);

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch Fee Structure."

            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createFeeStructure = createAsyncThunk(
    "feeStructure/createFeeStructure",

    async (payload, thunkAPI) => {

        try {

            return await createFeeStructureApi(payload);

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to create Fee Structure."

            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateFeeStructure = createAsyncThunk(
    "feeStructure/updateFeeStructure",

    async ({ id, data }, thunkAPI) => {

        try {

            return await updateFeeStructureApi(
                id,
                data
            );

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update Fee Structure."

            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteFeeStructure = createAsyncThunk(
    "feeStructure/deleteFeeStructure",

    async (id, thunkAPI) => {

        try {

            await deleteFeeStructureApi(id);

            return id;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete Fee Structure."

            );

        }

    }
);