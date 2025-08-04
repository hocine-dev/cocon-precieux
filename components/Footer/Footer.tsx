// components/Footer/Footer.tsx

import Link from 'next/link';
import { Truck } from 'lucide-react'; 
import Image from 'next/image';


// --- Données pour les liens du footer ---
const navigationLinks = [
  { href: "/", label: "Accueil" },
  { href: "/produit", label: "Le Baume" },
  { href: "#story", label: "Notre Histoire" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];


export function Footer() {
  return (
    <footer className="bg-[#181818] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Section Marque */}
          <div className="md:col-span-2 lg:col-span-1">
             <Link href="/">
              <Image
                src="/logo.png"
                alt="Cocon Précieux Logo"
                width={160}
                height={51}
                priority
                className="transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <p className="text-gray-400 pr-4 text-sm  my-4 ">
              Des soins naturels, fabriqués en France avec amour, pour une beauté authentique.
            </p>
          </div>

          {/* Section Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#C9A74D] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Légal */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Légal</h3>
            <ul className="space-y-2 text-gray-400">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#C9A74D] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Section Contact & Suivi */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact & Suivi</h3>
            <div className="space-y-3 text-gray-400">
              <p>
                <a href="mailto:cocon-precieux@outlook.com" className="hover:text-[#C9A74D] transition-colors">
                  cocon-precieux@outlook.com
                </a>
              </p>
              <div className="flex items-center gap-4">
                 <a href="https://facebook.com/coconprecieux" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#C9A74D] transition-colors">Facebook</a>
                 <a href="https://instagram.com/coconprecieux" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#C9A74D] transition-colors">Instagram</a>
              </div>
              <p className="flex items-center space-x-2 pt-1 text-sm">
                <Truck className="w-4 h-4" />
                <span>Livraison : 5,25€ (max 250g)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#333] mt-10 pt-8 text-center text-gray-300 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Cocon Précieux. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}