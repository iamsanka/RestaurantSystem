"use client";

import React from "react";

type OrderItem = {
  id: number;
  item_name: string;
  quantity: number;
  price_at_time: number;
  customizations: string[] | null;
  received: boolean;
  category_name: string | null;
};

type Order = {
  id: number;
  order_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  total_amount: number;
  status: string;
  created_at: string | null;
  payment_method: string | null;
  payment_status: string | null;
  notes: string | null;
  table_number: string | null;
  order_source: string | null;

  // ⭐ REQUIRED
  items: OrderItem[];
};

type Props = {
  order: Order;
  expandedId: number | null;
  toggleExpand: (id: number) => void;
  reviveOrder: (id: number) => void;
};

export default function OrderRow({
  order,
  expandedId,
  toggleExpand,
  reviveOrder,
}: Props) {
  const isExpanded = expandedId === order.id;

  return (
    <>
      {/* MAIN ROW */}
      <tr
        onClick={() => toggleExpand(order.id)}
        style={{
          textAlign: "center",
          cursor: "pointer",
          background: isExpanded ? "rgba(255,255,255,0.08)" : "transparent",
        }}
      >
        <td style={cellStyle}>{order.order_number}</td>
        <td style={cellStyle}>{order.customer_name ?? "-"}</td>
        <td style={cellStyle}>{order.customer_phone ?? "-"}</td>
        <td style={cellStyle}>{order.customer_email ?? "-"}</td>
        <td style={cellStyle}>€{order.total_amount}</td>
        <td style={cellStyle}>{order.status}</td>
        <td style={cellStyle}>
          {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
        </td>
      </tr>

      {/* EXPANDABLE PANEL */}
      <tr>
        <td colSpan={7} style={{ padding: 0 }}>
          <div
            style={{
              maxHeight: isExpanded ? "800px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}
          >
            {isExpanded && (
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  padding: "20px",
                  borderRadius: "0 0 10px 10px",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>Order Details</h3>

                {/* ITEMS LIST */}
                <h4 style={{ marginTop: "15px" }}>Items</h4>
                <div style={{ marginBottom: "15px" }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "10px",
                        marginBottom: "10px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "6px",
                      }}
                    >
                      <strong>
                        {item.item_name} x{item.quantity}
                      </strong>{" "}
                      — €{item.price_at_time}
                      <br />
                      <span style={{ opacity: 0.8 }}>
                        Category: {item.category_name ?? "-"}
                      </span>
                      <br />
                      {item.customizations &&
                        item.customizations.length > 0 && (
                          <div style={{ marginTop: "5px" }}>
                            <em>Customizations:</em>
                            <ul>
                              {item.customizations.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* OTHER ORDER DETAILS */}
                <p>
                  <strong>Payment Method:</strong> {order.payment_method ?? "-"}
                </p>
                <p>
                  <strong>Payment Status:</strong> {order.payment_status ?? "-"}
                </p>
                <p>
                  <strong>Notes:</strong> {order.notes ?? "-"}
                </p>
                <p>
                  <strong>Table Number:</strong> {order.table_number ?? "-"}
                </p>
                <p>
                  <strong>Order Source:</strong> {order.order_source ?? "-"}
                </p>

                <button
                  onClick={() => reviveOrder(order.id)}
                  style={{
                    marginTop: "15px",
                    background: "var(--forest-mint)",
                    color: "black",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Revive Order
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};
