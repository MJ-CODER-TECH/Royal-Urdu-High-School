import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getMarksApi,
    getMarkByIdApi,
    createMarkApi,
    updateMarkApi,
    deleteMarkApi,
    bulkCreateMarksApi,
     getStudentsForMarksApi,
    getMarksByFilterApi,
} from "../../../api/mark.api";

import {
    getClassesApi as getDropdownClassesApi,
    getAcademicYearsApi as getDropdownAcademicYearsApi,
    getSectionsApi as getDropdownSectionsApi,
    getSubjectsApi as getDropdownSubjectsApi,
} from "../../../api/master.api";

import {
    getExamsApi as getDropdownExamsApi,
} from "../../../api/exam.api";

/*
|--------------------------------------------------------------------------
| GET MARKS
|--------------------------------------------------------------------------
*/

export const getMarks = createAsyncThunk(
    "mark/getMarks",
    async (_, thunkAPI) => {
        try {
            return await getMarksApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load marks."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET MARK BY ID
|--------------------------------------------------------------------------
*/

export const getMarkById = createAsyncThunk(
    "mark/getMarkById",
    async (id, thunkAPI) => {
        try {
            return await getMarkByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load mark."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE MARK
|--------------------------------------------------------------------------
*/

export const createMark = createAsyncThunk(
    "mark/createMark",
    async (data, thunkAPI) => {
        try {
            return await createMarkApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create mark."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

export const bulkCreateMarks = createAsyncThunk(
    "mark/bulkCreateMarks",
    async (data, thunkAPI) => {
        try {
            return await bulkCreateMarksApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to save marks."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

export const updateMark = createAsyncThunk(
    "mark/updateMark",
    async ({ id, data }, thunkAPI) => {
        try {
            return await updateMarkApi(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update mark."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

export const deleteMark = createAsyncThunk(
    "mark/deleteMark",
    async (id, thunkAPI) => {
        try {
            await deleteMarkApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete mark."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| FILTER MARKS
|--------------------------------------------------------------------------
*/

export const getMarksByFilter = createAsyncThunk(
    "mark/getMarksByFilter",
    async (params, thunkAPI) => {
        try {
            return await getMarksByFilterApi(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load marks."
            );
        }
    }
);


export const getStudentsForMarks = createAsyncThunk(
    "mark/getStudentsForMarks",
    async (params, thunkAPI) => {
        try {

            const response = await getStudentsForMarksApi(params);

            // console.log(
            //     "STUDENTS FOR MARKS API =>",
            //     response
            // );

            return response;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load students."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| DROPDOWNS
|--------------------------------------------------------------------------
*/

export const fetchClasses = createAsyncThunk(
    "mark/fetchClasses",
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

export const fetchSections = createAsyncThunk(
    "mark/fetchSections",
    async (_, thunkAPI) => {
        try {
            return await getDropdownSectionsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sections."
            );
        }
    }
);

export const fetchSubjects = createAsyncThunk(
    "mark/fetchSubjects",
    async (_, thunkAPI) => {
        try {
            return await getDropdownSubjectsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load subjects."
            );
        }
    }
);

export const fetchAcademicYears = createAsyncThunk(
    "mark/fetchAcademicYears",
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

export const fetchExams = createAsyncThunk(
    "mark/fetchExams",
    async (_, thunkAPI) => {
        try {

            const data = await getDropdownExamsApi();

            // console.log("EXAM API =>", data);

            return data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load exams."
            );
        }
    }
);