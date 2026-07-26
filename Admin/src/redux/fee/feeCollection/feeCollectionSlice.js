import { createSlice } from "@reduxjs/toolkit";

import {

    getFeeCollections,
    getFeeReceiptById,
    collectFee,
    deleteFeeReceipt,
    getPendingStudentFees

} from "./feeCollectionThunk";



const initialState = {

    collections: [],
    pendingFees:[],

    selectedReceipt: null,

    loading: false,

    submitting: false,

    error: null,

    summary: {

        total_receipts: 0,

        total_collection: 0,

        today_collection: 0,

        monthly_collection: 0

    },

    pagination: {

        page: 1,

        limit: 10,

        total: 0,

        totalPages: 1

    }

};



const feeCollectionSlice = createSlice({

    name: "feeCollection",

    initialState,

    reducers: {

        clearSelectedReceipt: (state) => {

            state.selectedReceipt = null;

        },

        clearFeeCollectionError: (state) => {

            state.error = null;

        }

    },

    extraReducers: (builder) => {

        builder
     
        builder


.addCase(
getPendingStudentFees.pending,
(state)=>{

    state.loading=true;

})


.addCase(
getPendingStudentFees.fulfilled,
(state,action)=>{

    state.loading=false;

    state.pendingFees =
        action.payload.data || action.payload;

})


.addCase(
getPendingStudentFees.rejected,
(state,action)=>{

    state.loading=false;

    state.error =
        action.payload;

})


        // ============================
        // GET ALL
        // ============================

        .addCase(getFeeCollections.pending, (state) => {

            state.loading = true;

            state.error = null;

        })

        .addCase(getFeeCollections.fulfilled, (state, action) => {

            state.loading = false;

            state.collections = action.payload.data || [];

            state.pagination = action.payload.pagination || state.pagination;

            state.summary = action.payload.summary || state.summary;

        })

        .addCase(getFeeCollections.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })



        // ============================
        // GET RECEIPT
        // ============================

        .addCase(getFeeReceiptById.pending, (state) => {

            state.loading = true;

            state.error = null;

        })

.addCase(getFeeReceiptById.fulfilled, (state, action) => {

    // console.log("SLICE PAYLOAD =>", action.payload);

    state.loading = false;

    state.selectedReceipt = action.payload;

})

        .addCase(getFeeReceiptById.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })



        // ============================
        // COLLECT FEE
        // ============================

        .addCase(collectFee.pending, (state) => {

            state.submitting = true;

            state.error = null;

        })

        .addCase(collectFee.fulfilled, (state, action) => {

            state.submitting = false;

            state.collections.unshift(action.payload.data);

        })

        .addCase(collectFee.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        })



        // ============================
        // DELETE RECEIPT
        // ============================

        .addCase(deleteFeeReceipt.pending, (state) => {

            state.loading = true;

            state.error = null;

        })

        .addCase(deleteFeeReceipt.fulfilled, (state, action) => {

            state.loading = false;

            state.collections = state.collections.filter(

                item =>

                    item.collection_id !== action.payload

            );

        })

        .addCase(deleteFeeReceipt.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        });

    }

});



export const {

    clearSelectedReceipt,

    clearFeeCollectionError

} = feeCollectionSlice.actions;



export default feeCollectionSlice.reducer;