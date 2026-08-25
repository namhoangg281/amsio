"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { signInAdmin } from "@/lib/supabase";

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    const { data, error: authError } = await signInAdmin(email, password);

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email hoặc mật khẩu không đúng."
          : authError.message
      );
      setLoading(false);
      return;
    }

    if (data.session) {
      // Redirect to admin dashboard after successful login
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/admin`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label
          htmlFor="admin-email"
          className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2"
        >
          Email Address
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@amsio.org"
          required
          className="w-full h-12 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/40 transition-all text-sm"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="admin-password"
          className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full h-12 px-4 pr-12 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/40 transition-all text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full h-12 mt-2 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-dark focus:ring-orange shadow-lg shadow-orange/20 hover:shadow-xl hover:shadow-orange/30 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Access Dashboard</span>
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}