import React, { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAction } from "../store/userSlice";
import { loginUser } from "../api/authApi";
import AuthLayout from "../components/auth/AuthLayout";
import QuickFillButtons from "../components/auth/QuickFillButtons";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AlertMessage from "../components/ui/AlertMessage";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const reducer = (state, action) => {
  if (action.type === "CHANGE") {
    return { ...state, [action.payload.id]: action.payload.value };
  }
  if (action.type === "SET_FORM") {
    return { ...state, ...action.payload };
  }
  return state;
};

export function LoginPage() {
  const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const reduxDispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrorMsg("");
    dispatch({ type: "CHANGE", payload: { id: e.target.id, value: e.target.value } });
  };

  const handleQuickFill = (email, password) => {
    dispatch({ type: "SET_FORM", payload: { email, password } });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.email || !state.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await loginUser(state);
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
    <AuthLayout linkText="New to PeopleCore?" linkTo="/signup" linkLabel="Request Access">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Sign in to your portal</h1>
        <p className="text-xs text-slate-400">Enter your credentials to access your organization workspace.</p>
      </div>

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} />

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="space-y-1">
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
        </div>

        <Button type="submit" loading={isLoading} icon={LogIn} className="w-full py-3">
          Sign In
        </Button>
      </form>

      <QuickFillButtons onQuickFill={handleQuickFill} />
    </AuthLayout>
  );
}

export default LoginPage;
