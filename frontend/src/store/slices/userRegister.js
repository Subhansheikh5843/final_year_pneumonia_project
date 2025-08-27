import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userRegisterInfo:null,
  loading: false,
  error: null,
};

const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState,
  reducers: {
    userRegisterRequest: (state) => {
      state.loading = true;
    },
    userRegisterSuccess: (state, action) => {
      state.loading = false;
      state.userRegisterInfo = action.payload;
    },
    userRegisterFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

export const {
  userRegisterRequest,
  userRegisterSuccess,
  userRegisterFail,

} = userRegisterSlice.actions;

export default userRegisterSlice.reducer;
