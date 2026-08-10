import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./themeSlice";
import notificationSlice from "./notificationSlice";

const peopleCoreStore = configureStore({
  reducer: {
    user: userSlice.reducer,
    theme: themeSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export default peopleCoreStore;
