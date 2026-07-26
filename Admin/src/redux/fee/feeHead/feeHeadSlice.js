import { createSlice } from "@reduxjs/toolkit";

import {

    getFeeHeads,
    getFeeHeadById,
    createFeeHead,
    updateFeeHead,
    deleteFeeHead,

} from "./feeHeadThunk";


const initialState = {

    feeHeads: [],

    selectedFeeHead: null,


    loading: false,

    submitting: false,

    error: null,


    pagination: {

        page: 1,

        limit: 10,

        total: 0,

        totalPages: 0,

    },

};



const feeHeadSlice = createSlice({

    name: "feeHead",


    initialState,


    reducers: {


        /*
        |--------------------------------------------------------------------------
        | CLEAR SELECTED FEE HEAD
        |--------------------------------------------------------------------------
        */

        clearSelectedFeeHead: (state) => {

            state.selectedFeeHead = null;

        },


        /*
        |--------------------------------------------------------------------------
        | CLEAR ERROR
        |--------------------------------------------------------------------------
        */

        clearFeeHeadError: (state) => {

            state.error = null;

        },


        /*
        |--------------------------------------------------------------------------
        | RESET STATE
        |--------------------------------------------------------------------------
        */

        resetFeeHeadState: () => {

            return initialState;

        },


    },


    extraReducers: (builder) => {


        /*
        |--------------------------------------------------------------------------
        | GET FEE HEADS
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(
            getFeeHeads.pending,
            (state) => {

                state.loading = true;

                state.error = null;

            }
        )


        .addCase(
            getFeeHeads.fulfilled,
            (state, action) => {


                state.loading = false;


                state.feeHeads =

                    action.payload.data || 
                    action.payload.feeHeads ||
                    [];



                if(action.payload.pagination){

                    state.pagination =
                        action.payload.pagination;

                }


            }
        )


        .addCase(
            getFeeHeads.rejected,
            (state, action) => {


                state.loading = false;


                state.error =

                    action.payload ||
                    "Something went wrong";


            }
        )



        /*
        |--------------------------------------------------------------------------
        | GET FEE HEAD BY ID
        |--------------------------------------------------------------------------
        */


        .addCase(
            getFeeHeadById.pending,
            (state) => {


                state.loading = true;


            }
        )


        .addCase(
            getFeeHeadById.fulfilled,
            (state, action)=>{


                state.loading = false;


                state.selectedFeeHead =

                    action.payload.data ||
                    action.payload;


            }
        )


        .addCase(
            getFeeHeadById.rejected,
            (state, action)=>{


                state.loading = false;


                state.error =

                    action.payload;


            }
        )



        /*
        |--------------------------------------------------------------------------
        | CREATE FEE HEAD
        |--------------------------------------------------------------------------
        */


        .addCase(
            createFeeHead.pending,
            (state)=>{


                state.submitting = true;


            }
        )


        .addCase(
            createFeeHead.fulfilled,
            (state)=>{


                state.submitting = false;


            }
        )


        .addCase(
            createFeeHead.rejected,
            (state, action)=>{


                state.submitting = false;


                state.error =

                    action.payload;


            }
        )



        /*
        |--------------------------------------------------------------------------
        | UPDATE FEE HEAD
        |--------------------------------------------------------------------------
        */


        .addCase(
            updateFeeHead.pending,
            (state)=>{


                state.submitting = true;


            }
        )


        .addCase(
            updateFeeHead.fulfilled,
            (state)=>{


                state.submitting = false;


            }
        )


        .addCase(
            updateFeeHead.rejected,
            (state, action)=>{


                state.submitting = false;


                state.error =

                    action.payload;


            }
        )



        /*
        |--------------------------------------------------------------------------
        | DELETE FEE HEAD
        |--------------------------------------------------------------------------
        */


        .addCase(
            deleteFeeHead.pending,
            (state)=>{


                state.loading = true;


            }
        )


        .addCase(
            deleteFeeHead.fulfilled,
            (state, action)=>{


                state.loading = false;



                state.feeHeads =

                    state.feeHeads.filter(

                        (item)=>

                            item.id !== action.payload

                    );


            }
        )


        .addCase(
            deleteFeeHead.rejected,
            (state, action)=>{


                state.loading = false;


                state.error =

                    action.payload;


            }
        )


    },


});



export const {

    clearSelectedFeeHead,

    clearFeeHeadError,

    resetFeeHeadState,

} = feeHeadSlice.actions;



export default feeHeadSlice.reducer;