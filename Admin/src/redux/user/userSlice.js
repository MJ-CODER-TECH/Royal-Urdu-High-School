import { createSlice } from "@reduxjs/toolkit";

import {

    getRoles,

    getUsers,

    getUserById,

    createUser,

    updateUser,

    deleteUser,

    changeStatus,

    resetPassword,

} from "./userThunk";

const initialState = {

    users: [],

    roles: [],

    selectedUser: null,

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

const userSlice = createSlice({

    name: "user",

    initialState,

    reducers: {

        clearSelectedUser: (state) => {

            state.selectedUser = null;

        },

    },

    extraReducers: (builder) => {

        builder

        /*
        |--------------------------------------------------------------------------
        | GET ROLES
        |--------------------------------------------------------------------------
        */

        .addCase(getRoles.pending, (state) => {

            state.loading = true;

        })

        .addCase(getRoles.fulfilled, (state, action) => {

            state.loading = false;

            state.roles = action.payload;

        })

        .addCase(getRoles.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | GET USERS
        |--------------------------------------------------------------------------
        */

        .addCase(getUsers.pending, (state) => {

            state.loading = true;

        })

.addCase(getUsers.fulfilled, (state, action) => {
    state.loading = false;
    state.users = action.payload;   // ab yeh already sirf array hai, direct set karo
})
        .addCase(getUsers.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | GET USER BY ID
        |--------------------------------------------------------------------------
        */

        .addCase(getUserById.pending, (state) => {

            state.loading = true;

        })

        .addCase(getUserById.fulfilled, (state, action) => {

            state.loading = false;

            state.selectedUser = action.payload;

        })

        .addCase(getUserById.rejected, (state, action) => {

            state.loading = false;

            state.error = action.payload;

        })

                /*
        |--------------------------------------------------------------------------
        | CREATE USER
        |--------------------------------------------------------------------------
        */

        .addCase(createUser.pending, (state) => {

            state.submitting = true;

        })

        .addCase(createUser.fulfilled, (state) => {

            state.submitting = false;

        })

        .addCase(createUser.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | UPDATE USER
        |--------------------------------------------------------------------------
        */

        .addCase(updateUser.pending, (state) => {

            state.submitting = true;

        })

        .addCase(updateUser.fulfilled, (state) => {

            state.submitting = false;

        })

        .addCase(updateUser.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | DELETE USER
        |--------------------------------------------------------------------------
        */

        .addCase(deleteUser.pending, (state) => {

            state.submitting = true;

        })

        .addCase(deleteUser.fulfilled, (state) => {

            state.submitting = false;

        })

        .addCase(deleteUser.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | CHANGE STATUS
        |--------------------------------------------------------------------------
        */

        .addCase(changeStatus.pending, (state) => {

            state.submitting = true;

        })

        .addCase(changeStatus.fulfilled, (state) => {

            state.submitting = false;

        })

        .addCase(changeStatus.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        })

        /*
        |--------------------------------------------------------------------------
        | RESET PASSWORD
        |--------------------------------------------------------------------------
        */

        .addCase(resetPassword.pending, (state) => {

            state.submitting = true;

        })

        .addCase(resetPassword.fulfilled, (state) => {

            state.submitting = false;

        })

        .addCase(resetPassword.rejected, (state, action) => {

            state.submitting = false;

            state.error = action.payload;

        });

    },

});

export const {

    clearSelectedUser,

} = userSlice.actions;

export default userSlice.reducer;


