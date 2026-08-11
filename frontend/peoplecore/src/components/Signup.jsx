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
  Zap,
  Clock,
  ShieldCheck,
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
  const theme = useSelector((store) => store.theme) || "light";
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
      className={`min-h-screen lg:h-screen w-screen overflow-y-auto lg:overflow-hidden flex transition-colors selection:bg-indigo-500 selection:text-white ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Left Column: Hero Visual Section */}
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
              Workforce Registration
            </span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Your Corporate Workforce Workspace</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Register your profile to collaborate seamlessly across teams.
          </h2>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div className="font-bold text-sm">Role-Based Security</div>
              <div className="text-xs text-slate-400">Admin-approved account security</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1">
              <Zap className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-sm">Instant Access</div>
              <div className="text-xs text-slate-400">Leaves, Attendance & Notifications</div>
            </div>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>© 2026 PeopleCore Inc.</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Microservices Active
          </span>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
        {/* Background Orbs */}
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
            <span className={isLight ? "text-slate-600" : "text-slate-400"}>Already have an account? </span>
            <Link
              to="/"
              className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Center Form */}
        <div className="w-full max-w-md mx-auto z-10 space-y-4 my-auto">
          <div className="text-center space-y-1">
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Create Account
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Submit your employee details for corporate workspace onboarding
            </p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={state.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
              >
                Corporate Email Address
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
                  className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Password
                </label>
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
                    className={`w-full pl-10 pr-8 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={state.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

export default Signup;
