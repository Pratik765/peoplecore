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
  Calendar,
  Building2,
  Phone,
  MapPin,
  FileText,
  Camera,
  Upload,
  Check,
  Award,
} from "lucide-react";

function Profile() {
  const reduxUser = useSelector((store) => store.user);
  const theme = useSelector((store) => store.theme) || "dark";
  const isLight = theme === "light";
  const reduxDispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editable Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Software Engineer");
  const [joinDate, setJoinDate] = useState("");
  const [location, setLocation] = useState("Bengaluru, India");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  // Preset Avatars for fast selection
  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  ];

  // Fetch current user details from user-service
  const fetchProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const token = reduxUser?.token || localStorage.getItem("token") || "";
      const response = await fetch("http://localhost:5004/user/me", {
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load user profile.");
      }

      const res = await response.json();
      setUserData(res);
      setName(res.name || "");
      setEmail(res.email || "");
      setPhone(res.phone || "");
      setDepartment(res.department || "Engineering");
      setDesignation(res.designation || "Software Engineer");
      setJoinDate(res.joinDate || new Date().toISOString().split("T")[0]);
      setLocation(res.location || "Bengaluru, India");
      setBio(res.bio || "");
      setAvatar(res.avatar || "");
    } catch (err) {
      console.error("Profile fetch error:", err.message);
      setErrorMsg(err.message || "Error connecting to user service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Photo Upload (Convert file to Base64 thumbnail)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg("Profile photo must be less than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email) {
      setErrorMsg("Name and email address are required.");
      return;
    }

    setUpdating(true);
    const token = reduxUser?.token || localStorage.getItem("token") || "";

    try {
      const response = await fetch("http://localhost:5004/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: userData?._id || userData?.id,
          name,
          email,
          phone,
          department,
          designation,
          joinDate,
          location,
          bio,
          avatar,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || "Failed to update profile.");
      }

      setSuccessMsg("Profile details updated successfully!");

      // Update Redux state
      if (res.updatedUser) {
        setUserData(res.updatedUser);
        reduxDispatch(
          userAction.login({
            user: res.updatedUser,
            token,
          })
        );
      }
    } catch (err) {
      setErrorMsg(err.message || "Error updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  const userRole = userData?.role || reduxUser?.user?.role || "EMPLOYEE";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800 shadow-slate-950/50"
        }`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Picture Frame */}
          <div className="relative group shrink-0">
            <div
              className={`h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden border-2 shadow-xl flex items-center justify-center font-bold text-2xl transition-transform group-hover:scale-105 ${
                isLight
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              }`}
            >
              {avatar ? (
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-indigo-500" />
              )}
            </div>

            <label
              htmlFor="avatar-file-input"
              className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-110"
              title="Upload new photo"
            >
              <Camera className="w-4 h-4" />
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* User Bio Header Info */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  userRole === "ADMIN"
                    ? isLight
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                    : userRole === "HR"
                    ? isLight
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    : isLight
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {userRole}
              </span>

              <span
                className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${
                  isLight
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {department}
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {name || "Employee Name"}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-indigo-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span>{designation || "Software Engineer"}</span>
              <span className="opacity-40">•</span>
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">{location}</span>
            </p>

            <p
              className={`text-xs max-w-xl pt-1 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {bio || "No professional bio provided yet. Add a short bio below to personalize your employee profile."}
            </p>
          </div>
        </div>
      </div>

      {/* Preset Avatars Selection Ribbon */}
      <div
        className={`border rounded-2xl p-4 backdrop-blur-xl shadow-lg space-y-3 transition-colors ${
          isLight
            ? "bg-white/90 border-slate-200 shadow-slate-200/50"
            : "bg-slate-900/80 border-slate-800"
        }`}
      >
        <label
          className={`text-xs font-semibold uppercase tracking-wider block ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          Quick Choose Preset Avatar
        </label>
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {presetAvatars.map((imgUrl, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAvatar(imgUrl)}
              className={`h-12 w-12 rounded-xl overflow-hidden border-2 transition-all relative shrink-0 ${
                avatar === imgUrl
                  ? "border-indigo-500 scale-105 shadow-md shadow-indigo-500/30"
                  : isLight
                  ? "border-slate-200 hover:border-indigo-300"
                  : "border-slate-700 hover:border-indigo-500"
              }`}
            >
              <img src={imgUrl} alt={`Avatar ${i}`} className="h-full w-full object-cover" />
              {avatar === imgUrl && (
                <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}

          {avatar && (
            <button
              type="button"
              onClick={() => setAvatar("")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
              }`}
            >
              Remove Photo
            </button>
          )}
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

      {/* Main Edit Profile Form */}
      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Personal Details Section */}
        <div
          className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6 transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/80 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div
              className={`p-2.5 rounded-xl border ${
                isLight
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`text-lg font-bold tracking-tight ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Personal Details
              </h2>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Manage your name, contact details, and location.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
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
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Work Location */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Office Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Professional Bio */}
            <div className="md:col-span-2 space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Professional Bio
              </label>
              <textarea
                rows={3}
                placeholder="Share a short introduction about your background and responsibilities..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900"
                    : "bg-slate-950 border-slate-800 text-slate-100"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Organizational Information Section */}
        <div
          className={`border rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6 transition-colors ${
            isLight
              ? "bg-white/90 border-slate-200 shadow-slate-200/50"
              : "bg-slate-900/80 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div
              className={`p-2.5 rounded-xl border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`text-lg font-bold tracking-tight ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                Organizational Details
              </h2>
              <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                Department, designation, and company join date.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-900"
                    : "bg-slate-950 border-slate-800 text-slate-100"
                }`}
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Finance & Operations">Finance & Operations</option>
              </select>
            </div>

            {/* Designation */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Job Designation
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>

            {/* Date of Joining */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                Date of Joining
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200 text-slate-900"
                      : "bg-slate-950 border-slate-800 text-slate-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Action Footer */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={updating}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 transition-all text-sm disabled:opacity-60"
          >
            {updating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Profile;
