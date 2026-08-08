import React, { useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../store/userSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Briefcase,
  Shield,
  UserCheck,
} from "lucide-react";

const reducer = (currentState, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...currentState, [action.payload.id]: action.payload.value };
    }
    case "SET_FORM": {
      return { ...currentState, ...action.payload };
    }
    default: {
      return currentState;
    }
  }
};

function Login() {
  const theme = useSelector((store) => store.theme) || "light";
  const isLight = theme === "light";

  const initialState = {
    email: "",
    password: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (errorMsg) setErrorMsg("");
    dispatch({
      type: "CHANGE",
      payload: { id, value },
    });
  };

  const handleQuickFill = (email, password) => {
    dispatch({
      type: "SET_FORM",
      payload: { email, password },
    });
    setErrorMsg("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!state.email || !state.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Invalid credentials. Please try again.");
      }

      setSuccessMsg("Signed in successfully! Redirecting...");
      localStorage.setItem("token", `Bearer ${res.token}`);
      reduxDispatch(userAction.login(res));

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || "Unable to connect to auth server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors selection:bg-indigo-500 selection:text-white ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Main Sign In Card */}
      <div className="w-full max-w-md z-10">
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 group transition-transform duration-300 hover:scale-105">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-2 backdrop-blur-md border ${
              isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-900/90 border-slate-800 text-indigo-400"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>PeopleCore HR Management</span>
          </div>
          <h1
            className={`text-2xl font-bold tracking-tight sm:text-3xl ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Welcome back
          </h1>
          <p
            className={`text-sm mt-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Sign In to access your workspace
          </p>
        </div>

        {/* Card Box */}
        <div
          className={`backdrop-blur-xl border shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50 text-slate-900"
              : "bg-slate-900/80 border-slate-800/80 shadow-slate-950/50 text-slate-100"
          }`}
        >
          {/* Quick Auto-fill Shortcuts */}
          <div
            className={`rounded-xl p-3 border ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-950/60 border-slate-800/60"
            }`}
          >
            <div
              className={`text-xs font-medium mb-2 flex items-center justify-between ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <span>Quick Sign In Auto-fill:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickFill("aditya.sharma@peoplecore.in", "aditya123")
                }
                className={`text-[11px] py-1.5 px-2 border rounded-lg transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                    : "bg-slate-800/80 border-slate-700/50 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/50 hover:text-indigo-300"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold truncate">Aditya (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickFill("priya.patel@peoplecore.in", "priya123")
                }
                className={`text-[11px] py-1.5 px-2 border rounded-lg transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                    : "bg-slate-800/80 border-slate-700/50 text-slate-300 hover:bg-amber-600/20 hover:border-amber-500/50 hover:text-amber-300"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold truncate">Priya (HR)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickFill("rahul.verma@peoplecore.in", "rahul123")
                }
                className={`text-[11px] py-1.5 px-2 border rounded-lg transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-white border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                    : "bg-slate-800/80 border-slate-700/50 text-slate-300 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-300"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold truncate">Rahul (Emp)</span>
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-4 py-3 rounded-xl text-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@company.com"
                  value={state.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Password reset to be configured.");
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  placeholder="••••••••"
                  value={state.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            className={`pt-2 text-center text-xs border-t ${
              isLight
                ? "border-slate-200 text-slate-600"
                : "border-slate-800/60 text-slate-400"
            }`}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
