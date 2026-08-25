"use client";

import { useState, useEffect } from "react";
import PortalLayout from "@/components/portal/PortalLayout";
import {
  Building2,
  Users,
  DollarSign,
  Award,
  Trophy,
  Search,
  ChevronDown,
  CheckCircle2,
  Clock,
  Circle,
  Megaphone,
  Plus,
  Send,
  Star,
  ArrowUpDown,
} from "lucide-react";
import { getAuthClient } from "@/lib/supabase";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
import { fetchCountryByPartnerEmail, fetchSchoolsByCountryId, fetchAnnouncements } from "@/lib/queries";
import { useI18n } from "@/lib/i18n";
import type { Database } from "@/lib/database.types";

type CountryRow = Database["public"]["Tables"]["countries"]["Row"];
type SchoolRow = Database["public"]["Tables"]["schools"]["Row"] & {
  countries: { name: string; flag: string; code: string } | null;
};
type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

/* ── Static display data (non-DB) ──────────────────────── */

const revenueBreakdown = [
  { label: "Total Registration Revenue", pct: 100, color: "bg-navy" },
  { label: "Commission to Schools (15%)", pct: 15, color: "bg-blue-400" },
  { label: "Payment to AMSIO HQ (70%)", pct: 70, color: "bg-emerald-500" },
  { label: "Partner Revenue (15%)", pct: 15, color: "bg-orange" },
];

const competitionTimeline = [
  { label: "Round 1", date: "Feb 15 - Mar 15, 2026", status: "completed" as const },
  { label: "Round 2", date: "Apr 20 - May 10, 2026", status: "upcoming" as const },
  { label: "National Selection", date: "Jun 5, 2026", status: "future" as const },
  { label: "Grand Finals", date: "Jul 20 - 25, 2026", status: "future" as const },
];

/* ── Helpers ────────────────────────────────────────────── */

function schoolStatusBadge(status: string) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "Pending") return "bg-orange-light text-orange border border-orange/20";
  return "bg-gray-100 text-gray-600";
}

function timelineIcon(status: "completed" | "upcoming" | "future") {
  if (status === "completed") return <CheckCircle2 size={20} className="text-white" />;
  if (status === "upcoming") return <Clock size={18} className="text-orange" />;
  return <Circle size={18} className="text-text-secondary" />;
}

function timelineDot(status: "completed" | "upcoming" | "future") {
  if (status === "completed") return "bg-emerald-500";
  if (status === "upcoming") return "bg-orange-light border-2 border-orange";
  return "bg-bg-subtle border-2 border-border/30";
}

/* ── Page Component ─────────────────────────────────────── */

export default function PartnerDashboard() {
  const { t } = useI18n();
  const [schoolSearch, setSchoolSearch] = useState("");
  const [sortField, setSortField] = useState<string>("students_count");
  const [country, setCountry] = useState<CountryRow | null>(null);
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthClient().auth.getUser().then(async ({ data: { user } }) => {
      if (!user?.email) {
        window.location.href = `${BASE}/portal/login`;
        return;
      }
      const [{ data: countryData }, { data: announcementsData }] = await Promise.all([
        fetchCountryByPartnerEmail(user.email),
        fetchAnnouncements(),
      ]);
      setCountry(countryData ?? null);
      setAnnouncements(announcementsData ?? []);
      if (countryData?.id) {
        const { data: schoolsData } = await fetchSchoolsByCountryId(countryData.id);
        setSchools((schoolsData as SchoolRow[]) ?? []);
      }
      setLoading(false);
    });
  }, []);

  const filteredSchools = schools
    .filter((s) => s.name.toLowerCase().includes(schoolSearch.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "students_count") return (b.students_count ?? 0) - (a.students_count ?? 0);
      if (sortField === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const subjectCounts: Record<string, number> = {};
  const gradeCounts: Record<string, number> = {};

  const subjectColors: Record<string, string> = {
    Mathematics: "bg-math-blue",
    Science: "bg-sci-green",
    Language: "bg-lang-purple",
    "Computational Intelligence": "bg-ci-orange",
  };

  const maxSubjectCount = Math.max(...Object.values(subjectCounts), 1);
  const maxGradeCount = Math.max(...Object.values(gradeCounts), 1);

  const subjectStats = Object.entries(subjectCounts).map(([name, count]) => ({
    name,
    count,
    color: subjectColors[name] ?? "bg-navy",
  }));

  const gradeDistribution = Object.entries(gradeCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([grade, count]) => ({ grade, count }));

  if (loading) {
    return (
      <PortalLayout role="partner" title={t.portalPartner.dashboard}>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </PortalLayout>
    );
  }

  if (!country) {
    return (
      <PortalLayout role="partner" title={t.portalPartner.dashboard}>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-text-primary mb-2">No partner record found</p>
          <p className="text-text-secondary text-sm">Your account is not associated with any country partner. Please contact AMSIO support.</p>
        </div>
      </PortalLayout>
    );
  }

  const totalSchools = schools.length;
  const totalStudents = country.students_count ?? 0;

  const overviewCards = [
    { label: "Total Schools", value: String(totalSchools), icon: Building2, color: "bg-blue-500", change: "" },
    { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "bg-emerald-500", change: "" },
    { label: "Revenue", value: country.revenue ? `$${Number(country.revenue).toLocaleString()}` : "—", icon: DollarSign, color: "bg-purple-500", change: "" },
    { label: "Qualified for R2", value: "—", sub: "", icon: Award, color: "bg-orange", change: "" },
    { label: "National Ranking", value: "—", sub: "", icon: Trophy, color: "bg-gold", change: "" },
  ];

  return (
    <PortalLayout role="partner" title={t.portalPartner.dashboard}>
      {/* Partner Info Banner */}
      <div className="mb-8 rounded-2xl gradient-navy text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {country.flag} AMSIO {country.name}
            </h2>
            <p className="text-white/70 mt-1">
              {country.name}
              {country.partner_rep && ` · Representative: ${country.partner_rep}`}
              {country.partner_name && ` · ${country.partner_name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">{totalSchools} Schools</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">{totalStudents.toLocaleString()} Students</span>
          </div>
        </div>
      </div>

      {/* A) Country Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-border/20 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy">{card.value}</p>
              {card.sub && <p className="text-xs text-text-secondary mt-0.5">{card.sub}</p>}
              <p className="text-xs text-text-secondary mt-1.5">{card.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* B) School Performance Table */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm mb-8">
        <div className="p-6 border-b border-border/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)]">{t.portalPartner.schoolPerformance}</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle w-56"
                />
              </div>
              <div className="relative">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle cursor-pointer"
                >
                  <option value="students_count">Sort by Students</option>
                  <option value="name">Sort by Name</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-bg-subtle/50">
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">School Name</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">
                  <button onClick={() => setSortField("students")} className="flex items-center gap-1 cursor-pointer">Students <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">
                  <button onClick={() => setSortField("avgScore")} className="flex items-center gap-1 cursor-pointer">Avg Score <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">R2 Qualifiers</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">Payment %</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((s, i) => (
                <tr key={s.id} className={`border-b border-border/10 hover:bg-bg-subtle/50 transition-colors ${i % 2 === 1 ? "bg-bg-subtle/30" : ""}`}>
                  <td className="px-6 py-3.5 font-medium text-navy">{s.name}</td>
                  <td className="px-6 py-3.5 text-text-primary font-semibold">{s.students_count}</td>
                  <td className="px-6 py-3.5 text-text-primary">—</td>
                  <td className="px-6 py-3.5 text-text-primary">—</td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm text-text-secondary">—</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${schoolStatusBadge(s.status)}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">No schools found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* C) Revenue Dashboard */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portalPartner.revenueDashboard}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {revenueBreakdown.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-text-primary">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-navy">
                  {item.pct === 100 && country.revenue
                    ? `$${Number(country.revenue).toLocaleString()}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {revenueBreakdown.slice(1).map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-text-secondary">{item.label}</span>
                  <span className="text-xs font-semibold text-navy">{item.pct}%</span>
                </div>
                <div className="h-4 bg-bg-subtle rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* D) Student Statistics — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* By Subject */}
        <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
          <h3 className="text-base font-bold text-navy font-[family-name:var(--font-display)] mb-5">By Subject</h3>
          {subjectStats.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-6">No data available.</p>
          ) : (
            <div className="space-y-4">
              {subjectStats.map((subj) => (
                <div key={subj.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text-primary">{subj.name}</span>
                    <span className="text-sm font-bold text-navy">{subj.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-bg-subtle rounded-full overflow-hidden">
                    <div className={`h-full ${subj.color} rounded-full`} style={{ width: `${(subj.count / maxSubjectCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* By Grade */}
        <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
          <h3 className="text-base font-bold text-navy font-[family-name:var(--font-display)] mb-5">By Grade</h3>
          {gradeDistribution.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-6">No data available.</p>
          ) : (
            <div className="space-y-3">
              {gradeDistribution.map((g) => (
                <div key={g.grade} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-16 shrink-0">{g.grade}</span>
                  <div className="flex-1 h-2.5 bg-bg-subtle rounded-full overflow-hidden">
                    <div className="h-full bg-navy rounded-full" style={{ width: `${(g.count / maxGradeCount) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-navy w-12 text-right">{g.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Top Performers — requires score data not in schools table */}
        <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
          <h3 className="text-base font-bold text-navy font-[family-name:var(--font-display)] mb-5">Top Performers</h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star size={32} className="text-gray-300 mb-3" />
            <p className="text-sm text-text-secondary">Top performers will appear here once exam results are published.</p>
          </div>
        </section>
      </div>

      {/* E) Competition Timeline */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portalPartner.competitionTimeline}</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0">
          {competitionTimeline.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 w-full md:w-auto">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${timelineDot(step.status)}`}>
                  {timelineIcon(step.status)}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${step.status === "completed" ? "text-navy" : step.status === "upcoming" ? "text-orange" : "text-text-secondary"}`}>{step.label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{step.date}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${step.status === "completed" ? "bg-emerald-50 text-emerald-600" : step.status === "upcoming" ? "bg-orange-light text-orange" : "bg-bg-subtle text-text-secondary"}`}>
                    {step.status}
                  </span>
                </div>
              </div>
              {i < competitionTimeline.length - 1 && (
                <div className={`hidden md:block flex-1 h-0.5 mx-4 min-w-[40px] mt-[-40px] ${step.status === "completed" ? "bg-emerald-300" : "bg-border/30"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* F) Communications */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)]">{t.portalPartner.communications}</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy-dark transition-colors cursor-pointer">
            <Plus size={16} />
            New Announcement
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Megaphone size={32} className="text-gray-300 mb-3" />
              <p className="text-sm text-text-secondary">No announcements yet.</p>
            </div>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-border/20 hover:border-navy/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-light flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone size={16} className="text-navy" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-navy">{a.subject}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {a.sent_at ? new Date(a.sent_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : a.status}
                      </p>
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">{a.body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message to schools */}
        <div className="border-t border-border/20 pt-6">
          <h4 className="text-sm font-semibold text-navy mb-3">Message to Schools</h4>
          <div className="flex gap-3">
            <textarea
              placeholder="Type a message to all schools..."
              rows={3}
              className="flex-1 px-4 py-3 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle resize-none"
            />
            <button className="self-end px-4 py-3 bg-orange text-white rounded-xl hover:bg-orange/90 transition-colors cursor-pointer">
              <Send size={18} />
            </button>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}