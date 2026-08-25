"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users, Shield, Clock, Key, Bell, Plus,
  CheckCircle2, XCircle, Edit2, Trash2, Eye,
} from "lucide-react";
import { useState } from "react";

/* ── Mock data ── */
const adminUsers = [
  { name: "System Admin", email: "admin@amsio.org", role: "Super Admin" as const, lastLogin: "2026-05-20 09:14", active: true },
  { name: "Sarah Chen", email: "s.chen@amsio.org", role: "Admin" as const, lastLogin: "2026-05-19 16:42", active: true },
  { name: "Marco Rossi", email: "m.rossi@amsio.org", role: "Admin" as const, lastLogin: "2026-05-18 11:05", active: true },
  { name: "Aisha Rahman", email: "a.rahman@amsio.org", role: "Viewer" as const, lastLogin: "2026-05-15 08:30", active: true },
  { name: "Tom Nguyen", email: "t.nguyen@amsio.org", role: "Viewer" as const, lastLogin: "2026-04-28 14:20", active: false },
];

const roles = [
  {
    name: "Super Admin", color: "text-[#E8A817] bg-[#E8A817]/10 border-[#E8A817]/20",
    desc: "Full platform access and configuration rights",
    permissions: [
      { section: "Countries", read: true, write: true, delete: true },
      { section: "Schools", read: true, write: true, delete: true },
      { section: "Students", read: true, write: true, delete: true },
      { section: "Finance", read: true, write: true, delete: true },
      { section: "Settings", read: true, write: true, delete: true },
    ],
  },
  {
    name: "Admin", color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    desc: "Operational access — cannot change system settings",
    permissions: [
      { section: "Countries", read: true, write: true, delete: false },
      { section: "Schools", read: true, write: true, delete: false },
      { section: "Students", read: true, write: true, delete: false },
      { section: "Finance", read: true, write: false, delete: false },
      { section: "Settings", read: true, write: false, delete: false },
    ],
  },
  {
    name: "Viewer", color: "text-white/60 bg-white/5 border-white/10",
    desc: "Read-only access to reports and dashboards",
    permissions: [
      { section: "Countries", read: true, write: false, delete: false },
      { section: "Schools", read: true, write: false, delete: false },
      { section: "Students", read: true, write: false, delete: false },
      { section: "Finance", read: false, write: false, delete: false },
      { section: "Settings", read: false, write: false, delete: false },
    ],
  },
];

const auditLog = [
  { ts: "2026-05-20 09:14", admin: "System Admin", action: "Published", target: "Round 1 registration open announcement" },
  { ts: "2026-05-19 16:42", admin: "Sarah Chen", action: "Updated", target: "Indonesia partner commission rate" },
  { ts: "2026-05-19 11:30", admin: "System Admin", action: "Added", target: "New school: Osaka International Academy (Japan)" },
  { ts: "2026-05-18 15:05", admin: "Marco Rossi", action: "Exported", target: "Finance report — Q1 2027" },
  { ts: "2026-05-18 11:05", admin: "Marco Rossi", action: "Updated", target: "Grand Finals delegation: Philippines" },
  { ts: "2026-05-17 09:22", admin: "Sarah Chen", action: "Deleted", target: "Draft: obsolete CI sample paper v1" },
  { ts: "2026-05-16 14:50", admin: "System Admin", action: "Created", target: "Admin account: Tom Nguyen (Viewer)" },
  { ts: "2026-05-15 08:30", admin: "Aisha Rahman", action: "Viewed", target: "Finance overview report" },
  { ts: "2026-05-14 16:10", admin: "Sarah Chen", action: "Updated", target: "Announcement: updated grade divisions Science" },
  { ts: "2026-05-13 10:45", admin: "System Admin", action: "Configured", target: "Round 1 question set — Mathematics Grade 9" },
];

const apiCards = [
  { label: "Platform API Key", value: "amsk_live_••••••••••••••••4f9a", color: "text-[#E8A817]" },
  { label: "Email Service API", value: "sg_api_••••••••••••••••2b8c", color: "text-blue-400" },
  { label: "Storage API", value: "s3_key_••••••••••••••••7d1e", color: "text-purple-400" },
];

const notifToggles = [
  { label: "New school registration", enabled: true },
  { label: "Partner payment received", enabled: true },
  { label: "Round results published", enabled: true },
  { label: "GF qualification updates", enabled: false },
  { label: "System error alerts", enabled: true },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-[#E8A817]/10 text-[#E8A817]",
  Admin: "bg-blue-500/10 text-blue-400",
  Viewer: "bg-white/5 text-white/40",
};

const actionColors: Record<string, string> = {
  Published: "text-emerald-400",
  Updated: "text-blue-400",
  Added: "text-purple-400",
  Exported: "text-[#E8A817]",
  Deleted: "text-red-400",
  Created: "text-emerald-400",
  Viewed: "text-white/40",
  Configured: "text-orange-400",
};

export default function SettingsPage() {
  const [toggles, setToggles] = useState(notifToggles.map(t => t.enabled));

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-[1200px]">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">
            Admin Settings
          </h2>
          <p className="text-white/40 text-sm mt-1">System configuration and access management</p>
        </div>

        {/* ── Section 1: Admin Users ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base flex items-center gap-2">
              <Users size={17} className="text-[#E8A817]" /> Admin Users
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8A817]/10 hover:bg-[#E8A817]/20 text-[#E8A817] text-xs font-semibold transition-colors cursor-pointer border border-[#E8A817]/20">
              <Plus size={14} /> Add Admin
            </button>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-center font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Last Login</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((u, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                            {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-white font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${roleColors[u.role]}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">{u.lastLogin}</td>
                      <td className="px-4 py-3 text-center">
                        {u.active
                          ? <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active</span>
                          : <span className="inline-flex items-center gap-1 text-white/30 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" /> Inactive</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors cursor-pointer"><Eye size={13} /></button>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                          {u.role !== "Super Admin" && (
                            <button className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Section 2: Roles & Permissions ── */}
        <section>
          <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base flex items-center gap-2 mb-4">
            <Shield size={17} className="text-[#E8A817]" /> Roles &amp; Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map(role => (
              <div key={role.name} className={`bg-white/[0.03] border rounded-xl p-5 ${role.color.includes("border") ? role.color.split(" ").filter(c => c.startsWith("border")).join(" ") : "border-white/8"}`}>
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${role.color}`}>
                  {role.name}
                </div>
                <p className="text-white/40 text-xs mb-4">{role.desc}</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 text-[10px] text-white/30 uppercase tracking-wider mb-1">
                    <span>Section</span>
                    <span className="text-center">Read</span>
                    <span className="text-center">Write</span>
                    <span className="text-center">Delete</span>
                  </div>
                  {role.permissions.map(p => (
                    <div key={p.section} className="grid grid-cols-4 items-center text-xs">
                      <span className="text-white/50">{p.section}</span>
                      <span className="flex justify-center">
                        {p.read ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-white/15" />}
                      </span>
                      <span className="flex justify-center">
                        {p.write ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-white/15" />}
                      </span>
                      <span className="flex justify-center">
                        {p.delete ? <CheckCircle2 size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-white/15" />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Audit Log ── */}
        <section>
          <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base flex items-center gap-2 mb-4">
            <Clock size={17} className="text-[#E8A817]" /> Audit Log
          </h3>
          <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                    <th className="px-4 py-3 text-left font-medium">Admin</th>
                    <th className="px-4 py-3 text-left font-medium">Action</th>
                    <th className="px-4 py-3 text-left font-medium">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-white/30 text-xs font-mono">{entry.ts}</td>
                      <td className="px-4 py-2.5 text-white/60 text-xs">{entry.admin}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-semibold ${actionColors[entry.action] ?? "text-white/60"}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-white/50 text-xs">{entry.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Section 4: System ── */}
        <section>
          <h3 className="text-white font-[family-name:var(--font-display)] font-semibold text-base flex items-center gap-2 mb-4">
            <Key size={17} className="text-[#E8A817]" /> System
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* API Keys */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
              <h4 className="text-white/70 font-semibold text-sm mb-4 uppercase tracking-wider text-xs">API Keys</h4>
              <div className="space-y-3">
                {apiCards.map(api => (
                  <div key={api.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-white/50 text-xs">{api.label}</p>
                      <code className={`text-xs font-mono ${api.color}`}>{api.value}</code>
                    </div>
                    <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                      <Eye size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5">
              <h4 className="text-white/70 font-semibold text-sm mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                <Bell size={13} /> Notification Preferences
              </h4>
              <div className="space-y-3">
                {notifToggles.map((toggle, idx) => (
                  <div key={toggle.label} className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{toggle.label}</span>
                    <button
                      onClick={() => setToggles(prev => prev.map((v, i) => i === idx ? !v : v))}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        toggles[idx] ? "bg-[#E8A817]" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                          toggles[idx] ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}