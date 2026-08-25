import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In to Your Portal",
  description:
    "Access your AMSIO International portal. Students, schools, and national partners can sign in to manage competitions, results, and more.",
};

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel - brand / hero */}
      <div className="relative lg:w-[55%] gradient-hero flex flex-col px-8 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-10 overflow-hidden">
        {/* Back to home — in flow */}
        <div className="relative z-10 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute bottom-1/4 left-1/3 w-px h-24 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-lg flex-1 flex flex-col justify-center">
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO International"
            className="w-20 h-20 object-contain mb-10"
          />

          {/* Tagline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-display)] leading-tight tracking-tight">
            Measure Thinking,{" "}
            <span className="text-gradient">Not Memory.</span>
          </h1>

          <p className="mt-6 text-white/60 text-lg leading-relaxed">
            Your gateway to international academic excellence. Access your competition portal
            to track progress, view results, and connect with a global community.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-4">
            {[
              { title: "Real-Time Results", desc: "View scores and rankings as they are published" },
              { title: "Digital Certificates", desc: "Download and share your verified achievements" },
              { title: "Global Community", desc: "Connect with participants from 20+ countries" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-lg bg-orange/15 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-orange" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feature.title}</p>
                  <p className="text-white/50 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <div className="flex items-center gap-8 text-white/30 text-xs uppercase tracking-widest font-[family-name:var(--font-display)]">
              <span>20+ Countries</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>500+ Schools</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>50K+ Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="lg:w-[45%] bg-white flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-0 relative">
        {/* Back to home (mobile only — left panel handles desktop) */}
        <div className="absolute top-5 left-5 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-navy text-sm transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Home</span>
          </Link>
        </div>
        <Suspense fallback={<Loader2 size={32} className="animate-spin text-orange" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
