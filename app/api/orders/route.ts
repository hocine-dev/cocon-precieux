import { ObjectId } from 'mongodb';
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'id et status requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('orders');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Commande non trouvée ou non modifiée' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e?.message || e }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('orders');
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
    });
    return new Response(JSON.stringify({ success: true, id: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e?.message || e }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const day = url.searchParams.get('day'); // format YYYY-MM-DD
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('orders');
    if (id) {
      const order = await collection.findOne({ _id: new ObjectId(id) });
      if (!order) {
        return new Response(JSON.stringify({ success: false, error: 'Commande introuvable' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ success: true, order }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      let filter: any = {};
      if (day) {
        const start = new Date(day + 'T00:00:00.000Z');
        const end = new Date(day + 'T23:59:59.999Z');
        filter.createdAt = { $gte: start, $lte: end };
      }
      const total = await collection.countDocuments(filter);
      const orders = await collection.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      return new Response(JSON.stringify({ success: true, orders, total, page, limit }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e?.message || e }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
