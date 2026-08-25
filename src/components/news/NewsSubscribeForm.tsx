"use client";

import { useState } from "react";

export default function NewsSubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-emerald-600 font-semibold text-sm py-3">
        ✓ Subscribed! You&apos;ll receive AMSIO updates at {email}.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 px-4 py-3 rounded-full border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="w-full text-center text-xs text-red-500 mt-1">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  );
}
