"use client";

import { useRouter } from "next/navigation";

export default function StaffDashboard() {
  const router = useRouter();

  return (
    <div
      style={{
        padding: "40px",
        background: "var(--forest-medium)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Staff Dashboard
      </h1>

      {/* Order Screen Button */}
      <button
        onClick={() => router.push("/staff/orders")}
        style={{
          padding: "12px 20px",
          background: "var(--forest-mint)",
          color: "black",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          marginRight: "15px",
        }}
      >
        View Order Screen
      </button>

      {/* ⭐ Kitchen View Button */}
      <button
        onClick={() => router.push("/staff/kitchen")}
        style={{
          padding: "12px 20px",
          background: "var(--forest-green)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Kitchen View
      </button>
    </div>
  );
}
