// components/Header/Header.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { CartQuantityBadge } from "@/components/CartQuantityBadge";

// --- Données centralisées pour les liens ---
const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produit", label: "Le Baume" },
  { href: "#story", label: "Mon histoire" },
  { href: "#Values", label: "Mes valeurs" },
];

const socialLinks = [
  {
    href: "https://facebook.com/coconprecieux",
    label: "Facebook",
    icon: <Facebook className="w-6 h-6 text-[#C9A74D]" />,
  },
  {
    href: "https://instagram.com/coconprecieux",
    label: "Instagram",
    icon: <Instagram className="w-6 h-6 text-[#C9A74D]" />,
  },
];

// --- Le composant Header ---
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-[#E6D2B5]/30 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <Link href="/" onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}>
              <Image
                src="/logo.png"
                alt="Cocon Précieux Logo"
                width={160}
                height={51}
                priority
                className="transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-base font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#C9A74D] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2">
              {socialLinks.map((social) => (
                 <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-2 rounded-full hover:bg-[#F7E0D8]/60 transition-colors"
                 >
                    {React.cloneElement(social.icon, { className: "w-5 h-5 text-[#C9A74D]" })}
                 </a>
              ))}
            </div>
            
            <div className="relative">
              <Button
                variant="outline"
                className="border-[#C9A74D] text-[#C9A74D] hover:bg-[#C9A74D] hover:text-white bg-transparent rounded-xl shadow-sm px-4 py-2 font-semibold transition-all duration-200"
                asChild
              >
                <Link href="/panier">Panier</Link>
              </Button>
              <CartQuantityBadge />
            </div>

            <button
              className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-[#F7E0D8]/80 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-[#C9A74D]" />
              ) : (
                <Menu className="w-7 h-7 text-[#C9A74D]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative bg-white rounded-b-3xl shadow-lg mx-2 mt-2 p-6 flex flex-col gap-6 animate-fade-in-down">
            {/* Bouton de fermeture */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F7E0D8]/80 transition-colors focus:outline-none"
              aria-label="Fermer le menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-7 h-7 text-[#C9A74D]" />
            </button>
            <nav className="flex flex-col gap-4 text-lg font-medium mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-[#C9A74D] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[#E6D2B5]/30"></div>
            <div className="flex gap-4 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-full hover:bg-[#F7E0D8]/80 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}