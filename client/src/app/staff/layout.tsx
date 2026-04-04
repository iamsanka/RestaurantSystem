"use client";

import { useEffect, useState } from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      if (payload.role === "staff" || payload.role === "admin") {
        setAllowed(true);
      } else {
        window.location.href = "/login";
      }
    } catch {
      window.location.href = "/login";
    }
  }, []);

  if (!allowed) return null;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "var(--forest-medium)",
          minHeight: "100vh",
        }}
      >
        {/* Hidden audio element for bell sound */}
        <audio id="new-order-sound">
          <source src="/sounds/bell.wav" type="audio/mpeg" />
        </audio>
        {children}
      </body>
    </html>
  );
}
