type Props = {
  totalProducts: number;
  totalUnits: number;
  totalInventoryValue: number;
  averageUnitValue: number;
};

function money(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export default function FinanceStats({
  totalProducts,
  totalUnits,
  totalInventoryValue,
  averageUnitValue,
}: Props) {
  const stats = [
    {
      label: "Inventory Value",
      value: money(totalInventoryValue),
    },
    {
      label: "Total Units",
      value: totalUnits.toLocaleString(),
    },
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
    },
    {
      label: "Average Unit Value",
      value: money(averageUnitValue),
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-4"
        >
          <p className="text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
            {stat.label}
          </p>

          <p className="mt-2 break-words text-2xl font-black text-[var(--app-text)]">
            {stat.value}
          </p>
        </div>
      ))}
    </section>
  );
}