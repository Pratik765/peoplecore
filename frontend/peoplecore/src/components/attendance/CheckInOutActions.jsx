import React from "react";
import Button from "../ui/Button";
import { LogIn, LogOut as LogOutIcon } from "lucide-react";

export function CheckInOutActions({ todayRecord, onCheckIn, onCheckOut, actionLoading }) {
  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;

  return (
    <div className="flex items-center gap-3">
      {!isCheckedIn ? (
        <Button
          onClick={onCheckIn}
          loading={actionLoading}
          icon={LogIn}
          variant="primary"
          className="w-full sm:w-auto py-3 px-6"
        >
          Check In Now
        </Button>
      ) : !isCheckedOut ? (
        <Button
          onClick={onCheckOut}
          loading={actionLoading}
          icon={LogOutIcon}
          variant="amber"
          className="w-full sm:w-auto py-3 px-6"
        >
          Check Out Now
        </Button>
      ) : (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          ✓ Completed Today's Shift
        </div>
      )}
    </div>
  );
}

export default CheckInOutActions;
