import { StrictMode } from "react";
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/pending-request",
        element: <PendingRequest />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={peopleCoreStore}>
    <RouterProvider router={router} />
  </Provider>
);
