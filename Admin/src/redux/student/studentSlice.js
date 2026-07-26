import { createSlice } from "@reduxjs/toolkit";

import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    changeStudentStatus,
} from "./studentThunk";

const initialState = {
    students: [],
    selectedStudent: null,

    loading: false,
    submitting: false,
    error: null,

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    },
};

const studentSlice = createSlice({
    name: "student",
    initialState,

    reducers: {
        clearSelectedStudent: (state) => {
            state.selectedStudent = null;
        },
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET STUDENTS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getStudents.pending, (state) => {
                state.loading = true;
            })

            .addCase(getStudents.fulfilled, (state, action) => {
                state.loading = false;

                const payload = action.payload;

                // Shape: { success, students, page, limit, total, totalPages }
                if (payload?.students) {
                    state.students = payload.students;

                    state.pagination = {
                        page: payload.page,
                        limit: payload.limit,
                        total: payload.total,
                        totalPages: payload.totalPages,
                    };
                }

                // Shape: { success, count, data }  <-- what your API actually returns
                else if (payload?.data) {
                    state.students = payload.data;

                    state.pagination = {
                        ...state.pagination,
                        total: payload.count ?? payload.data.length,
                        totalPages: Math.max(
                            1,
                            Math.ceil(
                                (payload.count ?? payload.data.length) /
                                state.pagination.limit
                            )
                        ),
                    };
                }

                // Shape: plain array
                else if (Array.isArray(payload)) {
                    state.students = payload;

                    state.pagination = {
                        ...state.pagination,
                        total: payload.length,
                        totalPages: Math.max(
                            1,
                            Math.ceil(payload.length / state.pagination.limit)
                        ),
                    };
                }

                // Fallback - never leave students as a non-array
                else {
                    state.students = [];
                }
            })

            .addCase(getStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | GET STUDENT
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getStudentById.pending, (state) => {
                state.loading = true;
            })

            .addCase(getStudentById.fulfilled, (state, action) => {
                state.loading = false;
                // API likely returns { success, data } for a single student too
                state.selectedStudent =
                    action.payload?.data ?? action.payload;
            })

            .addCase(getStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | CREATE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(createStudent.pending, (state) => {
                state.submitting = true;
            })

            .addCase(createStudent.fulfilled, (state) => {
                state.submitting = false;
            })

            .addCase(createStudent.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(updateStudent.pending, (state) => {
                state.submitting = true;
            })

            .addCase(updateStudent.fulfilled, (state) => {
                state.submitting = false;
            })

            .addCase(updateStudent.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | DELETE
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(deleteStudent.pending, (state) => {
                state.submitting = true;
            })

            .addCase(deleteStudent.fulfilled, (state) => {
                state.submitting = false;
            })

            .addCase(deleteStudent.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /*
        |--------------------------------------------------------------------------
        | STATUS
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(changeStudentStatus.pending, (state) => {
                state.submitting = true;
            })

            .addCase(changeStudentStatus.fulfilled, (state) => {
                state.submitting = false;
            })

            .addCase(changeStudentStatus.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

    },
});

export const {
    clearSelectedStudent,
} = studentSlice.actions;

export default studentSlice.reducer;