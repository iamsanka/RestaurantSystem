"use client";

import { useState } from "react";

export default function CustomizeModal({ item, onClose, onSave }) {
  const ingredients = Array.isArray(item.ingredients)
    ? item.ingredients
    : [];

  const [removed, setRemoved] = useState([]);

  const toggleIngredient = (ing) => {
    setRemoved((prev) =>
      prev.includes(ing)
        ? prev.filter((i) => i !== ing)
        : [...prev, ing]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Customize <span className="text-orange-600">{item.name}</span>
        </h2>

        {/* Ingredients */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Ingredients</h3>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            {ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>

        {/* Remove Ingredients */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Remove Ingredients</h3>

          <div className="space-y-2">
            {ingredients.map((ing) => (
              <label
                key={ing}
                className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!removed.includes(ing)}
                  onChange={() => toggleIngredient(ing)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{ing}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                ...item,
                removedIngredients: removed,
                uniqueKey: `${item.id}-${removed.sort().join("-")}`,
              })
            }
            className="px-5 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
