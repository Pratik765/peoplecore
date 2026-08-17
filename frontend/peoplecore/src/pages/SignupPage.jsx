import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AlertMessage from "../components/ui/AlertMessage";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

const reducer = (state, action) => {
  if (action.type === "CHANGE") {
    return { ...state, [action.payload.id]: action.payload.value };
  }
  return state;
};

export function SignupPage() {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
    if (!state.name || !state.email || !state.password || !state.confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (state.password !== state.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await registerUser(state);
      setSuccessMsg("Registration initiated! OTP code sent to email.");
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit signup request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout linkText="Already registered?" linkTo="/" linkLabel="Sign In">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Request Account Access</h1>
        <p className="text-xs text-slate-400">Fill in your details for HR administrator approval.</p>
      </div>

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          icon={User}
          placeholder="e.g. Rahul Sharma"
          value={state.name}
          onChange={handleChange}
          required
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="name@company.com"
          value={state.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            icon={Lock}
            placeholder="••••••••"
            value={state.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-7 right-3 text-slate-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          icon={Lock}
          placeholder="••••••••"
          value={state.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={isLoading} icon={UserPlus} className="w-full py-3">
          Submit Request
        </Button>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;
