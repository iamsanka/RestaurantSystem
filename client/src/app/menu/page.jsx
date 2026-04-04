"use client";

import { useEffect, useState } from "react";
import MenuCategory from "../components/MenuCategory";
import "../styles/menu.css";
import io from "socket.io-client";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const socket = io(API);

  async function loadMenu() {
    try {
      const res = await fetch(`${API}/api/menu`, {
        cache: "no-store",
      });

      const data = await res.json();

      const safeItems = data.items.map((item) => {
        let ingredients = item.ingredients;

        if (Array.isArray(ingredients)) {
          // ok
        } else if (typeof ingredients === "string") {
          try {
            ingredients = JSON.parse(ingredients);
          } catch {
            ingredients = [];
          }
        } else {
          ingredients = [];
        }

        return { ...item, ingredients };
      });

      setItems(safeItems);

      // ⭐ Build category list dynamically from DB items
      const uniqueCategories = Array.from(
        new Set(
          safeItems
            .filter((i) => i.isAvailable)
            .map((i) => i.category)
        )
      );

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("MENU LOAD ERROR:", err);
    }
  }

  useEffect(() => {
    loadMenu();

    // ⭐ Real-time updates
    socket.on("menu:update", () => {
      loadMenu();
    });

    return () => socket.off("menu:update");
  }, []);

  return (
    <div className="menu-page">
      <h1 className="menu-title">Our Menu</h1>

      {categories.map((category) => (
        <MenuCategory
          key={category}
          category={category}
          items={items.filter((item) => item.isAvailable)}
        />
      ))}
    </div>
  );
}
