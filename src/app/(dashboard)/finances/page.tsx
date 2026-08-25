import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";

import FinanceStats from "@/components/finances/FinanceStats";
import ProductFinanceTable from "@/components/finances/ProductFinanceTable";
import LocationFinanceTable from "@/components/finances/LocationFinanceTable";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FinancesPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    barcode: product.barcode,
    sku: product.sku,
    price: Number(product.price),
    stock: product.stock,
    location: product.location,
    imageUrl: product.imageUrl,
    inventoryValue: Number(product.price) * product.stock,
  }));

  const totalProducts = serializedProducts.length;

  const totalUnits = serializedProducts.reduce(
    (total, product) => total + product.stock,
    0
  );

  const totalInventoryValue = serializedProducts.reduce(
    (total, product) => total + product.inventoryValue,
    0
  );

  const averageUnitValue =
    totalUnits > 0
      ? totalInventoryValue / totalUnits
      : 0;

  const locationMap = new Map<
    string,
    {
      location: string;
      products: number;
      units: number;
      value: number;
    }
  >();

  for (const product of serializedProducts) {
    const location =
      product.location?.trim() || "Unassigned";

    const existing = locationMap.get(location);

    if (existing) {
      existing.products += 1;
      existing.units += product.stock;
      existing.value += product.inventoryValue;
    } else {
      locationMap.set(location, {
        location,
        products: 1,
        units: product.stock,
        value: product.inventoryValue,
      });
    }
  }

  const locations = [...locationMap.values()].sort(
    (a, b) => b.value - a.value
  );

  const productsByValue = [...serializedProducts].sort(
    (a, b) => b.inventoryValue - a.inventoryValue
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Finance"
        title="Inventory Finances"
        description="Track inventory value, stock totals and financial breakdowns across your products."
      />

      <div className="space-y-6">
        <FinanceStats
          totalProducts={totalProducts}
          totalUnits={totalUnits}
          totalInventoryValue={totalInventoryValue}
          averageUnitValue={averageUnitValue}
        />

        <ProductFinanceTable
          products={productsByValue}
        />

        <LocationFinanceTable
          locations={locations}
        />
      </div>
    </PageShell>
  );
}