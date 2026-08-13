import { useSelector } from "react-redux";

export const useAuth = () => {
  const reduxUser = useSelector((store) => store.user);
  const user = reduxUser?.user || null;
  const token = reduxUser?.token || localStorage.getItem("token") || "";
  const role = user?.role || "EMPLOYEE";

  return {
    user,
    token,
    role,
    userId: user?._id || user?.id || "",
    userName: user?.name || "User",
    userEmail: user?.email || "",
    isLoggedIn: !!token,
    isAdmin: role === "ADMIN",
    isHR: role === "ADMIN" || role === "HR",
  };
};

export default useAuth;
