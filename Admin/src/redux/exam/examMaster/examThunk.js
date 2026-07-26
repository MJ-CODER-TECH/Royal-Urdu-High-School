import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getExamsApi,
    getExamByIdApi,
    createExamApi,
    updateExamApi,
    deleteExamApi,
    changeExamStatusApi,
} from "../../../api/exam.api";

import {
    getClassesApi as getDropdownClassesApi,
    getAcademicYearsApi as getDropdownAcademicYearsApi,
} from "../../../api/master.api";

/*
|--------------------------------------------------------------------------
| GET EXAMS
|--------------------------------------------------------------------------
*/

export const getExams = createAsyncThunk(
    "exam/getExams",
    async (_, thunkAPI) => {
        try {
            return await getExamsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load exams."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET EXAM BY ID
|--------------------------------------------------------------------------
*/

export const getExamById = createAsyncThunk(
    "exam/getExamById",
    async (id, thunkAPI) => {
        try {
            return await getExamByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load exam."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE EXAM
|--------------------------------------------------------------------------
*/

export const createExam = createAsyncThunk(
    "exam/createExam",
    async (data, thunkAPI) => {
        try {
            return await createExamApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create exam."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE EXAM
|--------------------------------------------------------------------------
*/

export const updateExam = createAsyncThunk(
    "exam/updateExam",
    async ({ id, data }, thunkAPI) => {
        try {
            return await updateExamApi(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update exam."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE EXAM
|--------------------------------------------------------------------------
*/

export const deleteExam = createAsyncThunk(
    "exam/deleteExam",
    async (id, thunkAPI) => {
        try {
            await deleteExamApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete exam."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CHANGE EXAM STATUS
|--------------------------------------------------------------------------
*/

export const changeExamStatus = createAsyncThunk(
    "exam/changeExamStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            await changeExamStatusApi(id, status);

            return {
                id,
                status,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update exam status."
            );
        }
    }
);



/*
|--------------------------------------------------------------------------
| GET CLASSES (Dropdown)
|--------------------------------------------------------------------------
*/

export const fetchClasses = createAsyncThunk(

    "exam/fetchClasses",

    async (_, thunkAPI) => {

        try {

            return await getDropdownClassesApi();

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to load classes."

            );

        }

    }

);


/*
|--------------------------------------------------------------------------
| GET ACADEMIC YEARS (Dropdown)
|--------------------------------------------------------------------------
*/

export const fetchAcademicYears = createAsyncThunk(

    "exam/fetchAcademicYears",

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