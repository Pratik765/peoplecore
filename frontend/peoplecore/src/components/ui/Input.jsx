import React from "react";
import useTheme from "../../hooks/useTheme";

export function Input({
  label,
  icon: Icon,
  error,
  className = "",
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  ...props
}) {
  const { isLight } = useTheme();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-2.5 rounded-xl text-xs transition-all border outline-none ${Icon ? "pl-10 pr-4" : "px-4"} ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              : "bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""} ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-[11px] text-red-500 font-medium mt-1">{error}</p>}
    </div>
  );
}

export default Input;
