import React from "react";
import PageLayout from "../components/layout/PageLayout";
import WelcomeHeroBanner from "../components/home/WelcomeHeroBanner";
import SubscriptionCallout from "../components/home/SubscriptionCallout";
import MetricsGrid from "../components/home/MetricsGrid";
import QuickActionsGrid from "../components/home/QuickActionsGrid";
import SystemActivityFeed from "../components/home/SystemActivityFeed";
import RecentAnnouncements from "../components/home/RecentAnnouncements";
import useDashboardMetrics from "../hooks/useDashboardMetrics";

export function HomePage() {
  const {
    activeServicesCount,
    recentAnnouncements,
    isLoading,
    fetchDynamicMetrics,
    stats,
    quickActions,
  } = useDashboardMetrics();

  return (
    <PageLayout>
      {/* Hero Welcome Banner */}
      <WelcomeHeroBanner
        activeServicesCount={activeServicesCount}
        onRefresh={fetchDynamicMetrics}
        isLoading={isLoading}
      />

      {/* Admin Subscription Upgrade Banner */}
      <SubscriptionCallout />

      {/* Dynamic Role Metrics Grid */}
      <MetricsGrid stats={stats} />

      {/* Module Shortcuts & Realtime Log Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QuickActionsGrid actions={quickActions} />
        </div>
        <div>
          <SystemActivityFeed activeServicesCount={activeServicesCount} />
        </div>
      </div>

      {/* Latest Announcements */}
      <RecentAnnouncements announcements={recentAnnouncements} />
    </PageLayout>
  );
}

export default HomePage;
