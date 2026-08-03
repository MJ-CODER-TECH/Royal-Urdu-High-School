import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getSubjectsApi,
    getSubjectByIdApi,
    createSubjectApi,
    updateSubjectApi,
    deleteSubjectApi,
    changeSubjectStatusApi,
} from "../../api/subject.api";


/*
|--------------------------------------------------------------------------
| GET ALL SUBJECTS
|--------------------------------------------------------------------------
*/

export const fetchSubjects = createAsyncThunk(
    "subject/fetchSubjects",

    async (_, { rejectWithValue }) => {

        try {

            return await getSubjectsApi();

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch subjects."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| GET SUBJECT BY ID
|--------------------------------------------------------------------------
*/

export const fetchSubjectById = createAsyncThunk(
    "subject/fetchSubjectById",

    async (id, { rejectWithValue }) => {

        try {

            return await getSubjectByIdApi(id);

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch subject."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| CREATE SUBJECT
|--------------------------------------------------------------------------
*/

export const createSubject = createAsyncThunk(
    "subject/createSubject",

    async (data, { rejectWithValue }) => {

        try {

            return await createSubjectApi(data);

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create subject."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| UPDATE SUBJECT
|--------------------------------------------------------------------------
*/

export const updateSubject = createAsyncThunk(
    "subject/updateSubject",

    async (
        {
            id,
            data,
        },
        {
            rejectWithValue,
        }
    ) => {

        try {

            return await updateSubjectApi(
                id,
                data
            );

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update subject."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| DELETE SUBJECT
|--------------------------------------------------------------------------
*/

export const deleteSubject = createAsyncThunk(
    "subject/deleteSubject",

    async (
        id,
        {
            rejectWithValue,
        }
    ) => {

        try {

            const response =
                await deleteSubjectApi(id);

            return {

                id,

                message:
                    response?.message ||
                    response?.data?.message ||
                    "Subject deleted successfully.",

            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete subject."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| CHANGE SUBJECT STATUS
|--------------------------------------------------------------------------
*/

export const changeSubjectStatus = createAsyncThunk(
    "subject/changeSubjectStatus",

    async (
        {
            id,
            is_active,
        },
        {
            rejectWithValue,
        }
    ) => {

        try {

            const response =
                await changeSubjectStatusApi(
                    id,
                    is_active
                );

            return {

                id,

                is_active:

                    Number(
                        is_active
                    ),

                message:

                    response?.message ||

                    response?.data?.message ||

                    "Subject status updated successfully.",

            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update subject status."
            );

        }

    }
);