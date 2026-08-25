"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Users, Award, TrendingUp, Plus, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Student = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type School = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Country = Record<string, any>;

const SUBJECT_OPTIONS = ["Mathematics", "Science", "Language", "Computational Intelligence"];

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-500/10 text-blue-400",
  Science: "bg-emerald-500/10 text-emerald-400",
  Language: "bg-purple-500/10 text-purple-400",
  "Computational Intelligence": "bg-orange-500/10 text-orange-400",
};

const subjectShort: Record<string, string> = {
  Mathematics: "Math",
  Science: "Sci",
  Language: "Lang",
  "Computational Intelligence": "CI",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    full_name: "", school_id: "", country_id: "",
    grade: "8", subjects: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadStudents = () => {
    setLoading(true);
    supabase.from("students_legacy")
      .select(`*, schools(name, code), countries(name, flag)`)
      .order("full_name")
      .then(({ data }) => {
        if (data) setStudents(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStudents();
    supabase.from("schools").select("id, name, country_id").order("name")
      .then(({ data }) => { if (data) setSchools(data); });
    supabase.from("countries").select("id, name, flag").order("name")
      .then(({ data }) => { if (data) setCountries(data); });
  }, []);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search) list = list.filter(s =>
      s.full_name?.toLowerCase().includes(search.toLowerCase())
    );
    if (countryFilter !== "All") list = list.filter(s => s.country_id === countryFilter);
    if (subjectFilter !== "All Subjects") list = list.filter(s =>
      Array.isArray(s.subjects) && s.subjects.includes(subjectFilter)
    );
    return list;
  }, [students, search, countryFilter, subjectFilter]);

  const r2Count   = filtered.filter(s => s.r2_result === "Pass").length;
  const gfCount   = filtered.filter(s => s.gf_qualified).length;
  const r2Rate    = filtered.length ? Math.round((r2Count / filtered.length) * 100) : 0;

  const toggleSubject = (sub: string) => {
    setForm(f => ({
      ...f,
      subjects: f.subjects.includes(sub) ? f.subjects.filter(s => s !== sub) : [...f.subjects, sub],
    }));
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) { setSaveError("Student name is required."); return; }
    if (form.subjects.length === 0) { setSaveError("Please select at least one subject."); return; }
    setSaving(true); setSaveError(null);
    const gradeNum = parseInt(form.grade) || 8;
    const divMap: Record<number, string> = { 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "11", 12: "12" };
    const { error } = await supabase.from("students_legacy").insert({
      full_name: form.full_name.trim(),
      school_id: form.school_id || null,
      country_id: form.country_id || null,
      grade: gradeNum,
      division: divMap[gradeNum] ?? String(gradeNum),
      subjects: form.subjects,
    });
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    setShowModal(false);
    setForm({ full_name: "", school_id: "", country_id: "", grade: "8", subjects: [] });
    loadStudents();
  };

  const getCountryFlag = (s: Student) => s.countries?.flag ?? countries.find(c => c.id === s.country_id)?.flag ?? "🌐";
  const getCountryName = (s: Student) => s.countries?.name ?? countries.find(c => c.id === s.country_id)?.name ?? "—";
  const getSchoolName  = (s: Student) => s.schools?.name ?? schools.find(sc => sc.id === s.school_id)?.name ?? "—";

  // Filter schools by selected country in modal
  const modalSchools = form.country_id
    ? schools.filter(s => s.country_id === form.country_id)
    : schools;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">Student Database</h2>
            <p className="text-white/40 text-sm mt-1">Season 2026-2027 — all registered participants</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-navy-dark text-sm font-semibold hover:bg-gold/90 transition-colors cursor-pointer">
            <Plus size={16} /> Add Student
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users size={18} className="text-purple-400" />
              </div>
              <span className="text-white/50 text-sm">Total Students</span>
            </div>
            <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-white">
              {loading ? "—" : filtered.length.toLocaleString()}
            </p>
            <p className="text-xs text-white/30 mt-1">matching current filters</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                <TrendingUp size={18} className="text-[#E8A817]" />
              </div>
              <span className="text-white/50 text-sm">R2 Qualification Rate</span>
            </div>
            <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-white">
              {loading ? "—" : `${r2Rate}%`}
            </p>
            <p className="text-xs text-white/30 mt-1">{loading ? "—" : `${r2Count} of ${filtered.length} students`}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Award size={18} className="text-orange-400" />
              </div>
              <span className="text-white/50 text-sm">GF Qualified</span>
            </div>
            <p className="text-3xl font-[family-name:var(--font-display)] font-bold text-white">
              {loading ? "—" : gfCount}
            </p>
            <p className="text-xs text-white/30 mt-1">Grand Finals participants</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors" />
          </div>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-gold/40 cursor-pointer">
            <option value="All">All Countries</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
          </select>
          <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-gold/40 cursor-pointer">
            <option value="All Subjects">All Subjects</option>
            {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Country</th>
                  <th className="px-4 py-3 text-left font-medium">School</th>
                  <th className="px-4 py-3 text-center font-medium">Grade</th>
                  <th className="px-4 py-3 text-left font-medium">Subjects</th>
                  <th className="px-4 py-3 text-center font-medium">R1</th>
                  <th className="px-4 py-3 text-center font-medium">R2</th>
                  <th className="px-4 py-3 text-center font-medium">GF</th>
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                )) : filtered.map(s => (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{s.full_name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{getCountryFlag(s)}</span>
                        <span className="text-white/60 text-xs">{getCountryName(s)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs max-w-[160px] truncate">{getSchoolName(s)}</td>
                    <td className="px-4 py-3 text-center text-white/70">{s.grade ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(s.subjects) && s.subjects.map((sub: string) => (
                          <span key={sub} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${subjectColors[sub] ?? "bg-white/5 text-white/50"}`}>
                            {subjectShort[sub] ?? sub.slice(0, 4)}
                          </span>
                        ))}
                        {(!s.subjects || s.subjects.length === 0) && <span className="text-white/25 text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusDot status={s.r1_result} /></td>
                    <td className="px-4 py-3 text-center"><StatusDot status={s.r2_result} /></td>
                    <td className="px-4 py-3 text-center">
                      {s.gf_qualified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#E8A817]/10 text-[#E8A817]">
                          <Award size={10} /> GF
                        </span>
                      ) : <span className="text-white/20 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-white/30">No students match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/8 text-xs text-white/30">
            {loading ? "Loading..." : `Showing ${filtered.length} of ${students.length} students`}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0e1f38] border border-white/12 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-[family-name:var(--font-display)] font-bold text-lg">Add New Student</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="e.g. Chen Wei"
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors" />
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Country</label>
                <select value={form.country_id} onChange={e => setForm(f => ({ ...f, country_id: e.target.value, school_id: "" }))}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                  <option value="">Select country...</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">School</label>
                <select value={form.school_id} onChange={e => setForm(f => ({ ...f, school_id: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                  <option value="">Select school...</option>
                  {modalSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-1.5 uppercase tracking-wider">Grade</label>
                <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 focus:outline-none focus:border-gold/50 cursor-pointer transition-colors">
                  {[6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 font-medium mb-2 uppercase tracking-wider">Subjects * (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {SUBJECT_OPTIONS.map(sub => (
                    <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer border ${
                        form.subjects.includes(sub)
                          ? "bg-gold/15 border-gold/40 text-gold"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                      }`}>
                      {sub}
                    </button>
                  ))}
                </div>
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
                {saving ? "Saving..." : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatusDot({ status }: { status: string | null }) {
  if (status === "Pass") return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">Pass</span>
  );
  if (status === "Fail") return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 uppercase tracking-wider">Fail</span>
  );
  if (status === "Pending") return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/10 text-[#E8A817] uppercase tracking-wider">Pend</span>
  );
  return <span className="text-white/20 text-xs">—</span>;
}