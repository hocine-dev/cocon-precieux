"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { BadgeCheck, ArrowRight, ArrowLeft } from "lucide-react";

const IBAN = "FR00000000";

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <p className="text-gray-600 text-lg mb-4">Chargement de la confirmation...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
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
        <Card className="w-full p-6 bg-white/90 rounded-xl shadow flex flex-col items-center">
          <BadgeCheck className="w-12 h-12 text-[#C9A74D] mb-2" />
          <h1 className="text-2xl font-serif font-bold mb-2 text-center">Commande introuvable</h1>
          <p className="text-gray-600 text-lg mb-4">Aucune commande trouvée pour cet identifiant.</p>
          <Button asChild className="bg-[#C9A74D] text-white rounded-full px-8 py-4">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </Card>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
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
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <Card className="max-w-xl w-full p-6 bg-white/90 rounded-xl shadow flex flex-col items-center">
          <BadgeCheck className="w-12 h-12 text-[#C9A74D] mb-2" />
          <h1 className="text-2xl font-serif font-bold mb-2 text-center">Merci pour votre commande !</h1>
          <p className="text-gray-700 text-center mb-4">Veuillez effectuer un virement bancaire du montant total à l'IBAN suivant :</p>
          <div className="bg-white rounded-xl shadow p-4 mb-4 text-center">
            <span className="font-bold text-[#C9A74D] text-lg">{IBAN}</span>
          </div>
          <p className="text-gray-600 text-center mb-2">Montant à virer : <span className="font-semibold">{order.total}€</span></p>
          <p className="text-[#C9A74D] text-center font-semibold mb-2">Merci d'indiquer la référence de votre commande : <span className="font-mono">{order._id || order.id}</span> dans le libellé du virement.</p>
          <p className="text-gray-500 text-xs text-center mb-6">Un email de confirmation vous sera envoyé après réception du paiement.</p>
          <Button className="bg-[#C9A74D] text-white rounded-full px-8 py-4 flex items-center gap-2 hover:bg-[#C9A74D]" onClick={() => router.push(`/commande?id=${order._id}`)}>
            Voir l'état de ma commande <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </main>
    </div>
  );
}
