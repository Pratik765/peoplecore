import { useSelector, useDispatch } from "react-redux";
import { themeAction } from "../store/themeSlice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const toggleTheme = () => {
    dispatch(themeAction.toggleTheme());
  };

  return {
    theme,
    isLight,
    toggleTheme,
  };
};

export default useTheme;
