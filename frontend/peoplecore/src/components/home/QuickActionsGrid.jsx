import React from "react";
import { Link } from "react-router-dom";
import useTheme from "../../hooks/useTheme";
import SectionHeader from "../ui/SectionHeader";
import { Briefcase, ChevronRight, ArrowUpRight } from "lucide-react";

export function QuickActionsGrid({ actions = [] }) {
  const { isLight } = useTheme();

  return (
    <section className="space-y-4">
      <SectionHeader icon={Briefcase} title="Quick Module Shortcuts" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, idx) => {
          const ActionIcon = action.icon;
          return (
            <Link
              key={idx}
              to={action.link}
              className={`bg-gradient-to-br ${action.color} border rounded-2xl p-6 backdrop-blur-md shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between group ${
                isLight ? "shadow-slate-200/50" : ""
              }`}
            >
              <div className="space-y-3">
                <div
                  className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-colors ${
                    isLight
                      ? "bg-white border-slate-200 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                      : "bg-slate-900/80 border-slate-800 text-indigo-400 group-hover:text-white"
                  }`}
                >
                  <ActionIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3
                    className={`font-bold text-base transition-colors flex items-center gap-1.5 ${
                      isLight
                        ? "text-slate-900 group-hover:text-indigo-600"
                        : "text-slate-100 group-hover:text-white"
                    }`}
                  >
                    <span>{action.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {action.description}
                  </p>
                </div>
              </div>
              <div
                className={`mt-6 pt-4 border-t text-xs font-semibold flex items-center justify-between transition-colors ${
                  isLight
                    ? "border-slate-200/60 text-indigo-600 group-hover:text-indigo-700"
                    : "border-slate-800/40 text-indigo-400 group-hover:text-indigo-300"
                }`}
              >
                <span>Access Module</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActionsGrid;
