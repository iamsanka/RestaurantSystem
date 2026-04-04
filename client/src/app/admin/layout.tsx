"use client";

import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ⭐ sidebar toggle

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const base64 = token.split(".")[1];
      const decoded = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        ),
      );

      if (decoded.role === "admin") {
        setAllowed(true);
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("TOKEN DECODE ERROR:", err);
      window.location.href = "/login";
    }
  }, []);

  if (!allowed) return null;

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  function go(path: string) {
    window.location.href = path;
  }

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "var(--forest-medium)",
          minHeight: "100vh",
          color: "white",
          display: "flex",
        }}
      >
        {/* ⭐ SIDEBAR */}
        <div
          style={{
            width: sidebarOpen ? "240px" : "70px",
            transition: "width 0.25s ease",
            background: "var(--forest-dark)",
            borderRight: "2px solid rgba(255,255,255,0.1)",
            paddingTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            overflow: "hidden",
          }}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              marginLeft: "10px",
              marginBottom: "20px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "22px",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Menu Buttons */}
          <SidebarButton
            label="Dashboard"
            icon="fa-gauge"
            open={sidebarOpen}
            onClick={() => go("/admin/dashboard")}
          />

          <SidebarButton
            label="Order Screen"
            icon="fa-list"
            open={sidebarOpen}
            onClick={() => go("/staff/orders")}
          />

          <SidebarButton
            label="Manage Menu"
            icon="fa-utensils"
            open={sidebarOpen}
            onClick={() => go("/admin/menu")}
          />

          <SidebarButton
            label="Manage Staff"
            icon="fa-users"
            open={sidebarOpen}
            onClick={() => go("/admin/staff")}
          />

          <SidebarButton
            label="Manage Orders"
            icon="fa-box"
            open={sidebarOpen}
            onClick={() => go("/admin/orders")}
          />

          {/* Logout */}
          <SidebarButton
            label="Logout"
            icon="fa-right-from-bracket"
            open={sidebarOpen}
            onClick={logout}
            danger
          />
        </div>

        {/* ⭐ MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            transition: "margin-left 0.25s ease",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}

/* ---------------------------------------------
   Sidebar Button Component
---------------------------------------------- */

function SidebarButton({
  label,
  icon,
  open,
  onClick,
  danger,
}: {
  label: string;
  icon: string;
  open: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: danger ? "#b91c1c" : "transparent",
        border: "none",
        color: "white",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "16px",
        fontWeight: "bold",
      }}
    >
      <i
        className={`fa ${icon}`}
        style={{ width: "20px", textAlign: "center" }}
      ></i>
      {open && <span>{label}</span>}
    </button>
  );
}
