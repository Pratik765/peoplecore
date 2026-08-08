import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./themeSlice";

const peopleCoreStore = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme: themeSlice.reducer,
  },
});

export default peopleCoreStore;
