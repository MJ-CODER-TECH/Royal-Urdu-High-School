import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getTimetablesApi,
    getTimetableByIdApi,
    createTimetableApi,
    updateTimetableApi,
    deleteTimetableApi,
    changeTimetableStatusApi,
     getClassTimetableApi,
     getTeacherTimetableApi
} from "../../api/timetable.api";

import {
    getClassesApi,
    getSectionsApi,
    getSubjectsApi,
} from "../../api/master.api";

import {
    getUsersApi,
} from "../../api/user.api";

/*
|--------------------------------------------------------------------------
| GET TIMETABLES
|--------------------------------------------------------------------------
*/

export const getTimetables = createAsyncThunk(
    "timetable/getTimetables",
    async (filters = {}, thunkAPI) => {
        try {
            return await getTimetablesApi(filters);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load timetable."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| GET TIMETABLE BY ID
|--------------------------------------------------------------------------
*/

export const getTimetableById = createAsyncThunk(
    "timetable/getTimetableById",
    async (id, thunkAPI) => {
        try {
            return await getTimetableByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load timetable."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE TIMETABLE
|--------------------------------------------------------------------------
*/

export const createTimetable = createAsyncThunk(
    "timetable/createTimetable",
    async (data, thunkAPI) => {
        try {
            return await createTimetableApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create timetable."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE TIMETABLE
|--------------------------------------------------------------------------
*/

export const updateTimetable = createAsyncThunk(
    "timetable/updateTimetable",
    async ({ id, data }, thunkAPI) => {
        try {
            return await updateTimetableApi(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update timetable."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE TIMETABLE
|--------------------------------------------------------------------------
*/

export const deleteTimetable = createAsyncThunk(
    "timetable/deleteTimetable",
    async (id, thunkAPI) => {
        try {
            await deleteTimetableApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete timetable."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeTimetableStatus = createAsyncThunk(
    "timetable/changeTimetableStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            await changeTimetableStatusApi(id, status);

            return {
                id,
                status,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to change timetable status."
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
    "timetable/fetchClasses",
    async (_, thunkAPI) => {
        try {
            return await getClassesApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load classes."
            );
        }
    }
);

export const fetchSections = createAsyncThunk(
    "timetable/fetchSections",
    async (_, thunkAPI) => {
        try {
            return await getSectionsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sections."
            );
        }
    }
);

export const fetchSubjects = createAsyncThunk(
    "timetable/fetchSubjects",
    async (_, thunkAPI) => {
        try {
            return await getSubjectsApi();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load subjects."
            );
        }
    }
);

export const fetchTeachers = createAsyncThunk(
    "timetable/fetchTeachers",
    async (_, thunkAPI) => {
        try {
            const users = await getUsersApi();

            return users.filter(
                (user) =>
                    user.role_name?.toLowerCase() === "teacher"
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load teachers."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

export const getClassTimetable = createAsyncThunk(

    "timetable/getClassTimetable",

    async(filters, thunkAPI)=>{

        try{

            const data =
                await getClassTimetableApi(filters);

            return data;

        }
        catch(error){

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load class timetable."
            );

        }

    }

);


/*
|--------------------------------------------------------------------------
| GET TEACHER TIMETABLE
|--------------------------------------------------------------------------
*/

export const getTeacherTimetable = createAsyncThunk(
    "timetable/getTeacherTimetable",

    async(filters = {}, thunkAPI)=>{

        try{

            return await getTeacherTimetableApi(filters);

        }
        catch(error){

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load teacher timetable."
            );

        }

    }
);