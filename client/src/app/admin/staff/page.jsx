"use client";

import { useEffect, useState } from "react";
import CreateStaffModal from "./CreateStaffModal";
import EditStaffModal from "./EditStaffModal";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  async function loadStaff() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/admin/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid staff response:", data);
        setStaff([]);
        return;
      }

      setStaff(data);
      setLoading(false);
    } catch (err) {
      console.error("STAFF LOAD ERROR:", err);
      setStaff([]);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  async function deactivateUser(id) {
    if (!confirm("Deactivate this staff account?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/admin/staff/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Failed to deactivate staff");
      return;
    }

    loadStaff();
  }

  async function activateUser(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/admin/staff/${id}/activate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Failed to activate staff");
      return;
    }

    loadStaff();
  }

  async function deleteUser(id) {
    if (!confirm("Permanently delete this staff account? This cannot be undone.")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/admin/staff/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Failed to delete staff");
      return;
    }

    loadStaff();
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Staff Management
      </h1>

      <button
        onClick={() => setShowCreate(true)}
        style={{
          background: "var(--forest-mint)",
          color: "black",
          padding: "10px 16px",
          borderRadius: "8px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        + Create Staff
      </button>

      {loading ? (
        <p>Loading staff...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "var(--forest-green)",
            color: "white",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)" }}>
              <th style={{ padding: "12px" }}>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((user) => (
              <tr key={user.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "12px" }}>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || "-"}</td>
                <td>{user.role}</td>
                <td
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setEditUser(user)}
                    style={{
                      background: "#facc15",
                      color: "black",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    Edit
                  </button>

                  {user.role === "inactive" ? (
                    <button
                      onClick={() => activateUser(user.id)}
                      style={{
                        background: "#22c55e",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => deactivateUser(user.id)}
                      style={{
                        background: "#ff4d4d",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      Deactivate
                    </button>
                  )}

                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      background: "#7f1d1d",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreate && (
        <CreateStaffModal
          onClose={() => setShowCreate(false)}
          onCreated={loadStaff}
        />
      )}

      {editUser && (
        <EditStaffModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdated={loadStaff}
        />
      )}
    </div>
  );
}
