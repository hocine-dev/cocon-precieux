  "use client"
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

// Type d'une commande
interface Order {
  id: string;
  _id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "en attente de paiement" | "payé" | "livré" | "finalisé" | "annulé";
}

const ORDERS_KEY = "cocon_precieux_orders";
const STATUS_OPTIONS = [
  "en attente de paiement",
  "payé",
  "livré",
  "finalisé",
  "annulé",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [statusChanged, setStatusChanged] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [changedOrder, setChangedOrder] = useState<{id: string, status: string} | null>(null);


function handleLogout() {
    Cookies.remove('admin_token');
    setIsAuth(false);
    setLogin({ username: '', password: '' });
  }

  // Vérifie le token JWT au chargement
  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (token) {
      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      let url = `/api/orders?page=${page}&limit=10`;
      if (dateFilter) {
        url += `&day=${dateFilter}`;
      }
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
            setTotal(data.total);
          }
        });
    }
  }, [isAuth, page, dateFilter]);

  async function updateStatus(orderId: string, status: Order["status"]) {
    try {
      // Chercher l'objet order pour trouver _id si dispo
      const order = orders.find(o => o.id === orderId || o._id === orderId);
      const idToSend = order?._id || orderId;
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idToSend, status }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      setOrders((prev) =>
        prev.map((order) =>
          (order._id === idToSend || order.id === idToSend) ? { ...order, status } : order
        )
      );
      setStatusChanged(idToSend);
      setChangedOrder({ id: idToSend, status });
      setShowModal(true);
    } catch (e) {
      alert('Erreur lors de la mise à jour du statut');
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login.username, password: login.password })
      });
      const data = await res.json();
      if (data.success && data.token) {
        Cookies.set('admin_token', data.token, { expires: 1 }); // 1 jour
        setIsAuth(true);
        setError("");
      } else {
        setError(data.error || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF6]">
        <form onSubmit={handleLogin} className="bg-white/90 p-8 rounded-xl shadow space-y-4 w-full max-w-xs">
          <h2 className="text-xl font-bold text-center mb-2">Connexion administrateur</h2>
          <input
            className="w-full border border-[#E6D2B5] rounded px-3 py-2"
            placeholder="Nom d'utilisateur"
            value={login.username}
            onChange={e => setLogin({ ...login, username: e.target.value })}
            autoFocus
          />
          <input
            className="w-full border border-[#E6D2B5] rounded px-3 py-2"
            placeholder="Mot de passe"
            type="password"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-[#C9A74D] text-white rounded-full py-2">Se connecter</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF6] p-4">
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-xs mx-auto rounded-2xl bg-[#FDFBF6] border-0 shadow-xl p-0">
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="rounded-full bg-green-100 p-4 mb-3">
              <CheckCircle2 className="w-16 h-16 text-[#4BB543]" />
            </div>
            <DialogTitle className="text-[#4BB543] text-xl font-bold text-center mb-2">Statut modifié !</DialogTitle>
            {changedOrder && (
              <>
                <div className="mb-1 text-base text-gray-700 text-center">Commande <span className="font-bold text-[#C9A74D]">{changedOrder.id}</span></div>
                <div className="mb-4 text-center">Nouveau statut : <span className="font-semibold text-[#C9A74D]">{changedOrder.status}</span></div>
              </>
            )}
            <Button onClick={() => setShowModal(false)} className="w-full bg-[#C9A74D] text-white rounded-full py-3 mt-2 text-lg shadow hover:bg-[#b8963b] transition">OK</Button>
          </div>
        </DialogContent>
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-serif text-gray-800 text-center">Gestion Commandes (Admin)</h1>
            <Button onClick={handleLogout} className="bg-red-500 text-white rounded-full px-4 py-2">Se déconnecter</Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
            <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} className="border rounded px-3 py-2" />
            <Button onClick={() => { setDateFilter(""); setPage(1); }} variant="outline" className="ml-2">Réinitialiser</Button>
          </div>
          {orders.length === 0 ? (
            <p className="text-center text-gray-600">Aucune commande pour le moment.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id || order.id} className={`p-4 bg-white/80 rounded-xl shadow transition-all ${statusChanged === order.id || statusChanged === order._id ? 'ring-2 ring-green-400' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div>
                      <span className="font-bold">{order.prenom} {order.nom}</span> — <span>{order.email}</span>
                      <div className="text-sm text-gray-600">{order.telephone}</div>
                      <div className="text-sm text-gray-600">{order.adresse}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value as Order["status"])}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm mb-2">
                      <thead>
                        <tr className="bg-[#F7E0D8] text-[#C9A74D]">
                          <th className="p-1 text-left">Produit</th>
                          <th className="p-1">Qté</th>
                          <th className="p-1">Prix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-1">{item.name}</td>
                            <td className="p-1 text-center">{item.quantity}</td>
                            <td className="p-1 text-right">{item.price}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-gray-800">Total : {order.total}€</span>
                    <span className="text-xs text-gray-500">ID: {order.id}</span>
                    <span className="text-xs text-gray-400">{order.createdAt ? format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm') : ''}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline">Précédent</Button>
            <span className="text-sm">Page {page} / {Math.ceil(total / 10) || 1}</span>
            <Button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} variant="outline">Suivant</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
