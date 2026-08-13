import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export function AccordionItem({ title, content, isOpen: defaultIsOpen = false }) {
  const { isLight } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  return (
    <div
      className={`rounded-2xl border transition-all ${
        isLight ? "border-slate-200 bg-slate-50/60" : "border-slate-800 bg-slate-950/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-semibold text-sm focus:outline-none"
      >
        <span className={isLight ? "text-slate-800" : "text-slate-200"}>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div
          className={`px-5 pb-4 text-xs leading-relaxed border-t pt-3 ${
            isLight ? "text-slate-600 border-slate-200" : "text-slate-400 border-slate-800/60"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function Accordion({ items = [], className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => (
        <AccordionItem key={idx} title={item.q || item.title} content={item.a || item.content} />
      ))}
    </div>
  );
}

export default Accordion;
