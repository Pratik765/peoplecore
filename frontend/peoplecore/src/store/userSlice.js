import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    loadUser: (state, action) => {
      return (state = action.payload);
    },
    unLoadUser: () => {
      return (state = []);
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice;
