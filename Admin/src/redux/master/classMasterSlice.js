import { createSlice } from "@reduxjs/toolkit";

import {
    fetchClasses,
    getClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    changeClassStatus,
} from "./Classmasterthunk";

const initialState = {

    // Dropdown
    classes: [],

    // Management
    classList: [],
    selectedClass: null,

    loading: false,
    submitting: false,
    error: null,

};

const classMasterSlice = createSlice({

    name: "classMaster",

    initialState,

    reducers: {

        clearSelectedClass: (state) => {
            state.selectedClass = null;
        },

    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | Dropdown Classes
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(fetchClasses.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(fetchClasses.fulfilled, (state, action) => {

                state.loading = false;
                state.classes = action.payload || [];

            })

            .addCase(fetchClasses.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Class Management List
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getClasses.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(getClasses.fulfilled, (state, action) => {

                state.loading = false;
                state.classList = action.payload || [];

            })

            .addCase(getClasses.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Get Class By Id
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getClassById.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(getClassById.fulfilled, (state, action) => {

                state.loading = false;
                state.selectedClass = action.payload;

            })

            .addCase(getClassById.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Create Class
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(createClass.pending, (state) => {

                state.submitting = true;
                state.error = null;

            })

            .addCase(createClass.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(createClass.rejected, (state, action) => {

                state.submitting = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Update Class
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(updateClass.pending, (state) => {

                state.submitting = true;
                state.error = null;

            })

            .addCase(updateClass.fulfilled, (state) => {

                state.submitting = false;

            })

            .addCase(updateClass.rejected, (state, action) => {

                state.submitting = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Delete Class
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(deleteClass.pending, (state) => {

                state.submitting = true;
                state.error = null;

            })

            .addCase(deleteClass.fulfilled, (state, action) => {

                state.submitting = false;

                state.classList = state.classList.filter(
                    (item) => item.class_id !== action.payload
                );

            })

            .addCase(deleteClass.rejected, (state, action) => {

                state.submitting = false;
                state.error = action.payload;

            });

        /*
        |--------------------------------------------------------------------------
        | Change Class Status
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(changeClassStatus.pending, (state) => {

                state.submitting = true;
                state.error = null;

            })

            .addCase(changeClassStatus.fulfilled, (state, action) => {

                state.submitting = false;

                const index = state.classList.findIndex(
                    (item) => item.class_id === action.payload.id
                );

                if (index !== -1) {

                    state.classList[index].is_active =
                        action.payload.is_active;

                }

            })

            .addCase(changeClassStatus.rejected, (state, action) => {

                state.submitting = false;
                state.error = action.payload;

            });

    },

});

export const { clearSelectedClass } = classMasterSlice.actions;

export default classMasterSlice.reducer;