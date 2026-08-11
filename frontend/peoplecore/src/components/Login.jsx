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
  Check,
  Zap,
  Building2,
  Clock,
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
      className={`min-h-screen lg:h-screen w-screen overflow-y-auto lg:overflow-hidden flex transition-colors selection:bg-indigo-500 selection:text-white ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Left Column: Visual Hero Section (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/20 blur-[110px] rounded-full pointer-events-none" />

        {/* Brand Logo Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">PeopleCore</span>
            <span className="block text-[10px] text-indigo-300 font-semibold tracking-wider uppercase">
              HR Microservice Engine
            </span>
          </div>
        </div>

        {/* Center Pitch & Features */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Enterprise Workforce Management</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Streamline your workforce, attendance & leaves in one place.
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div className="font-bold text-sm">Real-Time Attendance</div>
              <div className="text-xs text-slate-400">Automated check-ins & hours calculation</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-sm">Instant Leave Approvals</div>
              <div className="text-xs text-slate-400">One-click workflow for HR managers</div>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>© 2026 PeopleCore Inc.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            6 Microservices Active
          </span>
        </div>
      </div>

      {/* Right Column: Sign In Form Container */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
        {/* Background Orbs for right side */}
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between z-10">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-base">PeopleCore</span>
          </div>
          <div className="ml-auto text-xs">
            <span className={isLight ? "text-slate-600" : "text-slate-400"}>New to PeopleCore? </span>
            <Link
              to="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
            >
              Request Access
            </Link>
          </div>
        </div>

        {/* Center Form Card */}
        <div className="w-full max-w-md mx-auto z-10 space-y-5 my-auto">
          {/* Header Title */}
          <div className="text-center space-y-1">
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Sign In to PeopleCore
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Enter your corporate credentials to access your dashboard
            </p>
          </div>

          {/* Quick Auto-fill Shortcuts */}
          <div
            className={`rounded-2xl p-3 border ${
              isLight ? "bg-white border-slate-200/80 shadow-sm" : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <div className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Quick Auto-Fill Sign In:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("aditya.sharma@peoplecore.in", "aditya123")}
                className={`py-1.5 px-2 border rounded-xl transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/50 hover:text-indigo-300"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-semibold truncate">Aditya (Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("priya.patel@peoplecore.in", "priya123")}
                className={`py-1.5 px-2 border rounded-xl transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-amber-600/20 hover:border-amber-500/50 hover:text-amber-300"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-semibold truncate">Priya (HR)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("rahul.verma@peoplecore.in", "rahul123")}
                className={`py-1.5 px-2 border rounded-xl transition-all text-center flex flex-col items-center gap-1 group ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700"
                    : "bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-300"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-semibold truncate">Rahul (Emp)</span>
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-950/50 border border-red-800/60 text-red-300 px-3.5 py-2.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2.5 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-3.5 py-2.5 rounded-xl text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={state.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Password
                </label>
                <span className="text-[11px] text-indigo-500 hover:text-indigo-600 cursor-pointer font-medium">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={state.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className={`text-center text-[11px] z-10 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
          Secured by PeopleCore Microservices Engine • Version 1.0
        </div>
      </div>
    </div>
  );
}

export default Login;
