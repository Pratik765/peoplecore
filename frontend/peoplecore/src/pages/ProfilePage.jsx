import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import PageLayout from "../components/layout/PageLayout";
import PageHeader from "../components/ui/PageHeader";
import SectionHeader from "../components/ui/SectionHeader";
import AlertMessage from "../components/ui/AlertMessage";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import UserAvatar from "../components/common/UserAvatar";
import RoleBadge from "../components/common/RoleBadge";
import { fetchMyProfile, updateMyProfile } from "../api/userApi";
import { userAction } from "../store/userSlice";
import { User, Mail, Save, Building2, Phone, MapPin, Layers } from "lucide-react";

export function ProfilePage() {
  const { isLight } = useTheme();
  const { user, token, role: userRole } = useAuth();
  const reduxDispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Software Engineer");
  const [location, setLocation] = useState("Pune, Maharashtra");

  const loadProfile = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetchMyProfile();
      if (res) {
        setName(res.name || "");
        setEmail(res.email || "");
        setPhone(res.phone || "");
        setDepartment(res.department || "Engineering");
        setDesignation(res.designation || "Software Engineer");
        setLocation(res.location || "Pune, Maharashtra");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg("");
    try {
      const payload = { name, email, phone, department, designation, location };
      const updated = await updateMyProfile(payload);
      setSuccessMsg("Profile details saved successfully!");
      if (updated && reduxDispatch) {
        reduxDispatch(userAction.login({ token, user: { ...user, name, email } }));
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader
        badgeText="Account Management"
        badgeIcon={User}
        title="Personal Profile &"
        highlightTitle="Settings"
        description="Update your personal details, contact information, and organizational profile credentials."
      />

      <AlertMessage type="error" message={errorMsg} onDismiss={() => setErrorMsg("")} />
      <AlertMessage type="success" message={successMsg} onDismiss={() => setSuccessMsg("")} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <Card className="p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <UserAvatar name={name || "User"} size="xl" />
          <div>
            <h2 className={`text-xl font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
              {name || "User"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
          </div>

          <RoleBadge role={userRole} />

          <div className="w-full pt-4 border-t border-slate-800/60 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-white">{department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Designation:</span>
              <span className="font-semibold text-white">{designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-white">{location}</span>
            </div>
          </div>
        </Card>

        {/* Profile Edit Form */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader icon={Layers} title="Edit Account Details" />

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" icon={User} value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email Address" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Phone Number" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Location" icon={MapPin} value={location} onChange={(e) => setLocation(e.target.value)} />
                <Input label="Department" icon={Building2} value={department} onChange={(e) => setDepartment(e.target.value)} />
                <Input label="Designation" icon={Building2} value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" loading={updating} icon={Save} className="px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

export default ProfilePage;
