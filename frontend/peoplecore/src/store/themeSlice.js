import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    return savedTheme;
  }
  return "dark"; // Default theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialTheme(),
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      return nextTheme;
    },
    setTheme: (state, action) => {
      const newTheme = action.payload;
      localStorage.setItem("theme", newTheme);
      return newTheme;
    },
  },
});

export const themeAction = themeSlice.actions;
export default themeSlice;
