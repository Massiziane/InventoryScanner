import EmptyState from "@/components/ui/EmptyState";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

export default function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="App Settings"
        description="Customize your ScanApp experience and manage future application preferences."
      />

      <GlassCard className="p-6">
        <EmptyState
          title="Coming Soon"
          description="Settings will be available in a future update. This page is included in the MVP to establish the application's navigation and overall structure."
        />
      </GlassCard>
    </PageShell>
  );
}