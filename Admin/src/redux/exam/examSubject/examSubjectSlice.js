import { createSlice } from "@reduxjs/toolkit";

import {
    getExamSubjects,
    getExamSubjectById,
    createExamSubject,
    updateExamSubject,
    deleteExamSubject,
    changeExamSubjectStatus,
    fetchClasses,
    fetchSubjects,
    fetchAcademicYears,
    fetchExams,
} from "./examSubjectThunk";

const initialState = {
    examSubjects: [],
    selectedExamSubject: null,

    classes: [],
    subjects: [],
    academicYears: [],
    exams: [],

    loading: false,
    submitting: false,
    error: null,
};

const examSubjectSlice = createSlice({
    name: "examSubject",
    initialState,

    reducers: {
        clearSelectedExamSubject: (state) => {
            state.selectedExamSubject = null;
        },
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET EXAM SUBJECTS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getExamSubjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExamSubjects.fulfilled, (state, action) => {
                state.loading = false;
                state.examSubjects = action.payload.data || [];
            })
            .addCase(getExamSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | GET EXAM SUBJECT BY ID
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getExamSubjectById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExamSubjectById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedExamSubject = action.payload.data;
            })
            .addCase(getExamSubjectById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(createExamSubject.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createExamSubject.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(createExamSubject.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(updateExamSubject.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateExamSubject.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(updateExamSubject.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | DELETE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(deleteExamSubject.pending, (state) => {
                state.submitting = true;
            })
            .addCase(deleteExamSubject.fulfilled, (state, action) => {
                state.submitting = false;

                state.examSubjects = state.examSubjects.filter(
                    (item) =>
                        item.exam_subject_id !== action.payload
                );
            })
            .addCase(deleteExamSubject.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | CHANGE STATUS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(changeExamSubjectStatus.pending, (state) => {
                state.submitting = true;
            })
            .addCase(changeExamSubjectStatus.fulfilled, (state, action) => {
                state.submitting = false;

                const examSubject = state.examSubjects.find(
                    (item) =>
                        item.exam_subject_id === action.payload.id
                );

                if (examSubject) {
                    examSubject.status = action.payload.status;
                }
            })
            .addCase(changeExamSubjectStatus.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | DROPDOWNS
        |--------------------------------------------------------------------------
        */

        builder
           .addCase(fetchClasses.fulfilled, (state, action) => {
    state.classes = action.payload || [];
})

            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload || [];
            })

            .addCase(fetchAcademicYears.fulfilled, (state, action) => {
    state.academicYears = action.payload || [];
})

.addCase(fetchExams.fulfilled, (state, action) => {
    state.exams = action.payload;
})

    },
});

export const {
    clearSelectedExamSubject,
} = examSubjectSlice.actions;

export default examSubjectSlice.reducer;