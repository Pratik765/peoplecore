import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { userAction } from "./store/userSlice";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token.replace("Bearer ", ""));

        dispatch(
          userAction.login({
            token,
            user: {
              _id: decoded.userId,
              role: decoded.role,
            },
          })
        );
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />;
    </>
  );
}

export default App;
