import React from "react";
import useTheme from "../../hooks/useTheme";

export function UserAvatar({ name = "User", avatarUrl, size = "md", className = "" }) {
  const { isLight } = useTheme();

  const sizeClasses = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm",
    xl: "h-20 w-20 text-xl",
  };

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-xl object-cover border shrink-0 ${sizeClasses[size] || sizeClasses.md} ${
          isLight ? "border-slate-200" : "border-slate-700"
        } ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-xl border flex items-center justify-center font-bold shrink-0 ${sizeClasses[size] || sizeClasses.md} ${
        isLight
          ? "bg-indigo-100 border-indigo-200 text-indigo-700"
          : "bg-slate-800 border-slate-700 text-indigo-300"
      } ${className}`}
    >
      {initial}
    </div>
  );
}

export default UserAvatar;
