"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Login failed");
        return;
      }

      window.localStorage.setItem("token", data.token);

      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (data.role === "staff") {
        window.location.href = "/staff/orders";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError("Login failed");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--forest-medium)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--forest-green)",
          padding: "30px",
          borderRadius: "12px",
          width: "320px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
          Staff Login
        </h1>

        <label style={{ display: "block", marginBottom: "8px" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "12px",
          }}
          required
        />

        <label style={{ display: "block", marginBottom: "8px" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "16px",
          }}
          required
        />

        {error && (
          <p style={{ color: "#ffb3b3", marginBottom: "10px" }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "var(--forest-mint)",
            color: "var(--forest-dark)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
