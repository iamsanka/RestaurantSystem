"use client";

import { Suspense } from "react";
import OrderSubmittedContent from "./OrderSubmittedContent";

export default function OrderSubmittedPage() {
  return (
    <Suspense fallback={
      <div
        style={{
          minHeight: "100vh",
          background: "var(--forest-dark)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--forest-mint)",
          fontSize: "24px",
        }}
      >
        Loading your order…
      </div>
    }>
      <OrderSubmittedContent />
    </Suspense>
  );
}
