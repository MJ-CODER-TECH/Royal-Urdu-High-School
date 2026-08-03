import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getSchoolProfileApi,
  createSchoolProfileApi,
  updateSchoolProfileApi,
  addSchoolUnitApi,
  deleteSchoolUnitApi,
} from "../../api/schoolProfile.api";


/*
|--------------------------------------------------------------------------
| Get School Profile
|--------------------------------------------------------------------------
*/

export const getSchoolProfile =
  createAsyncThunk(

    "schoolProfile/getSchoolProfile",

    async (
      _,
      thunkAPI
    ) => {

      try {

        const response =
          await getSchoolProfileApi();

        return response;

      } catch (
        error
      ) {

        return thunkAPI.rejectWithValue(

          error.response
            ?.data
            ?.message ||

          "Failed to load school profile."

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

export const createSchoolProfile =
  createAsyncThunk(

    "schoolProfile/createSchoolProfile",

    async (
      data,
      thunkAPI
    ) => {

      try {

        const response =
          await createSchoolProfileApi(
            data
          );

        return response;

      } catch (
        error
      ) {

        return thunkAPI.rejectWithValue(

          error.response
            ?.data
            ?.message ||

          "Failed to create school profile."

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Update School Profile
|--------------------------------------------------------------------------
*/

export const updateSchoolProfile =
  createAsyncThunk(

    "schoolProfile/updateSchoolProfile",

    async (
      {
        id,
        data,
      },
      thunkAPI
    ) => {

      try {

        const response =
          await updateSchoolProfileApi(

            id,

            data

          );

        return response;

      } catch (
        error
      ) {

        return thunkAPI.rejectWithValue(

          error.response
            ?.data
            ?.message ||

          "Failed to update school profile."

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Add School Unit
|--------------------------------------------------------------------------
*/

export const addSchoolUnit =
  createAsyncThunk(

    "schoolProfile/addSchoolUnit",

    async (
      {
        schoolId,
        data,
      },
      thunkAPI
    ) => {

      try {

        const response =
          await addSchoolUnitApi(

            schoolId,

            data

          );

        return response;

      } catch (
        error
      ) {

        return thunkAPI.rejectWithValue(

          error.response
            ?.data
            ?.message ||

          "Failed to add school unit."

        );

      }

    }

  );


/*
|--------------------------------------------------------------------------
| Delete School Unit
|--------------------------------------------------------------------------
*/

export const deleteSchoolUnit =
  createAsyncThunk(

    "schoolProfile/deleteSchoolUnit",

    async (
      unitId,
      thunkAPI
    ) => {

      try {

        const response =
          await deleteSchoolUnitApi(
            unitId
          );

        return response;

      } catch (
        error
      ) {

        return thunkAPI.rejectWithValue(

          error.response
            ?.data
            ?.message ||

          "Failed to delete school unit."

        );

      }

    }

  );