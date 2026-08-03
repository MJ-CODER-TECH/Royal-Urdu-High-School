import { createSlice } from "@reduxjs/toolkit";

import {
    fetchPromotionStudents,
    promoteStudentsThunk,
    fetchPromotionHistory
} from "./promotionThunk";

const initialState = {

    students: [],
    history: [],

    loading: false,
    promoteLoading: false,

    success: false,
    message: "",

    // Result of the last promote action:
    // { promoted: [studentId, ...], skipped: [{ student_id, reason }, ...] }
    lastResult: null,

    error: null

};

const promotionSlice = createSlice({

    name: "promotion",

    initialState,

    reducers: {

        clearPromotionState: (state) => {

            state.success = false;
            state.message = "";
            state.error = null;
            state.lastResult = null;

        },

        clearStudents: (state) => {

            state.students = [];

        }

    },

    extraReducers: (builder) => {

        // ===========================================
        // Fetch Promotion Students
        // ===========================================

        builder

            .addCase(fetchPromotionStudents.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(fetchPromotionStudents.fulfilled, (state, action) => {

                state.loading = false;
                state.students = action.payload;

            })

            .addCase(fetchPromotionStudents.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        // ===========================================
        // Promote Students
        // ===========================================

        builder

            .addCase(promoteStudentsThunk.pending, (state) => {

                state.promoteLoading = true;
                state.success = false;
                state.error = null;
                state.message = "";
                state.lastResult = null;

            })

            .addCase(promoteStudentsThunk.fulfilled, (state, action) => {

                state.promoteLoading = false;
                state.success = action.payload.success;
                state.message = action.payload.message;
                state.lastResult = action.payload.data || null;

            })

            .addCase(promoteStudentsThunk.rejected, (state, action) => {

                state.promoteLoading = false;
                state.success = false;
                state.error = action.payload;

            });

        // ===========================================
        // Promotion History
        // ===========================================

        builder

            .addCase(fetchPromotionHistory.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(fetchPromotionHistory.fulfilled, (state, action) => {

                state.loading = false;
                state.history = action.payload;

            })

            .addCase(fetchPromotionHistory.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

    }

});

export const {
    clearPromotionState,
    clearStudents
} = promotionSlice.actions;

export default promotionSlice.reducer;