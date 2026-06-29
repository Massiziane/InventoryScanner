import { AlertTriangle, Activity, Boxes } from "lucide-react";
import StatCard from "@/components/home/StatCard";

type StatsGridProps = {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
};

export default function StatsGrid({
  totalProducts,
  totalStock,
  lowStock,
  outOfStock,
}: StatsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        icon={<Boxes size={20} />}
        label="Products"
        value={totalProducts}
      />

      <StatCard
        icon={<Activity size={20} />}
        label="Total Stock"
        value={totalStock}
      />

      <StatCard
        icon={<AlertTriangle size={20} />}
        label="Low Stock"
        value={lowStock}
      />

      <StatCard
        icon={<AlertTriangle size={20} />}
        label="Out of Stock"
        value={outOfStock}
        danger
      />
    </section>
  );
}