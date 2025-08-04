"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

// Interface mise à jour pour inclure `cart` pour la compatibilité
interface Order {
  _id: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  email: string;
  items: { name: string; quantity: number; price: number }[];
  cart?: { name: string; quantity: number; price: number }[];
  total: number;
  status: "en preparation" | "en cours de livraison" | "livré au client" | "annuler";
  createdAt?: string;
}

const STATUS_OPTIONS = [
  "en preparation",
  "en cours de livraison",
  "livré au client",
  "annuler",
];

export default function AdminOrdersPage() {
  // Vérifie le token JWT au chargement
  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (token) {
      setIsAuth(true);
    }
    setLoading(false);
  }, []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [showCancelledFinalized, setShowCancelledFinalized] = useState(false);
  const [statusChanged, setStatusChanged] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  // Le type de changedOrder inclut maintenant une `action` optionnelle
  const [changedOrder, setChangedOrder] = useState<{ id: string, status: string, action?: string } | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();

  // Fait disparaître la surbrillance de la carte après 3 secondes
  useEffect(() => {
    if (statusChanged) {
      const timer = setTimeout(() => {
        setStatusChanged(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusChanged]);

  // Fetch des commandes
  useEffect(() => {
    if (isAuth) {
      setLoading(true);
      let url = `/api/orders?page=${page}&limit=10`;
      if (dateFilter) url += `&day=${dateFilter}`;
      if (nameFilter) url += `&name=${encodeURIComponent(nameFilter)}`;
      
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
            setTotal(data.total);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isAuth, page, dateFilter, nameFilter]);

  // Redirection si non authentifié
  useEffect(() => {
    if (!loading && !isAuth) {
      setRedirecting(true);
      router.replace('/admin/login');
    }
  }, [loading, isAuth, router]);

  function handleLogout() {
    Cookies.remove('admin_token');
    setIsAuth(false);
  }

  async function updateStatus(orderId: string, status: Order["status"]) {
    setStatusLoading(orderId);
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      
      setOrders(prev => prev.map(order => order._id === orderId ? { ...order, status } : order));
      
      setStatusChanged(orderId);
      // Ouvre la modale pour un changement de statut
      setChangedOrder({ id: orderId, status });
      setShowModal(true);
    } catch (e) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setStatusLoading(null);
    }
  }
  
  // **FONCTION MODIFIÉE**
  async function informerClient(order: Order) {
    const toastId = toast.loading("Envoi de l'email...");
    try {
      const body = `Bonjour ${order.prenom},\n\nVotre commande est maintenant au statut : ${order.status}.`;
      const payload = {
        to: order.email,
        subject: `Mise à jour de votre commande Cocon Précieux`,
        body,
        order: { ...order, cart: order.cart || order.items }
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      toast.dismiss(toastId);

      if (res.status === 409) {
        setChangedOrder({ id: order._id, status: order.status, action: 'already_sent' });
        setShowModal(true);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setChangedOrder({ id: order._id, status: order.status, action: 'informer' });
        setShowModal(true);
      } else {
        toast.error(data.error || "Erreur lors de l'envoi de l'email");
      }
    } catch(error) {
      toast.dismiss(toastId);
      toast.error("Une erreur réseau est survenue.");
    }
  }

  if (loading || (!isAuth && !redirecting)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF6]">
        <span className="block w-12 h-12 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin"></span>
        <p className="text-gray-600 text-lg mt-4">Chargement...</p>
      </div>
    );
  }
  
  if (!isAuth && redirecting) {
    return null; // Ne rien afficher pendant la redirection
  }

  const filteredOrders = orders.filter(order => showCancelledFinalized || (order.status !== 'annulé' && order.status !== 'finalisé'));

  return (
    <div className="min-h-screen bg-[#FDFBF6] p-4">
      {/* **MODALE MISE À JOUR** pour gérer les deux cas */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!open) setChangedOrder(null); setShowModal(open); }}>
        <DialogContent className="max-w-xs mx-auto rounded-2xl bg-[#FDFBF6] border-0 shadow-xl p-0">
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="rounded-full bg-green-100 p-4 mb-3">
              <CheckCircle2 className="w-16 h-16 text-[#4BB543]" />
            </div>
            <DialogTitle className="text-[#4BB543] text-xl font-bold text-center mb-2">
              {changedOrder?.action === 'informer'
                ? 'Client informé !'
                : changedOrder?.action === 'already_sent'
                  ? 'Déjà informé'
                  : 'Statut modifié !'}
            </DialogTitle>
            {changedOrder && (
              <>
                <div className="mb-1 text-base text-gray-700 text-center">
                  Commande <span className="font-bold text-[#C9A74D]">{changedOrder.id ? changedOrder.id.slice(-6) : ''}</span>
                </div>
                <div className="mb-4 text-center">
                  {changedOrder?.action === 'informer' && (
                    <>Le client a été informé du statut : <span className="font-semibold text-[#C9A74D]">{changedOrder.status}</span></>
                  )}
                  {changedOrder?.action === 'already_sent' && (
                    <>Le client a déjà été informé pour ce statut.<br /><span className="font-semibold text-[#C9A74D]">{changedOrder.status}</span></>
                  )}
                  {(!changedOrder?.action || changedOrder?.action === undefined) && (
                    <>Nouveau statut : <span className="font-semibold text-[#C9A74D]">{changedOrder.status}</span></>
                  )}
                </div>
              </>
            )}
            <Button onClick={() => setShowModal(false)} className="w-full bg-[#C9A74D] text-white rounded-full py-3 mt-2 text-lg shadow hover:bg-[#b8963b] transition">OK</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Contenu principal de la page */}
      <div className="flex flex-col gap-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-serif text-gray-800">Gestion des Commandes</h1>
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-2">Se déconnecter</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center mb-4">
          <form
            onSubmit={e => { e.preventDefault(); setNameFilter(nameInput); setPage(1); }}
            className="flex gap-2 items-center"
            style={{ flex: 1 }}
          >
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Rechercher par nom de client"
              className="border rounded px-3 py-2"
            />
            <Button type="submit" variant="outline">Rechercher</Button>
          </form>
          <input type="date" value={dateFilter} onChange={e => { setDateFilter(e.target.value); setPage(1); }} className="border rounded px-3 py-2" />
          <label className="flex items-center gap-2 text-sm ml-2 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={showCancelledFinalized}
              onChange={e => setShowCancelledFinalized(e.target.checked)}
              className="accent-[#C9A74D]"
            />
            Afficher annulées/finalisées
          </label>
          <Button onClick={() => { setDateFilter(""); setNameFilter(""); setNameInput(""); setShowCancelledFinalized(false); setPage(1); }} variant="outline" className="ml-2">Réinitialiser</Button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-8">
             <span className="block w-10 h-10 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin"></span>
           </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Aucune commande ne correspond à vos critères.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className={`p-4 bg-white/80 rounded-xl shadow transition-all duration-300 ${statusChanged === order._id ? 'ring-2 ring-green-400' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold">{order.prenom} {order.nom}</span> — <span>{order.email}</span>
                    <div className="text-sm text-gray-600">{order.telephone}</div>
                    <div className="text-sm text-gray-600">{order.adresse}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <div className="relative">
                      <select
                        className="border rounded px-2 py-1 text-sm pr-8"
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value as Order["status"])}
                        disabled={statusLoading === order._id}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {statusLoading === order._id && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 block w-4 h-4 border-2 border-[#C9A74D] border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </div>
                    <Button
                      className="ml-2 bg-[#C9A74D] text-white rounded-full px-3 py-1 text-xs hover:bg-[#b8963b]"
                      onClick={() => informerClient(order)}
                    >
                      Informer le client
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mb-2">
                    <thead>
                      <tr className="bg-[#F7E0D8] text-[#C9A74D]">
                        <th className="p-1 text-left">Produit</th>
                        <th className="p-1">Qté</th>
                        <th className="p-1 text-right">Prix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(order.cart || order.items).map((item, idx) => (
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
                  <span className="text-xs text-gray-400">{order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : ''}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {total > 10 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} variant="outline">Précédent</Button>
            <span className="text-sm">Page {page} / {Math.ceil(total / 10) || 1}</span>
            <Button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} variant="outline">Suivant</Button>
          </div>
        )}
      </div>
    </div>
  );
}