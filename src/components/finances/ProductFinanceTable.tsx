type ProductFinance = {
  id: string;
  name: string;
  barcode: string;
  sku: string | null;
  price: number;
  stock: number;
  location: string | null;
  imageUrl: string | null;
  inventoryValue: number;
};

type Props = {
  products: ProductFinance[];
};

function money(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export default function ProductFinanceTable({
  products,
}: Props) {
  return (
    <section className="space-y-3">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
          Products
        </p>

        <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">
          Value by Product
        </h2>
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-black text-[var(--app-text)]">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-[var(--app-muted)]">
                {product.stock} units × {money(product.price)}
              </p>

              {product.location && (
                <p className="mt-1 text-xs text-cyan-300">
                  {product.location}
                </p>
              )}
            </div>

            <p className="shrink-0 text-lg font-black text-cyan-300">
              {money(product.inventoryValue)}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}