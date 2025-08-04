import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // Met à jour le statut de la commande à 'En préparation' après paiement Stripe
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const clientPromise = (await import('@/lib/mongodb')).default;
      const { ObjectId } = await import('mongodb');
      const client = await clientPromise;
      const db = client.db();
      await db.collection('orders').updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: 'En préparation' } }
      );
      // Récupère la commande pour l'email
      const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });
      if (order && order.email) {
        // Envoie l'email de confirmation via la boîte pro Hostinger
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporter.sendMail({
          from: `Cocon Précieux <${process.env.SMTP_USER}>`,
          to: order.email,
          subject: "Confirmation de votre commande Cocon Précieux",
          text: `Bonjour ${order.prenom || ''},\n\nNous avons bien reçu votre commande !\nMontant total : ${order.total}€\nStatut : En préparation\n\nMerci pour votre confiance.\n\nL'équipe Cocon Précieux`,
          html: `<h2>Merci pour votre commande !</h2><p>Bonjour ${order.prenom || ''},</p><p>Nous avons bien reçu votre commande.</p><p><b>Montant total :</b> ${order.total}€<br><b>Statut :</b> En préparation</p><p>Nous vous tiendrons informé de l'expédition.<br><br>L'équipe Cocon Précieux</p>`
        });
      }
    }
  }
  return NextResponse.json({ received: true });
}
