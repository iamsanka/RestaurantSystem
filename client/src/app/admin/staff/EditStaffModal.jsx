"use client";

import { useState } from "react";

export default function EditStaffModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    password: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/admin/staff/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      onUpdated();
      onClose();
    } else {
      alert(data.error || "Failed to update staff");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "var(--forest-green)",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Edit Staff Account</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            style={inputStyle}
          />

          <select
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
            style={inputStyle}
          >
            <option value="staff">Staff</option>
            <option value="kitchen">Kitchen</option>
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            placeholder="New Password (optional)"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              background: "var(--forest-mint)",
              color: "black",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Save Changes
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
            background: "#ff4d4d",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.2)",
  color: "white",
};
