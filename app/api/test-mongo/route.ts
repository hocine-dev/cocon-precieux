import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    // Pour MongoClient v4/v5, il faut utiliser client.db()
    const db = client.db(); // par défaut, prend la DB de l'URI
    await db.admin().ping();
    return new Response('Connexion MongoDB OK', { status: 200 });
  } catch (e: any) {
    return new Response('Erreur de connexion MongoDB : ' + (e?.message || e), { status: 500 });
  }
}