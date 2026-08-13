import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import peopleCoreStore from "./store/peopleCoreStore.js";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

// Page level orchestrators from pages/ directory
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import PendingRequestPage from "./pages/PendingRequestPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LeavesPage from "./pages/LeavesPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import AnnouncementsPage from "./pages/AnnouncementsPage.jsx";
import SubscriptionPage from "./pages/SubscriptionPage.jsx";
import Unauthorized from "./components/Unauthorized.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { path: "/", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/verify-otp", element: <VerifyOtpPage /> },

      // Protected routes (login required)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/attendance", element: <AttendancePage /> },
          { path: "/payroll", element: <PayrollPage /> },
          { path: "/my-leaves", element: <LeavesPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/announcements", element: <AnnouncementsPage /> },

          // Admin-only routes
          {
            element: <AdminRoute />,
            children: [
              { path: "/users", element: <UsersPage /> },
              { path: "/pending-request", element: <PendingRequestPage /> },
              { path: "/subscription", element: <SubscriptionPage /> },
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
