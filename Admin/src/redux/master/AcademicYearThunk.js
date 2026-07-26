import { createAsyncThunk } from "@reduxjs/toolkit";


import {
    getAcademicYearsApi as getDropdownAcademicYearsApi,
} from "../../api/master.api";


import {
    getAcademicYearsApi,
    getAcademicYearByIdApi,
    createAcademicYearApi,
    updateAcademicYearApi,
    deleteAcademicYearApi,
    changeAcademicYearStatusApi,
} from "../../api/academicYear.api";



/*
|--------------------------------------------------------------------------
| GET ACADEMIC YEARS (Dropdown)
|--------------------------------------------------------------------------
*/

export const fetchAcademicYears = createAsyncThunk(

    "academicYear/fetchAcademicYears",

    async (_, thunkAPI) => {

        try {

            return await getDropdownAcademicYearsApi();

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load academic years."

            );

        }

    }

);





/*
|--------------------------------------------------------------------------
| GET ACADEMIC YEARS MANAGEMENT LIST
|--------------------------------------------------------------------------
*/

export const getAcademicYears = createAsyncThunk(

    "academicYear/getAcademicYears",

    async (_, thunkAPI) => {

        try {

            return await getAcademicYearsApi();

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load academic years."

            );

        }

    }

);






/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getAcademicYearById = createAsyncThunk(

    "academicYear/getAcademicYearById",

    async (id, thunkAPI) => {

        try {

            return await getAcademicYearByIdApi(id);

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load academic year."

            );

        }

    }

);






/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createAcademicYear = createAsyncThunk(

    "academicYear/createAcademicYear",

    async (data, thunkAPI) => {

        try {

            return await createAcademicYearApi(data);

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to create academic year."

            );

        }

    }

);







/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateAcademicYear = createAsyncThunk(

    "academicYear/updateAcademicYear",

    async (
        {
            id,
            data
        },
        thunkAPI
    ) => {


        try {


            return await updateAcademicYearApi(
                id,
                data
            );


        } catch (error) {


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update academic year."

            );


        }


    }

);








/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteAcademicYear = createAsyncThunk(

    "academicYear/deleteAcademicYear",

    async (
        id,
        thunkAPI
    ) => {


        try {


            await deleteAcademicYearApi(id);


            return id;


        } catch (error) {


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete academic year."

            );


        }


    }

);








/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeAcademicYearStatus = createAsyncThunk(

    "academicYear/changeAcademicYearStatus",

    async (
        {
            id,
            is_active
        },
        thunkAPI
    ) => {


        try {


            await changeAcademicYearStatusApi(

                id,

                is_active

            );


            return {

                id,

                is_active,

            };


        } catch (error) {


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update status."

            );


        }


    }

);