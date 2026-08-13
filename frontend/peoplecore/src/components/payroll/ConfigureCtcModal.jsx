import React from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import { User, DollarSign } from "lucide-react";

export function ConfigureCtcModal({
  show,
  onClose,
  onSubmit,
  employeeId,
  setEmployeeId,
  ctc,
  setCtc,
  submitting,
}) {
  return (
    <Modal
      show={show}
      title="Configure Employee CTC"
      onClose={onClose}
      onConfirm={onSubmit}
      confirmText={submitting ? "Saving..." : "Save CTC Structure"}
      cancelText="Cancel"
    >
      <div className="space-y-4 text-xs pt-2">
        <Input
          label="Target Employee User ID"
          icon={User}
          placeholder="Enter Employee Mongo ID..."
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        />

        <Input
          label="Annual CTC Package (INR)"
          type="number"
          icon={DollarSign}
          placeholder="1200000"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          required
        />
      </div>
    </Modal>
  );
}

export default ConfigureCtcModal;
