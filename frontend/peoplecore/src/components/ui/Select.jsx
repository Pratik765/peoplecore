import React from "react";
import useTheme from "../../hooks/useTheme";

export function Select({
  label,
  icon: Icon,
  options = [],
  value,
  onChange,
  className = "",
  id,
  ...props
}) {
  const { isLight } = useTheme();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className={`block text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full py-2.5 rounded-xl text-xs transition-all border outline-none cursor-pointer ${Icon ? "pl-10 pr-8" : "px-4 pr-8"} ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500"
              : "bg-slate-950/60 border-slate-800 text-white focus:border-indigo-500"
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={idx} value={val} className={isLight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default Select;
