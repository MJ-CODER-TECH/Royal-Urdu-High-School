import { createSlice } from "@reduxjs/toolkit";

import {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
    changeExamStatus,
    fetchClasses,
    fetchAcademicYears,
} from "./examThunk";

const initialState = {
    exams: [],
    classes: [],
    academicYears: [],
    selectedExam: null,

    loading: false,
    submitting: false,
    error: null,
};

const examSlice = createSlice({
    name: "exam",

    initialState,

    reducers: {
        clearSelectedExam: (state) => {
            state.selectedExam = null;
        },
    },

    extraReducers: (builder) => {

        /*
        |------------------------------------------------------------------
        | GET EXAMS
        |------------------------------------------------------------------
        */

        builder
            .addCase(getExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExams.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload || [];
            })
            .addCase(getExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | GET EXAM BY ID
        |------------------------------------------------------------------
        */

        builder
            .addCase(getExamById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getExamById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedExam = action.payload.data;
            })
            .addCase(getExamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | CREATE EXAM
        |------------------------------------------------------------------
        */

        builder
            .addCase(createExam.pending, (state) => {
                state.submitting = true;
            })
            .addCase(createExam.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(createExam.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | UPDATE EXAM
        |------------------------------------------------------------------
        */

        builder
            .addCase(updateExam.pending, (state) => {
                state.submitting = true;
            })
            .addCase(updateExam.fulfilled, (state) => {
                state.submitting = false;
            })
            .addCase(updateExam.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | DELETE EXAM
        |------------------------------------------------------------------
        */

        builder
            .addCase(deleteExam.pending, (state) => {
                state.submitting = true;
            })
            .addCase(deleteExam.fulfilled, (state, action) => {
                state.submitting = false;

                state.exams = state.exams.filter(
                    (exam) => exam.exam_id !== action.payload
                );
            })
            .addCase(deleteExam.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | CHANGE STATUS
        |------------------------------------------------------------------
        */

        builder
            .addCase(changeExamStatus.pending, (state) => {
                state.submitting = true;
            })
            .addCase(changeExamStatus.fulfilled, (state, action) => {
                state.submitting = false;

                const exam = state.exams.find(
                    (item) => item.exam_id === action.payload.id
                );

                if (exam) {
                    exam.status = action.payload.status;
                }
            })
            .addCase(changeExamStatus.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |------------------------------------------------------------------
        | FETCH CLASSES
        |------------------------------------------------------------------
        */

        builder
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
            })
           .addCase(fetchClasses.fulfilled, (state, action) => {
    state.loading = false;
    state.classes = action.payload || [];
})
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.classes = [];
            });

        /*
        |------------------------------------------------------------------
        | FETCH ACADEMIC YEARS
        |------------------------------------------------------------------
        */

        builder
            .addCase(fetchAcademicYears.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAcademicYears.fulfilled, (state, action) => {
    state.loading = false;
    state.academicYears = action.payload || [];
})
            .addCase(fetchAcademicYears.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.academicYears = [];
            });
    },
});

export const {
    clearSelectedExam,
} = examSlice.actions;

export default examSlice.reducer;