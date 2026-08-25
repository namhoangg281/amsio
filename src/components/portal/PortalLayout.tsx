"use client";

import { useEffect, useState } from "react";
import PortalSidebar from "./PortalSidebar";
import { getAuthClient } from "@/lib/supabase";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type PortalRole = "student" | "school" | "partner";

/** JWT roles allowed per portal section */
const ALLOWED_ROLES: Record<PortalRole, readonly string[]> = {
  student: ["learner", "guardian", "center_admin", "ops_staff"],
  school: [
    "school_coordinator",
    "national_partner_admin",
    "national_partner_coordinator",
    "center_admin",
    "ops_staff",
  ],
  partner: [
    "national_partner_admin",
    "national_partner_coordinator",
    "center_admin",
    "ops_staff",
  ],
};

interface PortalLayoutProps {
  role: PortalRole;
  title: string;
  children: React.ReactNode;
}

export default function PortalLayout({ role, title, children }: PortalLayoutProps) {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getAuthClient()
      .auth.getUser()
      .then(({ data: { user }, error }) => {
        if (!user || error) {
          window.location.href = `${BASE}/portal/login`;
          return;
        }

        const jwtRoles: string[] = Array.isArray(
          (user.app_metadata as { roles?: string[] }).roles
        )
          ? (user.app_metadata as { roles: string[] }).roles
          : [];

        const allowed = ALLOWED_ROLES[role];
        const hasAccess = jwtRoles.some((r) => allowed.includes(r));

        if (!hasAccess) {
          window.location.href = `${BASE}/portal/login`;
          return;
        }

        setAuthChecked(true);
      });
  }, [role]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-bg-subtle flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-subtle">
      <PortalSidebar role={role} />
      <main className="flex-1 min-w-0 lg:ml-64">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border/20 px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-navy font-[family-name:var(--font-display)]">
              {title}
            </h1>
            <LanguageSwitcher variant="light" />
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}