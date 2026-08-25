"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Download, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type School = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Country = Record<string, any>;

const PAGE_SIZE = 20;

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Onboarding: "bg-gold/10 text-gold",
  Inactive: "bg-white/5 text-white/40",
};

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "", country_id: "", coordinator_name: "",
    coordinator_email: "", type: "Private", status: "Active",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadSchools = () => {
    setLoading(true);
    supabase.from("schools")
      .select(`*, countries(name, flag, code)`)
      .order("name")
      .then(({ data }) => {
        if (data) setSchools(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSchools();
    supabase.from("countries").select("id, name, flag, code").order("name")
      .then(({ data }) => { if (data) setCountries(data); });
  }, []);

  const filtered = useMemo(() => {
    let list = [...schools];
    if (search) list = list.filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.code?.toLowerCase().includes(search.toLowerCase()) ||
      s.coordinator_name?.toLowerCase().includes(search.toLowerCase())
    );
    if (countryFilter !== "All") list = list.filter(s => s.country_id === countryFilter);
    return list;
  }, [schools, search, countryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = async () => {
    if (!form.name.trim() || !form.country_id) {
      setSaveError("School name and country are required.");
      return;
    }
    setSaving(true); setSaveError(null);
    const { error } = await supabase.from("schools").insert({
      name: form.name.trim(),
      country_id: form.country_id,
      coordinator_name: form.coordinator_name.trim() || null,
      coordinator_email: form.coordinator_email.trim() || null,
      type: form.type,
      status: form.status,
    });
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    setShowModal(false);
    setForm({ name: "", country_id: "", coordinator_name: "", coordinator_email: "", type: "Private", status: "Active" });
    loadSchools();
  };

  const getCountryName = (school: School) =>
    school.countries?.name ?? countries.find(c => c.id === school.country_id)?.name ?? "—";
  const getCountryFlag = (school: School) =>
    school.countries?.flag ?? countries.find(c => c.id === school.country_id)?.flag ?? "🌐";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">School Database</h2>
            <p className="text-white/40 text-sm mt-1">
              {loading ? "Loading..." : `${schools.length} registered schools`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
              <Download size={16} /> Export
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-navy-dark text-sm font-semibold hover:bg-gold/90 transition-colors cursor-pointer">
              <Plus size={16} /> Add School
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search schools or code..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors" />
          </div>
          <select value={countryFilter} onChange={e => { setCountryFilter(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-gold/40 cursor-pointer">
            <option value="All">All Countries</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">School Name</th>
                  <th className="px-4 py-3 text-left font-medium">Country</th>
                  <th className="px-4 py-3 text-left font-medium">AMSIO Code</th>
                  <th className="px-4 py-3 text-left font-medium">Coordinator</th>
                  <th className="px-4 py-3 text-right font-medium">Students</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                )) : paginated.map(school => (
                  <tr key={school.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{school.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getCountryFlag(school)}</span>
                        <span className="text-white/60 text-xs">{getCountryName(school)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {school.code ? (
                        <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-[#E8A817] font-mono">{school.code}</code>
                      ) : <span className="text-white/30 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{school.coordinator_name ?? "—"}</td>
                    <td className="px-4 py-3 text-right text-white/70">{school.students_count ?? 0}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        statusStyles[school.status] ?? "bg-white/5 text-white/40"}`}>
                        {school.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{school.type ?? "—"}</td>
                  </tr>
                ))}
                {!loading && paginated.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-white/30">No schools match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <p className="text-xs text-white/40">
              {loading ? "Loading..." : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} schools`}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-white/50 px-2">Page {page} of {Math.max(1, totalPages)}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add School Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0e1f38] border border-white/12 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-[family-name:var(--font-display)] font-bold text-lg">Add New School</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">School Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Cambridge International Academy"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Country *</label>
                <select value={form.country_id} onChange={e => setForm(f => ({ ...f, country_id: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                  <option value="">Select country...</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                    <option value="Active">Active</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Coordinator Name</label>
                <input type="text" value={form.coordinator_name} onChange={e => setForm(f => ({ ...f, coordinator_name: e.target.value }))}
                  placeholder="e.g. Ms. Sarah Johnson"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Coordinator Email</label>
                <input type="email" value={form.coordinator_email} onChange={e => setForm(f => ({ ...f, coordinator_email: e.target.value }))}
                  placeholder="coordinator@school.edu"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              {saveError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{saveError}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 h-10 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 h-10 rounded-lg bg-gold text-navy-dark text-sm font-semibold hover:bg-gold/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? "Saving..." : "Add School"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}