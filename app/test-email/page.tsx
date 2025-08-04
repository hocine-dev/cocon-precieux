"use client";
import { useState } from "react";

export default function SendEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, body }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) setResult("Email envoyé avec succès !");
    else setResult("Erreur : " + (data.error || "Impossible d'envoyer l'email"));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF6] p-4">
      <h1 className="text-2xl font-bold mb-6">Test d'envoi d'email (Hostinger)</h1>
      <form onSubmit={handleSend} className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-semibold">À (destinataire)</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={to} onChange={e => setTo(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Sujet</label>
          <input className="w-full border rounded px-3 py-2" value={subject} onChange={e => setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Message</label>
          <textarea className="w-full border rounded px-3 py-2" value={body} onChange={e => setBody(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-[#C9A74D] text-white py-3 rounded-full text-lg shadow hover:bg-[#b8963b] transition" disabled={loading}>{loading ? "Envoi..." : "Envoyer l'email"}</button>
        {result && <div className="mt-2 text-center font-semibold text-sm text-gray-700">{result}</div>}
      </form>
    </div>
  );
}
