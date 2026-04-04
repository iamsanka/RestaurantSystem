"use client";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string;
  category_id: number | string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isNew: boolean;
  isPopular: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  reload: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MenuItemCard({
  item,
  reload,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function toggle(path: string) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/menu/${item.id}/${path}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`Toggle failed: ${res.status}`);
        return;
      }

      reload();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  return (
    <div
      style={{
        background: "var(--forest-green)",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
      />

      <h3 style={{ marginBottom: "5px" }}>{item.name}</h3>

      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
        €{(item.price / 100).toFixed(2)}
      </p>

      {/* NEW + POPULAR */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button
          onClick={() => toggle("new")}
          style={{
            flex: 1,
            padding: "6px 10px",
            background: item.isNew ? "#22c55e" : "#444",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {item.isNew ? "Unmark New" : "Mark New"}
        </button>

        <button
          onClick={() => toggle("popular")}
          style={{
            flex: 1,
            padding: "6px 10px",
            background: item.isPopular ? "#facc15" : "#444",
            color: "black",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {item.isPopular ? "Unmark Popular" : "Mark Popular"}
        </button>
      </div>

      {/* AVAILABILITY */}
      <button
        onClick={() => toggle("toggle")}
        style={{
          width: "100%",
          padding: "8px 12px",
          background: item.isAvailable ? "#ca8a04" : "var(--forest-mint)",
          color: "black",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        {item.isAvailable ? "Set Unavailable" : "Set Available"}
      </button>

      {/* EDIT + DELETE */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "#3b82f6",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          style={{
            flex: 1,
            padding: "8px 12px",
            background: "#b91c1c",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
