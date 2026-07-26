import { createSlice } from "@reduxjs/toolkit";

import {
    getTimetables,
    getTimetableById,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    changeTimetableStatus,
    fetchClasses,
    fetchSections,
    fetchSubjects,
    fetchTeachers,
    getClassTimetable,
    getTeacherTimetable
} from "./timetableThunk";


const initialState = {

    timetables: [],
    selectedTimetable: null,

    classes: [],
    sections: [],
    subjects: [],
    teachers: [],
    classTimetable: [],
    teacherTimetable: [],

    loading: false,
    submitting: false,
    error: null,
};


const timetableSlice = createSlice({

    name: "timetable",

    initialState,


    reducers: {

        clearSelectedTimetable: (state) => {
            state.selectedTimetable = null;
        },

    },


    extraReducers: (builder) => {


        /*
        |--------------------------------------------------------------------------
        | GET ALL TIMETABLES
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(getTimetables.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(getTimetables.fulfilled, (state, action) => {

                state.loading = false;

                state.timetables = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })

            .addCase(getTimetables.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });



        /*
        |--------------------------------------------------------------------------
        | GET TIMETABLE BY ID
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getTimetableById.pending, (state) => {

                state.loading = true;

            })


            .addCase(getTimetableById.fulfilled, (state, action) => {

                state.loading = false;

                state.selectedTimetable = action.payload.data || action.payload;

            })


            .addCase(getTimetableById.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });



        /*
        |--------------------------------------------------------------------------
        | DROPDOWNS
        |--------------------------------------------------------------------------
        */


        builder

            .addCase(fetchClasses.fulfilled, (state, action) => {

                state.classes = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })


            .addCase(fetchSections.fulfilled, (state, action) => {

                state.sections = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })


            .addCase(fetchSubjects.fulfilled, (state, action) => {

                state.subjects = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })


            .addCase(fetchTeachers.fulfilled, (state, action) => {

                state.teachers = Array.isArray(action.payload)
                    ? action.payload
                    : [];

            });



        /*
        |--------------------------------------------------------------------------
        | CREATE TIMETABLE
        |--------------------------------------------------------------------------
        */


        builder

            .addCase(createTimetable.pending, (state) => {

                state.submitting = true;

            })


            .addCase(createTimetable.fulfilled, (state, action) => {

                state.submitting = false;

                const data = action.payload.data || action.payload;

                state.timetables.unshift(data);

            })


            .addCase(createTimetable.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });



        /*
        |--------------------------------------------------------------------------
        | UPDATE TIMETABLE
        |--------------------------------------------------------------------------
        */


        builder

            .addCase(updateTimetable.pending, (state) => {

                state.submitting = true;

            })


            .addCase(updateTimetable.fulfilled, (state, action) => {

                state.submitting = false;


                const data = action.payload.data || action.payload;


                const index = state.timetables.findIndex(
                    (item) =>
                        item.timetable_id === data.timetable_id
                );


                if(index !== -1){

                    state.timetables[index] = data;

                }


            })


            .addCase(updateTimetable.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });



        /*
        |--------------------------------------------------------------------------
        | DELETE TIMETABLE
        |--------------------------------------------------------------------------
        */


        builder

            .addCase(deleteTimetable.pending, (state) => {

                state.submitting = true;

            })


            .addCase(deleteTimetable.fulfilled, (state, action) => {

                state.submitting = false;


                state.timetables =
                    state.timetables.filter(
                        (item) =>
                            item.timetable_id !== action.payload
                    );


            })


            .addCase(deleteTimetable.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            });



        /*
        |--------------------------------------------------------------------------
        | CHANGE STATUS
        |--------------------------------------------------------------------------
        */


        builder

            .addCase(changeTimetableStatus.pending, (state) => {

                state.submitting = true;

            })


            .addCase(changeTimetableStatus.fulfilled, (state, action) => {

                state.submitting = false;


                const timetable = state.timetables.find(
                    (item) =>
                        item.timetable_id === action.payload.id
                );


                if(timetable){

                    timetable.status = action.payload.status;

                }


            })


            .addCase(changeTimetableStatus.rejected, (state, action) => {

                state.submitting = false;

                state.error = action.payload;

            })



           /*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/


builder

.addCase(
    getClassTimetable.pending,
    (state)=>{

        state.loading=true;

    }
)


.addCase(
    getClassTimetable.fulfilled,
    (state,action)=>{

        state.loading=false;


        state.classTimetable =
            action.payload.data || [];

    }
)


.addCase(
    getClassTimetable.rejected,
    (state,action)=>{

        state.loading=false;

        state.error=action.payload;

    }
)

.addCase(
    getTeacherTimetable.fulfilled,
    (state, action)=>{

        state.teacherTimetable =
            action.payload.data || [];

    }
);



    },

});


export const {
    clearSelectedTimetable,
} = timetableSlice.actions;


export default timetableSlice.reducer;