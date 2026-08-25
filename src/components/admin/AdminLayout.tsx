"use client";

import AdminSidebar from "./AdminSidebar";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { AdminRoleContext, AdminRole, ROLE_LABELS, canAccess } from "@/lib/admin-role";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [role, setRole] = useState<AdminRole>('hq_staff');
  const [fullName, setFullName] = useState<string>('Admin');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // 1) Chưa đăng nhập → về trang login
      if (!session) {
        window.location.href = `${BASE}/admin/login`;
        return;
      }
      // 2) Có session nhưng KHÔNG phải admin (không có hồ sơ) → chặn
      const { data: profile } = await supabase
        .from('amsio_admin_profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .maybeSingle();
      if (!profile?.role) {
        window.location.href = `${BASE}/admin/login`;
        return;
      }
      const r = profile.role as AdminRole;
      setRole(r);
      if (profile.full_name) setFullName(profile.full_name);
      // 3) Enforce quyền theo trang — không được phép thì về Overview
      const pageKey = pathname === '/admin' ? 'overview' : pathname.replace(/^\/admin\//, '').split('/')[0];
      if (!canAccess(r, pageKey)) {
        window.location.href = `${BASE}/admin`;
        return;
      }
      setAuthChecked(true);
    });
  }, [pathname]);

  // Don't render admin content until auth is confirmed
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AdminRoleContext.Provider value={role}>
      <div className="flex min-h-screen bg-[#0d1b2a]">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 h-16 border-b border-white/8 flex items-center justify-between px-6 bg-[#0d1b2a]/95 backdrop-blur-md">
            <h1 className="font-[family-name:var(--font-display)] font-bold text-white text-lg">
              AMSIO HQ Dashboard
            </h1>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries, schools..."
                  className="w-64 h-9 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-colors"
                />
              </div>

              {/* Language switcher */}
              <LanguageSwitcher />

              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer">
                <Bell size={18} className="text-white/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange" />
              </button>

              {/* Admin avatar */}
              <button className="flex items-center gap-2 h-9 pl-1 pr-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                  {initials}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                  <span className="text-sm text-white/70">{fullName}</span>
                  <span className="text-[10px] text-white/40">{ROLE_LABELS[role]}</span>
                </div>
                <ChevronDown size={14} className="text-white/40" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminRoleContext.Provider>
  );
}