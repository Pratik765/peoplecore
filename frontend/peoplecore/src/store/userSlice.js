import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: (state, action) => {
      return {};
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice;
