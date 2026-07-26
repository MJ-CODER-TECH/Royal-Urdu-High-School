import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getResultsApi,
    getResultByIdApi,
    generateResultApi,
    getResultsByFilterApi,
    deleteResultApi,
} from "../../../api/result.api";



/*
|--------------------------------------------------------------------------
| GET ALL RESULTS
|--------------------------------------------------------------------------
*/

export const getResults = createAsyncThunk(

    "result/getResults",

    async (_, thunkAPI) => {

        try {

            return await getResultsApi();

        }
        catch(error){

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to load results."

            );

        }

    }

);




/*
|--------------------------------------------------------------------------
| GET RESULT BY ID
|--------------------------------------------------------------------------
*/

export const getResultById = createAsyncThunk(

    "result/getResultById",

    async(id, thunkAPI)=>{

        try{

            return await getResultByIdApi(id);

        }
        catch(error){

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to load result."

            );

        }

    }

);





/*
|--------------------------------------------------------------------------
| GENERATE RESULT
|--------------------------------------------------------------------------
*/

export const generateResult = createAsyncThunk(

    "result/generateResult",

    async(data, thunkAPI)=>{


        try{


            return await generateResultApi(data);


        }
        catch(error){


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to generate result."

            );


        }


    }

);






/*
|--------------------------------------------------------------------------
| FILTER RESULTS
|--------------------------------------------------------------------------
*/

export const getResultsByFilter = createAsyncThunk(

    "result/getResultsByFilter",

    async(params, thunkAPI)=>{


        try{


            return await getResultsByFilterApi(params);


        }
        catch(error){


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to load filtered results."

            );


        }


    }

);







/*
|--------------------------------------------------------------------------
| DELETE RESULT
|--------------------------------------------------------------------------
*/

export const deleteResult = createAsyncThunk(

    "result/deleteResult",

    async(id, thunkAPI)=>{


        try{


            await deleteResultApi(id);


            return id;


        }
        catch(error){


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to delete result."

            );


        }


    }

);