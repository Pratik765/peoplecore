import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { path: "/", element: <Login /> },
      { path: "/signup", element: <Signup /> },

      // Protected routes (login required)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/home", element: <Home /> },

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
  </Provider>
);
