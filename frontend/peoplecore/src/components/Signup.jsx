import React, { useReducer, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  User,
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
  Check,
} from "lucide-react";

const reducer = (reducerState, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...reducerState, [action.payload.id]: action.payload.value };
    }
    default: {
      return reducerState;
    }
  }
};

function Signup() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const initialState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (errorMsg) setErrorMsg("");
    dispatch({
      type: "CHANGE",
      payload: { id, value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!state.name || !state.email || !state.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Account creation failed. Email may already be registered.");
      }

      setSuccessMsg("Account registered successfully! Registration pending administrator approval.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || "Registration request failed.");
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

      {/* Main Signup Container Card */}
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
            Create an Account
          </h1>
          <p
            className={`text-sm mt-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Register your workforce details to request access
          </p>
        </div>

        {/* Card Box */}
        <div
          className={`backdrop-blur-xl border shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6 transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/80 border-slate-800/80 shadow-slate-950/50"
          }`}
        >
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
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Rahul Verma"
                  value={state.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

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
                  placeholder="rahul.verma@company.com"
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
              <label
                htmlFor="password"
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Password
              </label>
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={state.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
