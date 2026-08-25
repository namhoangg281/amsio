"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import {
  Send, Mail, Megaphone, FileText,
  Globe, Search,
  CheckCircle2, ChevronRight, Plus, Loader2,
} from "lucide-react";
import { fetchAnnouncements, createAnnouncement, fetchCountries } from "@/lib/queries";
import { getAuthClient } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

/* ── Static inbox (not yet wired to DB) ── */
const inbox = [
  { from: "Malaysia Partner", country: "🇲🇾", subject: "School Registration Issue — Ipoh Excellence", date: "18 May 2026", preview: "We are unable to complete school registration for Ipoh Excellence Centre due to a system error...", unread: true },
  { from: "India Partner", country: "🇮🇳", subject: "Exam Paper Delivery Schedule Request", date: "16 May 2026", preview: "Could you confirm the exact delivery date for Round 1 Mathematics papers? We need at least 10 days...", unread: true },
  { from: "Japan Partner", country: "🇯🇵", subject: "Grand Finals Delegation — Visa Assistance", date: "14 May 2026", preview: "Our students will require visa support letters for the USA Grand Finals. Please advise on the process...", unread: false },
  { from: "Australia Partner", country: "🇦🇺", subject: "Q1 Financial Statement Review", date: "12 May 2026", preview: "We have reviewed the Q1 statement and have a query regarding the commission calculation for...", unread: false },
  { from: "Singapore Partner", country: "🇸🇬", subject: "New School Onboarding — Raffles Prep", date: "10 May 2026", preview: "We would like to onboard Raffles Preparatory Institute for the 2026-2027 season. Please find...", unread: false },
];

const templates = [
  { name: "Season Launch", desc: "Announce the opening of a new competition season to all partners.", icon: "🚀", category: "Operations" },
  { name: "Round Results Published", desc: "Notify partners when round results are ready for download.", icon: "📊", category: "Results" },
  { name: "Payment Reminder", desc: "Chase outstanding remittance due to AMSIO HQ.", icon: "💳", category: "Finance" },
  { name: "Grand Finals Invitation", desc: "Invite qualifying delegations to the International Grand Finals.", icon: "🏆", category: "Grand Finals" },
  { name: "Platform Update", desc: "Inform partners about new portal features or system maintenance.", icon: "⚙️", category: "System" },
  { name: "Registration Deadline", desc: "Remind partners of upcoming student registration deadlines.", icon: "📋", category: "Operations" },
];

type TabId = "broadcast" | "inbox" | "templates";

export default function AdminCommunicationsPage() {
  const [tab, setTab] = useState<TabId>("broadcast");
  const [composing, setComposing] = useState(false);
  const [target, setTarget] = useState("All Partners");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [inboxSearch, setInboxSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null);
  const [broadcasts, setBroadcasts] = useState<AnnouncementRow[]>([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(true);
  const [countriesCount, setCountriesCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoadingBroadcasts(true);
      const [announcementsResult, countriesResult] = await Promise.all([
        fetchAnnouncements(),
        fetchCountries(),
      ]);
      if (announcementsResult.data) setBroadcasts(announcementsResult.data);
      if (countriesResult.data) setCountriesCount(countriesResult.data.length);
      setLoadingBroadcasts(false);
    }
    void loadData();
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setSendError(null);
    const { data: { user } } = await getAuthClient().auth.getUser();
    const { error } = await createAnnouncement({
      subject,
      body,
      target: target as "All Partners" | "Active Partners Only" | "Selected Partners",
      status: "Sent",
      created_by: user?.id ?? "",
      recipients: target === "All Partners" ? countriesCount : undefined,
      sent_at: new Date().toISOString(),
    });
    if (error) {
      setSendError(error.message);
      setSending(false);
      return;
    }
    setSent(true);
    setSending(false);
    setComposing(false);
    const { data } = await fetchAnnouncements();
    if (data) setBroadcasts(data);
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "broadcast", label: "Broadcasts", icon: <Megaphone size={15} /> },
    { id: "inbox", label: "Partner Inbox", icon: <Mail size={15} /> },
    { id: "templates", label: "Templates", icon: <FileText size={15} /> },
  ];

  const unreadCount = inbox.filter(m => m.unread).length;
  const filteredInbox = inbox.filter(m =>
    m.subject.toLowerCase().includes(inboxSearch.toLowerCase()) ||
    m.from.toLowerCase().includes(inboxSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-white">Communications</h2>
            <p className="text-white/40 text-sm mt-1">Global messaging to all National Partners</p>
          </div>
          {tab === "broadcast" && !composing && (
            <button
              onClick={() => { setComposing(true); setSent(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0a1628] text-sm font-bold rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Plus size={16} /> New Broadcast
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Broadcasts", value: loadingBroadcasts ? "…" : broadcasts.filter(b => b.status === "Sent").length, icon: <Megaphone size={18} />, color: "text-blue-400 bg-blue-500/10" },
            { label: "Unread Messages", value: unreadCount, icon: <Mail size={18} />, color: "text-orange bg-orange/10" },
            { label: "Partners Reached", value: "12", icon: <Globe size={18} />, color: "text-emerald-400 bg-emerald-500/10" },
            { label: "Avg Open Rate", value: "94%", icon: <CheckCircle2 size={18} />, color: "text-gold bg-gold/10" },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setComposing(false); setSent(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-gold text-[#0a1628]" : "text-white/50 hover:text-white"
              }`}
            >
              {t.icon} {t.label}
              {t.id === "inbox" && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Broadcast tab ── */}
        {tab === "broadcast" && (
          <div className="space-y-5">
            {/* Compose */}
            {composing && (
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">New Broadcast</h3>
                {sent ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <p className="font-semibold">Broadcast sent to {target}.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sendError && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {sendError}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Target Audience</label>
                        <select value={target} onChange={e => setTarget(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-gold/40">
                          <option>All Partners</option>
                          <option>Active Partners Only</option>
                          <option>Selected Partners</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Subject</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                          placeholder="Broadcast subject..."
                          className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Message</label>
                      <textarea rows={5} value={body} onChange={e => setBody(e.target.value)}
                        placeholder="Write your message to all partners..."
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 resize-none" />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setComposing(false); setSendError(null); }}
                        disabled={sending}
                        className="px-4 py-2 text-sm text-white/40 border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
                        Cancel
                      </button>
                      <button
                        disabled={sending}
                        className="px-4 py-2 text-sm text-white/60 border border-white/10 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50">
                        Save Draft
                      </button>
                      <button
                        onClick={() => void handleSend()}
                        disabled={sending || !subject.trim() || !body.trim()}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-gold text-[#0a1628] rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                        {sending ? "Sending…" : `Send to ${target}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Broadcast history */}
            <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/8">
                <h3 className="text-white font-semibold">Broadcast History</h3>
              </div>
              <div className="divide-y divide-white/5">
                {loadingBroadcasts ? (
                  <div className="px-5 py-8 flex items-center justify-center gap-2 text-white/30 text-sm">
                    <Loader2 size={16} className="animate-spin" /> Loading broadcasts…
                  </div>
                ) : broadcasts.length === 0 ? (
                  <div className="px-5 py-8 text-center text-white/30 text-sm">No broadcasts yet.</div>
                ) : (
                  broadcasts.map(b => {
                    const sentDate = b.sent_at
                      ? new Date(b.sent_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "";
                    return (
                      <div key={b.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">{b.subject}</p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {b.status === "Sent" ? `${sentDate} · To: ${b.target}` : `Draft · To: ${b.target}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          {b.status === "Sent" && (
                            <div className="text-right hidden sm:block">
                              <p className="text-xs text-white/60 font-medium">{b.opens}/{b.recipients}</p>
                              <p className="text-[10px] text-white/30">opened</p>
                            </div>
                          )}
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            b.status === "Sent" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Inbox tab ── */}
        {tab === "inbox" && (
          <div className="bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between gap-4">
              <h3 className="text-white font-semibold">Messages from Partners</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={inboxSearch}
                  onChange={e => setInboxSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="h-8 w-44 pl-8 pr-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40"
                />
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {filteredInbox.map((m, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedMsg(selectedMsg === i ? null : i)}
                  className={`px-5 py-4 cursor-pointer transition-colors ${
                    m.unread ? "bg-gold/[0.04]" : ""
                  } hover:bg-white/[0.03]`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
                      m.unread ? "ring-2 ring-gold/40" : ""
                    }`}>
                      {m.country}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm ${m.unread ? "font-bold text-white" : "font-medium text-white/80"}`}>
                          {m.subject}
                        </p>
                        {m.unread && <span className="w-2 h-2 rounded-full bg-orange flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-white/40 mb-1">{m.from} · {m.date}</p>
                      {selectedMsg === i ? (
                        <div className="mt-3 space-y-3">
                          <p className="text-sm text-white/70 leading-relaxed">{m.preview}</p>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold text-[#0a1628] text-xs font-bold rounded-lg hover:bg-gold/90">
                              <Send size={12} /> Reply
                            </button>
                            <button className="px-3 py-1.5 text-xs text-white/50 border border-white/10 rounded-lg hover:bg-white/5">
                              Mark as Read
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-white/40 truncate">{m.preview}</p>
                      )}
                    </div>
                    <ChevronRight size={16} className={`text-white/20 flex-shrink-0 mt-1 transition-transform ${selectedMsg === i ? "rotate-90" : ""}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Templates tab ── */}
        {tab === "templates" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 hover:border-gold/20 transition-colors group">
                <div className="text-3xl mb-3">{t.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1 block">{t.category}</span>
                <h3 className="font-bold text-white mb-1">{t.name}</h3>
                <p className="text-sm text-white/50 mb-4 leading-relaxed">{t.desc}</p>
                <button
                  onClick={() => { setTab("broadcast"); setComposing(true); setSent(false); }}
                  className="text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
                >
                  Use Template →
                </button>
              </div>
            ))}
            {/* Add template card */}
            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Plus size={20} className="text-white/30" />
              </div>
              <p className="text-sm text-white/30">Add New Template</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}