"use client";

import React, { useState, useEffect } from "react";
import PortalLayout from "@/components/portal/PortalLayout";
import { useI18n } from "@/lib/i18n";
import {
  Users,
  DollarSign,
  Award,
  TrendingUp,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  BarChart3,
  FileText,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase, getAuthClient } from "@/lib/supabase";
import { fetchSchoolByCoordinatorEmail, fetchStudentsBySchoolId } from "@/lib/queries";
import type { Database } from "@/lib/database.types";

type SchoolRow = Database["public"]["Tables"]["schools"]["Row"] & {
  countries: { name: string; flag: string; code: string } | null;
};
type StudentRow = Database["public"]["Tables"]["students_legacy"]["Row"];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ── Static display data (non-DB) ──────────────────────── */

// overviewCards are built inside the component so they can use i18n translations and real data

const subjectDistributionColors: Record<string, string> = {
  Mathematics: "bg-math-blue",
  Science: "bg-sci-green",
  Language: "bg-lang-purple",
  "Computational Intelligence": "bg-ci-orange",
};

// paymentSummaryConfig and timeline labels are rendered using i18n keys inside the component

/* ── Helpers ────────────────────────────────────────────── */

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Qualified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Not Qualified": "bg-red-50 text-red-700 border border-red-200",
    Pending: "bg-orange-light text-orange border border-orange/20",
    Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Overdue: "bg-red-50 text-red-700 border border-red-200",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}

/* ── Page Component ─────────────────────────────────────── */

interface PendingSchool {
  school_name: string;
  school_code: string;
  country_name?: string;
}

export default function SchoolDashboard() {
  const { t } = useI18n();

  const paymentSummaryConfig = [
    { label: t.portal.school.payment.paid, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
    { label: t.portal.school.payment.pending, color: "text-orange", bg: "bg-orange-light", border: "border-orange/20", dot: "bg-orange" },
    { label: t.portal.school.payment.overdue, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
  ];

  const timeline = [
    { label: t.portal.school.timeline.r1PapersReceived, done: true },
    { label: t.portal.school.timeline.r1AttendanceSubmitted, done: true },
    { label: t.portal.school.timeline.r2Papers, done: false },
    { label: t.portal.school.timeline.r2ScheduleConfirmed, done: false },
  ];

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [school, setSchool] = useState<SchoolRow | null>(null);
  const [pendingSchool, setPendingSchool] = useState<PendingSchool | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthClient().auth.getUser().then(async ({ data: { user } }) => {
      if (!user?.email) {
        window.location.href = `${BASE}/portal/login`;
        return;
      }
      const { data: schoolData } = await fetchSchoolByCoordinatorEmail(user.email);
      setSchool(schoolData as SchoolRow | null);
      if (schoolData?.id) {
        const { data: studentsData } = await fetchStudentsBySchoolId(schoolData.id);
        setStudents(studentsData ?? []);
      } else {
        // No schools record yet — check user_metadata for pending registration
        const meta = user.user_metadata as Record<string, string> | undefined;
        if (meta?.school_name && meta?.school_code) {
          setPendingSchool({
            school_name: meta.school_name,
            school_code: meta.school_code,
            country_name: meta.country_name,
          });
        }
      }
      setLoading(false);
    });
  }, []);

  // Derived subject distribution from real students
  const subjectCounts: Record<string, number> = {};
  for (const s of students) {
    for (const sub of s.subjects ?? []) {
      subjectCounts[sub] = (subjectCounts[sub] ?? 0) + 1;
    }
  }
  const totalStudents = students.length;
  const subjectDistribution = Object.entries(subjectCounts).map(([name, count]) => ({
    name,
    count,
    max: totalStudents || 1,
    color: subjectDistributionColors[name] ?? "bg-navy",
  }));

  // R2 qualification count
  const qualifiedR2 = students.filter((s) => s.r1_result === "Pass" || s.r1_result === "Distinction").length;
  const qualificationPct = totalStudents > 0 ? ((qualifiedR2 / totalStudents) * 100).toFixed(1) : "0";

  const overviewCards: Array<{ label: string; value: string; sub?: string; icon: LucideIcon; color: string; change: string }> = [
    { label: t.portalSchool.overview.totalStudents, value: String(totalStudents), icon: Users, color: "bg-blue-500", change: "" },
    { label: t.portalSchool.overview.paymentCollected, value: "—", icon: DollarSign, color: "bg-emerald-500", change: "" },
    { label: t.portalSchool.overview.qualifiedR2, value: String(qualifiedR2), icon: Award, color: "bg-orange", change: `${qualificationPct}% qualification` },
    { label: t.portalSchool.overview.averageScore, value: "—", icon: TrendingUp, color: "bg-purple-500", change: "" },
  ];

  // Map StudentRow to display shape for table
  const displayStudents = students.map((s) => ({
    id: s.id,
    name: s.full_name,
    grade: s.grade ? `Grade ${s.grade}` : "—",
    subjects: s.subjects ?? [],
    r1Result: s.r1_result ?? "Pending",
    status: s.r1_result === "Pass" || s.r1_result === "Distinction" ? "Qualified" : s.r1_result === "Fail" ? "Not Qualified" : "Pending",
  }));

  const filteredStudents = displayStudents.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  if (loading) {
    return (
      <PortalLayout role="school" title="Dashboard">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </PortalLayout>
    );
  }

  if (!school) {
    if (pendingSchool) {
      return (
        <PortalLayout role="school" title="Dashboard">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-6">
              <Clock size={36} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-[family-name:var(--font-display)] mb-2">
              {t.portal.school.pending.registrationUnderReview}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              {t.portal.school.pending.reviewDesc}
            </p>
            <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-5 text-left space-y-3">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{t.portal.school.pending.schoolNameLabel}</p>
                <p className="text-base font-bold text-amber-900 mt-0.5">{pendingSchool.school_name}</p>
              </div>
              {pendingSchool.country_name && (
                <div>
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{t.portal.school.pending.countryLabel}</p>
                  <p className="text-sm text-amber-900 mt-0.5">{pendingSchool.country_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{t.portal.school.pending.schoolCodeLabel}</p>
                <p className="text-2xl font-mono font-bold text-amber-900 tracking-widest mt-0.5">{pendingSchool.school_code}</p>
                <p className="text-xs text-amber-600 mt-1">{t.portal.school.pending.schoolCodeHint}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-text-secondary">
              Questions? Contact <a href="mailto:info@amsio.org" className="text-orange hover:underline">info@amsio.org</a>
            </p>
          </div>
        </PortalLayout>
      );
    }
    return (
      <PortalLayout role="school" title="Dashboard">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-text-primary mb-2">{t.portal.school.noSchool.title}</p>
          <p className="text-text-secondary text-sm">{t.portal.school.noSchool.desc}</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="school" title="Dashboard">
      {/* School Info Banner */}
      <div className="mb-8 rounded-2xl gradient-navy text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">{school.name}</h2>
            <p className="text-white/70 mt-1">
              {school.countries?.name ?? school.city} &middot; {t.portal.school.infoBanner.codePrefix} {school.code}
              {school.coordinator_name && ` · ${t.portal.school.infoBanner.coordinatorPrefix} ${school.coordinator_name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-sm font-medium">{totalStudents} {t.portal.school.infoBanner.studentsCount}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${school.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : "bg-orange/20 text-orange-300"}`}>
              {school.status}
            </span>
          </div>
        </div>
      </div>

      {/* A) Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-border/20 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-navy">{card.value}</p>
              {card.sub && <p className="text-sm text-text-secondary mt-0.5">{card.sub}</p>}
              <p className="text-xs text-text-secondary mt-2">{card.label}</p>
              <p className="text-xs text-emerald-600 mt-1">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* B) Student Management */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm mb-8">
        <div className="p-6 border-b border-border/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)]">{t.portal.school.studentMgmt.sectionTitle}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder={t.portal.school.studentMgmt.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle w-56"
                />
              </div>
              <div className="relative">
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle cursor-pointer"
                >
                  <option value="all">{t.portal.school.studentMgmt.allGrades}</option>
                  <option value="Grade 6">{t.portal.register.gradeOption} 6</option>
                  <option value="Grade 7">{t.portal.register.gradeOption} 7</option>
                  <option value="Grade 8">{t.portal.register.gradeOption} 8</option>
                  <option value="Grade 9">{t.portal.register.gradeOption} 9</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border/30 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 bg-bg-subtle cursor-pointer"
                >
                  <option value="all">{t.portal.school.studentMgmt.allStatus}</option>
                  <option value="Qualified">{t.portal.school.statusBadge.qualified}</option>
                  <option value="Not Qualified">{t.portal.school.statusBadge.notQualified}</option>
                  <option value="Pending">{t.portal.school.statusBadge.pending}</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-xl hover:bg-navy-dark transition-colors cursor-pointer">
                <Plus size={16} />
                {t.portal.school.studentMgmt.addStudent}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border/30 text-sm font-medium rounded-xl hover:bg-bg-subtle transition-colors cursor-pointer">
                <FileSpreadsheet size={16} />
                {t.portal.school.studentMgmt.importExcel}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-bg-subtle/50">
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colName}</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colGrade}</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colSubjects}</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colR1Score}</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colStatus}</th>
                <th className="text-left px-6 py-3 font-semibold text-text-secondary">{t.portal.school.studentMgmt.colPayment}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={s.id} className={`border-b border-border/10 hover:bg-bg-subtle/50 transition-colors ${i % 2 === 1 ? "bg-bg-subtle/30" : ""}`}>
                  <td className="px-6 py-3.5 font-medium text-navy">{s.name}</td>
                  <td className="px-6 py-3.5 text-text-secondary">{s.grade}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.subjects.map((sub) => (
                        <span key={sub} className="px-2 py-0.5 rounded-md bg-navy-light text-navy text-xs font-medium">{sub}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-navy">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(s.r1Result)}`}>{s.r1Result}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(s.status)}`}>{s.status}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">—</span>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">{t.portal.school.studentMgmt.noMatchFilters}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* C & D side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* C) Subject Distribution */}
        <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
          <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portal.school.subjectDist.sectionTitle}</h3>
          {subjectDistribution.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8">{t.portal.school.subjectDist.noDataYet}</p>
          ) : (
            <div className="space-y-5">
              {subjectDistribution.map((subj) => (
                <div key={subj.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">{subj.name}</span>
                    <span className="text-sm font-bold text-navy">{subj.count} {t.portal.school.subjectDist.studentsUnit}</span>
                  </div>
                  <div className="h-3 bg-bg-subtle rounded-full overflow-hidden">
                    <div
                      className={`h-full ${subj.color} rounded-full transition-all duration-700`}
                      style={{ width: `${(subj.count / subj.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* D) Payment Summary — payment data not available in DB schema */}
        <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
          <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portal.school.paymentSummary.sectionTitle}</h3>
          <div className="space-y-4 mb-6">
            {paymentSummaryConfig.map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-4 rounded-xl ${item.bg} border ${item.border}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.dot}`} />
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                </div>
                <span className={`text-xl font-bold ${item.color}`}>—</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary text-center mb-4">{t.portal.school.paymentSummary.financeIntegrationNote}</p>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange text-white text-sm font-medium rounded-xl hover:bg-orange/90 transition-colors cursor-pointer">
            <Send size={16} />
            {t.portal.school.paymentSummary.sendReminder}
          </button>
        </section>
      </div>

      {/* E) Exam Operations Timeline */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6 mb-8">
        <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portal.school.examOps.sectionTitle}</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
          {timeline.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1 w-full md:w-auto">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-emerald-500" : "bg-bg-subtle border-2 border-border/30"}`}>
                  {step.done ? (
                    <CheckCircle2 size={20} className="text-white" />
                  ) : (
                    <Clock size={18} className="text-text-secondary" />
                  )}
                </div>
                <span className={`text-sm font-medium ${step.done ? "text-navy" : "text-text-secondary"}`}>{step.label}</span>
              </div>
              {i < timeline.length - 1 && (
                <div className={`hidden md:block flex-1 h-0.5 mx-4 min-w-[40px] ${step.done ? "bg-emerald-300" : "bg-border/30"}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* F) Quick Actions */}
      <section className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
        <h3 className="text-lg font-bold text-navy font-[family-name:var(--font-display)] mb-6">{t.portal.school.quickActions.sectionTitle}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t.portal.school.quickActions.downloadStudentList, icon: Download, color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
            { label: t.portal.school.quickActions.exportResults, icon: BarChart3, color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
            { label: t.portal.school.quickActions.viewReports, icon: FileText, color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
            { label: t.portal.school.quickActions.contactPartner, icon: Mail, color: "bg-orange-light text-orange hover:bg-orange/10" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border border-border/20 transition-colors cursor-pointer ${action.color}`}
              >
                <Icon size={24} />
                <span className="text-sm font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </PortalLayout>
  );
}