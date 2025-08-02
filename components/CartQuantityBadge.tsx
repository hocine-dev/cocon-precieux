// components/CartQuantityBadge.tsx
"use client";
import { useEffect, useState } from "react";

const CART_KEY = "cocon_precieux_cart";

export function CartQuantityBadge() {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    function getCartQuantity() {
      if (typeof window === "undefined") return 0;
      const stored = localStorage.getItem(CART_KEY);
      if (!stored) return 0;
      try {
        const cart = JSON.parse(stored);
        return cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
      } catch {
        return 0;
      }
    }
    setQty(getCartQuantity());
    const handler = () => setQty(getCartQuantity());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (qty < 1) return null;
  return (
    <span className="absolute -top-2 -right-2 bg-[#C9A74D] text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md animate-bounce z-10">
      {qty}
    </span>
  );
}
