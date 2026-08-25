"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  School,
  Users,
  Trophy,
  Award,
  DollarSign,
  FileText,
  MessageSquare,
  Settings,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
import { useState } from "react";
import { getAuthClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
import { useAdminRole, canAccess, ROLE_LABELS } from "@/lib/admin-role";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useI18n();
  const role = useAdminRole();

  const adminNav: NavItem[] = [
    { label: t.admin.sidebar.overview, href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: t.admin.sidebar.countries, href: "/admin/countries", icon: <Globe size={20} /> },
    { label: t.admin.sidebar.schools, href: "/admin/schools", icon: <School size={20} /> },
    { label: t.admin.sidebar.students, href: "/admin/students", icon: <Users size={20} /> },
    { label: t.admin.sidebar.competitions, href: "/admin/competitions", icon: <Trophy size={20} /> },
    { label: t.admin.sidebar.grandFinals, href: "/admin/grand-finals", icon: <Award size={20} /> },
    { label: t.admin.sidebar.finance, href: "/admin/finance", icon: <DollarSign size={20} /> },
    { label: t.admin.sidebar.content, href: "/admin/content", icon: <FileText size={20} /> },
    { label: t.admin.sidebar.communications, href: "/admin/communications", icon: <MessageSquare size={20} /> },
    { label: t.admin.sidebar.settings, href: "/admin/settings", icon: <Settings size={20} /> },
    { label: t.admin.sidebar.registrations, href: "/admin/registrations", icon: <ClipboardList size={20} /> },
  ];

  const visibleNav = adminNav.filter((item) => {
    const pageKey = item.href === '/admin' ? 'overview' : item.href.replace('/admin/', '');
    return canAccess(role, pageKey);
  });

  const handleLogout = async () => {
    await getAuthClient().auth.signOut();
    window.location.href = `${BASE}/admin/login`;
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 text-white transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
      style={{ background: "#0a1628" }}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/10", collapsed && "justify-center px-3")}>
        <div className="w-9 h-9 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO"
            className="w-full h-full object-contain"
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-display)] font-bold text-sm tracking-wide text-white">
              AMSIO
            </span>
            <span className="text-[10px] text-gold font-semibold tracking-[0.2em] uppercase">
              HQ Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-gold bg-white/5"
                  : "text-white/60 hover:text-white/90 hover:bg-white/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2 border-t border-white/8">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors w-full cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>{t.admin.sidebar.collapse}</span>}
        </button>
      </div>

      {/* Admin user info */}
      <div className="px-3 pb-4 pt-2 border-t border-white/8">
        <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-bold shrink-0">
            SA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">System Admin</p>
              <p className="text-xs text-white/40">{ROLE_LABELS[role]}</p>
            </div>
          )}
        </div>
        <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors w-full mt-1">
          <ChevronLeft size={18} />
          {!collapsed && <span>Back to home</span>}
        </a>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors w-full cursor-pointer mt-1">
          <LogOut size={18} />
          {!collapsed && <span>{t.admin.sidebar.signOut}</span>}
        </button>
      </div>
    </aside>
  );
}