import { createSlice } from "@reduxjs/toolkit";

import {
    getAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    bulkAttendance,

    getMonthlyAttendance,
    getStudentMonthlyAttendance,
    getClassMonthlyAttendance,
    getAttendanceCalendar,
    getLowAttendanceStudents,
    getAttendanceDashboard,
    getYearlyAttendance,
    getAttendanceRegister,
    getAttendanceRegisterMatrix,
    getAttendanceAnalytics,

} from "./attendanceThunk";

const initialState = {

    attendance: [],

    attendanceDetails: null,

    monthlyAttendance: [],

    calendar: [],

    dashboard: {},

    analytics: {},

    register: [],

    registerMatrix: [],

    yearlyAttendance: [],

    lowAttendance: [],

    loading: false,

    submitting: false,

    error: null,

    page: 1,

    totalPages: 1,

    totalRecords: 0,

};

const attendanceSlice = createSlice({

    name: "attendance",

    initialState,

    reducers: {

        clearAttendanceError(state) {

            state.error = null;

        },

        clearAttendanceDetails(state) {

            state.attendanceDetails = null;

        },

    },

    extraReducers: (builder) => {
                /* ==========================
           Get Attendance
        ========================== */

        builder

            .addCase(getAttendance.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(getAttendance.fulfilled, (state, action) => {

                state.loading = false;

                state.attendance =
                    action.payload.data || [];

                state.page =
                    action.payload.page || 1;

                state.totalPages =
                    action.payload.totalPages || 1;

                state.totalRecords =
                    action.payload.total || 0;

            })

            .addCase(getAttendance.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

        /* ==========================
           Get By Id
        ========================== */

        builder

            .addCase(getAttendanceById.pending, (state) => {

                state.loading = true;

            })

            .addCase(getAttendanceById.fulfilled, (state, action) => {

                state.loading = false;

                state.attendanceDetails =
                    action.payload;

            })

            .addCase(getAttendanceById.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

                    builder

            .addCase(createAttendance.pending, (state) => {

                state.submitting = true;

            })

            .addCase(createAttendance.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(createAttendance.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });

        builder

            .addCase(updateAttendance.pending, (state) => {

                state.submitting = true;

            })

            .addCase(updateAttendance.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(updateAttendance.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });

        builder

            .addCase(deleteAttendance.fulfilled, (state, action) => {

                state.attendance =
                    state.attendance.filter(

                        (item) =>

                            item.attendance_id !==

                            action.payload

                    );

            });

        builder

            .addCase(bulkAttendance.pending, (state) => {

                state.submitting = true;

            })

            .addCase(bulkAttendance.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(bulkAttendance.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });


                    /* ==========================
           Monthly Attendance
        ========================== */

        builder

            .addCase(getMonthlyAttendance.pending, (state) => {

                state.loading = true;

            })

            .addCase(getMonthlyAttendance.fulfilled, (state, action) => {

                state.loading = false;

                state.monthlyAttendance =
                    action.payload.data || [];

            })

            .addCase(getMonthlyAttendance.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

        /* ==========================
           Student Monthly Attendance
        ========================== */

        builder

            .addCase(getStudentMonthlyAttendance.fulfilled, (state, action) => {

                state.monthlyAttendance =
                    action.payload.data || [];

            });

        /* ==========================
           Class Monthly Attendance
        ========================== */

        builder

            .addCase(getClassMonthlyAttendance.fulfilled, (state, action) => {

                state.monthlyAttendance =
                    action.payload.data || [];

            });

        /* ==========================
           Calendar
        ========================== */

        builder

            .addCase(getAttendanceCalendar.fulfilled, (state, action) => {

                state.calendar =
                    action.payload.data || [];

            });

        /* ==========================
           Dashboard
        ========================== */

        builder

            .addCase(getAttendanceDashboard.fulfilled, (state, action) => {

                state.dashboard =
                    action.payload.data || {};

            });

        /* ==========================
           Analytics
        ========================== */

        builder

            .addCase(getAttendanceAnalytics.fulfilled, (state, action) => {

                state.analytics =
                    action.payload.data || {};

            });

        /* ==========================
           Register
        ========================== */

        builder

            .addCase(getAttendanceRegister.fulfilled, (state, action) => {

                state.register =
                    action.payload.data || [];

            });

        /* ==========================
           Register Matrix
        ========================== */

        builder

            .addCase(getAttendanceRegisterMatrix.fulfilled, (state, action) => {

                state.registerMatrix =
                    action.payload.data || [];

            });

        /* ==========================
           Yearly Attendance
        ========================== */

        builder

            .addCase(getYearlyAttendance.fulfilled, (state, action) => {

                state.yearlyAttendance =
                    action.payload.data || [];

            });

        /* ==========================
           Low Attendance
        ========================== */

        builder

            .addCase(getLowAttendanceStudents.fulfilled, (state, action) => {

                state.lowAttendance =
                    action.payload.data || [];

            });


                },

});

export const {

    clearAttendanceError,

    clearAttendanceDetails,

} = attendanceSlice.actions;

export default attendanceSlice.reducer;