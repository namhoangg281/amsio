"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Globe, School, Users, DollarSign, Award, TrendingUp,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, MapPin,
  CircleDot, Activity, Zap, Search, ArrowUpDown,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { useAdminRole, canAccess } from "@/lib/admin-role";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Country = Record<string, any>;

const recentActivity = [
  { text: "New school registered: Cambridge Academy (Australia)", time: "2h ago", type: "school" as const },
  { text: "Round 1 results published: Japan", time: "5h ago", type: "result" as const },
  { text: "Payment received: Indonesia ($45,200)", time: "1d ago", type: "payment" as const },
  { text: "Partner application: Brazil (Coming Soon)", time: "2d ago", type: "partner" as const },
  { text: "Grand Finals venue confirmed: San Francisco, USA", time: "3d ago", type: "event" as const },
];

const ALL_QUICK_ACTIONS = [
  { label: "Manage Countries", icon: <Globe size={22} />, color: "bg-blue-500/10 text-blue-400", page: "countries" },
  { label: "View All Schools", icon: <School size={22} />, color: "bg-emerald-500/10 text-emerald-400", page: "schools" },
  { label: "Student Database", icon: <Users size={22} />, color: "bg-purple-500/10 text-purple-400", page: "students" },
  { label: "Financial Reports", icon: <DollarSign size={22} />, color: "bg-gold/10 text-gold", page: "finance" },
  { label: "Competition Settings", icon: <Zap size={22} />, color: "bg-orange/10 text-orange", page: "competitions" },
  { label: "Grand Finals Planning", icon: <Award size={22} />, color: "bg-pink-500/10 text-pink-400", page: "grand-finals" },
];

const timelineEvents = [
  { phase: "Round 1", date: "Oct 2026", status: "completed" as const, location: "All Countries" },
  { phase: "Round 2", date: "Jan 2027", status: "upcoming" as const, location: "All Countries" },
  { phase: "Grand Finals", date: "Jun 2027", status: "planning" as const, location: "San Francisco, USA" },
];

type SortKey = "name" | "schools_count" | "students_count" | "revenue";
type SortDir = "asc" | "desc";

export default function AdminOverviewPage() {
  const { t } = useI18n();
  const role = useAdminRole();
  const quickActions = ALL_QUICK_ACTIONS.filter((action) => canAccess(role, action.page));
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
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

  const filteredCountries = useMemo(() => {
    let list = [...countries];
    if (tableSearch) list = list.filter(c => c.name.toLowerCase().includes(tableSearch.toLowerCase()));
    list.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? (va ?? 0) - (vb ?? 0) : (vb ?? 0) - (va ?? 0);
    });
    return list;
  }, [countries, tableSearch, sortKey, sortDir]);

  const totalStudents = countries.reduce((s, c) => s + (c.students_count ?? 0), 0);
  const totalSchools  = countries.reduce((s, c) => s + (c.schools_count ?? 0), 0);
  const totalRevenue  = countries.reduce((s, c) => s + Number(c.revenue ?? 0), 0);
  const activeCount   = countries.filter(c => c.status === "Active").length;

  const fmtRev = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;
  const fmtBar = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

  const revenueTarget = 1550000;
  const topByRevenue = [...countries].sort((a, b) => Number(b.revenue ?? 0) - Number(a.revenue ?? 0)).slice(0, 5);
  const maxRev = topByRevenue[0] ? Number(topByRevenue[0].revenue ?? 0) : 1;

  const monthlyRevenue = [
    { month: "Jul", amount: 45000 }, { month: "Aug", amount: 95000 },
    { month: "Sep", amount: 180000 }, { month: "Oct", amount: 310000 },
    { month: "Nov", amount: 420000 }, { month: "Dec", amount: 530000 },
    { month: "Jan", amount: 720000 }, { month: "Feb", amount: 890000 },
    { month: "Mar", amount: 1050000 }, { month: "Apr", amount: 1200000 },
    { month: "May", amount: totalRevenue || 1350000 },
  ];
  const maxMonthly = Math.max(...monthlyRevenue.map(m => m.amount));

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">{t.admin.overview.title}</h2>
            <p className="text-white/40 text-sm mt-1">{t.admin.overview.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.admin.overview.live}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard label={t.admin.overview.memberCountries} value={loading ? "—" : String(countries.length)}
            sub={`${activeCount} active`} icon={<Globe size={20} />} color="blue" />
          <KPICard label={t.admin.overview.registeredSchools} value={loading ? "—" : totalSchools.toLocaleString()}
            sub={t.admin.overview.acrossAllCountries} icon={<School size={20} />} color="emerald" />
          <KPICard label={t.admin.overview.totalStudents} value={loading ? "—" : totalStudents.toLocaleString()}
            sub={t.admin.overview.enrolledThisSeason} icon={<Users size={20} />} color="purple" />
          <KPICard label={t.admin.overview.revenue} value={loading ? "—" : fmtRev(totalRevenue)}
            sub={`${Math.round((totalRevenue / revenueTarget) * 100)}${t.admin.overview.collectedPct}`}
            icon={<DollarSign size={20} />} color="gold" />
          <KPICard label={t.admin.overview.gfQualified} value="2,450" sub={t.admin.overview.fromAllRounds}
            icon={<Award size={20} />} color="orange" />
        </div>

        {/* Country Performance Table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">{t.admin.overview.countryPerformance}</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                placeholder={t.admin.overview.filterCountries}
                className="h-8 w-48 pl-8 pr-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 transition-colors" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                  <SortTH label="Country" k="name" cur={sortKey} dir={sortDir} onClick={toggleSort} />
                  <SortTH label="Schools" k="schools_count" cur={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                  <SortTH label="Students" k="students_count" cur={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                  <SortTH label="Revenue" k="revenue" cur={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                  <th className="px-4 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                )) : filteredCountries.map(c => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-white/70">{c.schools_count ?? 0}</td>
                    <td className="px-4 py-3 text-right text-white/70">{(c.students_count ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-white/70">{fmtBar(Number(c.revenue ?? 0))}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        c.status === "Active" ? "bg-emerald-500/10 text-emerald-400"
                        : c.status === "Onboarding" ? "bg-gold/10 text-gold"
                        : "bg-white/5 text-white/40"}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
                {!loading && filteredCountries.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-white/30">No countries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue (2 cols) */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-5">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">{t.admin.overview.revenueOverview}</h3>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/60">{t.admin.overview.collectedVsTarget}</span>
                <span className="text-white font-semibold">{fmtRev(totalRevenue)} / {fmtRev(revenueTarget)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold to-orange"
                  style={{ width: `${Math.min(100, (totalRevenue / revenueTarget) * 100)}%` }} />
              </div>
              <p className="text-xs text-white/40 mt-1">{Math.round((totalRevenue / revenueTarget) * 100)}% of season target</p>
            </div>
            {topByRevenue.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{t.admin.overview.topByRevenue}</p>
                {topByRevenue.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-sm w-28 text-white/60 shrink-0">{c.flag} {c.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gold/70"
                        style={{ width: `${(Number(c.revenue ?? 0) / maxRev) * 100}%` }} />
                    </div>
                    <span className="text-xs text-white/50 w-14 text-right">{fmtBar(Number(c.revenue ?? 0))}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-3">
              <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{t.admin.overview.monthlyTrend}</p>
              <div className="flex items-end gap-1 h-24">
                {monthlyRevenue.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t bg-gradient-to-t from-navy to-gold/60 hover:to-gold min-h-[2px]"
                      style={{ height: `${(m.amount / maxMonthly) * 100}%` }}
                      title={`${m.month}: ${fmtRev(m.amount)}`} />
                    <span className="text-[10px] text-white/30">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competition Timeline */}
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 space-y-5">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">{t.admin.overview.competitionTimeline}</h3>
            <p className="text-xs text-white/40">Season 2026-2027</p>
            <div className="space-y-0 relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-white/10" />
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="flex gap-4 py-3 relative">
                  <div className="relative z-10 shrink-0">
                    {event.status === "completed" ? <CheckCircle2 size={22} className="text-emerald-400" />
                      : event.status === "upcoming" ? <CircleDot size={22} className="text-gold" />
                      : <AlertCircle size={22} className="text-white/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{event.phase}</p>
                    <p className="text-white/40 text-xs mt-0.5">{event.date}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-white/30" />
                      <span className="text-white/30 text-xs">{event.location}</span>
                    </div>
                    <span className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      event.status === "completed" ? "bg-emerald-500/10 text-emerald-400"
                      : event.status === "upcoming" ? "bg-gold/10 text-gold"
                      : "bg-white/5 text-white/40"}`}>{event.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base mb-4">{t.admin.overview.recentActivity}</h3>
            <div className="space-y-0 divide-y divide-white/5">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 py-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.type === "school" ? "bg-blue-500/10 text-blue-400"
                    : item.type === "result" ? "bg-emerald-500/10 text-emerald-400"
                    : item.type === "payment" ? "bg-gold/10 text-gold"
                    : item.type === "partner" ? "bg-purple-500/10 text-purple-400"
                    : "bg-orange/10 text-orange"}`}>
                    {item.type === "school" ? <School size={14} />
                      : item.type === "result" ? <CheckCircle2 size={14} />
                      : item.type === "payment" ? <DollarSign size={14} />
                      : item.type === "partner" ? <Globe size={14} />
                      : <MapPin size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">{item.text}</p>
                    <p className="text-xs text-white/30 mt-0.5 flex items-center gap-1"><Clock size={10} /> {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base mb-4">{t.admin.overview.quickActions}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map(action => (
                <button key={action.label}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>{action.icon}</div>
                  <span className="text-xs text-white/60 text-center leading-tight group-hover:text-white/80 transition-colors">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white/40">{t.admin.overview.platformStatus}</span>
            <span className="text-emerald-400 font-medium">{t.admin.overview.online}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-white/30" />
            <span className="text-white/40">{t.admin.overview.database}</span>
            <span className="text-white/60">{loading ? t.admin.overview.syncing : t.admin.overview.connected}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} className="text-white/30" />
            <span className="text-white/40">{t.admin.overview.countriesLoaded}</span>
            <span className="text-white/60">{loading ? "—" : countries.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-white/30" />
            <span className="text-white/40">{t.admin.overview.apiStatus}</span>
            <span className="text-emerald-400 font-medium">{t.admin.overview.healthy}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function KPICard({ label, value, sub, icon, color }: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; color: "blue" | "emerald" | "purple" | "gold" | "orange";
}) {
  const iconBg = { blue: "bg-blue-500/10 text-blue-400", emerald: "bg-emerald-500/10 text-emerald-400",
    purple: "bg-purple-500/10 text-purple-400", gold: "bg-gold/10 text-gold", orange: "bg-orange/10 text-orange" };
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:bg-white/[0.05] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg[color]}`}>{icon}</div>
        <TrendingUp size={14} className="text-emerald-400/60" />
      </div>
      <p className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
      <p className="text-[11px] text-white/25 mt-0.5">{sub}</p>
    </div>
  );
}

function SortTH({ label, k, cur, dir, onClick, align = "left" }: {
  label: string; k: SortKey; cur: SortKey; dir: SortDir;
  onClick: (k: SortKey) => void; align?: "left" | "right";
}) {
  return (
    <th className={`px-4 py-3 font-medium cursor-pointer hover:text-white/60 transition-colors select-none ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => onClick(k)}>
      <div className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <span>{label}</span>
        <ArrowUpDown size={12} className={cur === k ? "text-gold" : "text-white/20"} />
      </div>
    </th>
  );
}