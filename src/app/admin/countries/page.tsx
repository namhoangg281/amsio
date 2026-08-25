"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Globe, ArrowUpDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type SortKey = "name" | "schools_count" | "students_count" | "revenue";
type SortDir = "asc" | "desc";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Country = Record<string, any>;

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Onboarding: "bg-[#E8A817]/10 text-[#E8A817]",
  "Coming Soon": "bg-white/5 text-white/40",
};

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Onboarding" | "Coming Soon">("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    supabase.from("countries").select("*").order("name").then(({ data }) => {
      if (data) setCountries(data);
      setLoading(false);
    });
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "name" ? "asc" : "desc"); }
  };

  const rows = useMemo(() => {
    let list = [...countries];
    if (statusFilter !== "All") list = list.filter(c => c.status === statusFilter);
    list.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return list;
  }, [countries, statusFilter, sortKey, sortDir]);

  const fmt = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">Countries</h2>
            <p className="text-white/40 text-sm mt-1">{countries.length} member countries · Season 2026-2027</p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Countries", value: loading ? "—" : countries.length },
            { label: "Active", value: loading ? "—" : countries.filter(c => c.status === "Active").length },
            { label: "Total Schools", value: loading ? "—" : countries.reduce((s, c) => s + (c.schools_count ?? 0), 0).toLocaleString() },
            { label: "Total Revenue", value: loading ? "—" : fmt(countries.reduce((s, c) => s + Number(c.revenue ?? 0), 0)) },
          ].map(k => (
            <div key={k.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{k.value}</div>
              <div className="text-xs text-white/40 mt-1">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["All", "Active", "Onboarding", "Coming Soon"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-gold text-[#0a1628]" : "bg-white/5 text-white/50 hover:text-white"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-white/60" onClick={() => toggleSort("name")}>
                    <span className="flex items-center gap-1">Country <ArrowUpDown size={12} className={sortKey === "name" ? "text-gold" : "text-white/20"} /></span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Partner</th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white/60" onClick={() => toggleSort("schools_count")}>
                    <span className="flex items-center justify-end gap-1">Schools <ArrowUpDown size={12} className={sortKey === "schools_count" ? "text-gold" : "text-white/20"} /></span>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white/60" onClick={() => toggleSort("students_count")}>
                    <span className="flex items-center justify-end gap-1">Students <ArrowUpDown size={12} className={sortKey === "students_count" ? "text-gold" : "text-white/20"} /></span>
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white/60" onClick={() => toggleSort("revenue")}>
                    <span className="flex items-center justify-end gap-1">Revenue <ArrowUpDown size={12} className={sortKey === "revenue" ? "text-gold" : "text-white/20"} /></span>
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : rows.map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{c.partner_name ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-white/70">{c.schools_count ?? 0}</td>
                    <td className="px-4 py-3 text-right text-white/70">{(c.students_count ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-white/70">{fmt(Number(c.revenue ?? 0))}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusStyles[c.status] ?? "bg-white/5 text-white/40"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-gold hover:text-gold/80 font-medium transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/8 text-xs text-white/30">
            {loading ? "Loading..." : `Showing ${rows.length} of ${countries.length} countries`}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}