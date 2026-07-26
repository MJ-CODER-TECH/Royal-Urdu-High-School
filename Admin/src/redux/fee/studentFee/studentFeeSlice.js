import { createSlice } from "@reduxjs/toolkit";

import {
    getStudentFees,
    getStudentFeeById,
    assignStudentFee,
    deleteStudentFee,
} from "./studentFeeThunk";

const initialState = {
    studentFees: [],

    selectedStudentFee: null,

    loading: false,

    submitting: false,

    error: null,

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },

    summary: {
        total_fee: 0,
        payable_amount: 0,
        paid_amount: 0,
        balance_amount: 0,
    },
};

const studentFeeSlice = createSlice({
    name: "studentFee",

    initialState,

    reducers: {
        /*
        |--------------------------------------------------------------------------
        | CLEAR SELECTED STUDENT FEE
        |--------------------------------------------------------------------------
        */

        clearSelectedStudentFee: (state) => {
            state.selectedStudentFee = null;
        },

        /*
        |--------------------------------------------------------------------------
        | CLEAR ERROR
        |--------------------------------------------------------------------------
        */

        clearStudentFeeError: (state) => {
            state.error = null;
        },

        /*
        |--------------------------------------------------------------------------
        | RESET STATE
        |--------------------------------------------------------------------------
        */

        resetStudentFeeState: () => {
            return initialState;
        },
    },

    extraReducers: (builder) => {
        /*
        |--------------------------------------------------------------------------
        | GET STUDENT FEES
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getStudentFees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

        
         .addCase(getStudentFees.fulfilled, (state, action) => {

    state.loading = false;

    const payload = action.payload;

  


    // API direct array return kar raha hai
    if (Array.isArray(payload)) {

        state.studentFees = payload;

        state.pagination = {
            page:1,
            limit:10,
            total:payload.length,
            totalPages:1
        };

        return;
    }


    // future pagination support
    state.studentFees =
        payload.rows ||
        payload.data?.rows ||
        payload.data ||
        [];


    state.pagination = {

        page:
            payload.page ||
            payload.data?.page ||
            1,


        limit:
            payload.limit ||
            payload.data?.limit ||
            10,


        total:
            payload.total ||
            payload.data?.total ||
            0,


        totalPages:
            payload.totalPages ||
            payload.data?.totalPages ||
            1
    };


})

            /*
            |--------------------------------------------------------------------------
            | GET STUDENT FEE BY ID
            |--------------------------------------------------------------------------
            */

            .addCase(getStudentFeeById.pending, (state) => {
                state.loading = true;
            })

            .addCase(getStudentFeeById.fulfilled, (state, action) => {
                state.loading = false;

                state.selectedStudentFee =
                    action.payload.data ||
                    action.payload;
            })

            .addCase(getStudentFeeById.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | ASSIGN STUDENT FEE
            |--------------------------------------------------------------------------
            */

            .addCase(assignStudentFee.pending, (state) => {
                state.submitting = true;
            })

            .addCase(assignStudentFee.fulfilled, (state) => {
                state.submitting = false;
            })

            .addCase(assignStudentFee.rejected, (state, action) => {
                state.submitting = false;

                state.error = action.payload;
            })

            /*
            |--------------------------------------------------------------------------
            | DELETE STUDENT FEE
            |--------------------------------------------------------------------------
            */

            .addCase(deleteStudentFee.pending, (state) => {
                state.loading = true;
            })

            .addCase(deleteStudentFee.fulfilled, (state, action) => {
                state.loading = false;

                state.studentFees = state.studentFees.filter(
                    (item) =>
                        item.student_fee_id !== action.payload
                );
            })

            .addCase(deleteStudentFee.rejected, (state, action) => {
                state.loading = false;

                state.error = action.payload;
            });
    },
});

export const {
    clearSelectedStudentFee,
    clearStudentFeeError,
    resetStudentFeeState,
} = studentFeeSlice.actions;

export default studentFeeSlice.reducer;