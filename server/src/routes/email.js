import express from "express";
import { Resend } from "resend";

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-receipt", async (req, res) => {
  const { orderNumber, customerName, items, email } = req.body;

  try {
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

    const html = `
      <div style="font-family: 'Georgia', serif; padding: 30px; background: #111; color: #f5f5f5; border-radius: 12px;">
        <h1 style="text-align: center; color: gold; margin-bottom: 10px;">🍽️ Your Receipt</h1>
        <p style="text-align: center; color: #ccc; margin-bottom: 30px;">Thank you for dining with us</p>

        <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <p><strong style="color: gold;">Customer:</strong> ${customerName}</p>
          <p><strong style="color: gold;">Order Number:</strong> ${orderNumber}</p>
          <p><strong style="color: gold;">Date:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h2 style="color: gold; margin-bottom: 10px;">Order Summary</h2>
        <table style="width: 100%; border-collapse: collapse; color: #eee;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #444;">Item</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #444;">Qty</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #444;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px;">${item.name}</td>
                <td style="padding: 8px; text-align: right;">${item.qty}</td>
                <td style="padding: 8px; text-align: right;">€${(
                  item.price * item.qty
                ).toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <h2 style="color: gold; margin-top: 20px;">Total: €${total}</h2>

        <div style="margin-top: 30px; padding: 20px; background: #1a1a1a; border-radius: 10px;">
          <h3 style="color: gold;">Pickup Instructions</h3>
          <p>Please show this receipt at the counter. Your food will be ready in approximately <strong>15–20 minutes</strong>.</p>
        </div>

        <p style="text-align: center; margin-top: 40px; color: #777;">
          © ${new Date().getFullYear()} Your Restaurant — Thank you for your order
        </p>
      </div>
    `;

    // ⭐ SEND EMAIL USING RESEND
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM, // e.g. no-reply@yourdomain.eu.org
      to: email,
      subject: `Your Receipt — Order ${orderNumber}`,
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return res.json({ success: false });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    res.json({ success: false });
  }
});

export default router;
