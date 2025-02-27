import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    user: {},
    users: {},
    error: "", // for error message
    loading: false,
    isUserLogout: false,
    errorMsg: false, // for error
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        apiError(state, action) {
            state.error = action.payload.data;
            state.loading = true;
            state.isUserLogout = false;
            state.errorMsg = true;
        },
        loginSuccess(state, action) {
            state.user = action.payload
            state.loading = false;
            state.errorMsg = false;
        },
        registerSuccess(state, action) {
            state.users = action.payload
            state.loading = false;
            state.errorMsg = false;
        },
        reset_login_flag(state) {
            state.error = null
            state.loading = false;
            state.errorMsg = false;
        }
    },
});

export const {
    apiError,
    loginSuccess,
    registerSuccess,
    reset_login_flag
} = loginSlice.actions

export default loginSlice.reducer;