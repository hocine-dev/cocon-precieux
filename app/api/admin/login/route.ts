import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('admins');
    const admin = await collection.findOne({ username });
    if (!admin) {
      return new Response(JSON.stringify({ success: false, error: 'Utilisateur inconnu' }), { status: 401 });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, error: 'Mot de passe incorrect' }), { status: 401 });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || e }), { status: 500 });
  }
}
