import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const peopleCoreStore = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
export default peopleCoreStore;
