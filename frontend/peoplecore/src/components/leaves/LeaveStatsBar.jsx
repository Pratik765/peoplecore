import React from "react";
import StatCard from "../ui/StatCard";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

export function LeaveStatsBar({ leaves = [] }) {
  const pendingCount = leaves.filter((l) => l.status === "PENDING").length;
  const approvedCount = leaves.filter((l) => l.status === "APPROVED").length;
  const totalBalance = Math.max(18 - approvedCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Annual Leave Balance"
        value={`${totalBalance} Days`}
        change="Remaining annual quota"
        icon={Calendar}
        color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      />
      <StatCard
        title="Pending Applications"
        value={`${pendingCount} Pending`}
        change={pendingCount > 0 ? "Under HR review" : "Up-to-date"}
        icon={Clock}
        color="text-amber-400 bg-amber-500/10 border-amber-500/20"
      />
      <StatCard
        title="Approved Leaves"
        value={`${approvedCount} Days`}
        change="Approved this year"
        icon={CheckCircle2}
        color="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
      />
    </div>
  );
}

export default LeaveStatsBar;
