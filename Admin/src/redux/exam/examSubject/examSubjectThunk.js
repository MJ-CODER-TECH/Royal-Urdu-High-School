import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getExamSubjectsApi,
    getExamSubjectByIdApi,
    createExamSubjectApi,
    updateExamSubjectApi,
    deleteExamSubjectApi,
    changeExamSubjectStatusApi,
} from "../../../api/examSubject.api";

import {
    getClassesApi as getDropdownClassesApi,
    getAcademicYearsApi as getDropdownAcademicYearsApi,
    getSubjectsApi as getDropdownSubjectsApi,
} from "../../../api/master.api";

import {
    getExamsApi as getDropdownExamsApi,
} from "../../../api/exam.api";

/*
|--------------------------------------------------------------------------
| GET EXAM SUBJECTS
|--------------------------------------------------------------------------
*/

export const getExamSubjects = createAsyncThunk(
    "examSubject/getExamSubjects",
    async (_, thunkAPI) => {
        try {
            return await getExamSubjectsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load exam subjects."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET EXAM SUBJECT BY ID
|--------------------------------------------------------------------------
*/

export const getExamSubjectById = createAsyncThunk(
    "examSubject/getExamSubjectById",
    async (id, thunkAPI) => {
        try {
            return await getExamSubjectByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load exam subject."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const createExamSubject = createAsyncThunk(
    "examSubject/createExamSubject",
    async (data, thunkAPI) => {
        try {
            return await createExamSubjectApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create exam subject."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const updateExamSubject = createAsyncThunk(
    "examSubject/updateExamSubject",
    async ({ id, data }, thunkAPI) => {
        try {
            return await updateExamSubjectApi(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update exam subject."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const deleteExamSubject = createAsyncThunk(
    "examSubject/deleteExamSubject",
    async (id, thunkAPI) => {
        try {
            await deleteExamSubjectApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete exam subject."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CHANGE EXAM SUBJECT STATUS
|--------------------------------------------------------------------------
*/

export const changeExamSubjectStatus = createAsyncThunk(
    "examSubject/changeExamSubjectStatus",
    async ({ id, status }, thunkAPI) => {
        try {

            await changeExamSubjectStatusApi(id, status);

            return {
                id,
                status,
            };

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update exam subject status."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET CLASSES
|--------------------------------------------------------------------------
*/

export const fetchClasses = createAsyncThunk(
    "examSubject/fetchClasses",
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
| GET SUBJECTS
|--------------------------------------------------------------------------
*/

export const fetchSubjects = createAsyncThunk(
    "examSubject/fetchSubjects",
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

/*
|--------------------------------------------------------------------------
| GET EXAMS
|--------------------------------------------------------------------------
*/
export const fetchExams = createAsyncThunk(
    "examSubject/fetchExams",
    async (_, thunkAPI) => {
        try {
            return await getDropdownExamsApi();
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
| GET ACADEMIC YEARS
|--------------------------------------------------------------------------
*/

export const fetchAcademicYears = createAsyncThunk(
    "examSubject/fetchAcademicYears",
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