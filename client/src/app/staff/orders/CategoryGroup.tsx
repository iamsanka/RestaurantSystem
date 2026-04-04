"use client";

import { useState } from "react";
import ItemCheckbox from "./ItemCheckBox";

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  customizations: string[] | null;
  received: boolean;
};

export default function CategoryGroup({
  category,
  items,
  onToggleItem,
}: {
  category: string;
  items: OrderItem[];
  onToggleItem: (itemId: number, received: boolean) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-[rgba(255,255,255,0.05)] p-4 rounded-xl shadow-md border border-[rgba(255,255,255,0.1)]">
      {/* HEADER */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-xl font-bold text-white">{category}</h3>

        <span
          className={`
            transition-transform text-white
            ${open ? "rotate-90" : "rotate-0"}
          `}
        >
          ▶
        </span>
      </div>

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${open ? "max-h-500px mt-4" : "max-h-0"}
        `}
      >
        <div className="space-y-3">
          {items.map((item) => (
            <ItemCheckbox
              key={item.id}
              item={item}
              onToggle={(checked) => onToggleItem(item.id, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
