import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getDashboardApi,
} from "../../api/dashboard.api";

/*
|--------------------------------------------------------------------------
| GET DASHBOARD
|--------------------------------------------------------------------------
*/

export const getDashboard = createAsyncThunk(

    "dashboard/getDashboard",

    async (_, { rejectWithValue }) => {

        try {

            const response =
                await getDashboardApi();

            return response;

        } catch (error) {

            return rejectWithValue(

                error.response?.data ||

                error.message

            );

        }

    }

);