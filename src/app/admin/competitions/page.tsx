"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Trophy, Settings, Eye, Send, FileText,
  BookOpen, Grid3X3, Target, Megaphone, CheckCircle2, CircleDot, Clock,
} from "lucide-react";

/* ── Round data ── */
const rounds = [
  {
    id: "r1", name: "Round 1", subtitle: "National Qualifier", date: "October 2026",
    status: "Upcoming" as const,
    countries: 12, participantsEst: 45280, location: "Partner Schools Nationwide",
    description: "All registered participants compete at their school. Questions are grade-appropriate.",
  },
  {
    id: "r2", name: "Round 2", subtitle: "National Championship", date: "January 2027",
    status: "Planning" as const,
    countries: 12, participantsEst: 9050, location: "Designated Exam Centres",
    description: "Top performers from Round 1 advance. More challenging assessment.",
  },
  {
    id: "gf", name: "Grand Finals", subtitle: "International Stage", date: "June 2027",
    status: "Planning" as const,
    countries: 12, participantsEst: 2450, location: "San Francisco, USA",
    description: "Top achievers from each country compete on the global stage.",
  },
];

const settingCards = [
  { icon: <BookOpen size={18} />, title: "Question Sets", desc: "4 subjects × grade divisions", color: "blue", action: "Configure" },
  { icon: <Grid3X3 size={18} />, title: "Grade Divisions", desc: "Math: 12 · Science: 6 · Lang: 12 · CI: 5", color: "emerald", action: "Edit" },
  { icon: <Target size={18} />, title: "Achievement Thresholds", desc: "Distinction / Merit / Participation+", color: "gold", action: "Edit" },
  { icon: <Megaphone size={18} />, title: "Announcement Templates", desc: "8 templates configured", color: "purple", action: "Manage" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  gold: "bg-[#E8A817]/10 text-[#E8A817]",
  purple: "bg-purple-500/10 text-purple-400",
};

const statusStyles: Record<string, string> = {
  "Upcoming": "bg-[#E8A817]/10 text-[#E8A817]",
  "In Progress": "bg-emerald-500/10 text-emerald-400",
  "Planning": "bg-white/5 text-white/40",
};

const statusIcons: Record<string, React.ReactNode> = {
  "Upcoming": <CircleDot size={20} className="text-[#E8A817]" />,
  "In Progress": <CheckCircle2 size={20} className="text-emerald-400" />,
  "Planning": <Clock size={20} className="text-white/30" />,
};

export default function CompetitionsPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1200px]">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
            Competition Management
          </h2>
          <p className="text-white/40 text-sm mt-1">Season 2026-2027</p>
        </div>

        {/* Season card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8A817]/10 flex items-center justify-center">
                <Trophy size={20} className="text-[#E8A817]" />
              </div>
              <div>
                <h3 className="text-white font-[family-name:var(--font-display)] font-bold text-lg">
                  Season 2026-2027
                </h3>
                <p className="text-white/40 text-xs">12 countries · 4 subjects · 3 rounds</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
              Active Season
            </span>
          </div>

          {/* Round timeline */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[28px] left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-0.5 bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rounds.map((round, idx) => (
                <div key={round.id} className="relative bg-white/[0.02] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors">
                  {/* Round number badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative z-10">
                        {statusIcons[round.status]}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{round.name}</p>
                        <p className="text-white/40 text-xs">{round.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[9px] shrink-0 ml-2">{idx + 1}/3</span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs text-white/60"><span className="text-white/30">Date:</span> {round.date}</p>
                    <p className="text-xs text-white/60"><span className="text-white/30">Location:</span> {round.location}</p>
                    <p className="text-xs text-white/60"><span className="text-white/30">Expected:</span> ~{round.participantsEst.toLocaleString()} participants</p>
                  </div>

                  <p className="text-xs text-white/30 mb-4 leading-relaxed">{round.description}</p>

                  <div className="flex items-center gap-1.5 mb-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusStyles[round.status]}`}>
                      {round.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors cursor-pointer">
                      <Settings size={12} /> Configure
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors cursor-pointer">
                      <Eye size={12} /> Results
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#E8A817]/10 hover:bg-[#E8A817]/20 text-[#E8A817] text-xs font-medium transition-colors cursor-pointer">
                      <Send size={12} /> Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings section */}
        <div>
          <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base mb-4">
            Competition Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settingCards.map(card => (
              <div key={card.title} className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[card.color]}`}>
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{card.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{card.desc}</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/90 text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5">
                  <FileText size={12} /> {card.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subject coverage */}
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
          <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-sm mb-4 uppercase tracking-wider">
            Subject Coverage — Season 2026-2027
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Mathematics", divisions: 12, color: "text-blue-400", bg: "bg-blue-500/10", icon: "∑" },
              { name: "Science", divisions: 6, color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "⚛" },
              { name: "Language", divisions: 12, color: "text-purple-400", bg: "bg-purple-500/10", icon: "文" },
              { name: "Computational Intelligence", divisions: 5, color: "text-orange-400", bg: "bg-orange-500/10", icon: "{}" },
            ].map(s => (
              <div key={s.name} className={`rounded-xl p-4 ${s.bg} border border-white/5`}>
                <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.icon}</p>
                <p className="text-white text-sm font-medium leading-tight">{s.name}</p>
                <p className="text-white/40 text-xs mt-1">{s.divisions} divisions</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}