import LotItemCard from "./LotItemCard";
import type { Product } from "@/types";

export type PendingLotItem = {
  product: Product;
  quantity: number;
};

type Props = {
  items: PendingLotItem[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onProductUpdated: (productId: string) => void;
  onRemove: (productId: string) => void;
};

export default function LotList({
  items,
  onQuantityChange,
  onProductUpdated,
  onRemove,
}: Props) {
  if (!items.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black">Products in lot</h2>

        <span className="text-sm font-bold text-cyan-300">
          {items.length} products
        </span>
      </div>

      {items.map((item) => (
        <LotItemCard
          key={item.product.id}
          product={item.product}
          quantity={item.quantity}
          onQuantityChange={(quantity) =>
            onQuantityChange(item.product.id, quantity)
          }
          onUpdated={() => onProductUpdated(item.product.id)}
          onRemove={() => onRemove(item.product.id)}
        />
      ))}
    </section>
  );
}