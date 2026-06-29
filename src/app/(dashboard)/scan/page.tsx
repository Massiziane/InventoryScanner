import ActionCard from "@/components/ui/ActionCard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import { PackagePlus, Search } from "lucide-react";

export default function ScanPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Scanner"
        title="Choose Action"
        description="Scan an existing product or register a new one. Fast, reliable and optimized for mobile devices."
      />

      <div className="space-y-4">
        <ActionCard
          href="/scan/look-up"
          icon={Search}
          title="Look for Product"
          description="Scan a barcode to instantly check stock, location and product information."
        />

        <ActionCard
          href="/scan/add-product"
          icon={PackagePlus}
          title="Add Product"
          description="Scan a barcode to update an existing product or create a brand new inventory item."
        />
      </div>
    </PageShell>
  );
}