import React, { useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  KeyRound,
  Users,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const reducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": {
      return { ...state, [action.payload.id]: action.payload.value };
    }
    default: {
      return state;
    }
  }
};

function VerifyOtp() {
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const initialState = {
    otp: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const register = useSelector((store) => store.register);
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

    if (!state.otp) {
      setErrorMsg("Please enter the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const obj = { email: register?.email || "user@example.com", otp: state.otp };
      const otpResp = await fetch("http://localhost:8080/api4/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      if (otpResp.ok) {
        setSuccessMsg("OTP verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        throw new Error("Invalid or expired verification code.");
      }
    } catch (err) {
      setErrorMsg(err.message || "OTP verification failed.");
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

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 group transition-transform duration-300 hover:scale-105">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-2 backdrop-blur-md border ${
              isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-slate-900/90 border-slate-800 text-indigo-400"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Two-Factor Authentication</span>
          </div>
          <h1
            className={`text-2xl font-bold tracking-tight sm:text-3xl ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Verify Security Code
          </h1>
          <p
            className={`text-sm mt-1 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Enter the verification code sent to your registered email
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="otp"
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Verification OTP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="otp"
                  required
                  placeholder="Enter 6-digit code"
                  value={state.otp}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono tracking-wider ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      : "bg-slate-950/80 border-slate-800 text-slate-100 placeholder-slate-500"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Security Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div
            className={`pt-2 text-center text-xs border-t ${
              isLight
                ? "border-slate-200 text-slate-600"
                : "border-slate-800/60 text-slate-400"
            }`}
          >
            Back to{" "}
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

export default VerifyOtp;
