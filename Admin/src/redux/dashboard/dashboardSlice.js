import { createSlice } from "@reduxjs/toolkit";

import {
    getDashboard,
} from "./dashboardThunk";

const initialState = {

    dashboard: {

        students: {},

        users: {},

        classes: {},

        attendance: {},

        fees: {},

        exams: {},

        results: {},

        certificates: {},

        recentAdmissions: [],

        recentCollections: [],

        lowAttendance: []

    },

    loading: false,

    error: null

};

const dashboardSlice = createSlice({

    name: "dashboard",

    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(getDashboard.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(getDashboard.fulfilled, (state, action) => {

                state.loading = false;

              state.dashboard =
    action.payload?.data ??
    initialState.dashboard;

            })

            .addCase(getDashboard.rejected, (state, action) => {

                state.loading = false;

                state.error =
    action.payload ||
    "Something went wrong";

            });

    }

});

export default dashboardSlice.reducer;