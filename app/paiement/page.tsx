"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "cocon_precieux_cart";
// Stripe Checkout, plus d'IBAN

export default function PaiementPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function getCart() {
      if (typeof window === "undefined") return [];
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) return [];
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    setCart(getCart());
    setLoading(false);
  }, []);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const livraison = totalQuantity >= 2 ? 0 : 5.25;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, ...form }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création de la session de paiement");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPaying(false);
      }
    } catch (err) {
      setPaying(false);
      alert("Erreur lors de la commande : " + (err as any).message);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF6]">
        <Image src="/logo.png" alt="Panier vide" width={80} height={80} className="mb-6 opacity-80" loading="lazy" />
        <p className="text-gray-600 text-lg mb-4">Votre panier est vide.</p>
        <Button asChild className="bg-[#C9A74D] text-white rounded-full px-8 py-4">
          <Link href="/produit">Découvrir le baume</Link>
        </Button>
      </div>
    );
  }

  if (paying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF6]">
        <span className="block w-12 h-12 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin"></span>
        <p className="text-gray-600 text-lg mt-4">Redirection vers le paiement sécurisé…</p>
      </div>
    );
  }

  if (submitted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF6] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#FDFBF6]/95 backdrop-blur-sm border-b border-[#E6D2B5]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <Link href="/panier" className="flex items-center space-x-2 text-[#C9A74D] hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Cocon Précieux Logo" width={48} height={48} className="object-contain h-10 w-auto md:h-12" priority sizes="48px" />
            </Link>
          </div>
          <div className="flex-1" />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6 w-full max-w-2xl">
        <h1 className="text-2xl font-serif text-gray-800 mb-6 text-center">Récapitulatif de la commande</h1>
        <div className="space-y-4 mb-8">
          {cart.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/80 border-0 shadow-md rounded-2xl">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F7E0D8]/30 to-[#E6D2B5]/20">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 w-full flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-semibold text-gray-800 text-lg">{item.name}</h2>
                  <Badge className="bg-[#F7E0D8] text-[#C9A74D]">x{item.quantity}</Badge>
                </div>
                <span className="text-[#C9A74D] font-bold text-lg">{item.price}€</span>
              </div>
            </Card>
          ))}
          <div className="flex items-center justify-between text-lg font-semibold text-gray-800 mt-4">
            <span>Total</span>
            <span>{total}€</span>
          </div>
          <div className="flex items-center justify-between text-base text-gray-700">
            <span>Livraison</span>
            <span>{livraison === 0 ? 'Offerte' : '5,25€'}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold text-[#C9A74D]">
            <span>Total à payer</span>
            <span>{(total + livraison).toFixed(2)}€</span>
          </div>
        </div>
        <form className="space-y-4 bg-white/80 rounded-xl shadow p-6" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-1" htmlFor="prenom">Prénom</label>
              <input required name="prenom" id="prenom" className="w-full border border-[#E6D2B5] rounded px-3 py-2" value={form.prenom} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1" htmlFor="nom">Nom</label>
              <input required name="nom" id="nom" className="w-full border border-[#E6D2B5] rounded px-3 py-2" value={form.nom} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="telephone">Numéro de téléphone</label>
            <input required name="telephone" id="telephone" className="w-full border border-[#E6D2B5] rounded px-3 py-2" value={form.telephone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="adresse">Adresse exacte</label>
            <textarea required name="adresse" id="adresse" className="w-full border border-[#E6D2B5] rounded px-3 py-2" value={form.adresse} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input required type="email" name="email" id="email" className="w-full border border-[#E6D2B5] rounded px-3 py-2" value={form.email} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full bg-[#C9A74D] text-white py-4 rounded-full text-lg shadow-lg hover:bg-[#C9A74D]/90 transition" disabled={paying}>
            {paying ? (
              <span className="flex items-center justify-center">
                <span className="block w-5 h-5 border-2 border-[#C9A74D] border-t-transparent rounded-full animate-spin mr-2"></span>
                Paiement en cours…
              </span>
            ) : (
              "Valider et payer par carte"
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">Après validation, vous serez redirigé vers le paiement sécurisé par carte bancaire.</p>
      </main>
    </div>
  );
}
