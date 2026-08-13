import React from "react";
import StatCard from "../ui/StatCard";
import SectionHeader from "../ui/SectionHeader";
import { Layers } from "lucide-react";

export function MetricsGrid({ stats = [] }) {
  return (
    <section className="space-y-4">
      <SectionHeader
        icon={Layers}
        title="Dynamic Metrics"
        subtitle="Real-time backend synchronization"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <StatCard
            key={idx}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </section>
  );
}

export default MetricsGrid;
