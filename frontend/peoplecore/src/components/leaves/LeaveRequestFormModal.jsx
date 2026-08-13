import React from "react";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Input from "../ui/Input";
import { LEAVE_TYPES } from "../../utils/constants";
import { Calendar, FileText } from "lucide-react";

export function LeaveRequestFormModal({
  show,
  onClose,
  onSubmit,
  leaveType,
  setLeaveType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  remark,
  setRemark,
  submitting,
}) {
  return (
    <Modal
      show={show}
      title="Apply for Leave"
      onClose={onClose}
      onConfirm={onSubmit}
      confirmText={submitting ? "Submitting..." : "Submit Application"}
      cancelText="Cancel"
    >
      <div className="space-y-4 text-xs pt-2">
        <Select
          label="Leave Type"
          icon={Calendar}
          options={LEAVE_TYPES}
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-300">
            Reason / Remarks
          </label>
          <textarea
            rows={3}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Brief reason for your leave request..."
            className="w-full p-3 rounded-xl text-xs bg-slate-950/60 border border-slate-800 text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </Modal>
  );
}

export default LeaveRequestFormModal;
