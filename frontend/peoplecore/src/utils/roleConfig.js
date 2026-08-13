import { Shield, Briefcase, UserCheck2 } from "lucide-react";

export const getRoleBadgeConfig = (role, isLight = false) => {
  switch (role) {
    case "ADMIN":
      return {
        label: "ADMINISTRATOR",
        shortLabel: "ADMIN",
        color: isLight
          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        icon: Shield,
        desc: "Full administrative controls and real-time system metrics.",
      };
    case "HR":
      return {
        label: "HR MANAGER",
        shortLabel: "HR",
        color: isLight
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-amber-500/10 text-amber-400 border-amber-500/30",
        icon: Briefcase,
        desc: "Employee management, leave requests, and workforce metrics.",
      };
    default:
      return {
        label: "EMPLOYEE",
        shortLabel: "EMPLOYEE",
        color: isLight
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        icon: UserCheck2,
        desc: "Personal leave management, profile details, and activity.",
      };
  }
};
