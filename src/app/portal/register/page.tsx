"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  School,
  Globe2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  Check,
} from "lucide-react";
import { getAuthClient } from "@/lib/supabase";
import { fetchCountryByCode, fetchSchoolByCode, checkEmailTaken } from "@/lib/queries";
import { useI18n } from "@/lib/i18n";
import { SUBJECTS } from "@/lib/constants";
import type { Database } from "@/lib/database.types";

/* ─── Country list ──────────────────────────────────────────────────────── */

const COUNTRIES = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/* ─── Fee per subject (placeholder until Stripe integration) ─────────────── */

const FEE_PER_SUBJECT_USD = 15;

/* ─── Types ─────────────────────────────────────────────────────────────── */

type RoleId = "student" | "school" | "partner";
type AmsioTrack = "partner" | "direct";

/**
 * Steps for the student registration flow:
 *   1 — Role selection
 *   2 — Details (nationality + personal info + school code)
 *   3 — Subject selection
 *   4 — Payment / confirmation
 *   5 — Done (success screen)
 *
 * School and partner roles only use steps 1 → 2 → 5.
 */
type Step = 1 | 2 | 3 | 4 | 5;

type CountryRow = Pick<
  Database["public"]["Tables"]["countries"]["Row"],
  "id" | "name" | "code" | "flag" | "status" | "partner_name" | "partner_email" | "partner_rep"
>;

interface SchoolValidation {
  status: "idle" | "checking" | "valid" | "invalid";
  schoolName: string | null;
}

/** Subject keys as used in signUp metadata */
type SubjectKey =
  | "mathematics"
  | "science"
  | "language-en"
  | "language-zh"
  | "ci";

/* ─── Shared input style ─────────────────────────────────────────────────── */

const INPUT =
  "w-full h-11 px-4 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white transition-all disabled:opacity-60";

const SELECT = INPUT + " cursor-pointer";

/* ─── Shared password field ──────────────────────────────────────────────── */

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Min. 8 characters"}
          required
          disabled={disabled}
          className={INPUT + " pr-11"}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label={show ? t.portal.hidePassword : t.portal.showPassword}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ─── Error banner ───────────────────────────────────────────────────────── */

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
      <p className="text-sm text-red-700 leading-relaxed">{msg}</p>
    </div>
  );
}

/* ─── Submit button ──────────────────────────────────────────────────────── */

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  const { t } = useI18n();
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {t.portal.register.creating}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={15} className="ml-0.5" />
        </>
      )}
    </button>
  );
}

/* ─── School code validator ─────────────────────────────────────────────── */

function isValidSchoolCodeFormat(code: string) {
  return /^[A-Z0-9][A-Z0-9\-]{3,29}$/.test(code.trim().toUpperCase());
}

/* ─── School code input with live validation ─────────────────────────────── */

function SchoolCodeInput({
  id,
  value,
  onChange,
  disabled,
  validation,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  validation: SchoolValidation;
}) {
  const { t } = useI18n();

  const borderClass =
    validation.status === "valid"
      ? "border-emerald-400 focus:ring-emerald-200 focus:border-emerald-400"
      : validation.status === "invalid"
      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
      : "";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        School Code
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder={t.portal.schoolCodePlaceholder}
          maxLength={30}
          disabled={disabled}
          className={INPUT + " tracking-widest font-mono pr-10 " + borderClass}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {validation.status === "checking" && (
            <Loader2 size={15} className="animate-spin text-orange" />
          )}
          {validation.status === "valid" && (
            <Check size={15} className="text-emerald-500" />
          )}
          {validation.status === "invalid" && (
            <AlertCircle size={15} className="text-red-500" />
          )}
        </div>
      </div>

      {validation.status === "valid" && validation.schoolName && (
        <p className="mt-1.5 text-xs text-emerald-700 flex items-center gap-1.5">
          <Check size={11} className="shrink-0" />
          {t.portal.schoolVerified}: <span className="font-semibold">{validation.schoolName}</span>
        </p>
      )}
      {validation.status === "invalid" && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle size={11} className="shrink-0" />
          {t.portal.invalidSchoolCode}
        </p>
      )}
      {validation.status === "idle" && (
        <p className="mt-1.5 text-xs text-slate-500 flex items-start gap-1.5">
          <AlertCircle size={12} className="shrink-0 mt-0.5 text-orange" />
          {t.portal.register.schoolCodeHint}
        </p>
      )}
    </div>
  );
}

/* ─── Email availability — live dedup ───────────────────────────────────── */

type EmailStatus = "idle" | "checking" | "available" | "taken";

function useEmailCheck(email: string): EmailStatus {
  const [status, setStatus] = useState<EmailStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = email.trim().toLowerCase();

    // Only check when it looks like a real email
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("idle");
      return;
    }

    setStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const taken = await checkEmailTaken(trimmed);
      setStatus(taken ? "taken" : "available");
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [email]);

  return status;
}

function EmailField({
  id,
  label,
  value,
  onChange,
  disabled,
  emailStatus,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  emailStatus: EmailStatus;
}) {
  const borderClass =
    emailStatus === "available"
      ? "border-emerald-400 focus:ring-emerald-200 focus:border-emerald-400"
      : emailStatus === "taken"
      ? "border-red-400 focus:ring-red-200 focus:border-red-400"
      : "";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="email"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="you@example.com"
          disabled={disabled}
          className={INPUT + " pr-10 " + borderClass}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {emailStatus === "checking" && (
            <Loader2 size={15} className="animate-spin text-orange" />
          )}
          {emailStatus === "available" && (
            <Check size={15} className="text-emerald-500" />
          )}
          {emailStatus === "taken" && (
            <AlertCircle size={15} className="text-red-500" />
          )}
        </div>
      </div>

      {emailStatus === "taken" && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle size={11} className="shrink-0" />
          Email đã được đăng ký.{" "}
          <a href="/portal/login" className="font-semibold underline hover:no-underline">
            Đăng nhập?
          </a>
        </p>
      )}
      {emailStatus === "available" && (
        <p className="mt-1.5 text-xs text-emerald-700 flex items-center gap-1.5">
          <Check size={11} className="shrink-0" />
          Email có thể dùng
        </p>
      )}
    </div>
  );
}

/* ─── Partner track banner ───────────────────────────────────────────────── */

function PartnerBanner({
  partnerName,
  countryName,
  countryFlag,
  partnerEmail,
}: {
  partnerName: string;
  countryName: string;
  countryFlag: string | null;
  partnerEmail: string | null;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 flex items-start gap-3">
      <span className="text-xl shrink-0 mt-0.5">{countryFlag ?? "🏳️"}</span>
      <div>
        <p className="text-sm font-semibold text-blue-800">
          {countryName} — {t.portal.partnerTrackInfo}
        </p>
        <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
          Official National Partner: <strong>{partnerName}</strong>. Your registration will be
          confirmed by them — no online payment needed.
        </p>
        {partnerEmail && (
          <a
            href={`mailto:${partnerEmail}`}
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline transition-colors"
          >
            <Mail size={12} />
            Contact {partnerName}
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Direct track banner ────────────────────────────────────────────────── */

function DirectBanner({ countryName }: { countryName: string }) {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 flex items-start gap-3">
      <span className="text-xl shrink-0 mt-0.5">🌐</span>
      <div>
        <p className="text-sm font-semibold text-emerald-800">
          AMSIO Online is available for your country
        </p>
        <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
          {countryName} does not yet have an official National Partner.{" "}
          {t.portal.directTrackInfo}.
        </p>
      </div>
    </div>
  );
}

/* ─── Student Form — School track ────────────────────────────────────────── */

interface StudentSchoolFormData {
  studentName: string;
  dob: string;
  grade: string;
  schoolCode: string;
  email: string;
  password: string;
  confirmPassword: string;
  isParentToggle: boolean;
  guardianName: string;
  guardianPhone: string;
}

function StudentSchoolForm({
  onNext,
  countryCode,
  partnerData,
  initialData,
  onDataChange,
}: {
  onNext: (data: StudentSchoolFormData) => void;
  countryCode: string;
  partnerData: CountryRow;
  initialData: Partial<StudentSchoolFormData>;
  onDataChange: (data: Partial<StudentSchoolFormData>) => void;
}) {
  const { t } = useI18n();
  const [studentName, setStudentName] = useState(initialData.studentName ?? "");
  const [dob, setDob] = useState(initialData.dob ?? "");
  const [grade, setGrade] = useState(initialData.grade ?? "");
  const [schoolCode, setSchoolCode] = useState(initialData.schoolCode ?? "");
  const [email, setEmail] = useState(initialData.email ?? "");
  const [password, setPassword] = useState(initialData.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState(initialData.confirmPassword ?? "");
  const [isParentToggle, setIsParentToggle] = useState(initialData.isParentToggle ?? false);
  const [guardianName, setGuardianName] = useState(initialData.guardianName ?? "");
  const [guardianPhone, setGuardianPhone] = useState(initialData.guardianPhone ?? "");
  const [error, setError] = useState<string | null>(null);
  const [schoolValidation, setSchoolValidation] = useState<SchoolValidation>({ status: "idle", schoolName: null });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emailStatus = useEmailCheck(email);

  // Debounced school code validation
  useEffect(() => {
    const code = schoolCode.trim().toUpperCase();
    if (!isValidSchoolCodeFormat(code)) {
      setSchoolValidation({ status: "idle", schoolName: null });
      return;
    }

    setSchoolValidation({ status: "checking", schoolName: null });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await fetchSchoolByCode(code);
        if (data) {
          setSchoolValidation({ status: "valid", schoolName: data.name });
        } else {
          setSchoolValidation({ status: "invalid", schoolName: null });
        }
      } catch {
        setSchoolValidation({ status: "invalid", schoolName: null });
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [schoolCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailStatus === "taken") {
      setError("Email đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.");
      return;
    }
    if (emailStatus === "checking") {
      setError("Đang kiểm tra email, vui lòng thử lại sau giây lát.");
      return;
    }

    const code = schoolCode.trim().toUpperCase();
    if (!isValidSchoolCodeFormat(code)) {
      setError(t.portal.invalidSchoolCode);
      return;
    }
    if (schoolValidation.status !== "valid") {
      setError(t.portal.invalidSchoolCode);
      return;
    }
    if (password.length < 8) {
      setError(t.portal.passwordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data: StudentSchoolFormData = {
      studentName,
      dob,
      grade,
      schoolCode: code,
      email,
      password,
      confirmPassword,
      isParentToggle,
      guardianName,
      guardianPhone,
    };
    onDataChange(data);
    onNext(data);
  };

  return (
    <div className="space-y-5">
      <PartnerBanner
        partnerName={partnerData.partner_name!}
        countryName={partnerData.name}
        countryFlag={partnerData.flag}
        partnerEmail={partnerData.partner_email}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner msg={error} />}

        <div>
          <label htmlFor="ssc-name" className="block text-sm font-medium text-slate-700 mb-1.5">
            {t.portal.studentFullName}
          </label>
          <input
            id="ssc-name"
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={t.portal.namePlaceholder}
            className={INPUT}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ssc-dob" className="block text-sm font-medium text-slate-700 mb-1.5">{t.portal.dateOfBirth}</label>
            <input
              id="ssc-dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="ssc-grade" className="block text-sm font-medium text-slate-700 mb-1.5">{t.portal.grade}</label>
            <select
              id="ssc-grade"
              required
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={SELECT}
            >
              <option value="">Select grade</option>
              {GRADES.map((g) => (
                <option key={g} value={String(g)}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        <SchoolCodeInput
          id="ssc-code"
          value={schoolCode}
          onChange={setSchoolCode}
          validation={schoolValidation}
        />

        <EmailField
          id="ssc-email"
          label={t.portal.email}
          value={email}
          onChange={setEmail}
          emailStatus={emailStatus}
        />

        <PasswordField id="ssc-pw" label="Password" value={password} onChange={setPassword} />
        <PasswordField id="ssc-cpw" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat your password" />

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isParentToggle}
            onChange={(e) => setIsParentToggle(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange focus:ring-orange/30 cursor-pointer"
          />
          <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
            I am a parent / guardian registering on behalf of my child
          </span>
        </label>

        {isParentToggle && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="ssc-guardian" className="block text-sm font-medium text-slate-700 mb-1.5">
                Parent / Guardian Full Name
              </label>
              <input
                id="ssc-guardian"
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="ssc-gphone" className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="ssc-gphone"
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className={INPUT}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
        >
          Next: Select Subjects
          <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
}

/* ─── Student Form — Online track ───────────────────────────────────────── */

interface StudentOnlineFormData {
  studentName: string;
  dob: string;
  grade: string;
  email: string;
  password: string;
  confirmPassword: string;
  isParentToggle: boolean;
  guardianName: string;
  guardianPhone: string;
}

function StudentOnlineForm({
  onNext,
  countryCode,
  countryName,
  initialData,
  onDataChange,
}: {
  onNext: (data: StudentOnlineFormData) => void;
  countryCode: string;
  countryName: string;
  initialData: Partial<StudentOnlineFormData>;
  onDataChange: (data: Partial<StudentOnlineFormData>) => void;
}) {
  const { t } = useI18n();
  const [studentName, setStudentName] = useState(initialData.studentName ?? "");
  const [dob, setDob] = useState(initialData.dob ?? "");
  const [grade, setGrade] = useState(initialData.grade ?? "");
  const [email, setEmail] = useState(initialData.email ?? "");
  const [password, setPassword] = useState(initialData.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState(initialData.confirmPassword ?? "");
  const [isParentToggle, setIsParentToggle] = useState(initialData.isParentToggle ?? false);
  const [guardianName, setGuardianName] = useState(initialData.guardianName ?? "");
  const [guardianPhone, setGuardianPhone] = useState(initialData.guardianPhone ?? "");
  const [error, setError] = useState<string | null>(null);
  const emailStatus = useEmailCheck(email);

  // countryCode is captured in metadata at submit — suppresses unused-var lint
  void countryCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailStatus === "taken") {
      setError("Email đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.");
      return;
    }
    if (emailStatus === "checking") {
      setError("Đang kiểm tra email, vui lòng thử lại sau giây lát.");
      return;
    }
    if (password.length < 8) {
      setError(t.portal.passwordMinLength);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const data: StudentOnlineFormData = {
      studentName,
      dob,
      grade,
      email,
      password,
      confirmPassword,
      isParentToggle,
      guardianName,
      guardianPhone,
    };
    onDataChange(data);
    onNext(data);
  };

  return (
    <div className="space-y-5">
      <DirectBanner countryName={countryName} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner msg={error} />}

        <div>
          <label htmlFor="sol-name" className="block text-sm font-medium text-slate-700 mb-1.5">
            {t.portal.studentFullName}
          </label>
          <input
            id="sol-name"
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder={t.portal.namePlaceholder}
            className={INPUT}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sol-dob" className="block text-sm font-medium text-slate-700 mb-1.5">{t.portal.dateOfBirth}</label>
            <input
              id="sol-dob"
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="sol-grade" className="block text-sm font-medium text-slate-700 mb-1.5">{t.portal.grade}</label>
            <select
              id="sol-grade"
              required
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={SELECT}
            >
              <option value="">Select grade</option>
              {GRADES.map((g) => (
                <option key={g} value={String(g)}>Grade {g}</option>
              ))}
            </select>
          </div>
        </div>

        <EmailField
          id="sol-email"
          label={t.portal.email}
          value={email}
          onChange={setEmail}
          emailStatus={emailStatus}
        />

        <PasswordField id="sol-pw" label="Password" value={password} onChange={setPassword} />
        <PasswordField id="sol-cpw" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat your password" />

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={isParentToggle}
            onChange={(e) => setIsParentToggle(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange focus:ring-orange/30 cursor-pointer"
          />
          <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
            I am a parent / guardian registering on behalf of my child
          </span>
        </label>

        {isParentToggle && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="sol-guardian" className="block text-sm font-medium text-slate-700 mb-1.5">
                Parent / Guardian Full Name
              </label>
              <input
                id="sol-guardian"
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="sol-gphone" className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="sol-gphone"
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className={INPUT}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
        >
          Next: Select Subjects
          <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
}

/* ─── Student Step 2 — nationality picker + inline form ─────────────────── */

interface StudentDetailsResult {
  track: "school" | "online";
  amsioTrack: AmsioTrack;
  countryCode: string;
  countryName: string;
  partnerData: CountryRow | null;
  formData: StudentSchoolFormData | StudentOnlineFormData;
}

function StudentRegistrationStep({
  onNext,
  savedCountryCode,
}: {
  onNext: (result: StudentDetailsResult) => void;
  savedCountryCode: string;
}) {
  const [selectedCode, setSelectedCode] = useState(savedCountryCode);
  const [checkingPartner, setCheckingPartner] = useState(false);
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);
  const [partnerData, setPartnerData] = useState<CountryRow | null>(null);
  const [schoolFormData, setSchoolFormData] = useState<Partial<StudentSchoolFormData>>({});
  const [onlineFormData, setOnlineFormData] = useState<Partial<StudentOnlineFormData>>({});

  const selectedCountryLocal = COUNTRIES.find((c) => c.code === selectedCode);

  const handleCountryChange = useCallback(async (code: string) => {
    setSelectedCode(code);
    setHasPartner(null);
    setPartnerData(null);

    if (!code) return;

    setCheckingPartner(true);
    const timeoutId = setTimeout(() => {
      console.warn(`[StudentReg] fetchCountryByCode timeout for ${code}`);
      setCheckingPartner(false);
      setHasPartner(false);
    }, 5000);

    try {
      const { data, error } = await fetchCountryByCode(code);
      clearTimeout(timeoutId);

      if (error || !data) {
        setHasPartner(false);
      } else if (data.status === "Active" && data.partner_name) {
        setHasPartner(true);
        setPartnerData(data);
      } else {
        setHasPartner(false);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setHasPartner(false);
    } finally {
      setCheckingPartner(false);
    }
  }, []);

  // Re-check if savedCountryCode was already set
  useEffect(() => {
    if (savedCountryCode && hasPartner === null) {
      void handleCountryChange(savedCountryCode);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSchoolNext = (data: StudentSchoolFormData) => {
    onNext({
      track: "school",
      amsioTrack: "partner",
      countryCode: selectedCode,
      countryName: selectedCountryLocal?.name ?? selectedCode,
      partnerData,
      formData: data,
    });
  };

  const handleOnlineNext = (data: StudentOnlineFormData) => {
    onNext({
      track: "online",
      amsioTrack: "direct",
      countryCode: selectedCode,
      countryName: selectedCountryLocal?.name ?? selectedCode,
      partnerData: null,
      formData: data,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="nat-select" className="block text-sm font-medium text-slate-700 mb-1.5">
          Student&apos;s Nationality / Country of Residence
        </label>
        <div className="relative">
          <select
            id="nat-select"
            value={selectedCode}
            onChange={(e) => handleCountryChange(e.target.value)}
            className={SELECT}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {checkingPartner && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 size={15} className="animate-spin text-orange" />
            </div>
          )}
        </div>
      </div>

      {selectedCode && !checkingPartner && hasPartner === true && partnerData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">🏫</span>
            <span className="text-sm font-semibold text-slate-700">School Partner Track</span>
          </div>
          <StudentSchoolForm
            onNext={handleSchoolNext}
            countryCode={selectedCode}
            partnerData={partnerData}
            initialData={schoolFormData}
            onDataChange={setSchoolFormData}
          />
        </div>
      )}

      {selectedCode && !checkingPartner && hasPartner === false && selectedCountryLocal && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">🌐</span>
            <span className="text-sm font-semibold text-slate-700">AMSIO Online Track</span>
          </div>
          <StudentOnlineForm
            onNext={handleOnlineNext}
            countryCode={selectedCode}
            countryName={selectedCountryLocal.name}
            initialData={onlineFormData}
            onDataChange={setOnlineFormData}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Subject Selection Step ─────────────────────────────────────────────── */

interface SubjectSelectionStepProps {
  selectedSubjects: SubjectKey[];
  onChange: (subjects: SubjectKey[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function SubjectSelectionStep({
  selectedSubjects,
  onChange,
  onNext,
  onBack,
}: SubjectSelectionStepProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  const toggleSubject = (key: SubjectKey) => {
    if (selectedSubjects.includes(key)) {
      onChange(selectedSubjects.filter((s) => s !== key));
    } else {
      onChange([...selectedSubjects, key]);
    }
    setError(null);
  };

  const hasLanguageEn = selectedSubjects.includes("language-en");
  const hasLanguageZh = selectedSubjects.includes("language-zh");

  const handleNext = () => {
    if (selectedSubjects.length === 0) {
      setError(t.portal.atLeastOneSubject);
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-5">
      {error && <ErrorBanner msg={error} />}

      <div className="space-y-3">
        {SUBJECTS.map((subject) => {
          if (subject.id === "language") {
            // Language subject shows two sub-option toggles
            const isAnyLanguage = hasLanguageEn || hasLanguageZh;
            return (
              <div
                key={subject.id}
                className={`rounded-2xl border-2 bg-white p-5 transition-all ${
                  isAnyLanguage
                    ? "border-purple-500 ring-2 ring-purple-200 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                    style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                  >
                    {subject.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-base font-[family-name:var(--font-display)]">
                      {subject.name}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{subject.divisionLabel}</p>

                    {/* Sub-options */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSubject("language-en")}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          hasLanguageEn
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-purple-400"
                        }`}
                      >
                        {hasLanguageEn && <Check size={11} className="inline mr-1" />}
                        {t.portal.subjectLanguageEn}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSubject("language-zh")}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          hasLanguageZh
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-purple-400"
                        }`}
                      >
                        {hasLanguageZh && <Check size={11} className="inline mr-1" />}
                        {t.portal.subjectLanguageCh}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const key = subject.id as SubjectKey;
          const isSelected = selectedSubjects.includes(key);

          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => toggleSubject(key)}
              className={`w-full text-left rounded-2xl border-2 bg-white p-5 transition-all ${
                isSelected
                  ? "ring-2 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
              style={
                isSelected
                  ? { borderColor: subject.color, "--tw-ring-color": `${subject.color}33` } as React.CSSProperties
                  : undefined
              }
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                >
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-base font-[family-name:var(--font-display)]">
                    {subject.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{subject.divisionLabel}</p>
                  <p className="text-slate-400 text-xs mt-1">{subject.duration}</p>
                </div>
                {isSelected && (
                  <div
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: subject.color }}
                  >
                    <Check size={13} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedSubjects.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold">{selectedSubjects.length}</span> subject
          {selectedSubjects.length !== 1 ? "s" : ""} selected
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 hover:text-slate-800 transition-all flex items-center gap-1.5 bg-white"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          Next: Review &amp; Submit
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Payment / Confirmation Step ────────────────────────────────────────── */

interface PaymentStepProps {
  amsioTrack: AmsioTrack;
  partnerData: CountryRow | null;
  countryName: string;
  studentName: string;
  subjects: SubjectKey[];
  email: string;
  password: string;
  grade: string;
  countryCode: string;
  studentTrack: "school" | "online";
  schoolCode?: string;
  dob?: string;
  isParentRegistration?: boolean;
  guardianName?: string;
  guardianPhone?: string;
  onSuccess: () => void;
  onBack: () => void;
}

function PaymentStep({
  amsioTrack,
  partnerData,
  countryName,
  studentName,
  subjects,
  email,
  password,
  grade,
  countryCode,
  studentTrack,
  schoolCode,
  dob,
  isParentRegistration,
  guardianName,
  guardianPhone,
  onSuccess,
  onBack,
}: PaymentStepProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalFee = subjects.length * FEE_PER_SUBJECT_USD;

  const subjectLabels: Record<SubjectKey, string> = {
    mathematics: "Mathematics",
    science: "Science",
    "language-en": `Language (${t.portal.subjectLanguageEn})`,
    "language-zh": `Language (${t.portal.subjectLanguageCh})`,
    ci: "Computational Intelligence",
  };

  const buildMetadata = (track: AmsioTrack) => ({
    full_name: studentName,
    role: "student",
    track: studentTrack,
    nationality: countryCode,
    grade,
    date_of_birth: dob,
    is_parent_registration: isParentRegistration ?? false,
    ...(isParentRegistration && guardianName && { guardian_name: guardianName }),
    ...(isParentRegistration && guardianPhone && { guardian_phone: guardianPhone }),
    ...(studentTrack === "school" && schoolCode && { school_code: schoolCode }),
    amsio_track: track,
    subjects,
    // payment_status: "pending" for direct track — updated to "paid" once payment confirmed
    payment_status: track === "direct" ? "pending" : "partner_managed",
    // FEE_PER_SUBJECT_USD is set in register/page.tsx — contact info@amsio.org to change
    total_fee_usd: track === "direct" ? subjects.length * FEE_PER_SUBJECT_USD : 0,
  });

  const handleSubmitPartner = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: signUpError } = await getAuthClient().auth.signUp({
        email,
        password,
        options: { data: buildMetadata("partner") },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmitDirect = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: signUpError } = await getAuthClient().auth.signUp({
        email,
        password,
        options: { data: buildMetadata("direct") },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Registration summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Registration Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Student</span>
            <span className="font-semibold text-slate-800">{studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Country</span>
            <span className="font-semibold text-slate-800">{countryName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Grade</span>
            <span className="font-semibold text-slate-800">Grade {grade}</span>
          </div>
          {schoolCode && (
            <div className="flex justify-between">
              <span className="text-slate-500">School Code</span>
              <span className="font-semibold text-slate-800 font-mono">{schoolCode}</span>
            </div>
          )}
          <div className="flex justify-between items-start">
            <span className="text-slate-500">Subjects</span>
            <div className="text-right space-y-0.5">
              {subjects.map((s) => (
                <div key={s} className="font-semibold text-slate-800 text-xs">{subjectLabels[s]}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Partner track */}
      {amsioTrack === "partner" && partnerData && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 space-y-1">
            <p className="text-sm font-semibold text-blue-800">
              {t.portal.partnerTrackInfo}
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              {t.portal.partnerWillContact}
            </p>
          </div>

          {error && <ErrorBanner msg={error} />}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 hover:text-slate-800 transition-all flex items-center gap-1.5 bg-white"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitPartner}
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.portal.register.creating}
                </>
              ) : (
                <>
                  {t.portal.submitRegistration}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Direct track */}
      {amsioTrack === "direct" && (
        <div className="space-y-4">
          {/* Fee breakdown */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>{t.portal.feePerSubject}</span>
              <span>${FEE_PER_SUBJECT_USD} USD</span>
            </div>
            {subjects.map((s) => (
              <div key={s} className="flex justify-between text-slate-500 text-xs">
                <span>{subjectLabels[s]}</span>
                <span>${FEE_PER_SUBJECT_USD}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-800">
              <span>Total</span>
              <span>${totalFee} USD</span>
            </div>
          </div>

          {/* Payment notice — account created first, pay later */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 flex items-start gap-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Online payment coming soon — complete registration now
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Your account will be created immediately. Payment instructions will be available inside your portal, or contact us directly.
              </p>
              <a
                href="mailto:info@amsio.org"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline transition-colors"
              >
                <Mail size={12} />
                info@amsio.org
              </a>
            </div>
          </div>

          {error && <ErrorBanner msg={error} />}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="h-12 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:border-slate-300 hover:text-slate-800 transition-all flex items-center gap-1.5 bg-white"
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitDirect}
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.portal.register.creating}
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── School Staff Form ─────────────────────────────────────────────────── */

const SCHOOL_DIAL_COUNTRIES = [
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MM", name: "Myanmar", dial: "+95" },
  { code: "KH", name: "Cambodia", dial: "+855" },
  { code: "LA", name: "Laos", dial: "+856" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "XX", name: "Other", dial: "" },
];


function SchoolStaffForm({ onSuccess }: { onSuccess: (schoolCode: string) => void }) {
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState(SCHOOL_DIAL_COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailStatus = useEmailCheck(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailStatus === "taken") {
      setError("Email đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.");
      return;
    }
    if (emailStatus === "checking") {
      setError("Đang kiểm tra email, vui lòng thử lại sau giây lát.");
      return;
    }
    if (!schoolName.trim()) {
      setError("Please enter your school name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a contact phone number.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    let schoolCode: string;
    try {
      const codeRes = await fetch("/api/v1/school-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: country.code }),
      });
      if (!codeRes.ok) {
        setError("Failed to generate a school code. Please try again.");
        setLoading(false);
        return;
      }
      const codeData = (await codeRes.json()) as { code?: string };
      if (!codeData.code) {
        setError("Failed to generate a school code. Please try again.");
        setLoading(false);
        return;
      }
      schoolCode = codeData.code;
    } catch {
      setError("Network error while generating school code. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await getAuthClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "school_coordinator",
            school_name: schoolName.trim(),
            school_code: schoolCode,
            nationality: country.code,
            country_code: country.code,
            country_name: country.name,
            dial_code: country.dial,
            phone: country.dial ? `${country.dial}${phone.trim()}` : phone.trim(),
            position,
            status: "pending",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      onSuccess(schoolCode);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner msg={error} />}

      <div>
        <label htmlFor="sc-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
        <input
          id="sc-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Maria Santos"
          disabled={loading}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="sc-school" className="block text-sm font-medium text-slate-700 mb-1.5">School Name</label>
        <input
          id="sc-school"
          type="text"
          required
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="e.g. Riverside International School"
          disabled={loading}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="sc-pos" className="block text-sm font-medium text-slate-700 mb-1.5">Position / Title</label>
        <input
          id="sc-pos"
          type="text"
          required
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="e.g. AMSIO Coordinator, Vice Principal"
          disabled={loading}
          className={INPUT}
        />
      </div>

      {/* Country + Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Country &amp; Contact Phone</label>
        <div className="flex gap-2">
          <select
            value={country.code}
            onChange={(e) => {
              const found = SCHOOL_DIAL_COUNTRIES.find((c) => c.code === e.target.value);
              if (found) setCountry(found);
            }}
            disabled={loading}
            className="w-44 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/40"
          >
            {SCHOOL_DIAL_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}{c.dial ? ` (${c.dial})` : ""}
              </option>
            ))}
          </select>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={country.dial ? `${country.dial} (555) 123-4567` : "Phone number"}
            disabled={loading}
            className={`flex-1 ${INPUT}`}
          />
        </div>
      </div>

      <EmailField
        id="sc-email"
        label="Work Email"
        value={email}
        onChange={setEmail}
        disabled={loading}
        emailStatus={emailStatus}
      />

      <PasswordField id="sc-pw" label="Password" value={password} onChange={setPassword} disabled={loading} />
      <PasswordField id="sc-cpw" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat your password" disabled={loading} />

      <SubmitBtn loading={loading} label="Create School Account" />
    </form>
  );
}

/* ─── National Partner Form ─────────────────────────────────────────────── */

function NationalPartnerForm({ onSuccess }: { onSuccess: () => void }) {
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState(SCHOOL_DIAL_COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailStatus = useEmailCheck(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (emailStatus === "taken") {
      setError("This email is already registered. Please sign in or use a different email.");
      return;
    }
    if (emailStatus === "checking") {
      setError("Checking email availability, please try again in a moment.");
      return;
    }
    if (!orgName.trim()) {
      setError("Please enter your organization name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter a contact phone number.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await getAuthClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "national_partner",
            organization_name: orgName.trim(),
            country_code: country.code,
            country_name: country.name,
            dial_code: country.dial,
            phone: country.dial ? `${country.dial}${phone.trim()}` : phone.trim(),
            position,
            website: website.trim() || undefined,
            motivation: motivation.trim() || undefined,
            status: "pending",
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorBanner msg={error} />}

      <div>
        <label htmlFor="np-name" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name (Representative)</label>
        <input
          id="np-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. John Smith"
          disabled={loading}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="np-org" className="block text-sm font-medium text-slate-700 mb-1.5">Organization Name</label>
        <input
          id="np-org"
          type="text"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="e.g. AMSIO Education Group Ltd."
          disabled={loading}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="np-pos" className="block text-sm font-medium text-slate-700 mb-1.5">Position / Title</label>
        <input
          id="np-pos"
          type="text"
          required
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="e.g. CEO, Director, Country Manager"
          disabled={loading}
          className={INPUT}
        />
      </div>

      {/* Country + Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Country &amp; Contact Phone</label>
        <div className="flex gap-2">
          <select
            value={country.code}
            onChange={(e) => {
              const found = SCHOOL_DIAL_COUNTRIES.find((c) => c.code === e.target.value);
              if (found) setCountry(found);
            }}
            disabled={loading}
            className="w-44 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/40"
          >
            {SCHOOL_DIAL_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}{c.dial ? ` (${c.dial})` : ""}
              </option>
            ))}
          </select>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={country.dial ? `${country.dial} (555) 123-4567` : "Phone number"}
            disabled={loading}
            className={`flex-1 ${INPUT}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="np-website" className="block text-sm font-medium text-slate-700 mb-1.5">
          Website <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          id="np-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yourorganization.com"
          disabled={loading}
          className={INPUT}
        />
      </div>

      <EmailField
        id="np-email"
        label="Work Email"
        value={email}
        onChange={setEmail}
        disabled={loading}
        emailStatus={emailStatus}
      />

      <PasswordField id="np-pw" label="Password" value={password} onChange={setPassword} disabled={loading} />
      <PasswordField id="np-cpw" label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Repeat your password" disabled={loading} />

      <div>
        <label htmlFor="np-motivation" className="block text-sm font-medium text-slate-700 mb-1.5">
          Why do you want to represent AMSIO in your country?{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="np-motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Brief message about your motivation and background…"
          disabled={loading}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white transition-all disabled:opacity-60 resize-none"
        />
      </div>

      <SubmitBtn loading={loading} label="Submit Application" />
    </form>
  );
}

/* ─── National Partner block ─────────────────────────────────────────────── */

function NationalPartnerBlock({ onPartnerSuccess }: { onPartnerSuccess: () => void }) {
  const { t } = useI18n();
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors bg-white"
            aria-label="Back to options"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-display)]">
              National Partner Application
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill in your details to apply</p>
          </div>
        </div>
        <NationalPartnerForm onSuccess={onPartnerSuccess} />
      </div>
    );
  }

  return (
    <div className="text-center py-4 px-2 space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
        <Globe2 size={28} className="text-amber-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800 font-[family-name:var(--font-display)]">
          {t.portal.register.partner}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
          {t.portal.register.partnerGated}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange text-white text-sm font-semibold hover:bg-orange/90 transition-colors shadow-sm"
        >
          <ArrowRight size={15} />
          Apply Online
        </button>
        <a
          href="mailto:info@amsio.org"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          <Mail size={15} />
          Contact AMSIO HQ directly
        </a>
      </div>
    </div>
  );
}

/* ─── Success screen ─────────────────────────────────────────────────────── */

function SuccessScreen({
  amsioTrack,
  role,
  schoolCode,
}: {
  amsioTrack: AmsioTrack | null;
  role: RoleId;
  schoolCode?: string;
}) {
  const { t } = useI18n();

  let title = "Account Created!";
  let message = "Check your email to verify your address, then sign in to your student portal.";

  if (role === "student" && amsioTrack === "partner") {
    title = t.portal.registrationSubmitted;
    message = t.portal.partnerWillContact;
  } else if (role === "student" && amsioTrack === "direct") {
    title = "Account Created!";
    message = "Check your email to verify your address, then browse AMSIO Online competitions in your portal.";
  } else if (role === "school") {
    title = "School Account Created!";
    message = "Verify your email. AMSIO will review your registration and activate your account within 1–2 business days.";
  } else if (role === "partner") {
    title = "Application Submitted!";
    message = "Thank you for your interest in becoming an AMSIO National Partner. Our team will review your application and contact you within 3–5 business days.";
  }

  return (
    <div className="text-center py-10 px-4 space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
        <CheckCircle2 size={36} className="text-emerald-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800 font-[family-name:var(--font-display)]">
          {title}
        </h2>
        <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>

      {role === "school" && schoolCode && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-6 py-5 text-left max-w-sm mx-auto">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Your School Code</p>
          <p className="text-2xl font-mono font-bold text-amber-900 tracking-widest">{schoolCode}</p>
          <p className="text-xs text-amber-700 mt-2 leading-relaxed">
            Save this code. Once your account is activated, your teachers and staff will use it to register under your school.
          </p>
        </div>
      )}

      <Link
        href="/portal/login"
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-colors shadow-sm"
      >
        Go to Sign In
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────────────── */

function ProgressBar({
  step,
  isStudentFlow,
  isPartner,
}: {
  step: Step;
  isStudentFlow: boolean;
  isPartner: boolean;
}) {
  const { t } = useI18n();

  // Student flow: Role → Details → Subjects → Payment → Done (5 steps)
  // School flow:  Role → Details → Done (steps 1, 2, 5 map to 1, 2, 3 in display)
  const studentSteps = [
    t.portal.progressRole,
    t.portal.progressDetails,
    t.portal.selectSubjects,
    "Payment",
    t.portal.progressDone,
  ];
  const schoolSteps = [t.portal.progressRole, t.portal.progressDetails, t.portal.progressDone];

  const steps = isStudentFlow ? studentSteps : schoolSteps;

  // Map actual step to display step index (0-based)
  let displayStep: number;
  if (isStudentFlow) {
    displayStep = step - 1; // steps 1–5 map to indices 0–4
  } else {
    // School: step 1→0, step 2→1, step 5→2
    displayStep = step === 5 ? 2 : step - 1;
  }

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, idx) => {
        const active = idx === displayStep;
        const done = idx < displayStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-orange text-white ring-4 ring-orange/20"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 size={14} /> : idx + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                  active ? "text-orange" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mb-4 rounded-full transition-all ${
                  done ? "bg-emerald-400" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
      {isPartner && (
        <span className="ml-3 mb-4 text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold border border-amber-200">
          Invitation Only
        </span>
      )}
    </div>
  );
}

/* ─── Role Card ──────────────────────────────────────────────────────────── */

type RoleCard = {
  id: RoleId;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  accent: string;
};

const ROLE_CARDS: RoleCard[] = [
  {
    id: "student",
    icon: (
      <div className="flex items-center gap-0.5">
        <GraduationCap size={22} />
        <Users size={18} />
      </div>
    ),
    title: "Student or Parent / Guardian",
    description: "Register a student for AMSIO competitions",
    tag: "Open registration",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    accent: "border-[#0A1628] ring-[#0A1628]",
  },
  {
    id: "school",
    icon: <School size={26} />,
    title: "School Coordinator",
    description: "Manage AMSIO registrations and results for your school",
    tag: "Register your school — get your school code instantly",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "border-emerald-500 ring-emerald-500",
  },
  {
    id: "partner",
    icon: <Globe2 size={26} />,
    title: "National Partner (invitation)",
    description: "Represent AMSIO in your country as the official National Partner",
    tag: "Invitation only — contact AMSIO HQ",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "border-amber-500 ring-amber-500",
  },
];

// Ẩn "Đăng ký cá nhân" (Student/Parent) + School Coordinator (mục 21).
// Đổi thành true để hiện lại 2 lựa chọn đăng ký này.
const SHOW_SELF_REGISTRATION = true;

/* ─── Collected student details ──────────────────────────────────────────── */

interface StudentRegDetails {
  track: "school" | "online";
  amsioTrack: AmsioTrack;
  countryCode: string;
  countryName: string;
  partnerData: CountryRow | null;
  studentName: string;
  email: string;
  password: string;
  grade: string;
  dob: string;
  schoolCode?: string;
  isParentRegistration: boolean;
  guardianName?: string;
  guardianPhone?: string;
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function RegisterPage() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>(1);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedSchoolCode, setGeneratedSchoolCode] = useState<string | undefined>(undefined);

  // Student-specific state that persists across steps
  const [studentDetails, setStudentDetails] = useState<StudentRegDetails | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectKey[]>([]);
  const [savedCountryCode, setSavedCountryCode] = useState("");

  const isPartner = selectedRole === "partner";
  const isStudentFlow = selectedRole === "student";

  const handleRoleSelect = (role: RoleId) => {
    setSelectedRole(role);
  };

  const handleRoleContinue = () => {
    if (!selectedRole) return;
    if (selectedRole === "partner") return;
    setStep(2);
  };

  // Called when student finishes step 2 (details)
  const handleStudentDetailsNext = (result: StudentDetailsResult) => {
    const fd = result.formData;
    setSavedCountryCode(result.countryCode);

    const isSchool = result.track === "school";
    const schoolFd = isSchool ? (fd as StudentSchoolFormData) : null;
    const onlineFd = !isSchool ? (fd as StudentOnlineFormData) : null;

    setStudentDetails({
      track: result.track,
      amsioTrack: result.amsioTrack,
      countryCode: result.countryCode,
      countryName: result.countryName,
      partnerData: result.partnerData,
      studentName: isSchool ? (schoolFd?.studentName ?? "") : (onlineFd?.studentName ?? ""),
      email: isSchool ? (schoolFd?.email ?? "") : (onlineFd?.email ?? ""),
      password: isSchool ? (schoolFd?.password ?? "") : (onlineFd?.password ?? ""),
      grade: isSchool ? (schoolFd?.grade ?? "") : (onlineFd?.grade ?? ""),
      dob: isSchool ? (schoolFd?.dob ?? "") : (onlineFd?.dob ?? ""),
      schoolCode: isSchool ? (schoolFd?.schoolCode) : undefined,
      isParentRegistration: isSchool
        ? (schoolFd?.isParentToggle ?? false)
        : (onlineFd?.isParentToggle ?? false),
      guardianName: isSchool
        ? (schoolFd?.guardianName ?? undefined)
        : (onlineFd?.guardianName ?? undefined),
      guardianPhone: isSchool
        ? (schoolFd?.guardianPhone ?? undefined)
        : (onlineFd?.guardianPhone ?? undefined),
    });
    setStep(3);
  };

  const handleSubjectsNext = () => {
    setStep(4);
  };

  const handleSuccess = () => {
    // Redirect to student portal after successful signup (proxy rewrite handles /portal/*)
    window.location.href = `${BASE}/portal/dashboard`;
  };

  // For school role — step 2 directly → success
  const handleSchoolSuccess = (code: string) => {
    // Redirect to school portal after successful signup (proxy rewrite handles /portal/*)
    window.location.href = `${BASE}/portal/school`;
  };

  // For partner role — M-168 grants role immediately, redirect straight to portal
  const handlePartnerSuccess = () => {
    window.location.href = `${BASE}/portal/partner`;
  };

  const currentCard = ROLE_CARDS.find((c) => c.id === selectedRole);

  // Determine display step for progress bar
  // The actual step numbers: 1=role, 2=details, 3=subjects, 4=payment, 5=done
  // For school role, steps used are 1, 2, 5 — but ProgressBar handles mapping
  const displayStep: Step = success ? 5 : step;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Brand Panel */}
      <div className="relative lg:w-[42%] xl:w-[44%] gradient-hero flex flex-col px-8 sm:px-12 lg:px-14 xl:px-20 py-8 lg:py-10 overflow-hidden flex-shrink-0">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>{t.portal.backToHome}</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md flex-1 flex flex-col justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO International"
            className="w-16 h-16 object-contain mb-10"
          />

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-display)] leading-tight tracking-tight">
            Join a Global{" "}
            <span className="text-gradient">Community of Excellence</span>
          </h1>

          <p className="mt-5 text-white/60 text-base leading-relaxed">
            Create your AMSIO account and take your first step toward internationally recognised academic achievement.
          </p>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-[family-name:var(--font-display)] mb-4">
              Trusted globally
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "12 Countries", icon: "🌍" },
                { label: "4 Subjects", icon: "📚" },
                { label: "2027 Grand Finals", icon: "🏆" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-base">{badge.icon}</span>
                  <span className="text-white/70 text-xs font-semibold">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-10 text-white/40 text-sm">
            {t.portal.hasAccount}{" "}
            <Link href="/portal/login" className="text-orange hover:text-orange/80 font-semibold underline underline-offset-2 transition-colors">
              {t.portal.signIn}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="lg:hidden px-5 pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm transition-colors group"
          >
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>{t.portal.backToHome}</span>
          </Link>
        </div>

        <div className="min-h-full flex items-start justify-center px-5 sm:px-8 lg:px-12 py-12">
          <div className="w-full max-w-2xl">

            {/* Progress indicator */}
            <ProgressBar
              step={displayStep}
              isStudentFlow={isStudentFlow}
              isPartner={isPartner && step === 1}
            />

            {/* Step 5: Success */}
            {success && selectedRole && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <SuccessScreen
                  amsioTrack={studentDetails?.amsioTrack ?? null}
                  role={selectedRole}
                  schoolCode={generatedSchoolCode}
                />
              </div>
            )}

            {/* Step 1: Role Selection */}
            {!success && step === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-[family-name:var(--font-display)]">
                    {t.portal.register.title}
                  </h2>
                  <p className="mt-2 text-slate-500 text-sm">
                    {t.portal.register.subtitle}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {/* Primary card — Student / Parent (ẩn theo mục 21) */}
                  {SHOW_SELF_REGISTRATION && (() => {
                    const card = ROLE_CARDS[0]!;
                    const isSelected = selectedRole === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleRoleSelect(card.id)}
                        className={`w-full text-left p-5 rounded-2xl border-2 bg-white transition-all cursor-pointer group flex items-start gap-4 ${
                          isSelected ? `${card.accent} ring-2 shadow-md` : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                        }`}
                      >
                        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-orange/10 text-orange" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                        }`}>
                          {card.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-base font-[family-name:var(--font-display)]">{card.title}</p>
                          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{card.description}</p>
                          <div className={`mt-2.5 inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${card.tagColor}`}>
                            {card.tag}
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-orange" />}
                      </button>
                    );
                  })()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLE_CARDS.slice(1).filter((c) => SHOW_SELF_REGISTRATION || c.id === "partner").map((card) => {
                      const isSelected = selectedRole === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleRoleSelect(card.id)}
                          className={`text-left p-5 rounded-2xl border-2 bg-white transition-all cursor-pointer group ${
                            isSelected ? `${card.accent} ring-2 shadow-md` : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className={`mb-3 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected ? "bg-orange/10 text-orange" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }`}>
                            {card.icon}
                          </div>
                          <p className="font-bold text-slate-800 text-[15px] font-[family-name:var(--font-display)]">{card.title}</p>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{card.description}</p>
                          <div className={`mt-3 inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${card.tagColor}`}>
                            {card.tag}
                          </div>
                          {card.id === "school" && (
                            <div className="mt-2">
                              <Link href="/for-schools" className="text-[11px] text-orange hover:underline" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                Learn more about AMSIO for Schools →
                              </Link>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedRole === "partner" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
                    <NationalPartnerBlock onPartnerSuccess={handlePartnerSuccess} />
                  </div>
                )}

                {selectedRole && selectedRole !== "partner" && (
                  <button
                    type="button"
                    onClick={handleRoleContinue}
                    className="w-full h-12 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    {t.portal.register.continue} — {currentCard?.title}
                    <ChevronRight size={16} />
                  </button>
                )}
              </>
            )}

            {/* Step 2: Details */}
            {!success && step === 2 && selectedRole && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors bg-white"
                    aria-label="Go back"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 font-[family-name:var(--font-display)]">
                      {selectedRole === "student" && "Student / Parent Registration"}
                      {selectedRole === "school" && "School Coordinator Registration"}
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Fill in your details below
                    </p>
                  </div>
                </div>

                {selectedRole === "student" && (
                  <StudentRegistrationStep
                    onNext={handleStudentDetailsNext}
                    savedCountryCode={savedCountryCode}
                  />
                )}

                {selectedRole === "school" && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <SchoolStaffForm onSuccess={handleSchoolSuccess} />
                  </div>
                )}
              </>
            )}

            {/* Step 3: Subject Selection (student only) */}
            {!success && step === 3 && selectedRole === "student" && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors bg-white"
                    aria-label="Go back"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 font-[family-name:var(--font-display)]">
                      {t.portal.selectSubjects}
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">Select one or more subjects to compete in</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <SubjectSelectionStep
                    selectedSubjects={selectedSubjects}
                    onChange={setSelectedSubjects}
                    onNext={handleSubjectsNext}
                    onBack={() => setStep(2)}
                  />
                </div>
              </>
            )}

            {/* Step 4: Payment / Confirmation (student only) */}
            {!success && step === 4 && selectedRole === "student" && studentDetails && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 font-[family-name:var(--font-display)]">
                      {studentDetails.amsioTrack === "partner"
                        ? "Confirm Registration"
                        : "Payment & Registration"}
                    </h2>
                    <p className="text-slate-500 text-xs mt-0.5">Review and complete your registration</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <PaymentStep
                    amsioTrack={studentDetails.amsioTrack}
                    partnerData={studentDetails.partnerData}
                    countryName={studentDetails.countryName}
                    studentName={studentDetails.studentName}
                    subjects={selectedSubjects}
                    email={studentDetails.email}
                    password={studentDetails.password}
                    grade={studentDetails.grade}
                    countryCode={studentDetails.countryCode}
                    studentTrack={studentDetails.track}
                    schoolCode={studentDetails.schoolCode}
                    dob={studentDetails.dob}
                    isParentRegistration={studentDetails.isParentRegistration}
                    guardianName={studentDetails.guardianName}
                    guardianPhone={studentDetails.guardianPhone}
                    onSuccess={handleSuccess}
                    onBack={() => setStep(3)}
                  />
                </div>
              </>
            )}

            {!success && (
              <p className="text-center text-xs text-slate-500 mt-6">
                Already have an account?{" "}
                <Link href="/portal/login" className="text-orange font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
