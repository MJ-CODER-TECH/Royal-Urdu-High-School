import { createSlice } from "@reduxjs/toolkit";


import {

    fetchAcademicYears,

    getAcademicYears,

    getAcademicYearById,

    createAcademicYear,

    updateAcademicYear,

    deleteAcademicYear,

    changeAcademicYearStatus,

} from "./AcademicYearThunk";



const initialState = {


    // Dropdown ke liye

    academicYears: [],



    // Management table ke liye

    academicYearList: [],



    selectedAcademicYear: null,



    loading: false,



    submitting: false,



    error: null,


};




const academicYearSlice = createSlice({

    name: "academicYear",


    initialState,



    reducers: {


        clearSelectedAcademicYear: (state) => {

            state.selectedAcademicYear = null;

        },


    },



    extraReducers: (builder) => {


        builder




        /*
        |--------------------------------------------------------------------------
        | Dropdown
        |--------------------------------------------------------------------------
        */


        .addCase(
            fetchAcademicYears.pending,
            (state)=>{

                state.loading = true;

            }
        )


        .addCase(
            fetchAcademicYears.fulfilled,
            (state,action)=>{

                state.loading = false;

                state.academicYears =
                    action.payload || [];

            }
        )


        .addCase(
            fetchAcademicYears.rejected,
            (state,action)=>{

                state.loading = false;

                state.error =
                    action.payload;

            }
        )





        /*
        |--------------------------------------------------------------------------
        | Management List
        |--------------------------------------------------------------------------
        */


        .addCase(
            getAcademicYears.pending,
            (state)=>{

                state.loading = true;

            }
        )


        .addCase(
            getAcademicYears.fulfilled,
            (state,action)=>{

                state.loading = false;

                state.academicYearList =
                    action.payload || [];

            }
        )


        .addCase(
            getAcademicYears.rejected,
            (state,action)=>{

                state.loading = false;

                state.error =
                    action.payload;

            }
        )






        /*
        |--------------------------------------------------------------------------
        | Get By ID
        |--------------------------------------------------------------------------
        */


        .addCase(
            getAcademicYearById.fulfilled,
            (state,action)=>{

                state.selectedAcademicYear =
                    action.payload;

            }
        )







        /*
        |--------------------------------------------------------------------------
        | Create
        |--------------------------------------------------------------------------
        */


        .addCase(
            createAcademicYear.pending,
            (state)=>{

                state.submitting = true;

            }
        )


        .addCase(
            createAcademicYear.fulfilled,
            (state)=>{

                state.submitting = false;

            }
        )


        .addCase(
            createAcademicYear.rejected,
            (state,action)=>{

                state.submitting = false;

                state.error =
                    action.payload;

            }
        )







        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */


        .addCase(
            updateAcademicYear.pending,
            (state)=>{

                state.submitting = true;

            }
        )


        .addCase(
            updateAcademicYear.fulfilled,
            (state)=>{

                state.submitting = false;

            }
        )


        .addCase(
            updateAcademicYear.rejected,
            (state,action)=>{

                state.submitting = false;

                state.error =
                    action.payload;

            }
        )








        /*
        |--------------------------------------------------------------------------
        | Delete
        |--------------------------------------------------------------------------
        */


        .addCase(
            deleteAcademicYear.fulfilled,
            (state,action)=>{


                state.academicYearList =

                    state.academicYearList.filter(

                        item =>

                        item.academic_year_id !== action.payload

                    );


            }
        )







        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */


        .addCase(
            changeAcademicYearStatus.fulfilled,
            (state,action)=>{


                const item =

                    state.academicYearList.find(

                        x =>

                        x.academic_year_id === action.payload.id

                    );



                if(item){

                    item.is_active =

                        action.payload.is_active;

                }


            }
        );



    },


});




export const {

    clearSelectedAcademicYear,

} = academicYearSlice.actions;



export default academicYearSlice.reducer;