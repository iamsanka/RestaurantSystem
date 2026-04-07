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
      const res = await fetch(`${API}/api/menu`, { cache: "no-store" });
      const data = await res.json();

      const safeItems = data.items.map((item) => {
        let ingredients = item.ingredients;

        if (Array.isArray(ingredients)) {
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

  // ⭐ Apply yellow background ONLY on this page
  useEffect(() => {
    document.body.classList.add("menu-bg-yellow");
    return () => document.body.classList.remove("menu-bg-yellow");
  }, []);

  useEffect(() => {
    loadMenu();
    socket.on("menu:update", loadMenu);
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
