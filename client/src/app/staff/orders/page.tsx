"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import PreparingOrderCard from "./PreparingOrderCard";
import { useRouter } from "next/navigation";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  transports: ["websocket"],
});

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: "received" | "preparing" | "done" | "collected";
  created_at: string;
  preparation_time: number | null;
};

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  price_at_time: number;
  customizations: string[] | null;
  received: boolean;
  category_name: string;
};

export default function StaffOrdersPage() {
  const router = useRouter();

  const [role, setRole] = useState<"staff" | "admin" | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [itemsByOrder, setItemsByOrder] = useState<Record<number, OrderItem[]>>(
    {},
  );

  const [timers, setTimers] = useState<Record<number, number>>({});
  const [todayStats, setTodayStats] = useState({ total: 0, avgPrep: 0 });

  /* ---------------------------
     Detect role for Back button
  ---------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      setRole(payload.role);
    } catch {
      setRole(null);
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  async function loadItems(orderId: number) {
    const token = window.localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
      {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      },
    );
    const data = await res.json();

    setItemsByOrder((prev) => ({
      ...prev,
      [orderId]: data.items || [],
    }));
  }

  function calculateTodayStats(allOrders: Order[]) {
    const today = new Date().toISOString().slice(0, 10);

    const todaysOrders = allOrders.filter((o) =>
      o.created_at.startsWith(today),
    );

    const total = todaysOrders.length;

    const prepTimes = todaysOrders
      .filter((o) => o.preparation_time != null)
      .map((o) => o.preparation_time!);

    const avgPrep =
      prepTimes.length > 0
        ? Math.floor(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length)
        : 0;

    setTodayStats({ total, avgPrep });
  }

  useEffect(() => {
    async function loadOrders() {
      const token = window.localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();

      if (data.success) {
        const now = Date.now();
        const newTimers: Record<number, number> = {};

        data.orders.forEach((o: Order) => {
          if (o.status !== "done") {
            newTimers[o.id] = now;
          }
        });

        setTimers(newTimers);
        setOrders(data.orders);
        calculateTodayStats(data.orders);

        data.orders.forEach((o: Order) => loadItems(o.id));
      }
    }
    loadOrders();
  }, []);

  useEffect(() => {
    function handleNew(order: Order) {
      const now = Date.now();

      setTimers((prev) => ({
        ...prev,
        [order.id]: now,
      }));

      setOrders((prev) => {
        const next = [order, ...prev.filter((o) => o.id !== order.id)];
        calculateTodayStats(next);
        return next;
      });

      loadItems(order.id);
    }

    function handleUpdate(updatedOrder: Order) {
      setTimers((prev) => {
        const newTimers = { ...prev };

        if (updatedOrder.status === "done") {
          delete newTimers[updatedOrder.id];
        } else {
          if (!newTimers[updatedOrder.id]) {
            newTimers[updatedOrder.id] = Date.now();
          }
        }

        return newTimers;
      });

      setOrders((prev) => {
        const next = prev.map((o) =>
          o.id === updatedOrder.id ? updatedOrder : o,
        );
        calculateTodayStats(next);
        return next;
      });

      loadItems(updatedOrder.id);
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

  async function updateStatus(
    id: number,
    status: Order["status"],
    finalTime?: number,
  ) {
    const token = window.localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ status, finalTime }),
    });
  }

  async function toggleItem(
    orderId: number,
    itemId: number,
    received: boolean,
  ) {
    const token = window.localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/item-received`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ itemId, received }),
      },
    );

    const data = await res.json();
    if (data.items) {
      setItemsByOrder((prev) => ({
        ...prev,
        [orderId]: data.items,
      }));
    }
  }

  function groupItems(items: OrderItem[]) {
    const groups: Record<string, OrderItem[]> = {};
    for (const item of items) {
      if (!groups[item.category_name]) groups[item.category_name] = [];
      groups[item.category_name].push(item);
    }
    return groups;
  }

  const received = orders.filter((o) => o.status === "received");
  const preparing = orders.filter((o) => o.status === "preparing");
  const done = orders.filter((o) => o.status === "done");

  return (
    <div
      style={{
        padding: "20px",
        background: "var(--forest-medium)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* ⭐ TOP BAR WITH BACK BUTTON + LOGOUT ON SAME LINE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        {/* LEFT: BACK BUTTON */}
        <button
          onClick={() =>
            router.push(
              role === "admin" ? "/admin/dashboard" : "/staff/dashboard",
            )
          }
          style={{
            background: "transparent",
            border: "none",
            color: "var(--forest-mint)",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>

        {/* RIGHT: STATS + LOGOUT */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              fontWeight: "bold",
            }}
          >
            Today: {todayStats.total} orders • Avg:{" "}
            {formatTime(todayStats.avgPrep)}
          </div>

          <button
            onClick={logout}
            style={{
              padding: "10px 16px",
              background: "#b91c1c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* 3 COLUMNS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          height: "calc(100vh - 100px)",
          borderTop: "2px solid #444",
        }}
      >
        {/* RECEIVED */}
        <Column title="Order Received" orders={received} timers={timers}>
          {(order) => {
            const items = itemsByOrder[order.id] || [];

            return (
              <>
                <ItemList items={items} />

                <button
                  onClick={() => updateStatus(order.id, "preparing")}
                  className="staff-btn"
                >
                  Accept
                </button>
              </>
            );
          }}
        </Column>

        {/* PREPARING */}
        <Column title="Preparing" orders={preparing} timers={timers}>
          {(order) => {
            const items = itemsByOrder[order.id] || [];
            const groups = groupItems(items);
            const allReceived =
              items.length > 0 && items.every((i) => i.received);

            return (
              <PreparingOrderCard
                order={order}
                groupedItems={groups}
                onToggleItem={(itemId, received) =>
                  toggleItem(order.id, itemId, received)
                }
                onDone={() => {
                  const start = timers[order.id] ?? Date.now();
                  const finalTime = Math.floor((Date.now() - start) / 1000);

                  updateStatus(order.id, "done", finalTime);
                }}
                allReceived={allReceived}
              />
            );
          }}
        </Column>

        {/* DONE */}
        <Column title="Order Done" orders={done} timers={timers}>
          {(order) => {
            const items = itemsByOrder[order.id] || [];

            return (
              <>
                <ItemList items={items} />

                <button
                  onClick={() => updateStatus(order.id, "collected")}
                  className="staff-btn"
                >
                  Collected
                </button>
              </>
            );
          }}
        </Column>
      </div>

      <style>{`
        .staff-card {
          padding: 20px;
          border-radius: 16px;
          margin-bottom: 15px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.35);
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .staff-card:hover {
          transform: translateY(-2px);
        }
        .staff-btn {
          margin-top: 10px;
          padding: 12px 18px;
          background: var(--forest-mint);
          color: var(--forest-dark);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------
   ITEM LIST
---------------------------------------------- */

function ItemList({ items }: { items: OrderItem[] }) {
  return (
    <div style={{ marginTop: "10px", textAlign: "left" }}>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: "8px" }}>
          <strong>{item.item_name}</strong> × {item.quantity}
          {item.customizations && item.customizations.length > 0 && (
            <div style={{ fontSize: "0.9rem", color: "#f0f0f0" }}>
              Removed: {item.customizations.join(", ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------
   COLUMN + ORDER CARD
---------------------------------------------- */

function Column({
  title,
  orders,
  timers,
  children,
}: {
  title: string;
  orders: Order[];
  timers: Record<number, number>;
  children: (order: Order) => React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "20px",
        overflowY: "auto",
        borderRight: "2px solid #444",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "var(--forest-mint)",
          fontWeight: "bold",
          fontSize: "1.4rem",
        }}
      >
        {title} ({orders.length})
      </h2>

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} timers={timers}>
          {children(order)}
        </OrderCard>
      ))}
    </div>
  );
}

function OrderCard({
  order,
  timers,
  children,
}: {
  order: Order;
  timers: Record<number, number>;
  children: React.ReactNode;
}) {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (order.status === "done") {
      setSeconds(order.preparation_time ?? 0);
      return;
    }

    const start = timers[order.id] ?? Date.now();
    setSeconds(0);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setSeconds(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.status, timers[order.id]]);

  function formatKitchen(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  }

  function getUrgencyColor(sec: number) {
    if (order.status === "done") return "#166534";
    if (sec >= 600) return "#b91c1c";
    if (sec >= 300) return "#ca8a04";
    return "#166534";
  }

  const bgColor = getUrgencyColor(seconds);

  return (
    <div
      className="staff-card"
      style={{
        background: bgColor,
      }}
    >
      <h3 className="text-xl font-bold">{order.order_number}</h3>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        ⏱ {formatKitchen(seconds)}
      </p>

      <hr style={{ borderColor: "#eee", margin: "10px 0" }} />

      {children}
    </div>
  );
}
