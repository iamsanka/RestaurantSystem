"use client";

interface DeleteConfirmModalProps {
  id: number;
  onClose: () => void;
  reload: () => void;
}

export default function DeleteConfirmModal({
  id,
  onClose,
  reload,
}: DeleteConfirmModalProps) {
  const API = process.env.NEXT_PUBLIC_API_URL;

  async function confirm() {
    const token = localStorage.getItem("token");

    await fetch(`${API}/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    reload();
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
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
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Are you sure?</h2>
        <p style={{ marginBottom: "20px" }}>This action cannot be undone.</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={confirm}
            style={{
              flex: 1,
              padding: "10px",
              background: "#b91c1c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Yes, Delete
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              background: "#444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
