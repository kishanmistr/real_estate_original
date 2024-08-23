import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({

    name : "user",
    initialState : {

        currentUser : null,
        error : null,
        loading : false

    },
    reducers : {

        signInStart : (state) => {

            state.loading = true

        },

        signinSuccess : (state,action) => {

            state.currentUser = action.payload ;
            state.error = null ;
            state.loading = false ;

        },

        signinFailure : (state,action) => {

            state.error = action.payload
            state.loading = false

        },

        clearError : (state) => {

            state.error = null

        },

        updateUserStart : (state) => {

            state.loading = true

        },

        updateUserSuccess : (state,action) => {

            state.currentUser =  action.payload
            state.error  = null
            state.loading = false

        },

        updateUserFailure : (state,action) => {

            state.error = action.payload
            state.loading = false

        },

        deleteUserStart : (state) => {

            state.loading = true

        },

        deleteUserSuccess : (state) => {

            state.currentUser = null
            state.error = null
            state.loading = false

        },

        deleteUserFailure : (state,action) => {

            state.error = action.payload
            state.loading = false

        },

        signOutUserStart : (state) => {

            state.loading = true

        },

        signOutUserSuccess : (state) => {

            state.currentUser = null
            state.error = null
            state.loading = false

        },

        signOutUserFailure : (state,action) => {

            state.error = action.payload
            state.loading = false

        }

    }

})


export  default userSlice.reducer

export const { signInStart, signinSuccess, signinFailure,clearError , updateUserStart, updateUserSuccess , updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure , signOutUserStart, signOutUserSuccess, signOutUserFailure  } = userSlice.actions
