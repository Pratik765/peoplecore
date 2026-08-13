import React from "react";
import useTheme from "../../hooks/useTheme";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { Clock, LogIn, LogOut as LogOutIcon, Timer } from "lucide-react";

export function TodayStatusCard({ todayRecord, currentTime }) {
  const { isLight } = useTheme();

  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Today's Status
            </span>
            <Badge variant={isCheckedOut ? "emerald" : isCheckedIn ? "amber" : "indigo"}>
              {isCheckedOut ? "Checked Out" : isCheckedIn ? "Active Shift" : "Not Checked In"}
            </Badge>
          </div>
          <div className={`text-2xl font-extrabold font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
            {formattedTime}
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Check In</div>
              <div className="font-bold">{todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <LogOutIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Check Out</div>
              <div className="font-bold">{todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Total Hours</div>
              <div className="font-bold">{todayRecord?.workHours ? `${todayRecord.workHours} hrs` : "--"}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TodayStatusCard;
