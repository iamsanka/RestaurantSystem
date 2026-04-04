"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import CustomizeModal from "./CustomizeModal";

export default function MenuItemCard({ item }) {
  const { addToCart } = useCart();
  const [showCustomize, setShowCustomize] = useState(false);

  const ingredients = Array.isArray(item.ingredients)
    ? item.ingredients
    : [];

  const imageSrc = item.imageUrl || item.image || "/placeholder.jpg";

  return (
    <>
      <div className="menu-card">
        {/* IMAGE */}
        <img src={imageSrc} alt={item.name} className="menu-card-img" />

        {/* BADGES */}
        <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
          {item.isNew && (
            <span
              style={{
                background: "#22c55e",
                color: "black",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              NEW
            </span>
          )}

          {item.isPopular && (
            <span
              style={{
                background: "#facc15",
                color: "black",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              POPULAR
            </span>
          )}
        </div>

        {/* NAME */}
        <h3 className="menu-card-name">{item.name}</h3>

        {/* PRICE */}
        <p className="menu-card-price">€{item.price.toFixed(2)}</p>

        {/* INGREDIENT PREVIEW */}
        <p className="menu-card-ingredients">
          {ingredients.length > 0 ? ingredients.join(", ") : "No ingredients listed"}
        </p>

        {/* ALWAYS SHOW CUSTOMIZE BUTTON */}
        <button
          className="menu-card-btn"
          onClick={() => setShowCustomize(true)}
        >
          Customize
        </button>
      </div>

      {/* CUSTOMIZE MODAL */}
      {showCustomize && (
        <CustomizeModal
          item={item}
          onClose={() => setShowCustomize(false)}
          onSave={(customizedItem) => {
            addToCart(customizedItem);
            setShowCustomize(false);
          }}
        />
      )}
    </>
  );
}
