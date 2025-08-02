"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Leaf, Award, Truck, Shield, ArrowLeft, Plus, Minus, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
// Utilitaire pour lire la quantité totale du panier
function getCartQuantity(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(CART_KEY);
  if (!stored) return 0;
  try {
    const cart: CartItem[] = JSON.parse(stored);
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}
// Type for a cart item (doit matcher le panier)
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = "cocon_precieux_cart";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const productImages = [
    "/produit%20principale.jpg?height=500&width=500",
    "/image1.jpg?height=500&width=500",
    "/image2.jpg?height=500&width=500",
    "/image2.jpg?height=500&width=500",
  ]

  const ingredients = [
    "Beurre de Karité Bio",
    "Huile de Coco Vierge",
    "Cire d'Abeille",
    "Huile d'Amande Douce",
    "Vitamine E Naturelle",
    "Huile Essentielle de Lavande",
    "Extrait de Calendula",
    "Huile de Jojoba Bio",
  ]

  const usages = [
    "Visage - Hydratation quotidienne",
    "Corps - Soin nourrissant",
    "Mains - Protection et douceur",
    "Lèvres - Baume réparateur",
    "Cheveux - Soin des pointes",
    "Après-soleil - Apaisement",
    "Barbe - Soin et brillance",
  ]

  // Ajout au panier + gestion quantité header
  const [added, setAdded] = useState(false);
  const [cartQty, setCartQty] = useState(0);

  // Met à jour la quantité du panier au chargement et après ajout
  useEffect(() => {
    setCartQty(getCartQuantity());
    // Ecoute le stockage local pour MAJ si modifié ailleurs
    const handler = () => setCartQty(getCartQuantity());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleAddToCart = () => {
    const item: CartItem = {
      id: "baume-precieux",
      name: "Le Baume Précieux",
      price: 25,
      image: "/produit%20principale.jpg?height=500&width=500",
      quantity,
    };
    let cart: CartItem[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) cart = JSON.parse(stored);
      const existing = cart.find((i) => i.id === item.id);
      if (existing) {
        cart = cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        cart.push(item);
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      setAdded(true);
      setCartQty(getCartQuantity());
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF6]">
      {/* Header with centered logo */}
      <header className="sticky top-0 z-50 bg-[#FDFBF6]/95 backdrop-blur-sm border-b border-[#E6D2B5]/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left: Retour */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-[#C9A74D] hover:opacity-80 transition-opacity">
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
          <div className="flex-1 flex justify-end">
            <Link href="/panier" className="relative">
              <Button
                variant="outline"
                className="border-[#C9A74D] text-[#C9A74D] hover:bg-[#C9A74D] hover:text-white bg-transparent"
              >
                Panier
                {cartQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C9A74D] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md animate-bounce">
                    {cartQty}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7E0D8]/20 to-[#E6D2B5]/10">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt="Le baume précieux"
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-[#C9A74D] text-white">
                <Zap className="w-3 h-3 mr-1" />
                Cadeau pour les 28 premiers
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-[#C9A74D] scale-105" : "border-transparent hover:border-[#E6D2B5]"
                  }`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`Vue ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">Le Baume Précieux</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C9A74D] text-[#C9A74D]" />
                  ))}
                </div>
                <span className="text-gray-600">(127 avis)</span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Un baume multi-usage naturel, composé de seulement 8 ingrédients essentiels, soigneusement sélectionnés
                pour leur efficacité. Riche, fondant et sensoriel, il hydrate, apaise et sublime la peau tout en
                douceur.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, text: "100% Végan" },
                { icon: Award, text: "97% Naturel" },
                { icon: Heart, text: "Made in France" },
                { icon: Shield, text: "ISO 22716" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <benefit.icon className="w-5 h-5 text-[#C9A74D]" />
                  <span className="text-sm text-gray-600">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-[#F7E0D8]/30 to-[#E6D2B5]/20 rounded-2xl p-6">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold text-[#C9A74D]">25€</span>
                <span className="text-gray-600">+ 5,25€ de livraison</span>
              </div>
              <p className="text-sm text-gray-600">
                <Truck className="w-4 h-4 inline mr-1" />
                Livraison en France métropolitaine
              </p>
            </div>

           

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantité:</span>
              <div className="flex items-center border border-[#E6D2B5] rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-[#F7E0D8]/50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-[#F7E0D8]/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full bg-[#C9A74D] hover:bg-[#C9A74D]/90 text-white py-6 text-lg rounded-full transition"
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? "Ajouté au panier !" : `Ajouter au panier - ${25 * quantity}€`}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-[#C9A74D] text-[#C9A74D] hover:bg-[#C9A74D]/10 py-6 text-lg rounded-full"
              >
                <a href="/panier">Voir mon panier</a>
              </Button>
            </div>

          </motion.div>
        </div>

        {/* Product Details */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12">
          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif text-gray-800 mb-6">8 Ingrédients Essentiels</h3>
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#C9A74D] rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-600">
                  Formule minimaliste pour un maximum de bienfaits. 62% d'ingrédients biologiques certifiés.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif text-gray-800 mb-6">Multi-Usage</h3>
                <div className="space-y-3">
                  {usages.map((usage, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#C9A74D] rounded-full"></div>
                      <span className="text-gray-700">{usage}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-600">
                  Un seul produit pour tous vos besoins beauté quotidiens. Polyvalent et efficace.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-serif text-gray-800 mb-8 text-center">Avis Clients</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Élise M.",
                text: "Parfait pour ma peau sensible ! Texture divine et résultats visibles dès la première utilisation.",
                rating: 5,
                verified: true,
              },
              {
                name: "Juliette P.",
                text: "Je l'utilise partout : visage, mains, même sur mes lèvres gercées. Un indispensable !",
                rating: 5,
                verified: true,
              },
              {
                name: "Amélie R.",
                text: "Enfin un produit naturel qui tient ses promesses. L'odeur est subtile et apaisante.",
                rating: 5,
                verified: true,
              },
            ].map((review, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C9A74D] text-[#C9A74D]" />
                      ))}
                    </div>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs">
                        Achat vérifié
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3 italic">"{review.text}"</p>
                  <p className="font-medium text-[#C9A74D] text-sm">— {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
