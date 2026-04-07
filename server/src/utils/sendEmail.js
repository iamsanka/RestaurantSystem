import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(to, order) {
  if (!to) return;

  const { orderNumber, items, totalAmount } = order;

  const itemsHtml = items
    .map((i) => {
      const removedHtml =
        i.removedIngredients && i.removedIngredients.length > 0
          ? `
            <div style="font-size: 13px; color: #e74c3c; margin-top: 4px;">
              <strong>Removed:</strong> ${i.removedIngredients.join(", ")}
            </div>
          `
          : "";

      return `
        <tr>
          <td style="padding: 8px 0; font-size: 15px;">
            ${i.qty} × ${i.name}
            ${removedHtml}
          </td>
          <td style="padding: 8px 0; font-size: 15px; text-align: right;">
            €${(i.price * i.qty).toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #ffffff; border-radius: 10px; border: 1px solid #eee;">
      
      <h2 style="text-align: center; color: #2c3e50; margin-bottom: 5px;">
        Your Order is Confirmed
      </h2>
      <p style="text-align: center; color: #7f8c8d; margin-top: 0;">
        Thank you for ordering from our restaurant!
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <h3 style="color: #2c3e50;">Order Details</h3>

      <p style="font-size: 15px; margin: 5px 0;">
        <strong>Order Number:</strong> ${orderNumber}
      </p>

      <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
        ${itemsHtml}
        <tr>
          <td style="padding: 10px 0; font-size: 16px; font-weight: bold; border-top: 1px solid #ddd;">
            Total
          </td>
          <td style="padding: 10px 0; font-size: 16px; font-weight: bold; text-align: right; border-top: 1px solid #ddd;">
            €${totalAmount.toFixed(2)}
          </td>
        </tr>
      </table>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 14px; color: #7f8c8d;">
        If you have any questions about your order, feel free to reply to this email.
      </p>

      <p style="font-size: 14px; color: #2c3e50; margin-top: 20px;">
        — The Restaurant Team
      </p>

    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM, // e.g. no-reply@yourdomain.eu.org
      to,
      subject: `Order Confirmation — ${orderNumber}`,
      html,
    });

    if (result.error) {
      console.error("Resend email error:", result.error);
    }
  } catch (err) {
    console.error("Resend sendEmail() error:", err);
  }
}
