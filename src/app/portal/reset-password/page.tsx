"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getAuthClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type PageState = "loading" | "form" | "success" | "invalid";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase sends the recovery token in the URL hash as:
    // #access_token=...&refresh_token=...&type=recovery
    // The supabase client picks up the hash and establishes a session automatically
    // on onAuthStateChange with event "PASSWORD_RECOVERY"
    const { data: authListener } = getAuthClient().auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("form");
      } else if (event === "SIGNED_IN" && pageState === "loading") {
        // Already signed in — shouldn't arrive here via reset link, treat as invalid
        setPageState("invalid");
      }
    });

    // Fallback: if no hash token, the event won't fire — show invalid after a short wait
    const timeout = setTimeout(() => {
      setPageState((prev) => (prev === "loading" ? "invalid" : prev));
    }, 3000);

    return () => {
      authListener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) {
      setError(t.portal.passwordMinLength);
      return;
    }
    setLoading(true);
    try {
      const { error: updateErr } = await getAuthClient().auth.updateUser({ password: newPassword });
      if (updateErr) {
        setError(updateErr.message);
      } else {
        setPageState("success");
        // Sign out and redirect to login after a short delay
        setTimeout(async () => {
          await getAuthClient().auth.signOut();
          window.location.href = `${BASE}/portal/login`;
        }, 2500);
      }
    } catch {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="relative lg:w-[55%] gradient-hero flex flex-col px-8 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-10 overflow-hidden">
        <div className="relative z-10 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t.portal.backToHome}</span>
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative z-10 max-w-lg flex-1 flex flex-col justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO International"
            className="w-20 h-20 object-contain mb-10"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-display)] leading-tight tracking-tight">
            {t.portal.resetPasswordTitle}
          </h1>
          <p className="mt-6 text-white/60 text-lg leading-relaxed">
            {t.portal.resetPasswordSubtitle}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-0 relative">
        <div className="absolute top-5 left-5 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-navy text-sm transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t.portal.backToHome}</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Loading */}
          {pageState === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
              <p className="text-sm text-text-secondary">{t.common.loading}</p>
            </div>
          )}

          {/* Invalid / expired link */}
          {pageState === "invalid" && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
                  {t.portal.resetPasswordTitle}
                </h2>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700 leading-relaxed">
                  {t.portal.invalidResetLink}
                </p>
              </div>
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange hover:text-orange/80 transition-colors"
              >
                {t.portal.backToSignIn}
              </Link>
            </div>
          )}

          {/* New password form */}
          {pageState === "form" && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
                  {t.portal.resetPasswordTitle}
                </h2>
                <p className="mt-2 text-text-secondary">
                  {t.portal.resetPasswordSubtitle}
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-text-primary mb-1.5"
                  >
                    {t.portal.newPassword}
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={t.portal.newPasswordPlaceholder}
                      required
                      minLength={8}
                      disabled={loading}
                      className="w-full h-12 px-4 pr-12 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all text-sm disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-navy transition-colors"
                      aria-label={showPassword ? t.portal.hidePassword : t.portal.showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t.portal.updatingPassword}</span>
                    </>
                  ) : (
                    <span>{t.portal.updatePassword}</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Success */}
          {pageState === "success" && (
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
                  {t.portal.resetPasswordTitle}
                </h2>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                <p className="text-sm text-green-800 leading-relaxed">{t.portal.passwordUpdated}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
