"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Portal from "../components/Portal";
import ReceiptTemplate from "../lib/ReceiptTemplate";
import "../styles/colors.css";

export default function OrderSubmittedContent() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [receiptDate, setReceiptDate] = useState("");

  const [isClient, setIsClient] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setReceiptDate(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    if (!orderId) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/public/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);

        setItems(
          data.items.map((i) => ({
            ...i,
            name: i.item_name,
            qty: i.quantity,
            price: Number(i.price_at_time),
          }))
        );
      });
  }, [orderId]);

  if (!isClient || !order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--neon-yellow)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--pure-black)",
          fontSize: "24px",
        }}
      >
        Loading your order…
      </div>
    );
  }

  const downloadReceipt = async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const element = receiptRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(13, 13, 13);
    pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

    const y = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0;

    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    pdf.save(`Receipt-${order.order_number}.pdf`);
  };

  const sendReceiptEmail = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/email/send-receipt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.order_number,
          customerName: order.customer_name,
          items,
          email: order.customer_email,
        }),
      }
    );

    const data = await res.json();
    alert(data.success ? "Receipt sent to your email." : "Failed to send receipt.");
  };

  return (
    <>
      <Portal>
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <ReceiptTemplate
            receiptRef={receiptRef}
            customerName={order.customer_name}
            orderNumber={order.order_number}
            receiptDate={receiptDate}
            items={items}
          />
        </div>
      </Portal>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--neon-yellow)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          color: "var(--pure-black)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            background: "#111111",
            padding: "40px",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
            border: "1px solid var(--warm-gold)",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "var(--warm-gold)",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pop 0.6s ease-out",
            }}
          >
            <span style={{ fontSize: "48px", color: "var(--pure-black)" }}>✓</span>
          </div>

          <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "var(--neon-yellow)" }}>
            Order Submitted!
          </h1>

          <p style={{ fontSize: "18px", marginBottom: "20px", color: "#e6e6e6" }}>
            Thank you, <strong>{order.customer_name}</strong> — your order has been received.
          </p>

          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "30px",
              color: "var(--warm-gold)",
            }}
          >
            Order Number: {order.order_number}
          </p>

          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={downloadReceipt}
              style={{
                padding: "14px 24px",
                background: "#333",
                color: "var(--neon-yellow)",
                border: "1px solid var(--warm-gold)",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Download Receipt
            </button>

            <button
              onClick={sendReceiptEmail}
              style={{
                padding: "14px 24px",
                background: "var(--soft-orange)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Send Receipt to Email
            </button>

            <button
              onClick={() => router.push("/")}
              style={{
                padding: "14px 24px",
                background: "var(--neon-yellow)",
                color: "var(--pure-black)",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
