import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getAttendanceApi,
    getAttendanceByIdApi,
    createAttendanceApi,
    updateAttendanceApi,
    deleteAttendanceApi,
    bulkAttendanceApi,

    getMonthlyAttendanceApi,
    getStudentMonthlyAttendanceApi,
    getClassMonthlyAttendanceApi,
    getAttendanceCalendarApi,
    getLowAttendanceStudentsApi,
    getAttendanceDashboardApi,
    getYearlyAttendanceApi,
    getAttendanceRegisterApi,
    getAttendanceRegisterMatrixApi,
    getAttendanceAnalyticsApi,

} from "../../api/attendance.api";;

/* =====================================================
   Get Attendance
===================================================== */

export const getAttendance = createAsyncThunk(
    "attendance/getAttendance",

    async (params, thunkAPI) => {

        try {

            const res = await getAttendanceApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance."

            );

        }

    }

);

/* =====================================================
   Get Attendance By Id
===================================================== */

export const getAttendanceById = createAsyncThunk(

    "attendance/getAttendanceById",

    async (attendanceId, thunkAPI) => {

        try {

            const res =
                await getAttendanceByIdApi(attendanceId);

            return res.data.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance."

            );

        }

    }

);

/* =====================================================
   Create Attendance
===================================================== */

export const createAttendance = createAsyncThunk(

    "attendance/createAttendance",

    async (data, thunkAPI) => {

        try {

            const res =
                await createAttendanceApi(data);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to create attendance."

            );

        }

    }

);

/* =====================================================
   Update Attendance
===================================================== */

export const updateAttendance = createAsyncThunk(

    "attendance/updateAttendance",

    async ({ id, data }, thunkAPI) => {

        try {

            const res =
                await updateAttendanceApi(id, data);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to update attendance."

            );

        }

    }

);

/* =====================================================
   Delete Attendance
===================================================== */

export const deleteAttendance = createAsyncThunk(

    "attendance/deleteAttendance",

    async (attendanceId, thunkAPI) => {

        try {

            await deleteAttendanceApi(attendanceId);

            return attendanceId;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to delete attendance."

            );

        }

    }

);

/* =====================================================
   Bulk Attendance
===================================================== */

export const bulkAttendance = createAsyncThunk(

    "attendance/bulkAttendance",

    async (data, thunkAPI) => {

        try {

            const res =
                await bulkAttendanceApi(data);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to save attendance."

            );

        }

    }

);


/* =====================================================
   Monthly Attendance
===================================================== */

export const getMonthlyAttendance = createAsyncThunk(

    "attendance/getMonthlyAttendance",

    async (params, thunkAPI) => {

        try {

            const res =
                await getMonthlyAttendanceApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch monthly attendance."

            );

        }

    }

);

/* =====================================================
   Student Monthly Attendance
===================================================== */

export const getStudentMonthlyAttendance = createAsyncThunk(

    "attendance/getStudentMonthlyAttendance",

    async (params, thunkAPI) => {

        try {

            const res =
                await getStudentMonthlyAttendanceApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch student attendance."

            );

        }

    }

);

/* =====================================================
   Class Monthly Attendance
===================================================== */

export const getClassMonthlyAttendance = createAsyncThunk(

    "attendance/getClassMonthlyAttendance",

    async (params, thunkAPI) => {

        try {

            const res =
                await getClassMonthlyAttendanceApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch class attendance."

            );

        }

    }

);

/* =====================================================
   Attendance Calendar
===================================================== */

export const getAttendanceCalendar = createAsyncThunk(

    "attendance/getAttendanceCalendar",

    async (params, thunkAPI) => {

        try {

            const res =
                await getAttendanceCalendarApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance calendar."

            );

        }

    }

);

/* =====================================================
   Low Attendance
===================================================== */

export const getLowAttendanceStudents = createAsyncThunk(

    "attendance/getLowAttendanceStudents",

    async (params, thunkAPI) => {

        try {

            const res =
                await getLowAttendanceStudentsApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch low attendance students."

            );

        }

    }

);

/* =====================================================
   Attendance Dashboard
===================================================== */

export const getAttendanceDashboard = createAsyncThunk(

    "attendance/getAttendanceDashboard",

    async (_, thunkAPI) => {

        try {

            const res =
                await getAttendanceDashboardApi();

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch dashboard."

            );

        }

    }

);

/* =====================================================
   Yearly Attendance
===================================================== */

export const getYearlyAttendance = createAsyncThunk(

    "attendance/getYearlyAttendance",

    async (params, thunkAPI) => {

        try {

            const res =
                await getYearlyAttendanceApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch yearly attendance."

            );

        }

    }

);

/* =====================================================
   Attendance Register
===================================================== */

export const getAttendanceRegister = createAsyncThunk(

    "attendance/getAttendanceRegister",

    async (params, thunkAPI) => {

        try {

            const res =
                await getAttendanceRegisterApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance register."

            );

        }

    }

);

/* =====================================================
   Attendance Register Matrix
===================================================== */

export const getAttendanceRegisterMatrix = createAsyncThunk(

    "attendance/getAttendanceRegisterMatrix",

    async (params, thunkAPI) => {

        try {

            const res =
                await getAttendanceRegisterMatrixApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance register matrix."

            );

        }

    }

);

/* =====================================================
   Attendance Analytics
===================================================== */

export const getAttendanceAnalytics = createAsyncThunk(

    "attendance/getAttendanceAnalytics",

    async (params, thunkAPI) => {

        try {

            const res =
                await getAttendanceAnalyticsApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to fetch attendance analytics."

            );

        }

    }

);

/* =====================================================
   Export Monthly PDF
===================================================== */

export const exportMonthlyAttendancePdf = createAsyncThunk(

    "attendance/exportMonthlyAttendancePdf",

    async (params, thunkAPI) => {

        try {

            const res =
                await exportMonthlyAttendancePdfApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to export PDF."

            );

        }

    }

);

/* =====================================================
   Export Monthly Excel
===================================================== */

export const exportMonthlyAttendanceExcel = createAsyncThunk(

    "attendance/exportMonthlyAttendanceExcel",

    async (params, thunkAPI) => {

        try {

            const res =
                await exportMonthlyAttendanceExcelApi(params);

            return res.data;

        } catch (error) {

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||

                "Failed to export Excel."

            );

        }

    }

);
