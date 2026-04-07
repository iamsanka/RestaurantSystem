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
        }}
      >
        View Order Screen
      </button>
    </div>
  );
}
