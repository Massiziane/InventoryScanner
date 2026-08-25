type LocationFinance = {
  location: string;
  products: number;
  units: number;
  value: number;
};

type Props = {
  locations: LocationFinance[];
};

function money(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export default function LocationFinanceTable({
  locations,
}: Props) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
          Locations
        </p>

        <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">
          Value by Location
        </h2>
      </div>

      {locations.map((location) => (
        <div
          key={location.location}
          className="rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-black text-[var(--app-text)]">
                {location.location}
              </p>

              <p className="mt-1 text-xs text-[var(--app-muted)]">
                {location.products} products ·{" "}
                {location.units} units
              </p>
            </div>

            <p className="text-lg font-black text-cyan-300">
              {money(location.value)}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}