import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import {
    getStudentsApi,
    getStudentByIdApi,
    createStudentApi,
    updateStudentApi,
    deleteStudentApi,
    changeStudentStatusApi,
} from "../../api/student.api";

/*
|--------------------------------------------------------------------------
| GET STUDENTS
|--------------------------------------------------------------------------
*/

export const getStudents = createAsyncThunk(
    "student/getStudents",
    async (params = {}, thunkAPI) => {
        try {
            return await getStudentsApi(params);
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
| GET STUDENT
|--------------------------------------------------------------------------
*/

export const getStudentById = createAsyncThunk(
    "student/getStudentById",
    async (id, thunkAPI) => {
        try {
            return await getStudentByIdApi(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load student."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CREATE STUDENT
|--------------------------------------------------------------------------
*/

export const createStudent = createAsyncThunk(
    "student/createStudent",
    async (payload, thunkAPI) => {
        try {
            const data = await createStudentApi(payload);

            toast.success("Student created successfully.");

            thunkAPI.dispatch(getStudents());

            return data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to create student."
            );
            
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create student."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE STUDENT
|--------------------------------------------------------------------------
*/

export const updateStudent = createAsyncThunk(
    "student/updateStudent",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await updateStudentApi(id, data);

            toast.success("Student updated successfully.");

            thunkAPI.dispatch(getStudents());

            return response;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update student."
            );

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update student."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| DELETE STUDENT
|--------------------------------------------------------------------------
*/

export const deleteStudent = createAsyncThunk(
    "student/deleteStudent",
    async (id, thunkAPI) => {
        try {
            await deleteStudentApi(id);

            toast.success("Student deleted successfully.");

            thunkAPI.dispatch(getStudents());

            return id;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to delete student."
            );

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete student."
            );
        }
    }
);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeStudentStatus = createAsyncThunk(
    "student/changeStudentStatus",
    async ({ id, isActive }, thunkAPI) => {
        try {
            const response = await changeStudentStatusApi(
                id,
                isActive
            );

            toast.success(
                `Student ${
                    isActive ? "Activated" : "Deactivated"
                } Successfully.`
            );

            thunkAPI.dispatch(getStudents());

            return response;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to change status."
            );

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to change status."
            );
        }
    }
);