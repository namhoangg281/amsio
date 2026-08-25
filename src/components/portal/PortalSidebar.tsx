"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAuthClient } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Award,
  CreditCard,
  Globe,
  Settings,
  Users,
  FileText,
  ClipboardList,
  Mail,
  Building2,
  GraduationCap,
  User,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Trophy,
} from "lucide-react";

type PortalRole = "student" | "school" | "partner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface PortalSidebarProps {
  role: PortalRole;
}

export default function PortalSidebar({ role }: PortalSidebarProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    getAuthClient().auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserName(user.email.split("@")[0]);
    });
  }, []);

  const handleLogout = async () => {
    await getAuthClient().auth.signOut();
    window.location.href = `/portal/login`;
  };

  const studentNav: NavItem[] = [
    { label: t.portalStudent.nav.overview,    href: "/portal/student",                    icon: <LayoutDashboard size={20} /> },
    { label: t.portalStudent.nav.competitions, href: "/portal/student/competitions",       icon: <Trophy size={20} /> },
    { label: t.portalStudent.nav.results,     href: "/portal/student/results",             icon: <BarChart3 size={20} /> },
    { label: t.portalStudent.nav.certificates, href: "/portal/student/certificates",       icon: <Award size={20} /> },
    { label: t.portalStudent.nav.payments,    href: "/portal/student/payments",            icon: <CreditCard size={20} /> },
    { label: t.portalStudent.nav.grandFinals, href: "/portal/student/grand-finals",        icon: <Globe size={20} /> },
    { label: t.portalStudent.nav.profile,     href: "/portal/student/profile",             icon: <User size={20} /> },
  ];

  const schoolNav: NavItem[] = [
    { label: t.portalSchool.nav.overview,  href: "/portal/school",                icon: <LayoutDashboard size={20} /> },
    { label: t.portalSchool.nav.students,  href: "/portal/school/students",       icon: <GraduationCap size={20} /> },
    { label: t.portalSchool.nav.results,   href: "/portal/school/results",        icon: <BarChart3 size={20} /> },
    { label: t.portalSchool.nav.finance,   href: "/portal/school/finance",        icon: <CreditCard size={20} /> },
    { label: t.portalSchool.nav.exams,     href: "/portal/school/exams",          icon: <ClipboardList size={20} /> },
    { label: t.portalSchool.nav.reports,   href: "/portal/school/reports",        icon: <FileText size={20} /> },
    { label: t.portalSchool.nav.settings,  href: "/portal/school/settings",       icon: <Settings size={20} /> },
  ];

  const partnerNav: NavItem[] = [
    { label: t.portalSidebar.dashboard,      href: "/portal/partner",               icon: <LayoutDashboard size={20} /> },
    { label: t.portalSidebar.students,       href: "/portal/partner/students",       icon: <Users size={20} /> },
    { label: t.portalSidebar.finance,        href: "/portal/partner/finance",        icon: <CreditCard size={20} /> },
    { label: t.portalSchool.nav.exams,       href: "/portal/partner/exams",          icon: <ClipboardList size={20} /> },
    { label: t.portalPartner.communications, href: "/portal/partner/communications", icon: <Mail size={20} /> },
    { label: t.portalSidebar.settings,       href: "/portal/partner/settings",       icon: <Settings size={20} /> },
  ];

  const navMap: Record<PortalRole, NavItem[]> = {
    student: studentNav,
    school:  schoolNav,
    partner: partnerNav,
  };

  const roleLabels: Record<PortalRole, string> = {
    student: t.portalSidebar.roleStudent,
    school:  t.portalSidebar.roleSchoolAdmin,
    partner: t.portalSidebar.rolePartner,
  };

  const navItems = navMap[role];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-5 pt-6 pb-4 border-b border-white/10",
        collapsed && "justify-center px-3"
      )}>
        {/* Logo icon */}
        <div className="w-9 h-9 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO"
            className="w-full h-full object-contain"
          />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-[16px] font-[family-name:var(--font-display)] leading-none tracking-wide">
              AMSIO
            </div>
            <div className="text-white/40 text-[8px] tracking-[0.18em] uppercase leading-none mt-0.5">
              International
            </div>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-5 py-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            {roleLabels[role]}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-orange/15 text-orange"
                  : "text-white/65 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="hidden lg:block px-3 py-2 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors w-full cursor-pointer"
        >
          <ChevronLeft size={18} className={cn("transition-transform flex-shrink-0", collapsed && "rotate-180")} />
          {!collapsed && <span>{t.portalSidebar.collapse}</span>}
        </button>
      </div>

      {/* User */}
      <div className={cn("px-4 py-4 border-t border-white/10", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-gold flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">{userName ? userName[0].toUpperCase() : "?"}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{userName || "—"}</p>
              <span className="text-white/40 text-[10px] uppercase tracking-wide">{roleLabels[role]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Back to home + Sign out */}
      <div className="px-3 pb-4 pt-1 space-y-0.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? t.portalSidebar.backToHome : undefined}
        >
          <ChevronLeft size={18} className="flex-shrink-0" />
          {!collapsed && <span>{t.portalSidebar.backToHome}</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors w-full cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? t.portalSidebar.signOut : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>{t.portalSidebar.signOut}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-navy-dark/90 backdrop-blur-sm flex items-center justify-center text-white shadow-lg"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-navy-dark transform transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col fixed inset-y-0 left-0 bg-navy-dark z-30 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}