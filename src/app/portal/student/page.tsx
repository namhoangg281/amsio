"use client";

import PortalLayout from "@/components/portal/PortalLayout";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, Trophy, Star, Award, Calendar, Download,
  ChevronRight, TrendingUp, Clock, MapPin, GraduationCap,
  Target, Sparkles, Globe, AlertCircle, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuthClient } from "@/lib/supabase";
import { fetchStudentByUserId, fetchStudentExamResults } from "@/lib/queries";
import type { ExamResultRow } from "@/lib/queries";
import type { Database } from "@/lib/database.types";

type StudentRow = Database["public"]["Tables"]["students_legacy"]["Row"] & {
  schools: { name: string; code: string } | null;
  countries: { name: string; flag: string } | null;
};

type UserProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type CoreUserItranId = {
  itran_id: string | null;
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const SUBJECT_COLORS: Record<string, { color: string; border: string }> = {
  Mathematics:              { color: "#2563EB", border: "#2563EB" },
  Science:                  { color: "#059669", border: "#059669" },
  Language:                 { color: "#7C3AED", border: "#7C3AED" },
  "Computational Intelligence": { color: "#E8590C", border: "#E8590C" },
};

function getAchievement(score: number | null): string {
  if (!score) return "—";
  if (score >= 90) return "Distinction";
  if (score >= 75) return "High Merit";
  if (score >= 60) return "Merit";
  return "Pass";
}

const timelineStages = [
  { label: "Round 1", date: "Oct 2026" },
  { label: "Round 2", date: "Jan 2027" },
  { label: "Grand Finals", date: "Jun 2027" },
];

const upcomingEvents = [
  { title: "Round 2 Registration Deadline", date: "Jan 5, 2027", type: "deadline" as const },
  { title: "Round 2 — National Championship", date: "Jan 18, 2027", type: "competition" as const },
  { title: "Results Announcement", date: "Feb 15, 2027", type: "announcement" as const },
];

export default function StudentDashboard() {
  const { t } = useI18n();
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [itranId, setItranId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [totalFeeUsd, setTotalFeeUsd] = useState<number | null>(null);
  const [examResults, setExamResults] = useState<ExamResultRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authClient = getAuthClient();
    authClient.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        window.location.href = `${BASE}/portal/login`;
        return;
      }

      // Read payment_status from auth user metadata (set at registration)
      setPaymentStatus((user.user_metadata?.payment_status as string | undefined) ?? null);
      setTotalFeeUsd((user.user_metadata?.total_fee_usd as number | undefined) ?? null);

      // Fetch user profile + student record + itran_id + exam results in parallel
      const [{ data: prof }, { data: stud }, { data: coreUser }, { data: results }] = await Promise.all([
        authClient.from("user_profiles").select("id, full_name, email").eq("id", user.id).maybeSingle(),
        fetchStudentByUserId(user.id),
        authClient.schema("core").from("users").select("itran_id").eq("auth_id", user.id).maybeSingle(),
        fetchStudentExamResults(authClient, user.id),
      ]);

      setStudent(stud as StudentRow | null);
      setProfile(prof as UserProfileRow | null);
      setItranId((coreUser as CoreUserItranId | null)?.itran_id ?? null);
      setExamResults(results ?? []);
      setLoading(false);
    });
  }, []);

  const studentName   = student?.full_name ?? profile?.full_name ?? "Student";
  const countryName   = student?.countries?.name ?? "—";
  const schoolName    = student?.schools?.name ?? "—";
  const gradeNum      = student?.grade ?? null;
  const subjects: string[] = Array.isArray(student?.subjects) ? student.subjects : [];

  // Look up published exam result for a given subject by subject_code
  function getExamResult(subjectName: string): ExamResultRow | undefined {
    return examResults.find(
      r => r.subject_code.toLowerCase() === subjectName.toLowerCase(),
    );
  }

  // Build per-subject data — scores from exam.exam_results (is_published=true)
  const subjectCards = subjects.map(sub => {
    const result = getExamResult(sub);
    const finalScore = result?.final_score ?? null;
    const maxScore = result?.max_score ?? null;
    const pct = (finalScore !== null && maxScore !== null && maxScore > 0)
      ? Math.round((finalScore / maxScore) * 100)
      : null;
    return {
      name: sub,
      color: SUBJECT_COLORS[sub]?.color ?? "#64748b",
      r1Score: pct,
      finalScore,
      maxScore,
      percentile: result?.percentile ?? null,
      prizeTier: result?.prize_tier ?? null,
      r1Result: student?.r1_result ?? null,
      gfQualified: student?.gf_qualified ?? false,
    };
  });

  // Determine timeline progress
  const r1Done = student?.r1_result != null && student.r1_result !== "Pending";
  const r2Done = student?.r2_result != null && student.r2_result !== "Pending";
  const timelineProgress = r2Done ? 66 : r1Done ? 33 : 0;

  // Best score across all published exam results
  const bestScore: number | null = examResults.reduce<number | null>((best, r) => {
    if (r.final_score === null || r.max_score === null || r.max_score === 0) return best;
    const pct = Math.round((r.final_score / r.max_score) * 100);
    return best === null || pct > best ? pct : best;
  }, null);

  const certCount = (student?.r1_result === "Pass" || student?.r1_result === "Distinction" ? subjects.length : 0);

  if (loading) {
    return (
      <PortalLayout role="student" title={t.portalStudent.nav.overview}>
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout role="student" title={t.portal.student.dashboard.title}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-2xl gradient-navy text-white p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-y-1/2" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">{t.portal.welcomeBackName}</p>
                <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)]">{studentName}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/70">
                  {countryName !== "—" && (
                    <span className="flex items-center gap-1.5"><MapPin size={14} />{countryName}</span>
                  )}
                  {schoolName !== "—" && (
                    <>
                      <span className="hidden sm:inline text-white/30">|</span>
                      <span className="flex items-center gap-1.5"><GraduationCap size={14} />{schoolName}</span>
                    </>
                  )}
                  {gradeNum && (
                    <>
                      <span className="hidden sm:inline text-white/30">|</span>
                      <span className="flex items-center gap-1.5"><Target size={14} />{t.portal.grade} {gradeNum}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                <Sparkles size={16} className="text-gold" />
                <span className="text-white/90">{t.portal.season}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">{t.portal.student.timeline.heading}</p>
              <div className="relative flex items-center justify-between">
                <div className="absolute top-4 left-8 right-8 h-0.5 bg-white/20">
                  <div className="h-full bg-gradient-to-r from-gold to-orange rounded-full transition-all duration-1000"
                    style={{ width: `${timelineProgress}%` }} />
                </div>
                {timelineStages.map((stage, i) => {
                  const completed = (i === 0 && r1Done) || (i === 1 && r2Done);
                  const active = (i === 0 && !r1Done) || (i === 1 && r1Done && !r2Done) || (i === 2 && r2Done);
                  const stageLabel = i === 0 ? t.portal.student.timeline.round1 : i === 1 ? t.portal.student.timeline.round2 : t.portal.student.timeline.grandFinals;
                  return (
                    <div key={stage.label} className="relative flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        completed ? "bg-gold border-gold text-navy-dark"
                        : active ? "bg-orange/20 border-orange text-orange animate-pulse"
                        : "bg-white/10 border-white/30 text-white/50"}`}>
                        {completed ? "✓" : i + 1}
                      </div>
                      <p className={`mt-2 text-xs font-semibold ${completed || active ? "text-white" : "text-white/50"}`}>{stageLabel}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{stage.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Payment Pending Banner */}
        {paymentStatus === "pending" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2.5 rounded-xl bg-amber-100 shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-900">
                  {t.portal.student.payment.pendingTitle}{totalFeeUsd ? ` — $${totalFeeUsd} USD` : ""}
                </p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  {t.portal.student.payment.pendingDesc}
                </p>
              </div>
            </div>
            <a
              href={`${BASE}/portal/student/payments`}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              <CreditCard size={14} />
              {t.portal.student.payment.viewPayment}
            </a>
          </div>
        )}

        {/* Student ID Card */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-border/20 shadow-sm px-5 py-4">
          <div className="p-2.5 rounded-xl bg-blue-50 shrink-0">
            <GraduationCap size={20} className="text-math-blue" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-0.5">
              {t.portal.studentId}
            </p>
            {itranId ? (
              <p className="font-mono font-bold text-base text-text-primary tracking-wider">{itranId}</p>
            ) : (
              <p className="font-mono text-base text-text-secondary/50 tracking-wider">—</p>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.portal.student.stats.subjectsRegistered, value: subjects.length > 0 ? String(subjects.length) : "—",
              icon: <BookOpen size={22} />, color: "text-math-blue", bg: "bg-blue-50" },
            { label: t.portal.student.stats.overallRanking, value: student?.r1_result ? "#—" : "—", sub: t.portal.student.stats.afterRound1,
              icon: <Trophy size={22} />, color: "text-gold", bg: "bg-amber-50" },
            { label: t.portal.student.stats.bestScore, value: bestScore ? `${bestScore}%` : "—",
              sub: bestScore ? t.portal.student.timeline.round1 : t.portal.student.stats.pendingR1,
              icon: <Star size={22} />, color: "text-orange", bg: "bg-orange-50" },
            { label: t.portalStudent.overview.certificates, value: String(certCount),
              icon: <Award size={22} />, color: "text-sci-green", bg: "bg-emerald-50" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border/20 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <TrendingUp size={16} className="text-sci-green mt-1" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">{stat.value}</p>
                {"sub" in stat && stat.sub && <span className="text-sm text-text-secondary">{stat.sub}</span>}
              </div>
              <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* My Subjects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">{t.portal.mySubjects}</h3>
            <Link href="/portal/student/results"
              className="text-sm text-orange font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t.portal.student.subjects.viewResults} <ChevronRight size={16} />
            </Link>
          </div>

          {subjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border/20 shadow-sm p-8 text-center">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-text-secondary text-sm">{t.portal.student.subjects.noSubjectsTitle}</p>
              <p className="text-text-secondary/60 text-xs mt-1">{t.portal.student.subjects.noSubjectsDesc}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectCards.map(subject => (
                <div key={subject.name}
                  className="bg-white rounded-2xl border border-border/20 shadow-sm overflow-hidden border-l-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: subject.color }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-text-primary font-[family-name:var(--font-display)]">{subject.name}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {gradeNum ? `${t.portal.grade} ${gradeNum}` : t.portal.student.subjects.divisionTBD}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        (subject.r1Result === "Pass" || subject.r1Result === "Distinction") ? "bg-emerald-50 text-emerald-700"
                        : subject.r1Result === "Fail" ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"}`}>
                        {(subject.r1Result === "Pass" || subject.r1Result === "Distinction") ? t.portal.student.subjects.qualifiedR2 : subject.r1Result === "Fail" ? t.portal.student.subjects.notQualified : t.portal.student.subjects.pendingR1Badge}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-text-secondary">{t.portal.student.subjects.r1Score}</span>
                        <span className="font-bold" style={{ color: subject.color }}>
                          {subject.r1Score ? `${subject.r1Score}%` : "—"}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${subject.r1Score ?? 0}%`, backgroundColor: subject.color }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-text-secondary">
                          {subject.r1Score ? getAchievement(subject.r1Score) : t.portal.student.subjects.resultPending}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          {subject.gfQualified ? t.portal.student.subjects.gfQualified : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Recent Results */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">{t.portal.round1Results}</h3>
              <Link href="/portal/student/results"
                className="text-sm text-orange font-medium flex items-center gap-1 hover:gap-2 transition-all">
                {t.portal.student.resultsTable.fullDetails} <ChevronRight size={16} />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-border/20 shadow-sm overflow-hidden">
              {student?.r1_result ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/10 bg-bg-subtle/50">
                        <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">{t.portal.student.resultsTable.colSubject}</th>
                        <th className="text-center px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">{t.portal.student.resultsTable.colScore}</th>
                        <th className="text-center px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">{t.portal.student.resultsTable.colAchievement}</th>
                        <th className="text-center px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wider">{t.portal.student.resultsTable.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjectCards.map(card => {
                        const c = card.color;
                        const score = card.r1Score;
                        const result = card.r1Result;
                        return (
                          <tr key={card.name} className="border-b border-border/5 last:border-0 hover:bg-bg-subtle/30 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c }} />
                                <span className="font-medium text-text-primary">{card.name}</span>
                                {card.prizeTier && (
                                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700">
                                    {card.prizeTier}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="font-bold" style={{ color: c }}>
                                {score !== null ? `${score}%` : "—"}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="rounded-full px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700">
                                {getAchievement(score)}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                                (result === "Pass" || result === "Distinction") ? "bg-emerald-50 text-emerald-700"
                                : result === "Fail" ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"}`}>
                                {(result === "Pass" || result === "Distinction") ? t.portal.student.resultsTable.qualifiedR2 : result === "Fail" ? t.portal.student.resultsTable.notQualified : t.portal.student.resultsTable.pending}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Clock size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-text-secondary text-sm font-medium">{t.portal.student.resultsTable.resultsNotPublished}</p>
                  <p className="text-text-secondary/60 text-xs mt-1">{t.portal.student.resultsTable.resultsNotPublishedDesc}</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">{t.portal.upcomingEvents}</h3>
            </div>
            <div className="bg-white rounded-2xl border border-border/20 shadow-sm p-5 space-y-0">
              {upcomingEvents.map((event, i) => (
                <div key={event.title} className={`flex gap-4 py-4 ${i !== upcomingEvents.length - 1 ? "border-b border-border/10" : ""}`}>
                  <div className="flex flex-col items-center pt-0.5">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      event.type === "deadline" ? "bg-orange" : event.type === "competition" ? "bg-math-blue" : "bg-gold"}`} />
                    {i !== upcomingEvents.length - 1 && <div className="w-px flex-1 bg-border/30 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary leading-tight">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar size={12} className="text-text-secondary shrink-0" />
                      <span className="text-xs text-text-secondary">{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* My Competitions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">{t.portal.myCompetitions}</h3>
            <Link href="/portal/student/competitions"
              className="text-sm text-orange font-medium flex items-center gap-1 hover:gap-2 transition-all">
              {t.portal.student.competitions.browseAll} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-border/20 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
                <Globe size={24} className="text-orange" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-text-primary">{t.portal.student.competitions.noRegistrations}</p>
                <p className="text-text-secondary text-sm mt-0.5">
                  {t.portal.student.competitions.noRegistrationsDesc}
                </p>
              </div>
              <Link
                href="/portal/student/competitions"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange text-white font-bold text-sm hover:bg-orange/90 active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
              >
                {t.portal.student.competitions.browseCompetitions} <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* Certificates */}
        {certCount > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-text-primary">{t.portal.student.certificates.sectionTitle}</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.filter(() => student?.r1_result === "Pass" || student?.r1_result === "Distinction").map(sub => {
                const c = SUBJECT_COLORS[sub]?.color ?? "#64748b";
                return (
                  <div key={sub} className="bg-white rounded-2xl border border-border/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="h-32 relative flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${c}08, ${c}18)` }}>
                      <div className="text-center">
                        <Award size={36} className="mx-auto mb-1 opacity-40" style={{ color: c }} />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60" style={{ color: c }}>
                          {t.portal.student.certificates.certificateOf} {student?.r1_result ?? t.portal.student.certificates.achievement}
                        </p>
                      </div>
                      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl opacity-20" style={{ borderColor: c }} />
                      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr opacity-20" style={{ borderColor: c }} />
                      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl opacity-20" style={{ borderColor: c }} />
                      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br opacity-20" style={{ borderColor: c }} />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-sm text-text-primary">{t.portal.student.certificates.roundLabel} {sub}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-secondary">Oct 2026</span>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-orange hover:text-orange/80 transition-colors cursor-pointer group-hover:gap-2">
                          <Download size={14} /> {t.portal.student.certificates.download}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PortalLayout>
  );
}