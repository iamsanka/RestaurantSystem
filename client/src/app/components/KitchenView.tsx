"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  transports: ["websocket"],
});

type Order = {
  id: number;
  order_number: string;
  status: "received" | "preparing" | "done" | "collected";
  created_at: string;
};

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  customizations: string[] | null;
  received: boolean;
};

export default function KitchenView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, OrderItem[]>>(
    {},
  );

  const [kitchenCounts, setKitchenCounts] = useState<Record<string, number>>(
    {},
  );
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  /* ---------------------------
     Load initial orders
  ---------------------------- */
  useEffect(() => {
    async function loadOrders() {
      const token = window.localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
        data.orders.forEach((o: Order) => loadItems(o.id));
      }
    }
    loadOrders();
  }, []);

  async function loadItems(orderId: number) {
    const token = window.localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();

    setItemsByOrder((prev) => ({
      ...prev,
      [orderId]: data.items || [],
    }));
  }

  /* ---------------------------
     Real-time socket updates
  ---------------------------- */
  useEffect(() => {
    function handleNew(order: Order) {
      setOrders((prev) => [order, ...prev]);
      loadItems(order.id);
    }

    function handleUpdate(updated: Order) {
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      loadItems(updated.id);
    }

    function handleItemUpdate(payload: any) {
      setItemsByOrder((prev) => ({
        ...prev,
        [payload.orderId]: payload.items,
      }));
    }

    socket.on("order:new", handleNew);
    socket.on("order:update", handleUpdate);
    socket.on("order:item-update", handleItemUpdate);

    return () => {
      socket.off("order:new", handleNew);
      socket.off("order:update", handleUpdate);
      socket.off("order:item-update", handleItemUpdate);
    };
  }, []);

  /* ---------------------------
     Filter active orders
  ---------------------------- */
  const activeOrders = orders.filter(
    (o) => o.status === "received" || o.status === "preparing",
  );

  /* ---------------------------
     Aggregate item counts
  ---------------------------- */
  const aggregated: Record<string, number> = {};

  activeOrders.forEach((order) => {
    const items = itemsByOrder[order.id] || [];
    items.forEach((item) => {
      aggregated[item.item_name] =
        (aggregated[item.item_name] || 0) + item.quantity;
    });
  });

  /* ---------------------------
     FIX: Sync kitchenCounts safely
  ---------------------------- */
  useEffect(() => {
    if (!aggregated || Object.keys(aggregated).length === 0) return;

    setKitchenCounts((prev) => {
      const updated = { ...prev };

      Object.entries(aggregated).forEach(([name, required]) => {
        const prepared = updated[name] || 0;

        if (prepared > required) {
          updated[name] = required;
        }
      });

      return updated;
    });
  }, [JSON.stringify(aggregated)]);

  /* ---------------------------
     Compute negative counts
  ---------------------------- */
  const negativeCounts: Record<string, number> = {};

  Object.entries(aggregated).forEach(([name, required]) => {
    const prepared = kitchenCounts[name] || 0;
    negativeCounts[name] = -(required - prepared);
  });

  const aggregatedList = Object.entries(negativeCounts);

  /* ---------------------------
     Handle input confirm
  ---------------------------- */
  function confirmAmount(itemName: string) {
    const amount = parseInt(inputValue);
    if (isNaN(amount) || amount <= 0) return;

    setKitchenCounts((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + amount,
    }));

    setInputValue("");
    setExpandedItem(null);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "100vh",
        background: "var(--forest-medium)",
        color: "white",
      }}
    >
      {/* LEFT COLUMN — ORDERS */}
      <div
        style={{
          borderRight: "2px solid #444",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* ⭐ Back to Dashboard Button */}
        <button
          onClick={() => {
            const path = window.location.pathname.startsWith("/admin")
              ? "/admin/dashboard"
              : "/staff/dashboard";
            window.location.href = path;
          }}
          style={{
            padding: "10px 16px",
            background: "var(--forest-mint)",
            color: "black",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          ← Back to Dashboard
        </button>

        <h2
          style={{
            marginBottom: "20px",
            color: "var(--forest-mint)",
            fontWeight: "bold",
            fontSize: "1.4rem",
          }}
        >
          Orders ({activeOrders.length})
        </h2>

        {activeOrders.map((order) => {
          const items = itemsByOrder[order.id] || [];

          return (
            <div
              key={order.id}
              style={{
                background: "rgba(255,255,255,0.08)",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            >
              <h3 style={{ fontWeight: "bold" }}>{order.order_number}</h3>

              <div style={{ marginTop: "10px" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ marginBottom: "6px" }}>
                    <strong>{item.item_name}</strong> × {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT COLUMN — AGGREGATED COUNTS */}
      <div style={{ padding: "20px", overflowY: "auto" }}>
        <h2
          style={{
            marginBottom: "20px",
            color: "var(--forest-mint)",
            fontWeight: "bold",
            fontSize: "1.4rem",
          }}
        >
          Item Counts
        </h2>

        {aggregatedList.length === 0 ? (
          <p>No active items</p>
        ) : (
          aggregatedList.map(([name, count]) => (
            <div key={name} style={{ marginBottom: "15px" }}>
              {/* ITEM ROW */}
              <div
                onClick={() =>
                  setExpandedItem((prev) => (prev === name ? null : name))
                }
                style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {name} — {count}
              </div>

              {/* EXPANDABLE INPUT BOX */}
              {expandedItem === name && (
                <div
                  style={{
                    background: "#f5f5f5",
                    color: "#333",
                    padding: "15px",
                    borderRadius: "10px",
                    marginTop: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold" }}>
                    Enter prepared amount:
                  </label>

                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      fontSize: "1rem",
                    }}
                  />

                  <button
                    onClick={() => confirmAmount(name)}
                    style={{
                      marginTop: "10px",
                      padding: "10px 16px",
                      background: "var(--forest-green)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
