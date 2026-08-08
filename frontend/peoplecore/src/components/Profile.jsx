import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../store/userSlice";
import {
  User,
  Mail,
  Shield,
  Briefcase,
  UserCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  KeyRound,
  Calendar,
  Lock,
  BadgeCheck,
} from "lucide-react";

function Profile() {
  const reduxUser = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";

  const reduxDispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch current user details from user-service
  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:5004/user/me", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load user profile.");
      }

      const res = await response.json();
      setUserData(res);
      setName(res.name || "");
      setEmail(res.email || "");
    } catch (err) {
      setErrorMsg(err.message || "Error connecting to user service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email) {
      setErrorMsg("Name and email address are required.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch("http://localhost:5004/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, email }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || "Failed to update profile details.");
      }

      setSuccessMsg("Profile details updated successfully!");
      setUserData((prev) => ({ ...prev, name, email }));

      // Sync Redux state
      reduxDispatch(
        userAction.login({
          ...reduxUser,
          user: {
            ...reduxUser.user,
            name,
            email,
          },
        })
      );
    } catch (err) {
      setErrorMsg(err.message || "Update request failed.");
    } finally {
      setUpdating(false);
    }
  };

  // Role Badge Config
  const getRoleBadge = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "ADMINISTRATOR",
          color: isLight
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          icon: Shield,
        };
      case "HR":
        return {
          label: "HR MANAGER",
          color: isLight
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Briefcase,
        };
      default:
        return {
          label: "EMPLOYEE",
          color: isLight
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          icon: UserCheck2,
        };
    }
  };

  const userRole = userData?.role || reduxUser?.user?.role || "EMPLOYEE";
  const roleInfo = getRoleBadge(userRole);
  const RoleIcon = roleInfo.icon;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Profile Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border shadow-xl flex items-center justify-center text-3xl font-extrabold shrink-0 ${
                isLight
                  ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                  : "bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 border-indigo-400/30 text-white"
              }`}
            >
              {(name || reduxUser?.user?.name || "U").charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}
                >
                  <RoleIcon className="w-3.5 h-3.5" />
                  {roleInfo.label}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Status: {userData?.status || "ACCEPTED"}
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {name || reduxUser?.user?.name || "My Account"}
              </h1>
              <p
                className={`text-xs font-mono ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {email || reduxUser?.user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          <div
            className={`px-4 py-3 rounded-2xl border flex items-center gap-3 self-start sm:self-center ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-950/60 border-slate-800/80"
            }`}
          >
            <BadgeCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div
                className={`text-[11px] font-medium ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Account Verified
              </div>
              <div className="text-xs font-semibold text-emerald-600">
                Active Member
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="flex items-center gap-3 bg-red-950/50 border border-red-800/60 text-red-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Details Form */}
        <section className="lg:col-span-2 space-y-6">
          <div
            className={`border rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
              isLight
                ? "bg-white/90 border-slate-200 shadow-slate-200/50"
                : "bg-slate-900/80 border-slate-800/80"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-5 border-b ${
                isLight ? "border-slate-200" : "border-slate-800"
              }`}
            >
              <div>
                <h2
                  className={`text-lg font-bold flex items-center gap-2 ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Personal Details</span>
                </h2>
                <p
                  className={`text-xs mt-1 ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Update your account information and contact email address.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="text-sm font-medium">Loading profile details...</span>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                {/* Full Name Input */}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                          : "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className={`block text-xs font-semibold ${
                      isLight ? "text-slate-700" : "text-slate-300"
                    }`}
                  >
                    Work Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono ${
                        isLight
                          ? "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                          : "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div
                  className={`pt-4 border-t flex justify-end ${
                    isLight ? "border-slate-200" : "border-slate-800"
                  }`}
                >
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-60"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating Profile...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Right Column: Account Security & Info */}
        <section className="space-y-6">
          <div
            className={`border rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5 transition-colors ${
              isLight
                ? "bg-white/90 border-slate-200 shadow-slate-200/50"
                : "bg-slate-900/80 border-slate-800/80"
            }`}
          >
            <h3
              className={`text-base font-bold flex items-center gap-2 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>Account Credentials</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-950/60 border-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span
                    className={
                      isLight ? "text-slate-600 font-medium" : "text-slate-400"
                    }
                  >
                    Assigned Role
                  </span>
                </div>
                <span className="font-bold text-indigo-600">{userRole}</span>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-950/60 border-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  <span
                    className={
                      isLight ? "text-slate-600 font-medium" : "text-slate-400"
                    }
                  >
                    Authentication
                  </span>
                </div>
                <span className="font-bold text-emerald-600">JWT Token</span>
              </div>

              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isLight
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-950/60 border-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  <span
                    className={
                      isLight ? "text-slate-600 font-medium" : "text-slate-400"
                    }
                  >
                    Created At
                  </span>
                </div>
                <span
                  className={`font-mono ${
                    isLight ? "text-slate-800 font-semibold" : "text-slate-300"
                  }`}
                >
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : "2026-08-08"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
