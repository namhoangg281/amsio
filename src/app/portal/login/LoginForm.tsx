"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type Role = "student" | "school" | "partner";

export default function LoginForm() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(urlError);
  }, [searchParams]);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetLoading(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}${BASE}/portal/reset-password`,
      });
      if (resetErr) {
        setResetError(resetErr.message);
      } else {
        setResetSent(true);
      }
    } catch {
      setResetError(t.common.error);
    } finally {
      setResetLoading(false);
    }
  };

  const roles: { value: Role; label: string }[] = [
    { value: "student", label: t.portal.roleStudent },
    { value: "school", label: t.portal.roleSchool },
    { value: "partner", label: t.portal.rolePartner },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError(t.common.error);
        setLoading(false);
        return;
      }

      const { data: adminProfile } = await supabase
        .from('amsio_admin_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (adminProfile) {
        window.location.href = `${BASE}/portal/admin`;
        return;
      }

      // custom_access_token_hook injects roles into the JWT app_metadata but
      // does NOT write back to auth.users.raw_app_meta_data — decode the JWT
      // for the authoritative role list (same approach as @itran/auth/client).
      const storedRoles: string[] = user.app_metadata?.roles ?? [];
      let appRoles = storedRoles;
      if (appRoles.length === 0 && data.session?.access_token) {
        try {
          const part = data.session.access_token.split('.')[1];
          if (part) {
            const claims = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
            const jwtRoles = (claims?.app_metadata as Record<string, unknown>)?.roles;
            if (Array.isArray(jwtRoles) && jwtRoles.length > 0) {
              appRoles = jwtRoles as string[];
            }
          }
        } catch { /* ignore decode errors — fall through to stored metadata */ }
      }
      const metaRole = (user.user_metadata?.role as string | undefined) ?? "";

      // marketing_staff → CMS Content Studio. The CMS lives LOCALLY in
      // amsio-website (/cms), it is NOT proxied to itran-portal. Check this
      // before isAdmin so content editors never get bounced to /portal/admin.
      if (appRoles.includes('marketing_staff')) {
        window.location.href = `${BASE}/cms`;
        return;
      }

      const isAdmin = appRoles.some(r => ['super_admin', 'center_admin', 'ops_staff', 'exam_manager', 'finance_staff'].includes(r));
      if (isAdmin) {
        window.location.href = `${BASE}/portal/admin`;
        return;
      }

      const isSchool  = appRoles.some(r => ['school', 'school_coordinator', 'institution_admin', 'school_admin'].includes(r))
                     || metaRole === 'school_coordinator';

      const isPartner = appRoles.some(r => [
        'partner', 'partner_org', 'national_partner', 'regional_partner',
        'national_partner_admin', 'national_partner_coordinator',
      ].includes(r))
                     || metaRole === 'partner'
                     || metaRole === 'national_partner';

      if (isSchool) {
        window.location.href = `${BASE}/portal/school`;
      } else if (isPartner) {
        window.location.href = `${BASE}/portal/partner`;
      } else {
        window.location.href = `${BASE}/portal/dashboard`;
      }
    } catch {
      setError(t.common.error);
      setLoading(false);
    }
  };

  if (forgotMode) {
    return (
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
            {t.portal.resetPasswordTitle}
          </h2>
          <p className="mt-2 text-text-secondary">
            {t.portal.resetPasswordSubtitle}
          </p>
        </div>

        {/* Success state */}
        {resetSent ? (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
              <div>
                <p className="text-sm text-green-800 leading-relaxed">{t.portal.resetLinkSent}</p>
                <p className="text-xs text-green-700 mt-1 opacity-80">{t.portal.resetLinkSentSpam}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(""); }}
              className="flex items-center gap-2 text-sm font-medium text-orange hover:text-orange/80 transition-colors"
            >
              <ChevronLeft size={16} />
              {t.portal.backToSignIn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            {/* Error banner */}
            {resetError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm text-red-700 leading-relaxed">{resetError}</p>
              </div>
            )}

            {/* Email input */}
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-text-primary mb-1.5">
                {t.portal.email}
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder={t.portal.emailPlaceholder}
                required
                disabled={resetLoading}
                className="w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all text-sm disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={resetLoading}
              className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {resetLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t.portal.sendingResetLink}</span>
                </>
              ) : (
                <span>{t.portal.sendResetLink}</span>
              )}
            </button>

            {/* Back link */}
            <button
              type="button"
              onClick={() => { setForgotMode(false); setResetError(null); }}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-navy transition-colors"
            >
              <ChevronLeft size={16} />
              {t.portal.backToSignIn}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
          {t.portal.welcomeBack}
        </h2>
        <p className="mt-2 text-text-secondary">
          {t.portal.signInSubtitle}
        </p>
      </div>

      {/* Role tabs */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          {t.portal.iAmA}
        </label>
        <div className="flex gap-1 p-1 bg-navy-light rounded-xl">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setSelectedRole(r.value)}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 font-[family-name:var(--font-display)]",
                selectedRole === r.value
                  ? "bg-white text-navy shadow-sm"
                  : "text-text-secondary hover:text-navy"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {t.portal.email}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.portal.emailPlaceholder}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all text-sm disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary"
            >
              {t.portal.password}
            </label>
            <button
              type="button"
              onClick={() => { setForgotMode(true); setResetEmail(email); setResetError(null); setResetSent(false); }}
              className="text-xs font-medium text-orange hover:text-orange/80 transition-colors"
            >
              {t.portal.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.portal.passwordPlaceholder}
              required
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

        {/* Sign In button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{t.portal.signingIn}</span>
            </>
          ) : (
            <>
              <span>{t.portal.signIn}</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Help divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-4 text-text-secondary uppercase tracking-wider">
            {t.portal.needHelp}
          </span>
        </div>
      </div>

      {/* Bottom text */}
      <p className="text-center text-sm text-text-secondary">
        {t.portal.noAccount}{" "}
        <Link
          href="/portal/register"
          className="font-semibold text-orange hover:text-orange/80 transition-colors"
        >
          {t.portal.createAccount}
        </Link>
      </p>

      {/* Security note */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <p className="text-center text-[11px] text-text-secondary/60 leading-relaxed">
          {t.portal.secureNote}
        </p>
      </div>
    </div>
  );
}
