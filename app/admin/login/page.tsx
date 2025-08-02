"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

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
        setError("");
        router.replace('/admin');
      } else {
        setError(data.error || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  }

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
        <Button type="submit" className="w-full bg-[#C9A74D] hover:bg-[#C9A74D] text-white rounded-full py-2">Se connecter</Button>
      </form>
    </div>
  );
}
