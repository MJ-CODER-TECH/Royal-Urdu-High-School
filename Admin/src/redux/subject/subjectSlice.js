import {
    createSlice,
} from "@reduxjs/toolkit";

import {

    fetchSubjects,

    fetchSubjectById,

    createSubject,

    updateSubject,

    deleteSubject,

    changeSubjectStatus,

} from "./subjectThunk";


const initialState = {

    subjects: [],

    selectedSubject: null,

    loading: false,

    actionLoading: false,

    error: null,

    successMessage: null,

};


const subjectSlice = createSlice({

    name: "subject",

    initialState,


    reducers: {

        clearSubjectError: (
            state
        ) => {

            state.error = null;

        },


        clearSubjectMessage: (
            state
        ) => {

            state.successMessage = null;

        },


        clearSelectedSubject: (
            state
        ) => {

            state.selectedSubject = null;

        },


        clearSubjectState: (
            state
        ) => {

            state.error = null;

            state.successMessage = null;

        },

    },


    extraReducers: (
        builder
    ) => {

        builder


            /*
            |--------------------------------------------------------------------------
            | GET ALL SUBJECTS
            |--------------------------------------------------------------------------
            */

            .addCase(
                fetchSubjects.pending,

                (
                    state
                ) => {

                    state.loading = true;

                    state.error = null;

                }
            )


            .addCase(
                fetchSubjects.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.loading = false;


                    /*
                    |--------------------------------------------------------------------------
                    | Supports both:
                    |
                    | return response.data
                    | return { success, data }
                    |--------------------------------------------------------------------------
                    */

                    state.subjects =

                        Array.isArray(
                            action.payload
                        )

                            ? action.payload

                            : (

                                action.payload?.data ||

                                action.payload?.subjects ||

                                []
                            );

                }
            )


            .addCase(
                fetchSubjects.rejected,

                (
                    state,
                    action
                ) => {

                    state.loading = false;

                    state.error =

                        action.payload ||

                        "Failed to fetch subjects.";

                }
            )


            /*
            |--------------------------------------------------------------------------
            | GET SUBJECT BY ID
            |--------------------------------------------------------------------------
            */

            .addCase(
                fetchSubjectById.pending,

                (
                    state
                ) => {

                    state.loading = true;

                    state.error = null;

                }
            )


            .addCase(
                fetchSubjectById.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.loading = false;


                    state.selectedSubject =

                        action.payload?.data ||

                        action.payload?.subject ||

                        action.payload;

                }
            )


            .addCase(
                fetchSubjectById.rejected,

                (
                    state,
                    action
                ) => {

                    state.loading = false;

                    state.error =

                        action.payload ||

                        "Failed to fetch subject.";

                }
            )


            /*
            |--------------------------------------------------------------------------
            | CREATE SUBJECT
            |--------------------------------------------------------------------------
            */

            .addCase(
                createSubject.pending,

                (
                    state
                ) => {

                    state.actionLoading = true;

                    state.error = null;

                    state.successMessage = null;

                }
            )


            .addCase(
                createSubject.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;


                    state.successMessage =

                        action.payload?.message ||

                        action.payload?.data?.message ||

                        "Subject created successfully.";

                }
            )


            .addCase(
                createSubject.rejected,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;

                    state.error =

                        action.payload ||

                        "Failed to create subject.";

                }
            )


            /*
            |--------------------------------------------------------------------------
            | UPDATE SUBJECT
            |--------------------------------------------------------------------------
            */

            .addCase(
                updateSubject.pending,

                (
                    state
                ) => {

                    state.actionLoading = true;

                    state.error = null;

                    state.successMessage = null;

                }
            )


            .addCase(
                updateSubject.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;


                    state.successMessage =

                        action.payload?.message ||

                        action.payload?.data?.message ||

                        "Subject updated successfully.";

                }
            )


            .addCase(
                updateSubject.rejected,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;

                    state.error =

                        action.payload ||

                        "Failed to update subject.";

                }
            )


            /*
            |--------------------------------------------------------------------------
            | DELETE SUBJECT
            |--------------------------------------------------------------------------
            */

            .addCase(
                deleteSubject.pending,

                (
                    state
                ) => {

                    state.actionLoading = true;

                    state.error = null;

                    state.successMessage = null;

                }
            )


            .addCase(
                deleteSubject.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;


                    state.successMessage =

                        action.payload?.message ||

                        "Subject deleted successfully.";


                    state.subjects =

                        state.subjects.filter(

                            (
                                subject
                            ) =>

                                Number(
                                    subject.subject_id
                                )

                                !==

                                Number(
                                    action.payload.id
                                )

                        );


                    if (

                        Number(
                            state.selectedSubject
                                ?.subject_id
                        )

                        ===

                        Number(
                            action.payload.id
                        )

                    ) {

                        state.selectedSubject = null;

                    }

                }
            )


            .addCase(
                deleteSubject.rejected,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;

                    state.error =

                        action.payload ||

                        "Failed to delete subject.";

                }
            )


            /*
            |--------------------------------------------------------------------------
            | CHANGE SUBJECT STATUS
            |--------------------------------------------------------------------------
            */

            .addCase(
                changeSubjectStatus.pending,

                (
                    state
                ) => {

                    state.actionLoading = true;

                    state.error = null;

                    state.successMessage = null;

                }
            )


            .addCase(
                changeSubjectStatus.fulfilled,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;


                    state.successMessage =

                        action.payload?.message ||

                        "Subject status updated successfully.";


                    const subjectIndex =

                        state.subjects.findIndex(

                            (
                                item
                            ) =>

                                Number(
                                    item.subject_id
                                )

                                ===

                                Number(
                                    action.payload.id
                                )

                        );


                    if (

                        subjectIndex !== -1

                    ) {

                        state.subjects[
                            subjectIndex
                        ].is_active =

                            Number(
                                action.payload
                                    .is_active
                            );

                    }


                    if (

                        Number(
                            state.selectedSubject
                                ?.subject_id
                        )

                        ===

                        Number(
                            action.payload.id
                        )

                    ) {

                        state.selectedSubject
                            .is_active =

                            Number(
                                action.payload
                                    .is_active
                            );

                    }

                }
            )


            .addCase(
                changeSubjectStatus.rejected,

                (
                    state,
                    action
                ) => {

                    state.actionLoading = false;

                    state.error =

                        action.payload ||

                        "Failed to update subject status.";

                }
            );

    },

});


export const {

    clearSubjectError,

    clearSubjectMessage,

    clearSelectedSubject,

    clearSubjectState,

} = subjectSlice.actions;


export default subjectSlice.reducer;