import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { userAction } from "./store/userSlice";
import { fetchMyProfile } from "./api/userApi";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const location = useLocation();

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
        if (!decoded || !decoded.userId) {
          throw new Error("Invalid token format");
        }

        // Fetch full dynamic profile details from user-service
        fetchMyProfile()
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
        dispatch(userAction.logout());
      }
    }
  }, [dispatch]);

  const isAuthPage = ["/", "/signup", "/verify-otp"].includes(location.pathname);
  const isLoggedIn = !!user?.token;
  const showNavAndSidebar = isLoggedIn && !isAuthPage;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-slate-50 text-slate-900"
          : "bg-slate-950 text-slate-100"
      } selection:bg-indigo-500 selection:text-white`}
    >
      {showNavAndSidebar && <Sidebar />}
      <div className={showNavAndSidebar ? "lg:pl-64 transition-all duration-300 flex flex-col min-h-screen" : ""}>
        {showNavAndSidebar && <Navbar />}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
