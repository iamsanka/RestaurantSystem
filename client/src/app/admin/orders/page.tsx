"use client";

import { useState } from "react";
import OrderRow from "./OrderRow";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  price_at_time: number;
  customizations: string[] | null;
  received: boolean;
  category_name: string | null;
};

type Order = {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  total_amount: number;
  status: string;
  created_at: string | null;
  payment_method: string | null;
  payment_status: string | null;
  notes: string | null;
  table_number: string | null;
  order_source: string | null;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL as string;
  const router = useRouter();

  function buildQueryParams() {
    const params = new URLSearchParams();

    const q = orderNumber || phone || email || name || "";

    if (q) params.append("query", q);

    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      params.append("date", formatted);
    }

    return params.toString();
  }

  async function searchOrders() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const queryString = buildQueryParams();
    if (!queryString) {
      alert("Please fill at least one field before searching.");
      return;
    }

    setLoading(true);

    const res = await fetch(`${API}/api/orders/admin/search?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.success && Array.isArray(data.orders)) {
      setOrders(data.orders as Order[]);
    }

    setLoading(false);
  }

  function resetSearch() {
    setPhone("");
    setEmail("");
    setName("");
    setOrderNumber("");
    setSelectedDate(null);
    setOrders([]);
    setExpandedId(null);
  }

  async function reviveOrder(id: number) {
    if (!confirm("Revive this order?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/orders/admin/${id}/revive`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Failed to revive order");
      return;
    }

    alert("Order revived and sent to staff screen");
    searchOrders();
  }

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      style={{
        padding: "40px",
        background: "var(--forest-medium)",
        minHeight: "100vh",
        color: "white",
      }}
    >
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

      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Order Management
      </h1>

      {/* SEARCH FIELDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label>Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Customer Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Order Number</label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* ⭐ Calendar Date Picker */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "6px" }}>Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="calendar-input"
            calendarClassName="calendar-popup"
          />
        </div>
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button onClick={searchOrders} style={buttonStyle}>
          Search
        </button>

        <button
          onClick={resetSearch}
          style={{ ...buttonStyle, background: "#444" }}
        >
          Reset
        </button>
      </div>

      {/* RESULTS */}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No results</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)" }}>
              <th style={cellStyle}>Order #</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Phone</th>
              <th style={cellStyle}>Email</th>
              <th style={cellStyle}>Total</th>
              <th style={cellStyle}>Status</th>
              <th style={cellStyle}>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <OrderRow
                key={o.id}
                order={o}
                expandedId={expandedId}
                toggleExpand={toggleExpand}
                reviveOrder={reviveOrder}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.2)",
  color: "white",
};

const buttonStyle: React.CSSProperties = {
  background: "var(--forest-green)",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "var(--forest-green)",
  borderRadius: "10px",
  overflow: "hidden",
};

const cellStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};
