"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Search, Users, GraduationCap, School, Globe2,
  Download, RefreshCw, Clock,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ─── Types ──────────────────────────────────────────────────── */

interface PortalRegistration {
  auth_id:        string;
  email:          string;
  full_name:      string;
  core_role:      string;        // 'learner' | 'national_partner_coordinator' | 'national_partner_admin'
  nationality:    string | null;
  grade:          number | null;
  school_code:    string | null;
  amsio_track:    string | null; // 'partner' | 'direct'
  subjects:       string[];
  payment_status: string;
  created_at:     string;
}

/* ─── Display helpers ────────────────────────────────────────── */

const ROLE_LABEL: Record<string, string> = {
  learner:                        "Student",
  national_partner_coordinator:   "School Coord.",
  national_partner_admin:         "Partner",
};

const ROLE_COLOR: Record<string, string> = {
  learner:                        "bg-blue-500/10 text-blue-400",
  national_partner_coordinator:   "bg-emerald-500/10 text-emerald-400",
  national_partner_admin:         "bg-purple-500/10 text-purple-400",
};

const PAYMENT_COLOR: Record<string, string> = {
  paid:            "bg-emerald-500/10 text-emerald-400",
  pending:         "bg-amber-500/10 text-amber-400",
  partner_managed: "bg-blue-500/10 text-blue-400",
};

const PAYMENT_LABEL: Record<string, string> = {
  paid:            "Paid",
  pending:         "Pending",
  partner_managed: "Partner",
};

const SUBJECT_SHORT: Record<string, string> = {
  mathematics:  "Math",
  science:      "Sci",
  "language-en": "EN",
  "language-zh": "ZH",
  ci:           "CI",
};

const SUBJECT_COLOR: Record<string, string> = {
  mathematics:  "bg-blue-500/10 text-blue-400",
  science:      "bg-emerald-500/10 text-emerald-400",
  "language-en": "bg-purple-500/10 text-purple-400",
  "language-zh": "bg-pink-500/10 text-pink-400",
  ci:           "bg-orange-500/10 text-orange-400",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function RegistrationsPage() {
  const [rows, setRows]       = useState<PortalRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRoleFilter]   = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [lastLoaded, setLastLoaded]   = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: rpcErr } = await supabase.rpc(
      "admin_get_amsio_portal_registrations",
      { p_limit: 500, p_offset: 0 },
    );
    if (rpcErr) {
      setError(rpcErr.message);
    } else {
      // subjects comes back as a JSONB array — normalise to string[]
      const normalised = (data as PortalRegistration[]).map((r) => ({
        ...r,
        subjects: Array.isArray(r.subjects) ? r.subjects as string[] : [],
      }));
      setRows(normalised);
      setLastLoaded(new Date());
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  /* filters */
  const filtered = useMemo(() => {
    let list = [...rows];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.school_code?.toLowerCase().includes(q),
      );
    }
    if (roleFilter !== "all")  list = list.filter((r) => r.core_role === roleFilter);
    if (trackFilter !== "all") list = list.filter((r) => r.amsio_track === trackFilter);
    return list;
  }, [rows, search, roleFilter, trackFilter]);

  /* KPIs */
  const total       = rows.length;
  const students    = rows.filter((r) => r.core_role === "learner").length;
  const schools     = rows.filter((r) => r.core_role === "national_partner_coordinator").length;
  const paidCount   = rows.filter((r) => r.payment_status === "paid").length;

  /* CSV export */
  const handleExport = () => {
    const header = ["Name", "Email", "Role", "Country", "Grade", "Track", "Subjects", "Payment", "Registered"];
    const csvRows = [
      header.join(","),
      ...rows.map((r) => [
        `"${r.full_name ?? ""}"`,
        `"${r.email}"`,
        ROLE_LABEL[r.core_role] ?? r.core_role,
        r.nationality ?? "",
        r.grade ?? "",
        r.amsio_track ?? "",
        `"${r.subjects.join("; ")}"`,
        r.payment_status,
        fmt(r.created_at),
      ].join(",")),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `amsio-portal-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
              Portal Registrations
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Users who signed up via amsio.org/portal/register
              {lastLoaded && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Clock size={11} />
                  {lastLoaded.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={rows.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-navy-dark text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Download size={15} />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI icon={<Users size={18} />} label="Total Registrations" value={loading ? "—" : total} color="blue" />
          <KPI icon={<GraduationCap size={18} />} label="Students" value={loading ? "—" : students} color="purple" />
          <KPI icon={<School size={18} />} label="School Coordinators" value={loading ? "—" : schools} color="emerald" />
          <KPI icon={<Globe2 size={18} />} label="Paid" value={loading ? "—" : paidCount} color="gold" sub={total ? `${Math.round((paidCount / total) * 100)}%` : "0%"} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, school code…"
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-gold/40 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="learner">Student</option>
            <option value="national_partner_coordinator">School Coord.</option>
            <option value="national_partner_admin">Partner</option>
          </select>
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-gold/40 cursor-pointer"
          >
            <option value="all">All Tracks</option>
            <option value="partner">Partner Track</option>
            <option value="direct">Direct (Online)</option>
          </select>
          {(search || roleFilter !== "all" || trackFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setRoleFilter("all"); setTrackFilter("all"); }}
              className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-center font-medium">Role</th>
                  <th className="px-4 py-3 text-center font-medium">Country</th>
                  <th className="px-4 py-3 text-center font-medium">Grade</th>
                  <th className="px-4 py-3 text-left font-medium">Subjects</th>
                  <th className="px-4 py-3 text-center font-medium">Track</th>
                  <th className="px-4 py-3 text-center font-medium">Payment</th>
                  <th className="px-4 py-3 text-right font-medium">Registered</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(8)].map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        {[...Array(9)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-white/5 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : filtered.map((r) => (
                      <tr key={r.auth_id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                        {/* Name */}
                        <td className="px-4 py-3 text-white font-medium max-w-[160px] truncate">
                          {r.full_name || <span className="text-white/30 italic">—</span>}
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 text-white/60 text-xs max-w-[200px] truncate">{r.email}</td>
                        {/* Role */}
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${ROLE_COLOR[r.core_role] ?? "bg-white/5 text-white/40"}`}>
                            {ROLE_LABEL[r.core_role] ?? r.core_role}
                          </span>
                        </td>
                        {/* Country */}
                        <td className="px-4 py-3 text-center text-white/60 text-xs font-mono">
                          {r.nationality ?? "—"}
                        </td>
                        {/* Grade */}
                        <td className="px-4 py-3 text-center text-white/60">
                          {r.grade ? `G${r.grade}` : "—"}
                        </td>
                        {/* Subjects */}
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {r.subjects.length > 0
                              ? r.subjects.map((s) => (
                                  <span
                                    key={s}
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SUBJECT_COLOR[s] ?? "bg-white/5 text-white/50"}`}
                                  >
                                    {SUBJECT_SHORT[s] ?? s.slice(0, 5)}
                                  </span>
                                ))
                              : <span className="text-white/25 text-xs">—</span>}
                          </div>
                        </td>
                        {/* Track */}
                        <td className="px-4 py-3 text-center">
                          {r.amsio_track ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${r.amsio_track === "partner" ? "bg-blue-500/10 text-blue-400" : "bg-teal-500/10 text-teal-400"}`}>
                              {r.amsio_track}
                            </span>
                          ) : (
                            <span className="text-white/25 text-xs">—</span>
                          )}
                        </td>
                        {/* Payment */}
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${PAYMENT_COLOR[r.payment_status] ?? "bg-white/5 text-white/40"}`}>
                            {PAYMENT_LABEL[r.payment_status] ?? r.payment_status}
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3 text-right text-white/40 text-xs whitespace-nowrap">
                          {fmt(r.created_at)}
                        </td>
                      </tr>
                    ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-white/30">
                      {rows.length === 0 ? "No portal registrations yet." : "No results match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/8 text-xs text-white/30">
            {loading
              ? "Loading…"
              : `Showing ${filtered.length} of ${rows.length} registrations`}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────── */

function KPI({
  icon, label, value, color, sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: "blue" | "purple" | "emerald" | "gold";
  sub?: string;
}) {
  const bg = {
    blue:    "bg-blue-500/10 text-blue-400",
    purple:  "bg-purple-500/10 text-purple-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    gold:    "bg-gold/10 text-gold",
  }[color];

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
          {icon}
        </div>
        <span className="text-white/50 text-xs leading-tight">{label}</span>
      </div>
      <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-white">
        {value}
      </p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}