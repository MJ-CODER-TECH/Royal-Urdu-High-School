import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    getFeeCollectionsApi,
    getFeeReceiptByIdApi,
    collectFeeApi,
    deleteFeeReceiptApi,
    getPendingStudentFeesApi

} from "../../../api/feeCollection.api";



// ======================================
// GET ALL RECEIPTS
// ======================================

export const getFeeCollections = createAsyncThunk(

    "feeCollection/getAll",

    async (params, { rejectWithValue }) => {

        try {

            const response =
                await getFeeCollectionsApi(params);

            return response.data;

        }

        catch (error) {

            return rejectWithValue(

                error.response?.data?.message ||

                "Failed to load fee collections."

            );

        }

    }

);



// ======================================
// GET RECEIPT BY ID
// ======================================

export const getFeeReceiptById = createAsyncThunk(
    "feeCollection/getReceiptById",
    async (id) => {

        const res = await getFeeReceiptByIdApi(id);

        // console.log("THUNK RESPONSE =>", res.data);

        return res.data.data;
    }
);



// ======================================
// COLLECT FEE
// ======================================

// Collect Fee
export const collectFee = createAsyncThunk(
    "feeCollection/collectFee",
    async (data, { rejectWithValue }) => {

        try {

            const response = await collectFeeApi(data);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Fee collection failed"
            );

        }

    }
);



// ======================================
// DELETE RECEIPT
// ======================================

export const deleteFeeReceipt = createAsyncThunk(

    "feeCollection/delete",

    async (id, { rejectWithValue }) => {

        try {

            await deleteFeeReceiptApi(id);

            return id;

        }

        catch (error) {

            return rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete receipt."

            );

        }

    }

);


export const getPendingStudentFees = createAsyncThunk(

    "feeCollection/getPendingStudentFees",

    async(params,{rejectWithValue})=>{

        try{


            const response =
                await getPendingStudentFeesApi(params);


            return response.data;


        }
        catch(error){

            return rejectWithValue(
                error.response?.data?.message ||
                "Unable to load pending fees"
            );

        }

    }

);