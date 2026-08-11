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
  Zap,
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
      const otpResp = await fetch("http://localhost:5001/verify-otp", {
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
      className={`min-h-screen lg:h-screen w-screen overflow-y-auto lg:overflow-hidden flex transition-colors selection:bg-indigo-500 selection:text-white ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Left Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-12 flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight">PeopleCore</span>
            <span className="block text-[10px] text-indigo-300 font-semibold tracking-wider uppercase">
              Security Verification
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Two-Factor Account Authentication</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Verify your email identity to activate your workforce profile.
          </h2>
        </div>

        <div className="relative z-10 text-xs text-slate-400 border-t border-white/10 pt-4">
          © 2026 PeopleCore Inc. • Microservice Engine Security
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <div className="lg:hidden flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-base">PeopleCore</span>
          </div>
          <div className="ml-auto text-xs">
            <Link
              to="/"
              className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
            >
              Back to Sign In
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto z-10 space-y-5 my-auto">
          <div className="text-center space-y-1">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-500 mx-auto flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              Verify Code
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              Enter the 6-digit security OTP sent to your registered email
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="otp"
                className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}
              >
                Verification OTP
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={state.otp}
                onChange={handleChange}
                className={`w-full text-center tracking-[0.5em] font-mono text-lg py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  isLight ? "bg-white border-slate-200 text-slate-900" : "bg-slate-900 border-slate-800 text-slate-100"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Verify Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className={`text-center text-[11px] z-10 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
          Secured by PeopleCore Microservices Engine • Version 1.0
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
