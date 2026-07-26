import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getSectionsApi as getDropdownSectionsApi,
} from "../../api/master.api";


import {
    getSectionsApi,
    getSectionByIdApi,
    createSectionApi,
    updateSectionApi,
    deleteSectionApi,
    changeSectionStatusApi,
} from "../../api/sectionMaster.api";


/*
|--------------------------------------------------------------------------
| GET SECTIONS (Dropdown)
|--------------------------------------------------------------------------
*/

export const fetchSections = createAsyncThunk(
    "section/fetchSections",
 
    async (_, thunkAPI) => {

        try {

            const res = await getDropdownSectionsApi();
return res.data || res;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sections."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| GET SECTION MANAGEMENT LIST
|--------------------------------------------------------------------------
*/

export const getSections = createAsyncThunk(
    "sectionMaster/getSections",

    async (_, thunkAPI) => {

        try {

            return await getSectionsApi();

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load sections."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| GET SECTION BY ID
|--------------------------------------------------------------------------
*/

export const getSectionById = createAsyncThunk(
    "sectionMaster/getSectionById",

    async (id, thunkAPI) => {

        try {

            return await getSectionByIdApi(id);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load section."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| CREATE SECTION
|--------------------------------------------------------------------------
*/

export const createSection = createAsyncThunk(
    "sectionMaster/createSection",

    async (data, thunkAPI) => {

        try {

            return await createSectionApi(data);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create section."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| UPDATE SECTION
|--------------------------------------------------------------------------
*/

export const updateSection = createAsyncThunk(
    "sectionMaster/updateSection",

    async (
        {
            id,
            data
        },
        thunkAPI
    ) => {

        try {

            return await updateSectionApi(
                id,
                data
            );

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update section."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| DELETE SECTION
|--------------------------------------------------------------------------
*/

export const deleteSection = createAsyncThunk(
    "sectionMaster/deleteSection",

    async (
        id,
        thunkAPI
    ) => {

        try {

            await deleteSectionApi(id);

            return id;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete section."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| CHANGE SECTION STATUS
|--------------------------------------------------------------------------
*/

export const changeSectionStatus = createAsyncThunk(
    "sectionMaster/changeSectionStatus",

    async (
        {
            id,
            is_active
        },
        thunkAPI
    ) => {

        try {

            await changeSectionStatusApi(
                id,
                is_active
            );


            return {
                id,
                is_active,
            };


        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update status."
            );

        }

    }
);
