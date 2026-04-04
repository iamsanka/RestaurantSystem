"use client";

import CategoryGroup from "./CategoryGroup";

type Order = {
  id: number;
  order_number: string;
  created_at: string;
};

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  customizations: string[] | null;
  received: boolean;
  category_name: string;
};

export default function PreparingOrderCard({
  order,
  groupedItems,
  onToggleItem,
  onDone,
  allReceived,
}: {
  order: Order;
  groupedItems: Record<string, OrderItem[]>;
  onToggleItem: (itemId: number, received: boolean) => void;
  onDone: () => void;
  allReceived: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-white tracking-wide">
        {order.order_number}
      </h2>

      {/* CATEGORY GROUPS */}
      <div className="space-y-6">
        {Object.keys(groupedItems).map((cat) => (
          <CategoryGroup
            key={cat}
            category={cat}
            items={groupedItems[cat]}
            onToggleItem={onToggleItem}
          />
        ))}
      </div>

      {/* DONE BUTTON */}
      <button
        disabled={!allReceived}
        onClick={onDone}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all"
        style={{
          background: "var(--forest-mint)",
          color: "var(--forest-dark)",
          opacity: allReceived ? 1 : 0.4,
          cursor: allReceived ? "pointer" : "not-allowed",
        }}
      >
        Done Preparing
      </button>
    </div>
  );
}
