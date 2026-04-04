"use client";

import MenuItemCard from "./MenuItemCard";

/**
 * Normalize category title for display
 * e.g. "desserts" → "Desserts"
 */
function formatCategory(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function MenuCategory({ category, items }) {
  const normalized = (category || "").toLowerCase();

  // Filter items that belong to this category
  const filtered = items.filter(
    (item) =>
      (item.category || "").toLowerCase() === normalized
  );

  if (filtered.length === 0) return null;

  return (
    <section className="menu-category">
      <h2 className="category-title">{formatCategory(category)}</h2>

      <div className="menu-grid">
        {filtered.map((item) => (
          <MenuItemCard
            key={item.id}
            item={{
              ...item,
              price: item.price / 100,
              image: item.imageUrl,
            }}
          />
        ))}
      </div>
    </section>
  );
}
