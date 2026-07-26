import { createAsyncThunk } from "@reduxjs/toolkit";

import { getClassesApi as getDropdownClassesApi } from "../../api/master.api";

import {
    getClassesApi,
    getClassByIdApi,
    createClassApi,
    updateClassApi,
    deleteClassApi,
    changeClassStatusApi,
} from "../../api/classMaster.api";

/*
|--------------------------------------------------------------------------
| GET CLASSES (Dropdown)
|--------------------------------------------------------------------------
*/

export const fetchClasses = createAsyncThunk(
    "classMaster/fetchClasses",
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
| GET CLASS MANAGEMENT LIST
|--------------------------------------------------------------------------
*/

export const getClasses = createAsyncThunk(
    "classMaster/getClasses",
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

/*
|--------------------------------------------------------------------------
| GET CLASS BY ID
|--------------------------------------------------------------------------
*/

export const getClassById = createAsyncThunk(
    "classMaster/getClassById",
    async (id, thunkAPI) => {
        try {
            return await getClassByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load class."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE CLASS
|--------------------------------------------------------------------------
*/

export const createClass = createAsyncThunk(
    "classMaster/createClass",
    async (data, thunkAPI) => {
        try {
            return await createClassApi(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create class."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE CLASS
|--------------------------------------------------------------------------
*/

export const updateClass = createAsyncThunk(
    "classMaster/updateClass",
    async ({ id, data }, thunkAPI) => {
        try {
            return await updateClassApi(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update class."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE CLASS
|--------------------------------------------------------------------------
*/

export const deleteClass = createAsyncThunk(
    "classMaster/deleteClass",
    async (id, thunkAPI) => {
        try {
            await deleteClassApi(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete class."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CHANGE CLASS STATUS
|--------------------------------------------------------------------------
*/

export const changeClassStatus = createAsyncThunk(
    "classMaster/changeClassStatus",
    async ({ id, is_active }, thunkAPI) => {
        try {
            await changeClassStatusApi(id, is_active);

            return {
                id,
                is_active,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update class status."
            );
        }
    }
);
