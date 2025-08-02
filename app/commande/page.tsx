"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, PackageCheck, User, Mail, Phone, MapPin, BadgeCheck } from "lucide-react";

export default function CommandePage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders?id=${orderId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) setOrder(data.order);
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6]">
      <span className="block w-12 h-12 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin mb-6"></span>
      <p className="text-gray-600 text-lg mb-4">Chargement de la commande...</p>
    </div>
  );
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF6]">
      <Image src="/logo.png" alt="Logo" width={80} height={80} className="mb-6 opacity-80" />
      <p className="text-gray-600 text-lg mb-4">Commande introuvable.</p>
      <Button asChild className="bg-[#C9A74D] text-white rounded-full px-8 py-4">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF6] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#FDFBF6]/95 backdrop-blur-sm border-b border-[#E6D2B5]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-[#C9A74D] hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span>Accueil</span>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="Cocon Précieux Logo" width={48} height={48} className="object-contain h-10 w-auto md:h-12" priority />
            </Link>
          </div>
          <div className="flex-1" />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-6 w-full max-w-2xl flex flex-col items-center justify-center">
        <Card className="w-full p-6 bg-white/90 rounded-xl shadow">
          <div className="flex flex-col items-center mb-4">
            <PackageCheck className="w-12 h-12 text-[#C9A74D] mb-2" />
            <h1 className="text-2xl font-serif font-bold mb-2 text-center">Votre commande</h1>
            <span className="text-sm text-gray-500 mb-2">Merci pour votre confiance !</span>
          </div>
          {/* Données personnelles masquées */}
          <div className="flex items-center gap-2 mb-4"><BadgeCheck className="w-5 h-5 text-[#C9A74D]" /><span className="font-semibold">Statut :</span> <span className="font-semibold text-[#C9A74D]">{order.status}</span></div>
          <div className="mb-4">
            <b>Produits commandés :</b>
            <ul className="list-disc ml-6 mt-2">
              {order.items.map((item: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="font-semibold">{item.name}</span> x{item.quantity} <span className="text-gray-500">— {item.price}€</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between text-lg font-bold text-[#C9A74D] mb-2">
            <span>Total à payer</span>
            <span>{order.total}€</span>
          </div>
        </Card>
      </main>
    </div>
  );
}
