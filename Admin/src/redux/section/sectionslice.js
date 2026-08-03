import { createSlice } from "@reduxjs/toolkit";

import {
    fetchSections,
    fetchSectionsByClass,
    getSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection,
    changeSectionStatus,
} from "./sectionThunk";


const initialState = {

    // Dropdown sections
    sections: [],

    // Management list
    sectionList: [],

    selectedSection: null,

    loading: false,

    submitting: false,

    error: null,

};



const sectionSlice = createSlice({

    name: "section",

    initialState,


    reducers: {

        clearSelectedSection:(state)=>{

            state.selectedSection = null;

        },


        clearSections:(state)=>{

            state.sections = [];

        }

    },


    extraReducers:(builder)=>{


        builder


        /*
        |--------------------------------------------------------------------------
        | Dropdown All Sections
        |--------------------------------------------------------------------------
        */

        .addCase(fetchSections.pending,(state)=>{

            state.loading = true;

        })


        .addCase(fetchSections.fulfilled,(state,action)=>{

            state.loading = false;

            state.sections =
                action.payload || [];

        })


        .addCase(fetchSections.rejected,(state,action)=>{

            state.loading = false;

            state.error =
                action.payload;

        })



        /*
        |--------------------------------------------------------------------------
        | Dropdown Sections By Class
        |--------------------------------------------------------------------------
        */

        .addCase(
            fetchSectionsByClass.pending,
            (state)=>{

                state.loading = true;

            }
        )


        .addCase(
            fetchSectionsByClass.fulfilled,
            (state,action)=>{

                state.loading = false;

                state.sections =
                    action.payload || [];

            }
        )


        .addCase(
            fetchSectionsByClass.rejected,
            (state,action)=>{

                state.loading = false;

                state.sections = [];

                state.error =
                    action.payload;

            }
        )



        /*
        |--------------------------------------------------------------------------
        | Section Management List
        |--------------------------------------------------------------------------
        */

        .addCase(getSections.pending,(state)=>{

            state.loading = true;

        })


        .addCase(getSections.fulfilled,(state,action)=>{

            state.loading = false;

            state.sectionList =
                action.payload || [];

        })


        .addCase(getSections.rejected,(state,action)=>{

            state.loading = false;

            state.error =
                action.payload;

        })



        /*
        |--------------------------------------------------------------------------
        | Get Section By Id
        |--------------------------------------------------------------------------
        */

        .addCase(
            getSectionById.fulfilled,
            (state,action)=>{

                state.selectedSection =
                    action.payload;

            }
        )



        /*
        |--------------------------------------------------------------------------
        | Create
        |--------------------------------------------------------------------------
        */

        .addCase(createSection.pending,(state)=>{

            state.submitting = true;

        })


        .addCase(createSection.fulfilled,(state)=>{

            state.submitting = false;

        })


        .addCase(createSection.rejected,(state,action)=>{

            state.submitting = false;

            state.error =
                action.payload;

        })



        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        .addCase(updateSection.pending,(state)=>{

            state.submitting = true;

        })


        .addCase(updateSection.fulfilled,(state)=>{

            state.submitting = false;

        })


        .addCase(updateSection.rejected,(state,action)=>{

            state.submitting = false;

            state.error =
                action.payload;

        })



        /*
        |--------------------------------------------------------------------------
        | Delete
        |--------------------------------------------------------------------------
        */

        .addCase(deleteSection.fulfilled,(state,action)=>{

            state.sectionList =
                state.sectionList.filter(
                    item =>
                    item.section_id !== action.payload
                );

        })



        /*
        |--------------------------------------------------------------------------
        | Status Update
        |--------------------------------------------------------------------------
        */

        .addCase(
            changeSectionStatus.fulfilled,
            (state,action)=>{


                const item =
                    state.sectionList.find(
                        x =>
                        x.section_id === action.payload.id
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
    clearSelectedSection,
    clearSections,
} = sectionSlice.actions;


export default sectionSlice.reducer;