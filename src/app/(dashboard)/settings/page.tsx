import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import ScannerThemeToggle from "@/components/settings/ScannerThemeToggle";

export default function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="App Settings"
        description="Customize your ScanApp experience and display preferences."
      />

      <ScannerThemeToggle />
    </PageShell>
  );
}