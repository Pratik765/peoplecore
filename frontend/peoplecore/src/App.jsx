import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { userAction } from "./store/userSlice";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";

  // Sync document root class for Tailwind CSS & theme tokens
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token.replace("Bearer ", ""));

        // Fetch full dynamic profile details from user-service
        fetch("http://localhost:5004/user/me", {
          headers: { Authorization: token },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              dispatch(
                userAction.login({
                  token,
                  user: {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                  },
                })
              );
            } else {
              dispatch(
                userAction.login({
                  token,
                  user: {
                    _id: decoded.userId,
                    role: decoded.role,
                  },
                })
              );
            }
          })
          .catch(() => {
            dispatch(
              userAction.login({
                token,
                user: {
                  _id: decoded.userId,
                  role: decoded.role,
                },
              })
            );
          });
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  const isLoggedIn = !!user?.token;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-slate-50 text-slate-900"
          : "bg-slate-950 text-slate-100"
      } selection:bg-indigo-500 selection:text-white`}
    >
      {isLoggedIn && <Sidebar />}
      <div className={isLoggedIn ? "lg:pl-64 transition-all duration-300" : ""}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
