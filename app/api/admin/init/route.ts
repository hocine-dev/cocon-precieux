import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('admins');
    // Vérifie si déjà créé
    const exist = await collection.findOne({ username: 'Sandie' });
    if (exist) {
      return new Response(JSON.stringify({ success: false, error: 'Déjà créé' }), { status: 400 });
    }
    const hash = await bcrypt.hash('$tr0ngPA$$', 10);
    await collection.insertOne({ username: 'sandie', password: hash });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || e }), { status: 500 });
  }
}
