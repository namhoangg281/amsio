"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Award, Users, CheckCircle2, Clock, AlertCircle, MapPin,
  Plane, Hotel, Monitor, FileText, Medal, Truck, Mail, Calendar,
} from "lucide-react";
import { useState } from "react";
import { COUNTRIES } from "@/lib/constants";

/* ── Mock delegation data ── */
const delegations = [
  { country: "Australia", flag: "🇦🇺", size: 18, coordinator: "Dr. Helen Marsh", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "Cambodia", flag: "🇰🇭", size: 8, coordinator: "Mr. Chan Sovann", visa: "Processing", accommodation: "Confirmed", status: "In Progress" as const },
  { country: "China", flag: "🇨🇳", size: 32, coordinator: "Ms. Liu Fang", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "India", flag: "🇮🇳", size: 28, coordinator: "Dr. Rohan Mehta", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "Indonesia", flag: "🇮🇩", size: 16, coordinator: "Ms. Sari Dewi", visa: "Processing", accommodation: "Pending", status: "In Progress" as const },
  { country: "Japan", flag: "🇯🇵", size: 20, coordinator: "Dr. Kenji Matsuda", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "Malaysia", flag: "🇲🇾", size: 14, coordinator: "Mr. Ahmad Rashid", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "Philippines", flag: "🇵🇭", size: 10, coordinator: "Ms. Ana Reyes", visa: "Pending", accommodation: "Pending", status: "Pending" as const },
  { country: "Singapore", flag: "🇸🇬", size: 12, coordinator: "Dr. James Lim", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "South Korea", flag: "🇰🇷", size: 18, coordinator: "Ms. Park Ji-yeon", visa: "Approved", accommodation: "Confirmed", status: "Ready" as const },
  { country: "Thailand", flag: "🇹🇭", size: 9, coordinator: "Mr. Krit Sanguan", visa: "Processing", accommodation: "Pending", status: "In Progress" as const },
  { country: "Vietnam", flag: "🇻🇳", size: 7, coordinator: "Ms. Tran Lan Anh", visa: "Pending", accommodation: "Pending", status: "Pending" as const },
];

const logistics = [
  { icon: <Monitor size={18} />, title: "Venue", detail: "Moscone Center West, San Francisco", done: true },
  { icon: <FileText size={18} />, title: "Certificates", detail: "2,450 participant certificates — printing confirmed", done: true },
  { icon: <Medal size={18} />, title: "Medals", detail: "Gold / Silver / Bronze — ordered", done: true },
  { icon: <Hotel size={18} />, title: "Accommodation", detail: "Block booking at 3 hotels — 80% confirmed", done: false },
  { icon: <FileText size={18} />, title: "Catering", detail: "3-day banquet menu — awaiting final numbers", done: false },
  { icon: <Monitor size={18} />, title: "AV & Tech", detail: "Stage AV, scoring system — in setup", done: false },
  { icon: <Truck size={18} />, title: "Transport", detail: "Airport transfers — coordination pending", done: false },
  { icon: <Plane size={18} />, title: "Delegation Arrivals", detail: "Scheduled Jun 10-11 2027", done: false },
];

const announcements = [
  { title: "Delegation Invitation Letter", target: "All National Partners", status: "Draft", date: "2027-01-15" },
  { title: "Grand Finals Schedule Release", target: "All Delegations", status: "Draft", date: "2027-04-01" },
  { title: "Final Instructions & Logistics Pack", target: "Lead Coordinators", status: "Draft", date: "2027-05-15" },
];

type Tab = "Overview" | "Delegations" | "Logistics" | "Communications";

const statusStyles: Record<string, string> = {
  Ready: "bg-emerald-500/10 text-emerald-400",
  "In Progress": "bg-[#E8A817]/10 text-[#E8A817]",
  Pending: "bg-white/5 text-white/40",
};

const visaStyles: Record<string, string> = {
  Approved: "text-emerald-400",
  Processing: "text-[#E8A817]",
  Pending: "text-white/40",
};

export default function GrandFinalsPage() {
  const [tab, setTab] = useState<Tab>("Overview");

  const totalDelegates = delegations.reduce((s, d) => s + d.size, 0);
  const confirmed = delegations.filter(d => d.status === "Ready").length;
  const pending = delegations.length - confirmed;

  // Countdown to June 15, 2027
  const gfDate = new Date("2027-06-15");
  const today = new Date("2026-05-20");
  const daysToGo = Math.round((gfDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const logisticsDone = logistics.filter(l => l.done).length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1300px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
              Grand Finals Management
            </h2>
            <p className="text-white/40 text-sm mt-1">San Francisco, USA · June 2027</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8A817]/10 border border-[#E8A817]/20">
            <Clock size={16} className="text-[#E8A817]" />
            <span className="text-[#E8A817] font-bold text-lg">{daysToGo}</span>
            <span className="text-[#E8A817]/70 text-sm">days to go</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/8 w-fit">
          {(["Overview", "Delegations", "Logistics", "Communications"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                tab === t
                  ? "bg-[#E8A817]/10 text-[#E8A817] border border-[#E8A817]/20"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {tab === "Overview" && (
          <div className="space-y-5">
            {/* Event card */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E8A817]/10 flex items-center justify-center shrink-0">
                  <Award size={32} className="text-[#E8A817]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-[family-name:var(--font-display)] font-bold text-xl">
                    AMSIO Grand Finals 2027
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-white/50 text-sm">
                      <MapPin size={14} /> Moscone Center West, San Francisco, USA 🇺🇸
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-sm">
                      <Calendar size={14} /> June 12–16, 2027
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Delegates", value: totalDelegates.toString(), sub: "from 12 countries", color: "text-white" },
                { label: "Delegations Confirmed", value: confirmed.toString(), sub: "of 12 countries", color: "text-emerald-400" },
                { label: "Awaiting Confirmation", value: pending.toString(), sub: "countries pending", color: "text-[#E8A817]" },
                { label: "Logistics Progress", value: `${logisticsDone}/${logistics.length}`, sub: "items completed", color: "text-blue-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 text-center">
                  <p className={`text-3xl font-[family-name:var(--font-display)] font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                  <p className="text-white/30 text-[11px] mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-white/60">Overall Readiness</span>
                <span className="text-white font-semibold">
                  {Math.round(((confirmed / delegations.length) * 50 + (logisticsDone / logistics.length) * 50))}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E8A817] to-[#E8590C]"
                  style={{ width: `${Math.round(((confirmed / delegations.length) * 50 + (logisticsDone / logistics.length) * 50))}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Delegations Tab ── */}
        {tab === "Delegations" && (
          <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8">
              <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">
                National Delegations
              </h3>
              <p className="text-white/40 text-xs mt-0.5">{totalDelegates} delegates total</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Country</th>
                    <th className="px-4 py-3 text-center font-medium">Delegates</th>
                    <th className="px-4 py-3 text-left font-medium">Lead Coordinator</th>
                    <th className="px-4 py-3 text-center font-medium">Visa</th>
                    <th className="px-4 py-3 text-center font-medium">Accommodation</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {delegations.map(d => (
                    <tr key={d.country} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{d.flag}</span>
                          <span className="text-white font-medium">{d.country}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Users size={13} className="text-white/30" />
                          <span className="text-white/70">{d.size}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">{d.coordinator}</td>
                      <td className={`px-4 py-3 text-center text-xs font-medium ${visaStyles[d.visa]}`}>{d.visa}</td>
                      <td className="px-4 py-3 text-center">
                        {d.accommodation === "Confirmed"
                          ? <CheckCircle2 size={16} className="text-emerald-400 mx-auto" />
                          : <AlertCircle size={16} className="text-white/30 mx-auto" />
                        }
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusStyles[d.status]}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Logistics Tab ── */}
        {tab === "Logistics" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">
                Logistics Checklist
              </h3>
              <span className="text-white/40 text-sm">
                {logisticsDone} of {logistics.length} complete
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logistics.map(item => (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${
                    item.done
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-white/[0.02] border-white/8"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.done ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      {item.done
                        ? <CheckCircle2 size={14} className="text-emerald-400" />
                        : <Clock size={14} className="text-white/30" />
                      }
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Communications Tab ── */}
        {tab === "Communications" && (
          <div className="space-y-4">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base">
              Draft Announcements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {announcements.map(ann => (
                <div key={ann.title} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-white/15 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{ann.title}</h4>
                  <p className="text-white/40 text-xs mb-1">Target: {ann.target}</p>
                  <p className="text-white/30 text-xs mb-4">Scheduled: {ann.date}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 uppercase tracking-wider font-semibold">
                      {ann.status}
                    </span>
                    <button className="ml-auto px-3 py-1.5 rounded-lg bg-[#E8A817]/10 hover:bg-[#E8A817]/20 text-[#E8A817] text-xs font-medium transition-colors cursor-pointer">
                      Edit Draft
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}