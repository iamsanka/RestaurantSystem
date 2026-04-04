"use client";

export default function ReceiptTemplate({
  receiptRef,
  customerName,
  orderNumber,
  receiptDate,
  items,
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxRate = 0;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const th = {
    padding: "10px",
    borderBottom: "2px solid #e6d8c3",
    textAlign: "left",
    fontWeight: "bold",
    color: "#d87b2f",
  };

  const td = {
    padding: "10px",
    borderBottom: "1px solid #e6d8c3",
    verticalAlign: "top",
  };

  const tdCenter = { ...td, textAlign: "center" };
  const tdRight = { ...td, textAlign: "right" };

  return (
    <div
      style={{
        background: "#fdf7ef",     // ⭐ FULL PAGE BACKGROUND
        width: "100%",
        minHeight: "100%",
        padding: "40px 0",        // top/bottom padding for breathing room
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={receiptRef}
        style={{
          width: "650px",
          padding: "40px",
          background: "#fdf7ef",  // same color as outer wrapper
          color: "#333",
          fontFamily: "Georgia, serif",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", color: "#d87b2f" }}>
            Restaurant Receipt
          </h1>
          <p style={{ margin: 0, color: "#555" }}>Thank you for your order</p>
        </div>

        {/* CUSTOMER + ORDER INFO */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
          }}
        >
          <div>
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Order Number:</strong> {orderNumber}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p><strong>Date:</strong> {receiptDate}</p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "25px",
          }}
        >
          <thead>
            <tr style={{ background: "#f2e6d8" }}>
              <th style={th}>Item</th>
              <th style={th}>Qty</th>
              <th style={th}>Price</th>
              <th style={th}>Total</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td style={td}>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>

                  {/* FULL INGREDIENT LIST */}
                  {item.ingredients && (
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>
                      <strong>Ingredients:</strong> {item.ingredients.join(", ")}
                    </div>
                  )}

                  {/* REMOVED INGREDIENTS */}
                  {item.customizations?.length > 0 && (
                    <div style={{ fontSize: "12px", color: "#a33", marginTop: "2px" }}>
                      <strong>Removed:</strong> {item.customizations.join(", ")}
                    </div>
                  )}
                </td>

                <td style={tdCenter}>{item.qty}</td>
                <td style={tdRight}>€{item.price.toFixed(2)}</td>
                <td style={tdRight}>€{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div style={{ textAlign: "right", marginBottom: "30px" }}>
          <p><strong>Subtotal:</strong> €{subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> {taxRate * 100}%</p>
          <p style={{ fontSize: "20px", marginTop: "10px" }}>
            <strong>Total: €{total.toFixed(2)}</strong>
          </p>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "20px",
            background: "#f2e6d8",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: 0, color: "#d87b2f" }}>Pickup Instructions</h3>
          <p style={{ marginTop: "8px" }}>
            Please show this receipt at the counter.
          </p>
        </div>
      </div>
    </div>
  );
}
