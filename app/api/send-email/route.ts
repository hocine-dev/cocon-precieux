// /app/api/send-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("Missing SMTP_USER or SMTP_PASS environment variables.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json(
      { success: false, error: "Server is not configured for sending emails." },
      { status: 500 }
    );
  }

  try {
    const { to, subject, body, order } = await req.json();
    if (!to || !subject || !body || !order) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }
    // Vérifier si un email a déjà été envoyé pour ce statut
    const clientPromise = (await import('@/lib/mongodb')).default;
    const { ObjectId } = await import('mongodb');
    const client = await clientPromise;
    const db = client.db();
    const orderDoc = await db.collection('orders').findOne({ _id: new ObjectId(order._id) });
    const status = order.status;
    if (orderDoc && Array.isArray(orderDoc.emailSentStatuses) && orderDoc.emailSentStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Email déjà envoyé pour ce statut." }, { status: 409 });
    }
    // Afficher le message personnalisé (body) en haut du mail, avant le résumé de commande, sans texte d'accueil supplémentaire
    const suiviUrl = `https://${req.headers.get("host") || "xn--coconprcieux-heb.fr"}/commande?id=${order._id}`;
    const html = `
      <div style="background:#FDFBF6;padding:0;margin:0;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 8px #e6d2b5;overflow:hidden;">
          <tr>
            <td style="background:#fff;padding:32px 24px 0 24px;text-align:center;">
              <h1 style="color:#C9A74D;font-family:serif;font-size:2rem;margin:0 0 18px 0;">Merci pour votre commande !</h1>
              <div style="font-size:1rem;color:#555;margin-bottom:18px;">${body.replace(/\n/g, '<br>')}</div>
              <div style="margin:18px 0 0 0;font-size:1rem;">
                Vous pouvez suivre l'état de votre commande à tout moment via <a href="${suiviUrl}" style="color:#C9A74D;text-decoration:underline;">ce lien</a>.
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px 24px;">
              <div style="background:#FDFBF6;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
                <h2 style="color:#C9A74D;font-size:1.1rem;margin:0 0 8px 0;">Résumé de votre commande</h2>
                <ul style="padding-left:18px;margin:0 0 8px 0;">
                  ${(order.cart || []).map((item:any) => `<li style='margin-bottom:4px;'><b>${item.name}</b> x${item.quantity} <span style='color:#888;'>— ${item.price}€</span></li>`).join('')}
                </ul>
                <ul style="padding-left:18px;margin:0 0 8px 0;">
                  <li style='margin-bottom:4px;'><b>Frais de Livraison:</b> <span style='color:#888;'>— 5.25 €</span></li>
                </ul>
                <div style="display:flex;justify-content:space-between;align-items:center;font-weight:bold;color:#C9A74D;font-size:1.1rem;margin-top:18px;margin-bottom:6px;">
                  <span>Total</span>
                  <span style="margin-left:18px;">${order.total} €</span>
                </div>
              </div>
              <div style="font-size:0.95rem;color:#888;margin-top:24px;">L'équipe <b style='color:#C9A74D;'>Cocon Précieux</b><br><a href='https://xn--coconprcieux-heb.fr/' style='color:#C9A74D;text-decoration:none;'>coconprecieux.fr</a></div>
            </td>
          </tr>
        </table>
      </div>
    `;
    const mailOptions = {
      from: `Cocon Précieux <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: body,
      html
    };
    await transporter.sendMail(mailOptions);
    // Ajouter le statut courant à emailSentStatuses (créé si absent)
    await db.collection('orders').updateOne(
      { _id: new ObjectId(order._id) },
      { $addToSet: { emailSentStatuses: status } }
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Failed to send email:", e);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
