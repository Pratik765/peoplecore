import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import { Provider } from "react-redux";
import peopleCoreStore from "./store/peopleCoreStore.js";
import Home from "./components/Home.jsx";
import Users from "./components/Users.jsx";
import PendingRequest from "./components/PendingRequest.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Profile from "./components/Profile.jsx";
import VerifyOtp from "./components/VerifyOtp.jsx";
import MyLeaves from "./components/MyLeaves.jsx";
import Attendance from "./components/Attendance.jsx";
import Payroll from "./components/Payroll.jsx";
import Notifications from "./components/Notifications.jsx";
import Announcements from "./components/Announcements.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { path: "/", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/verify-otp", element: <VerifyOtp /> },

      // Protected routes (login required)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/profile", element: <Profile /> },
          { path: "/attendance", element: <Attendance /> },
          { path: "/payroll", element: <Payroll /> },
          { path: "/my-leaves", element: <MyLeaves /> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/announcements", element: <Announcements /> },

          // Admin-only routes
          {
            element: <AdminRoute />,
            children: [
              { path: "/users", element: <Users /> },
              {
                path: "/pending-request",
                element: <PendingRequest />,
              },
            ],
          },
        ],
      },

      // Unauthorized page
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={peopleCoreStore}>
    <RouterProvider router={router} />
  </Provider>,
);
