import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function AlertMessage({ type = "error", message, onDismiss, autoDismissTime = 4000, className = "" }) {
  const { isLight } = useTheme();

  useEffect(() => {
    if (autoDismissTime && onDismiss && message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissTime);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismissTime, onDismiss]);

  if (!message) return null;

  const configs = {
    error: {
      icon: AlertCircle,
      bg: isLight ? "bg-red-50 border-red-200 text-red-800" : "bg-red-500/10 border-red-500/30 text-red-300",
      iconColor: "text-red-500",
    },
    success: {
      icon: CheckCircle2,
      bg: isLight ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      iconColor: "text-emerald-500",
    },
    info: {
      icon: Info,
      bg: isLight ? "bg-indigo-50 border-indigo-200 text-indigo-800" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
      iconColor: "text-indigo-500",
    },
  };

  const config = configs[type] || configs.error;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs ${config.bg} ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
        <span className="font-medium truncate">{message}</span>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="p-1 rounded-lg hover:bg-black/10 shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default AlertMessage;
