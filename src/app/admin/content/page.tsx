"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  FileText, Upload, Edit2, Trash2, Send, Plus,
  Download, Eye, Newspaper, BookOpen, Megaphone,
} from "lucide-react";
import { useState } from "react";

/* ── Mock data ── */
const newsArticles = [
  { title: "AMSIO 2026-2027 Season Registration Now Open", category: "Announcement", date: "2026-04-10", status: "Published" as const },
  { title: "Grand Finals 2027 Venue Confirmed: San Francisco", category: "Event", date: "2026-03-28", status: "Published" as const },
  { title: "New Partner: Cambodia Joins AMSIO Network", category: "Partnership", date: "2026-03-05", status: "Published" as const },
  { title: "2025-2026 Grand Finals Results — Full Rankings Released", category: "Results", date: "2026-02-14", status: "Published" as const },
  { title: "Computational Intelligence Subject Guide Updated", category: "Academic", date: "2026-01-20", status: "Draft" as const },
  { title: "AMSIO Partner Summit Recap — Key Highlights", category: "Event", date: "2025-12-08", status: "Published" as const },
];

const samplePapers = [
  {
    subject: "Mathematics", color: "text-blue-400 bg-blue-500/10",
    files: [
      { name: "Math_Grade7-9_R1_Sample_2026.pdf", uploaded: "2026-01-15", downloads: 1248 },
      { name: "Math_Grade10-12_R1_Sample_2026.pdf", uploaded: "2026-01-15", downloads: 982 },
      { name: "Math_Grade4-6_R1_Sample_2026.pdf", uploaded: "2026-01-20", downloads: 754 },
    ],
  },
  {
    subject: "Science", color: "text-emerald-400 bg-emerald-500/10",
    files: [
      { name: "Science_Grade5-6_R1_Sample_2026.pdf", uploaded: "2026-01-18", downloads: 876 },
      { name: "Science_Grade9-10_R1_Sample_2026.pdf", uploaded: "2026-01-18", downloads: 643 },
    ],
  },
  {
    subject: "Language", color: "text-purple-400 bg-purple-500/10",
    files: [
      { name: "Language_English_Grade7-9_Sample_2026.pdf", uploaded: "2026-02-01", downloads: 1102 },
      { name: "Language_Chinese_Grade7-9_Sample_2026.pdf", uploaded: "2026-02-01", downloads: 894 },
    ],
  },
  {
    subject: "Computational Intelligence", color: "text-orange-400 bg-orange-500/10",
    files: [
      { name: "CI_Grade7-8_R1_Sample_2026.pdf", uploaded: "2026-01-25", downloads: 712 },
      { name: "CI_Grade9-10_R1_Sample_2026.pdf", uploaded: "2026-01-25", downloads: 580 },
    ],
  },
];

const recentAnnouncements = [
  { title: "Round 1 Registration Deadline Reminder", target: "All Countries", date: "2026-04-05", sent: true },
  { title: "Updated Grading Criteria — Science Division", target: "Australia, Japan, Singapore", date: "2026-03-20", sent: true },
  { title: "Grand Finals Delegation Form Submission", target: "All Countries", date: "2026-05-01", sent: false },
];

type Tab = "News" | "Sample Papers" | "Announcements";

const statusStyles = {
  Published: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-white/5 text-white/40",
};

const categoryColors: Record<string, string> = {
  Announcement: "bg-[#E8A817]/10 text-[#E8A817]",
  Event: "bg-blue-500/10 text-blue-400",
  Partnership: "bg-purple-500/10 text-purple-400",
  Results: "bg-emerald-500/10 text-emerald-400",
  Academic: "bg-orange-500/10 text-orange-400",
};

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>("News");
  const [annTitle, setAnnTitle] = useState("");
  const [annTarget, setAnnTarget] = useState("All Countries");

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
              Content Manager
            </h2>
            <p className="text-white/40 text-sm mt-1">Manage news, sample papers, and announcements</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E8A817] text-[#0a1628] text-sm font-semibold hover:bg-[#E8A817]/90 transition-colors cursor-pointer">
            <Plus size={16} />
            New Content
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/8 w-fit">
          {(["News", "Sample Papers", "Announcements"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                tab === t
                  ? "bg-[#E8A817]/10 text-[#E8A817] border border-[#E8A817]/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t === "News" && <Newspaper size={14} />}
              {t === "Sample Papers" && <BookOpen size={14} />}
              {t === "Announcements" && <Megaphone size={14} />}
              {t}
            </button>
          ))}
        </div>

        {/* ── News Tab ── */}
        {tab === "News" && (
          <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsArticles.map((article, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <FileText size={14} className="text-white/30 mt-0.5 shrink-0" />
                          <span className="text-white font-medium text-sm leading-snug">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${categoryColors[article.category] ?? "bg-white/5 text-white/40"}`}>
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">{article.date}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusStyles[article.status]}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/90 transition-colors cursor-pointer">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/90 transition-colors cursor-pointer">
                            <Edit2 size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Sample Papers Tab ── */}
        {tab === "Sample Papers" && (
          <div className="space-y-5">
            {samplePapers.map(group => (
              <div key={group.subject} className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${group.color}`}>
                      <BookOpen size={15} />
                    </div>
                    <h3 className="text-white font-semibold text-sm">{group.subject}</h3>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors cursor-pointer">
                    <Upload size={12} /> Upload PDF
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {group.files.map(file => (
                    <div key={file.name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]">
                      <FileText size={14} className="text-white/30 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-xs font-medium truncate">{file.name}</p>
                        <p className="text-white/30 text-[11px] mt-0.5">Uploaded {file.uploaded}</p>
                      </div>
                      <div className="flex items-center gap-1 text-white/30 text-xs shrink-0">
                        <Download size={12} />
                        <span>{file.downloads.toLocaleString()}</span>
                      </div>
                      <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors cursor-pointer shrink-0">
                        <Edit2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Announcements Tab ── */}
        {tab === "Announcements" && (
          <div className="space-y-5">
            {/* Compose form */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
              <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-sm mb-4 flex items-center gap-2">
                <Send size={15} className="text-[#E8A817]" /> Compose Announcement
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="Announcement title..."
                  className="w-full h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8A817]/50 transition-colors"
                />
                <div className="flex gap-3">
                  <select
                    value={annTarget}
                    onChange={e => setAnnTarget(e.target.value)}
                    className="h-10 flex-1 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-[#E8A817]/50 cursor-pointer"
                  >
                    <option>All Countries</option>
                    <option>Australia</option>
                    <option>China</option>
                    <option>India</option>
                    <option>Japan</option>
                    <option>Singapore</option>
                    <option>South Korea</option>
                  </select>
                  <button className="px-5 py-2 rounded-lg bg-[#E8A817] text-[#0a1628] text-sm font-semibold hover:bg-[#E8A817]/90 transition-colors cursor-pointer flex items-center gap-2">
                    <Send size={14} /> Send
                  </button>
                </div>
                <textarea
                  placeholder="Write your announcement message here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8A817]/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Recent announcements */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8">
                <h3 className="text-white font-semibold text-sm">Recent Announcements</h3>
              </div>
              <div className="divide-y divide-white/5">
                {recentAnnouncements.map((ann, idx) => (
                  <div key={idx} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ann.sent ? "bg-emerald-400" : "bg-[#E8A817]"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{ann.title}</p>
                      <p className="text-white/30 text-xs mt-0.5">
                        Target: {ann.target} · {ann.date}
                      </p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider shrink-0 ${
                      ann.sent ? "bg-emerald-500/10 text-emerald-400" : "bg-[#E8A817]/10 text-[#E8A817]"
                    }`}>
                      {ann.sent ? "Sent" : "Scheduled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}