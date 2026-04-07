"use client";

import { useEffect, useState } from "react";
import MenuItemCard from "./MenuItemCard";
import EditItemModal from "./EditItemModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CreateItemModal from "./CreateItemModal";
import { useRouter } from "next/navigation";

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  async function loadMenu() {
    const res = await fetch(`${API}/api/menu`);
    const data = await res.json();
    setItems(data.items);

    const catRes = await fetch(`${API}/api/categories`);
    const catData = await catRes.json();
    setCategories(catData.categories);
  }

  useEffect(() => {
    setEditItem(null);
    setDeleteItemId(null);
    loadMenu();
  }, []);

  function groupedByCategory() {
    const groups: any = {};
    items.forEach((item: any) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }

  const groups = groupedByCategory();

  return (
    <div style={{ padding: "40px", color: "white" }}>
      {/* ⭐ BACK BUTTON */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--forest-mint)",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ marginBottom: "30px", fontWeight: "bold" }}>
        Menu Management
      </h1>

      {/* CREATE ITEM BUTTON */}
      <button
        onClick={() => setShowCreateModal(true)}
        style={{
          padding: "12px 20px",
          background: "var(--forest-mint)",
          color: "black",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "30px",
        }}
      >
        Create Item
      </button>

      {/* CATEGORY GROUPS */}
      {Object.keys(groups).map((category) => (
        <div key={category} style={{ marginBottom: "40px" }}>
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "28px",
              fontWeight: "bold",
              color: "var(--forest-mint)",
            }}
          >
            {category}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {groups[category].map((item: any) => (
              <MenuItemCard
                key={item.id}
                item={{
                  ...item,
                  category_id: item.category_id,
                }}
                reload={loadMenu}
                onEdit={() =>
                  setEditItem({
                    ...item,
                    category_id: item.category_id,
                  })
                }
                onDelete={() => setDeleteItemId(item.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <CreateItemModal
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          reload={loadMenu}
        />
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <EditItemModal
          item={editItem}
          categories={categories}
          onClose={() => setEditItem(null)}
          reload={loadMenu}
        />
      )}

      {/* DELETE MODAL */}
      {deleteItemId && (
        <DeleteConfirmModal
          id={deleteItemId}
          onClose={() => setDeleteItemId(null)}
          reload={loadMenu}
        />
      )}
    </div>
  );
}
