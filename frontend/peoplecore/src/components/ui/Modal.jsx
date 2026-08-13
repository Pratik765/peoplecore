import React from "react";
import useTheme from "../../hooks/useTheme";
import { AlertTriangle, Check, ShieldAlert } from "lucide-react";

export function Modal({
  show,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  type = "default", // 'default' | 'danger' | 'approve'
  children,
}) {
  const { isLight } = useTheme();

  if (!show) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
      />

      {/* Modal Container Card */}
      <div
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto border rounded-2xl shadow-2xl p-6 z-10 animate-scaleUp transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-slate-900 border-slate-800 text-white"
        }`}
      >
        {/* Header Glow Orb */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full pointer-events-none ${
            isDanger ? "bg-red-500/20" : "bg-indigo-500/20"
          }`}
        />

        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl border shrink-0 ${
              isDanger
                ? isLight
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
                : isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            }`}
          >
            {isDanger ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1 flex-1">
            <h3
              className={`text-lg font-bold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {title}
            </h3>
            {message && (
              <p
                className={`text-xs leading-relaxed ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        {/* Action Buttons */}
        <div
          className={`mt-6 pt-4 border-t flex items-center justify-end gap-3 ${
            isLight ? "border-slate-200" : "border-slate-800/80"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              isLight
                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                : "bg-slate-800/60 text-slate-400 hover:text-white border-slate-700/60 hover:bg-slate-800"
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center gap-1.5 transition-all active:scale-95 ${
              isDanger
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-500/20"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-indigo-500/20"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
