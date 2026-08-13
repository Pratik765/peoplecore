import React from "react";
import useTheme from "../../hooks/useTheme";
import { getRoleBadgeConfig } from "../../utils/roleConfig";

export function RoleBadge({ role = "EMPLOYEE", showIcon = true, short = false, className = "" }) {
  const { isLight } = useTheme();
  const config = getRoleBadgeConfig(role, isLight);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{short ? config.shortLabel : config.label}</span>
    </div>
  );
}

export default RoleBadge;
