"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { NAV_ITEMS, BRAND, SHOW_STUDENT_REGISTRATION } from "@/lib/constants";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import AMSIOLogo from "@/components/ui/AMSIOLogo";
import { useI18n } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ─── Register button (direct link to /portal/register) ──────────────────── */

function RegisterDropdown() {
  const { t } = useI18n();
  return (
    <Link
      href="/contact"
      className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-orange hover:bg-orange/90 rounded-full transition-all shadow-sm"
    >
      {t.nav.register}
    </Link>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group transition-opacity hover:opacity-90">
              <AMSIOLogo variant="horizontal" size={36} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const hasChildren = "children" in item;
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => hasChildren ? setActiveDropdown(item.label) : undefined}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      {item.label}
                      {hasChildren && <ChevronDown className="w-3 h-3" />}
                    </Link>

                    <AnimatePresence>
                      {hasChildren && activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-1 w-64 glass-light rounded-xl shadow-xl border border-white/20 overflow-hidden"
                        >
                          <div className="py-2">
                            {hasChildren && "children" in item && item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-navy hover:bg-navy-light transition-colors"
                              >
                                {"color" in child && child.color && (
                                  <span
                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: child.color }}
                                  />
                                )}
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right side — desktop: Language + Register▾ + Sign In */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex">
                <LanguageSwitcher />
              </div>

              {/* Register (student/school) — hidden in partner-only phase */}
              {SHOW_STUDENT_REGISTRATION && <RegisterDropdown />}

              {/* Sign In */}
              <Link
                href="/cms/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white/90 hover:text-white border border-white/25 hover:border-white/50 rounded-full transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                {t.nav.signIn}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 gradient-navy lg:hidden"
          >
            <div className="pt-24 px-6 pb-8 h-full overflow-y-auto">
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-lg font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      {item.label}
                    </Link>
                    {"children" in item && item.children && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile CTA — clean 2-card layout */}
              <div className="mt-8 space-y-3">
                {/* Register (student/school) — hidden in partner-only phase */}
                {SHOW_STUDENT_REGISTRATION && (
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl bg-orange text-white font-semibold text-sm hover:bg-orange/90 transition-colors"
                  >
                    {t.nav.register}
                  </Link>
                )}

                {/* Sign In */}
                <Link
                  href="/cms/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/25 text-white/90 font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  <LogIn size={16} />
                  {t.nav.signIn}
                </Link>

                <div className="pt-2 flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
