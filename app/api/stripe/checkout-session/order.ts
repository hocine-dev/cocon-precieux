import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function createOrder({ cart, email, form }: { cart: any[]; email: string; form: any }) {
  const client = await clientPromise;
  const db = client.db();
  // Calcule le total (somme des prix * quantité + livraison)
  const totalProduits = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const livraison = 5.25;
  const total = parseFloat((totalProduits + livraison).toFixed(2));
  const order = {
    cart,
    email,
    ...form,
    total,
    createdAt: new Date(),
    status: 'en attente de paiement',
  };
  const result = await db.collection('orders').insertOne(order);
  return result.insertedId;
}
