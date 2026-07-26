import { createSlice } from "@reduxjs/toolkit";

import {
    getResults,
    getResultById,
    generateResult,
    getResultsByFilter,
    deleteResult,
} from "./resultThunk";



const initialState = {

    results: [],

    selectedResult: null,


    loading: false,

    submitting: false,


    error: null,

};



const resultSlice = createSlice({

    name: "result",

    initialState,


    reducers: {


        clearSelectedResult:(state)=>{

            state.selectedResult = null;

        },


    },



    extraReducers:(builder)=>{


        /*
        |--------------------------------------------------------------------------
        | GET RESULTS
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(getResults.pending,(state)=>{

            state.loading = true;

            state.error = null;

        })


        .addCase(getResults.fulfilled,(state,action)=>{

            state.loading = false;


            state.results =
                action.payload.data || [];


        })


        .addCase(getResults.rejected,(state,action)=>{

            state.loading = false;

            state.error = action.payload;

        });





        /*
        |--------------------------------------------------------------------------
        | GET RESULT BY ID
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(getResultById.pending,(state)=>{

            state.loading = true;

        })


        .addCase(getResultById.fulfilled,(state,action)=>{

            state.loading = false;


            state.selectedResult =
                action.payload.data;


        })


        .addCase(getResultById.rejected,(state,action)=>{

            state.loading = false;

            state.error = action.payload;

        });







        /*
        |--------------------------------------------------------------------------
        | GENERATE RESULT
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(generateResult.pending,(state)=>{

            state.submitting = true;

        })


        .addCase(generateResult.fulfilled,(state)=>{

            state.submitting = false;

        })


        .addCase(generateResult.rejected,(state,action)=>{

            state.submitting = false;

            state.error = action.payload;

        });








        /*
        |--------------------------------------------------------------------------
        | FILTER RESULT
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(getResultsByFilter.pending,(state)=>{

            state.loading = true;

        })


        .addCase(getResultsByFilter.fulfilled,(state,action)=>{

            state.loading = false;


            state.results =
                action.payload.data || [];


        })


        .addCase(getResultsByFilter.rejected,(state,action)=>{

            state.loading = false;

            state.error = action.payload;

        });








        /*
        |--------------------------------------------------------------------------
        | DELETE RESULT
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(deleteResult.pending,(state)=>{

            state.submitting = true;

        })


        .addCase(deleteResult.fulfilled,(state,action)=>{

            state.submitting = false;


            state.results =
                state.results.filter(

                    (item)=>
                    item.result_id !== action.payload

                );


        })


        .addCase(deleteResult.rejected,(state,action)=>{

            state.submitting = false;

            state.error = action.payload;

        });



    },

});



export const {
    clearSelectedResult,

} = resultSlice.actions;



export default resultSlice.reducer;