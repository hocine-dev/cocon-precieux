
import { Suspense } from "react";
import ConfirmationClient from "./ConfirmationClient";

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDFBF6]"><span className="block w-12 h-12 border-4 border-[#C9A74D] border-t-transparent rounded-full animate-spin mb-6"></span><p className="text-gray-600 text-lg mb-4">Chargement de la confirmation...</p></div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
