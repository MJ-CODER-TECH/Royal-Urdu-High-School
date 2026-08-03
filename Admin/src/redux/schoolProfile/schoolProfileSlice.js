import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getSchoolProfile,
  createSchoolProfile,
  updateSchoolProfile,
  addSchoolUnit,
  deleteSchoolUnit,
} from "./schoolProfileThunk";


const initialState = {

  schoolProfile: null,

  exists: false,

  loading: false,

  submitting: false,

  unitSubmitting: false,

  deletingUnitId: null,

  error: null,

};


const schoolProfileSlice =
  createSlice({

    name: "schoolProfile",

    initialState,

    reducers: {

      clearSchoolProfile: (
        state
      ) => {

        state.schoolProfile = null;

        state.exists = false;

        state.loading = false;

        state.submitting = false;

        state.unitSubmitting = false;

        state.deletingUnitId = null;

        state.error = null;

      },

    },

    extraReducers: (
      builder
    ) => {

      /*
      |--------------------------------------------------------------------------
      | Get School Profile
      |--------------------------------------------------------------------------
      */

      builder

        .addCase(
          getSchoolProfile.pending,

          (state) => {

            state.loading = true;

            state.error = null;

          }
        )

        .addCase(
          getSchoolProfile.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error = null;

            state.exists =
              Boolean(
                action.payload?.exists
              );

            state.schoolProfile =
              action.payload?.data ||
              null;

          }
        )

        .addCase(
          getSchoolProfile.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.schoolProfile = null;

            state.exists = false;

            state.error =
              action.payload ||
              "Failed to load school profile.";

          }
        );


      /*
      |--------------------------------------------------------------------------
      | Update School Profile
      |--------------------------------------------------------------------------
      */

      builder

        .addCase(
          updateSchoolProfile.pending,

          (state) => {

            state.submitting = true;

            state.error = null;

          }
        )

        .addCase(
          updateSchoolProfile.fulfilled,

          (
            state,
            action
          ) => {

            state.submitting = false;

            state.error = null;

            state.exists = true;

            if (
              action.payload?.data
            ) {

              state.schoolProfile =
                action.payload.data;

            }

          }
        )

        .addCase(
          updateSchoolProfile.rejected,

          (
            state,
            action
          ) => {

            state.submitting = false;

            state.error =
              action.payload ||
              "Failed to save school profile.";

          }
        );


      /*
      |--------------------------------------------------------------------------
      | Add School Unit
      |--------------------------------------------------------------------------
      */

      builder

        .addCase(
          addSchoolUnit.pending,

          (state) => {

            state.unitSubmitting = true;

            state.error = null;

          }
        )

        .addCase(
          addSchoolUnit.fulfilled,

          (
            state,
            action
          ) => {

            state.unitSubmitting = false;

            const newUnit =
              action.payload?.data;

            if (
              newUnit &&
              state.schoolProfile
            ) {

              if (
                !Array.isArray(
                  state.schoolProfile
                    .school_units
                )
              ) {

                state.schoolProfile
                  .school_units = [];

              }

              state.schoolProfile
                .school_units
                .push(
                  newUnit
                );

            }

          }
        )

        .addCase(
          addSchoolUnit.rejected,

          (
            state,
            action
          ) => {

            state.unitSubmitting = false;

            state.error =
              action.payload ||
              "Failed to add school unit.";

          }
        );
      



      /*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

builder

  .addCase(
    createSchoolProfile.pending,

    (state) => {

      state.submitting = true;

      state.error = null;

    }
  )

  .addCase(
    createSchoolProfile.fulfilled,

    (
      state,
      action
    ) => {

      state.submitting = false;

      state.exists = true;

      state.schoolProfile =

        action.payload?.data ||

        action.payload?.schoolProfile ||

        null;

    }
  )

  .addCase(
    createSchoolProfile.rejected,

    (
      state,
      action
    ) => {

      state.submitting = false;

      state.error =

        action.payload ||

        "Failed to create school profile.";

    }
  );  

      /*
      |--------------------------------------------------------------------------
      | Delete School Unit
      |--------------------------------------------------------------------------
      */

      builder

        .addCase(
          deleteSchoolUnit.pending,

          (
            state,
            action
          ) => {

            state.deletingUnitId =
              action.meta.arg;

            state.error = null;

          }
        )

        .addCase(
          deleteSchoolUnit.fulfilled,

          (
            state,
            action
          ) => {

            const deletedUnitId =
              action.meta.arg;

            state.deletingUnitId =
              null;

            if (
              state.schoolProfile &&
              Array.isArray(
                state.schoolProfile
                  .school_units
              )
            ) {

              state.schoolProfile
                .school_units =
                state.schoolProfile
                  .school_units
                  .filter(
                    (unit) =>
                      Number(
                        unit.school_unit_id
                      ) !==
                      Number(
                        deletedUnitId
                      )
                  );

            }

          }
        )

        .addCase(
          deleteSchoolUnit.rejected,

          (
            state,
            action
          ) => {

            state.deletingUnitId =
              null;

            state.error =
              action.payload ||
              "Failed to delete school unit.";

          }
        );

    },

  });


export const {
  clearSchoolProfile,
} = schoolProfileSlice.actions;


export default
schoolProfileSlice.reducer;