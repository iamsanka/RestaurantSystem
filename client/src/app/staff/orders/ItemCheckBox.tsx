"use client";

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  customizations: string[] | null;
  received: boolean;
};

export default function ItemCheckbox({
  item,
  onToggle,
}: {
  item: OrderItem;
  onToggle: (checked: boolean) => void;
}) {
  const handleToggle = () => {
    onToggle(!item.received);
  };

  return (
    <div
      className="flex items-start gap-3 cursor-pointer select-none group"
      onClick={handleToggle}
    >
      {/* CUSTOM CHECKBOX */}
      <div
        className={`
          w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
          ${item.received ? "bg-green-400 border-green-500" : "border-gray-400"}
          group-hover:border-green-300
        `}
      >
        {item.received && (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--forest-dark)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* ITEM TEXT */}
      <div>
        <span className="font-semibold text-white">
          {item.item_name} × {item.quantity}
        </span>

        {item.customizations && item.customizations.length > 0 && (
          <div className="text-sm text-gray-300">
            Removed: {item.customizations.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
