import { createSlice } from "@reduxjs/toolkit";

import {

    getFeeStructures,

    getFeeStructureById,

    createFeeStructure,

    updateFeeStructure,

    deleteFeeStructure,

} from "./feeStructureThunk";

const initialState = {

    feeStructures: [],

    selectedFeeStructure: null,

    loading:false,

    submitting:false,

    error:null,


    pagination:{
        page:1,
        limit:10,
        total:0,
        totalPages:0
    }

};
const feeStructureSlice = createSlice({

    name: "feeStructure",

    initialState,

    reducers: {

        clearSelectedFeeStructure: (state) => {

            state.selectedFeeStructure = null;

        },

    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET ALL
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getFeeStructures.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

         .addCase(getFeeStructures.fulfilled,(state,action)=>{

    state.loading=false;

    state.feeStructures =
        action.payload.data || [];


    state.pagination =
        action.payload.pagination || {

            page:1,
            limit:10,
            total:0,
            totalPages:0

        };

})

            .addCase(getFeeStructures.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | GET BY ID
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getFeeStructureById.pending, (state) => {

                state.loading = true;

            })

            .addCase(getFeeStructureById.fulfilled, (state, action) => {

                state.loading = false;

                state.selectedFeeStructure = action.payload.data;

            })

            .addCase(getFeeStructureById.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(createFeeStructure.pending, (state) => {

                state.submitting = true;

            })

            .addCase(createFeeStructure.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(createFeeStructure.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(updateFeeStructure.pending, (state) => {

                state.submitting = true;

            })

            .addCase(updateFeeStructure.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(updateFeeStructure.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | DELETE
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(deleteFeeStructure.pending, (state) => {

                state.submitting = true;

            })

            .addCase(deleteFeeStructure.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(deleteFeeStructure.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });

    },

});

export const {

    clearSelectedFeeStructure,

} = feeStructureSlice.actions;

export default feeStructureSlice.reducer;