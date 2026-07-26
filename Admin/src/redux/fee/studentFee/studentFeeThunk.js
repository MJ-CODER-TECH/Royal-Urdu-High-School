import { createAsyncThunk } from "@reduxjs/toolkit";


import {
    getStudentFeesApi,
    getStudentFeeByIdApi,
    assignClassFeeApi,
    deleteStudentFeeApi,
} from "../../../api/studentFee.api";

export const getStudentFees = createAsyncThunk(
    "studentFee/getStudentFees",
    async (params, thunkAPI) => {
        try {
            const response = await getStudentFeesApi(params);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch student fees"
            );
        }
    }
);

// ======================================
// GET STUDENT FEE BY ID
// ======================================

export const getStudentFeeById = createAsyncThunk(

    "studentFee/getById",

    async(id,{rejectWithValue})=>{

        try{


            const response =
                await getStudentFeeByIdApi(id);



            // console.log(
            //     "STUDENT FEE DETAIL RESPONSE =>",
            //     response
            // );



            return response.data;



        }
        catch(error){


            return rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch student fee detail"

            );


        }

    }

);

export const assignStudentFee = createAsyncThunk(
    "studentFee/assignStudentFee",
    async (data, thunkAPI) => {
        try {
const response = await assignClassFeeApi(data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to assign fee"
            );
        }
    }
);

export const deleteStudentFee = createAsyncThunk(
    "studentFee/deleteStudentFee",
    async (id, thunkAPI) => {
        try {
            await deleteStudentFeeApi(id);

            return id; // ← ye zaroor return hona chahiye
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete student fee"
            );
        }
    }
);