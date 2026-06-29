import HeroCard from "@/components/home/HeroCard";
import StatsGrid from "@/components/home/StatsGrid";
import RecentScans from "@/components/home/RecentScans";
import { getHomeDashboardData } from "@/utils/home";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const {
    totalProducts,
    totalStock,
    lowStock,
    outOfStock,
    recentScans,
  } = await getHomeDashboardData();

  return (
    <div className="space-y-6">
      <HeroCard />

      <StatsGrid
        totalProducts={totalProducts}
        totalStock={totalStock}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />

      <RecentScans scans={recentScans} />
    </div>
  );
}