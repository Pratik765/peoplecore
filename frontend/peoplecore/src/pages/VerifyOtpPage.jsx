import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AlertMessage from "../components/ui/AlertMessage";
import { KeyRound, ShieldCheck } from "lucide-react";

const reducer = (state, action) => {
  if (action.type === "CHANGE") {
    return { ...state, [action.payload.id]: action.payload.value };
  }
  return state;
};

export function VerifyOtpPage() {
  const [state, dispatch] = useReducer(reducer, { otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorMsg("");
    dispatch({ type: "CHANGE", payload: { id: e.target.id, value: e.target.value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.otp) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await verifyOtp(state);
      setSuccessMsg("OTP verified! Account request submitted for HR approval.");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout linkText="Back to" linkTo="/" linkLabel="Sign In">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Verify Email OTP</h1>
        <p className="text-xs text-slate-400">Enter the verification code sent to your email.</p>
      </div>

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="otp"
          label="Verification Code"
          type="text"
          icon={KeyRound}
          placeholder="123456"
          value={state.otp}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={isLoading} icon={ShieldCheck} className="w-full py-3">
          Verify Code
        </Button>
      </form>
    </AuthLayout>
  );
}

export default VerifyOtpPage;
