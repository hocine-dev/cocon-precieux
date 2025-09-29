import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder } from "./order";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { cart, email, ...form } = await req.json();
    if (!cart || !email) {
      return NextResponse.json({ error: "Missing cart or email" }, { status: 400 });
    }
    // Crée la commande dans MongoDB et récupère son _id
    const orderId = await createOrder({ cart, email, form });
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    // Calcul de la quantité totale pour la livraison gratuite
    const totalQuantity = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    if (totalQuantity < 2) {
      // Add shipping as a line item uniquement si < 2 produits
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Livraison" },
          unit_amount: 525,
        },
        quantity: 1,
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: email,
      success_url: `${req.nextUrl.origin}/commande?id=${orderId.toString()}`,
      cancel_url: `${req.nextUrl.origin}/panier`,
      metadata: { email, orderId: orderId.toString() },
    });

    // Appel API send-email après paiement Stripe (confirmation)
    // (L'email sera envoyé après le paiement réussi, donc il faut appeler l'API dans le webhook Stripe, pas ici)

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
