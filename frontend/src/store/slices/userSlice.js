import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo") 
    ? JSON.parse(localStorage.getItem("userInfo")) 
    : null,
  loading: false,
  error: null,
};

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    userLoginRequest: (state) => {
      state.loading = true;
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      
    },
  },
});

export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userLogout,
} = userLoginSlice.actions;

export default userLoginSlice.reducer;
