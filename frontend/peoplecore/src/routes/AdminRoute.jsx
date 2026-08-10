import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = useSelector((store) => store.user.user);

  //  Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // User loaded but NOT admin or HR → BLOCK
  const allowedRoles = ["ADMIN", "HR"];
  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  //  Admin OR user not loaded yet
  return <Outlet />;
}

export default AdminRoute;
