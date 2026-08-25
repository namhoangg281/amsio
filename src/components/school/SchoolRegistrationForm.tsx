"use client";

import { useState } from "react";
import { COUNTRIES } from "@/lib/constants";
import Button from "@/components/ui/Button";

const RL_KEY = "amsio_school_reg_ts";
const RL_WINDOW_MS = 5 * 60 * 1000;

function getRemainingCooldownMs(): number {
  try {
    const stored = localStorage.getItem(RL_KEY);
    if (!stored) return 0;
    const elapsed = Date.now() - parseInt(stored, 10);
    return Math.max(0, RL_WINDOW_MS - elapsed);
  } catch {
    return 0;
  }
}

function recordSubmitTimestamp(): void {
  try {
    localStorage.setItem(RL_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable (private mode / blocked) — degrade silently
  }
}

interface FormData {
  name: string;
  country_code: string;
  city: string;
  type: string;
  coordinator_name: string;
  coordinator_email: string;
}

const initialForm: FormData = {
  name: "",
  country_code: "",
  city: "",
  type: "Private",
  coordinator_name: "",
  coordinator_email: "",
};

export default function SchoolRegistrationForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const remaining = getRemainingCooldownMs();
    if (remaining > 0) {
      const mins = Math.ceil(remaining / 60_000);
      setErrorMsg(`Please wait ${mins} minute${mins !== 1 ? "s" : ""} before submitting again.`);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const { supabase, isSupabaseConfigured } = await import("@/lib/supabase");

      if (!isSupabaseConfigured) {
        setErrorMsg("Registration is temporarily unavailable. Please contact your National Partner directly.");
        setStatus("error");
        return;
      }

      const pendingCode = `PEND-${Date.now().toString(36).toUpperCase()}`;

      // SEC-45: public.schools is now a compat VIEW; insert directly into core.institutions.
      // country_code (2-char) is already on the form — no UUID lookup needed.
      // SEC-45 RLS harden (20260710000017): anon self-registration carve-out requires:
      //   status='verified', is_active=true, tenant_id=amsio-international UUID.
      const { error } = await supabase.schema("core").from("institutions").insert({
        name: form.name.trim(),
        institution_code: pendingCode,
        country_code: form.country_code.toUpperCase() || null,
        province_city: form.city.trim() || null,
        contact_email: form.coordinator_email.trim() || null,
        contract_details: {
          coordinator_name: form.coordinator_name.trim() || null,
          amsio_school_type: form.type,
        },
        type: "school",
        source: "schools_view_insert",
        status: "verified",
        is_active: true,
        tenant_id: "00000000-0000-0000-0000-000000000002",
      });

      if (error) {
        setErrorMsg("Registration failed. Please try again or contact your National Partner.");
        setStatus("error");
        return;
      }

      recordSubmitTimestamp();
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">Registration Received</h3>
        <p className="text-emerald-700">
          Thank you! Your school registration request has been submitted. Your local AMSIO National Partner
          will contact you within 5 business days to confirm details and next steps.
        </p>
        <p className="mt-4 text-sm text-emerald-600">
          Registered: <strong>{form.name}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-navy mb-2">
            School Name <span className="text-orange">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="e.g. Cambridge International Academy"
            className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            Country <span className="text-orange">*</span>
          </label>
          <select
            required
            value={form.country_code}
            onChange={update("country_code")}
            className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all bg-white"
          >
            <option value="">Select your country…</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">City</label>
          <input
            type="text"
            value={form.city}
            onChange={update("city")}
            placeholder="e.g. Kuala Lumpur"
            className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-navy mb-2">School Type</label>
          <select
            value={form.type}
            onChange={update("type")}
            className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all bg-white"
          >
            <option value="Private">Private</option>
            <option value="Public">Public / Government</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>

      {/* Coordinator */}
      <div className="pt-2 border-t border-border/30">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
          School Coordinator (Optional)
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Coordinator Name</label>
            <input
              type="text"
              value={form.coordinator_name}
              onChange={update("coordinator_name")}
              placeholder="e.g. Ms. Sarah Johnson"
              className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Organization Representative Email</label>
            <input
              type="email"
              value={form.coordinator_email}
              onChange={update("coordinator_email")}
              placeholder="coordinator@school.edu"
              className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-all"
            />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting…" : "Submit Registration Request"}
      </Button>

      <p className="text-center text-xs text-text-secondary">
        Your request will be reviewed by the AMSIO National Partner in your country.
        Confirmation within 5 business days.
      </p>
    </form>
  );
}
