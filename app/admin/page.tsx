"use client";
import { UserCircle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get('admin_token');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);
  const handleLogout = () => {
    Cookies.remove('admin_token');
    localStorage.removeItem('admin_token');
    router.replace('/');
  };
  return (
    <div className="min-h-screen bg-[#FDFBF6] flex flex-col">
      <header className="w-full bg-[#C9A74D] text-white py-4 px-4 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h1 className="text-2xl font-bold font-serif">Tableau de bord Admin</h1>
          <button className="sm:hidden p-2" onClick={() => setMenuOpen(m => !m)} aria-label="Ouvrir le menu">
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
        <nav className={`flex-col sm:flex-row flex sm:items-center gap-2 sm:gap-4 w-full sm:w-auto ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
          <a href="/admin/orders" className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-white font-semibold text-center transition">Gestion des commandes</a>
          <a href="/admin/add-product" className="bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 text-white font-semibold text-center transition">Ajouter un produit</a>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 rounded-full px-4 py-2 text-white font-semibold transition">Déconnexion</button>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <UserCircle className="w-8 h-8 text-white" />
            <div className="flex flex-col">
              <span className="font-semibold text-base leading-none">Sandie Bras</span>
              <span className="text-xs text-white/80 leading-none">Administrateur</span>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/90 rounded-xl shadow p-8 mt-12 flex flex-col items-center w-full max-w-md">
          <UserCircle className="w-24 h-24 text-[#C9A74D] mb-4" />
          <h2 className="text-xl font-bold mb-2">Bienvenue, Sandie Bras</h2>
          <p className="text-gray-700 text-center mb-6">Gérez les commandes, les utilisateurs et les paramètres du site depuis ce tableau de bord.</p>
          <div className="flex flex-col gap-4 w-full">
            <a href="/admin/orders" className="w-full bg-[#C9A74D] text-white rounded-full py-3 text-center font-semibold shadow hover:bg-[#b8963b] transition">Gestion des commandes</a>
            <a href="/admin/add-product" className="w-full bg-[#E6D2B5] text-[#C9A74D] rounded-full py-3 text-center font-semibold shadow hover:bg-[#d1b77a] transition">Ajouter un produit</a>
            <button onClick={handleLogout} className="w-full bg-red-500 text-white rounded-full py-3 font-semibold shadow hover:bg-red-600 transition">Déconnexion</button>
          </div>
        </div>
      </main>
    </div>
  );
}
