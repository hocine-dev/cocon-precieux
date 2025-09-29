"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// import { useToast } from "@/components/ui/use-toast";
// Type for a cart item
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "cocon_precieux_cart";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
    // const { toast } = useToast();

  // Charge le panier depuis le localStorage à chaque affichage et sur modification externe
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
    const handler = () => setCart(getCart());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Plus besoin de gérer showNotice

  // Met à jour le localStorage et le state lors des actions utilisateur
  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem(CART_KEY, JSON.stringify([]));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const livraison = totalQuantity >= 2 ? 0 : 5.25;
  const totalAvecLivraison = (total + livraison).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FDFBF6] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FDFBF6]/95 backdrop-blur-sm border-b border-[#E6D2B5]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Retour */}
          <div className="flex-1 flex items-center">
            <Link href="/produit" className="flex items-center space-x-2 text-[#C9A74D] hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
          </div>
          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Cocon Précieux Logo"
                width={48}
                height={48}
                className="object-contain h-10 w-auto md:h-12"
                priority
              />
            </Link>
          </div>
          {/* Right: Panier */}
          <div className="flex-1 flex justify-end items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-[#C9A74D]" />
            {cart.length > 0 && (
              <Button variant="ghost" className="text-[#C9A74D]" onClick={clearCart}>
                Vider
                <Trash2 className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6 w-full max-w-2xl">
        <h1 className="text-2xl font-serif text-gray-800 mb-6 text-center">Mon Panier</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <span className="block w-12 h-12 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin"></span>
            </div>
            <p className="text-gray-600 text-lg mb-4">Chargement du panier...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Image src="/logo.png" alt="Panier vide" width={80} height={80} className="mb-6 opacity-80" />
            <p className="text-gray-600 text-lg mb-4">Votre panier est vide.</p>
            <Button asChild className="bg-[#C9A74D] text-white rounded-full px-8 py-4 hover:bg-[#C9A74D]">
              <Link href="/produit">Découvrir le baume</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {showAlert && (
              <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-[#C9A74D] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                <span>Temporairement, le nombre de Baume est limité à 1 unité par personne.</span>
              </div>
            )}
            {cart.map((item) => (
              <Card key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/80 border-0 shadow-md rounded-2xl">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F7E0D8]/30 to-[#E6D2B5]/20">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 w-full flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <h2 className="font-semibold text-gray-800 text-lg">{item.name}</h2>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-5 h-5 text-[#C9A74D]" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#C9A74D] font-bold text-lg">{item.price}€</span>
                    <Badge className="bg-[#F7E0D8] text-[#C9A74D]">x{item.quantity}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="icon" variant="outline" className="border-[#C9A74D] text-[#C9A74D]" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity === 1}>
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-3 text-gray-700 font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-[#C9A74D] text-[#C9A74D]"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* Total avec livraison */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center justify-between text-lg font-semibold text-gray-800">
                <span>Sous-total</span>
                <span>{total}€</span>
              </div>
              <div className="flex items-center justify-between text-base text-gray-700">
                <span>Livraison</span>
                <span>{livraison === 0 ? 'Offerte' : '5,25€'}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold text-[#C9A74D]">
                <span>Total à payer</span>
                <span>{totalAvecLivraison}€</span>
              </div>
              <Button asChild className="w-full bg-[#C9A74D] text-white py-4 rounded-full text-lg shadow-lg hover:bg-[#C9A74D]/90 transition">
                <Link href="/paiement">Procéder au paiement</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
