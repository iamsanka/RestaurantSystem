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
        background: "var(--neon-yellow)", // ⭐ BRAND BACKGROUND
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--pure-black)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--pure-black)", // ⭐ BLACK CARD
          padding: "35px",
          borderRadius: "14px",
          width: "340px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        <h1
          style={{
            marginBottom: "25px",
            textAlign: "center",
            fontWeight: "900",
            fontSize: "1.8rem",
            color: "var(--neon-yellow)", // ⭐ TITLE COLOR
          }}
        >
          Staff Login
        </h1>

        <label style={{ display: "block", marginBottom: "6px" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid var(--warm-gold)", // ⭐ GOLD BORDER
            marginBottom: "14px",
            background: "#111",
            color: "white",
          }}
          required
        />

        <label style={{ display: "block", marginBottom: "6px" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "2px solid var(--warm-gold)",
            marginBottom: "18px",
            background: "#111",
            color: "white",
          }}
          required
        />

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              marginBottom: "12px",
              fontWeight: "bold",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            background: "var(--neon-yellow)", // ⭐ BRAND BUTTON
            color: "var(--pure-black)",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.2s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "var(--soft-orange)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--neon-yellow)")
          }
        >
          Login
        </button>
      </form>
    </div>
  );
}
