import { createSlice } from "@reduxjs/toolkit";

import {
    getMarks,
    getMarkById,
    createMark,
    updateMark,
    deleteMark,
    bulkCreateMarks,
    getMarksByFilter,
    getStudentsForMarks,
    fetchAcademicYears,
    fetchClasses,
    fetchSections,
    fetchSubjects,
    fetchExams,
} from "./markThunk";

const initialState = {
    marks: [],
    selectedMark: null,

    academicYears: [],
    classes: [],
    sections: [],
    subjects: [],
    exams: [],

    loading: false,
    submitting: false,
    error: null,
};

const markSlice = createSlice({
    name: "mark",
    initialState,

  reducers: {

    clearSelectedMark: (state) => {
        state.selectedMark = null;
    },

    updateLocalMarks: (state, action) => {
        state.marks = action.payload;
    },

},

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET MARKS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getMarks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMarks.fulfilled, (state, action) => {
                state.loading = false;
                state.marks = action.payload.data || [];
            })
            .addCase(getMarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | GET MARK BY ID
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getMarkById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMarkById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedMark = action.payload.data;
            })
            .addCase(getMarkById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | CREATE MARK
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(createMark.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createMark.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(createMark.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | BULK CREATE MARKS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(bulkCreateMarks.pending, (state) => {
                state.submitting = true;
            })
            .addCase(bulkCreateMarks.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(bulkCreateMarks.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | UPDATE MARK
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(updateMark.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateMark.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(updateMark.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | DELETE MARK
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(deleteMark.pending, (state) => {
                state.submitting = true;
            })
            .addCase(deleteMark.fulfilled, (state, action) => {
                state.submitting = false;

                state.marks = state.marks.filter(
                    (mark) => mark.mark_id !== action.payload
                );
            })
            .addCase(deleteMark.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | GET MARKS BY FILTER
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getMarksByFilter.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMarksByFilter.fulfilled, (state, action) => {
                state.loading = false;
                state.marks = action.payload.data || [];
            })
            .addCase(getMarksByFilter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | GET STUDENTS FOR MARKS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getStudentsForMarks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStudentsForMarks.fulfilled, (state, action) => {
                state.loading = false;
                state.marks = action.payload.data || [];
            })
            .addCase(getStudentsForMarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | DROPDOWNS
        |--------------------------------------------------------------------------
        */

        builder
   /*
|--------------------------------------------------------------------------
| DROPDOWNS
|--------------------------------------------------------------------------
*/

builder

.addCase(fetchAcademicYears.fulfilled, (state, action) => {

    state.academicYears =
        action.payload.data || action.payload || [];

})


.addCase(fetchClasses.fulfilled, (state, action) => {

    state.classes =
        action.payload.data || action.payload || [];

})


.addCase(fetchSections.fulfilled, (state, action) => {

    state.sections =
        action.payload.data || action.payload || [];

})


.addCase(fetchSubjects.fulfilled, (state, action) => {

    state.subjects =
        action.payload.data || action.payload || [];

})


.addCase(fetchExams.fulfilled, (state, action) => {

    state.exams =
        action.payload.data || action.payload || [];

});
    },
});

export const {
    clearSelectedMark,
    updateLocalMarks,
} = markSlice.actions;

export default markSlice.reducer;