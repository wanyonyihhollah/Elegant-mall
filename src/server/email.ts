import nodemailer from "nodemailer";
import { Order, Promotion, EmailLog } from "../types";

let transporter: nodemailer.Transporter | null = null;
let testAccount: any = null;

// Lazy initialize Ethereal SMTP
async function getTransporter() {
  if (transporter) return { transporter, testAccount };
  try {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[SMTP] Created Ethereal test account: ${testAccount.user}`);
    return { transporter, testAccount };
  } catch (error) {
    console.error("[SMTP] Error creating Ethereal account, falling back to simulator mode", error);
    return { transporter: null, testAccount: null };
  }
}

// Global helper to store email logs (referenced in server.ts)
export const emailLogs: EmailLog[] = [];

// Base styling utility for luxury gold & charcoal aesthetic
const getEmailWrapper = (title: string, contentHtml: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background-color: #0A0A0A;
      color: #E5E5E5;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0F0F0F;
      border: 1px solid #D4AF37;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #D4AF37;
      padding-bottom: 25px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #D4AF37;
      font-size: 26px;
      font-weight: 300;
      letter-spacing: 3px;
      margin: 0 0 5px 0;
      text-transform: uppercase;
    }
    .header p {
      color: #888;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
    }
    .content {
      font-size: 14px;
      line-height: 1.8;
      color: #CCCCCC;
    }
    .highlight-gold {
      color: #D4AF37;
      font-weight: bold;
    }
    .button-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      background-color: #D4AF37;
      color: #0A0A0A;
      text-decoration: none;
      padding: 14px 30px;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 2px;
      display: inline-block;
      transition: background 0.3s;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #222222;
      padding-top: 25px;
      margin-top: 35px;
      font-size: 10px;
      color: #555555;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Elegant Mall</h1>
      <p>${title}</p>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      Elegant Mall Luxury Group &copy; 2026. All Rights Reserved.<br>
      Westlands Ave, Nairobi, Kenya
    </div>
  </div>
</body>
</html>
`;

export async function sendSimulatedEmail(
  recipient: string,
  subject: string,
  type: 'order_success' | 'cart_abandonment' | 'promotional',
  contentHtml: string,
  saveToDbCallback: (log: EmailLog) => void
): Promise<EmailLog> {
  const { transporter } = await getTransporter();
  const id = "ML-" + Math.floor(100000 + Math.random() * 900000);
  const log: EmailLog = {
    id,
    recipient,
    subject,
    body: contentHtml,
    type,
    sentAt: new Date().toISOString(),
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: '"Elegant Concierge" <concierge@elegantmall.com>',
        to: recipient,
        subject: subject,
        html: contentHtml,
      });

      const etherealUrl = nodemailer.getTestMessageUrl(info);
      if (etherealUrl) {
        log.etherealUrl = etherealUrl;
        log.previewUrl = etherealUrl;
        console.log(`[SMTP] Email successfully sent. Preview URL: ${etherealUrl}`);
      }
    } catch (err) {
      console.error("[SMTP] Error sending email via Ethereal, logging local copy", err);
    }
  }

  // Save via database callback to persist in db.json
  saveToDbCallback(log);
  return log;
}

export async function triggerOrderSuccessEmail(
  order: Order,
  saveToDbCallback: (log: EmailLog) => void
) {
  const itemsList = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #222;">
        <span style="font-style: italic; color: #fff;">${item.title}</span>
        <br/><span style="font-size: 10px; color: #888;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #222; text-align: right; font-family: monospace; color: #D4AF37;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");

  const contentHtml = getEmailWrapper(
    "Order Confirmation",
    `
    <p>Dear <span class="highlight-gold">${order.customerName}</span>,</p>
    <p>Thank you for shopping with us. Your elegant acquisition has been successfully processed and our dispatch team is carefully wrapping your selections in our signature luxury presentation.</p>
    
    <div style="background-color: #0A0A0A; border: 1px solid #222; padding: 20px; margin: 25px 0;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888;">Order Reference:</span>
        <strong style="font-family: monospace; color: #D4AF37;">${order.id}</strong>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="text-transform: uppercase; font-size: 9px; color: #888; border-bottom: 1px solid #D4AF37;">
            <th style="text-align: left; padding-bottom: 8px;">Item Details</th>
            <th style="text-align: right; padding-bottom: 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding-top: 15px; font-weight: bold; text-transform: uppercase; font-size: 11px; color: #888;">Total Acquisition Value</td>
            <td style="padding-top: 15px; text-align: right; font-family: monospace; font-size: 14px; font-weight: bold; color: #D4AF37;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p>Your order status is currently <span class="highlight-gold" style="text-transform: uppercase; font-size: 11px;">${order.status}</span>. You can track your boutique box movements via your customer dashboard using payment method <strong style="text-transform: uppercase;">${order.paymentMethod}</strong>.</p>
    
    <div class="button-container">
      <a href="https://elegantmall.com/orders/${order.id}" class="btn">View Order Details</a>
    </div>
    
    <p style="font-size: 12px; color: #777; font-style: italic;">Should you require boutique styling guidance or shipping alterations, our 24/7 AI Concierge and dedicated hosts are at your disposal.</p>
  `
  );

  return sendSimulatedEmail(
    order.customerEmail,
    `Your Elegant Mall Acquisition [${order.id}]`,
    "order_success",
    contentHtml,
    saveToDbCallback
  );
}

export async function triggerCartAbandonmentEmail(
  recipientEmail: string,
  customerName: string,
  items: { title: string; price: number; image: string }[],
  saveToDbCallback: (log: EmailLog) => void
) {
  const itemsHtml = items
    .map(
      (item) => `
    <div style="display: flex; align-items: center; gap: 15px; border-bottom: 1px solid #222; padding: 12px 0;">
      <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border: 1px solid #D4AF37;" />
      <div style="flex-1;">
        <h4 style="margin: 0; font-size: 13px; color: #fff; font-family: sans-serif;">${item.title}</h4>
        <span style="font-family: monospace; font-size: 11px; color: #D4AF37;">$${item.price.toFixed(2)}</span>
      </div>
    </div>`
    )
    .join("");

  const contentHtml = getEmailWrapper(
    "Forgotten Treasures",
    `
    <p>Dear <span class="highlight-gold">${customerName || "Patron"}</span>,</p>
    <p>We noticed you left some extraordinary items behind in your Elegant Mall digital shopping cart. Treasures this exceptional deserve to be showcased, not left in the shadow of an incomplete checkout.</p>
    
    <div style="background-color: #0A0A0A; border: 1px solid #222; padding: 20px; margin: 25px 0;">
      <h3 style="margin: 0 0 15px 0; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; color: #888; border-bottom: 1px solid #222; padding-bottom: 8px;">Awaiting Your Return</h3>
      ${itemsHtml}
    </div>

    <p>To assist in your final decision, we have prepared an exclusive incentive. Apply the VIP reservation code below during your return for <span class="highlight-gold">10% off your entire bag</span>:</p>
    
    <div style="text-align: center; margin: 25px 0; background: #141416; border: 1px dashed #D4AF37; padding: 15px;">
      <span style="font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 4px; color: #D4AF37;">ELEGANT10</span>
    </div>

    <div class="button-container">
      <a href="https://elegantmall.com/cart" class="btn">Resume My Purchase</a>
    </div>

    <p style="font-size: 11px; color: #666; font-style: italic; text-align: center;">This custom VIP offer expires in 48 hours. Items in cart are not reserved and subject to store boutique availability.</p>
  `
  );

  return sendSimulatedEmail(
    recipientEmail,
    "Your luxury selection awaits completion - Elegant Mall",
    "cart_abandonment",
    contentHtml,
    saveToDbCallback
  );
}

export async function triggerPromotionalEmail(
  recipientEmail: string,
  customerName: string,
  promotion: Promotion,
  saveToDbCallback: (log: EmailLog) => void
) {
  const contentHtml = getEmailWrapper(
    "Exclusive Invitation",
    `
    <p>Dear <span class="highlight-gold">${customerName || "Patron"}</span>,</p>
    <p>You are cordially invited to participate in our seasonal luxury showcase: <strong class="highlight-gold">${promotion.title}</strong>.</p>
    
    ${
      promotion.image
        ? `
    <div style="margin: 25px 0; text-align: center;">
      <img src="${promotion.image}" alt="${promotion.title}" style="max-width: 100%; border: 1px solid #D4AF37;" />
    </div>`
        : ""
    }

    <p>As a distinguished patron of our directory, you can unlock immediate access to exclusive curations with an additional <span class="highlight-gold">${promotion.discount}% premium deduction</span>. Apply this private invitation code at checkout:</p>
    
    <div style="text-align: center; margin: 30px 0; background: #141416; border: 1px solid #D4AF37; padding: 20px;">
      <span style="font-family: monospace; font-size: 22px; font-weight: bold; letter-spacing: 5px; color: #D4AF37;">${promotion.code}</span>
      <p style="margin: 8px 0 0 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px;">VIP PASS CODE</p>
    </div>

    <div class="button-container">
      <a href="https://elegantmall.com/catalog" class="btn">Explore The Private Sale</a>
    </div>

    <p style="font-size: 11px; color: #666; text-align: center;">This premium catalog code is valid for a limited period only. Not combinable with other boutique offers.</p>
  `
  );

  return sendSimulatedEmail(
    recipientEmail,
    `VIP Invitation: ${promotion.title} (${promotion.discount}% Off)`,
    "promotional",
    contentHtml,
    saveToDbCallback
  );
}
