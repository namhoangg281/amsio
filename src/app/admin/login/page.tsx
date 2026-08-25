import type { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "HQ Administration",
  description: "AMSIO International Headquarters administration access.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-navy/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange/3 blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
            alt="AMSIO International"
            className="w-20 h-20 object-contain mx-auto mb-6"
          />
          <h1 className="text-xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight">
            HQ Administration
          </h1>
          <p className="mt-1.5 text-white/40 text-sm">
            Authorized personnel only
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 shadow-2xl">
          <AdminLoginForm />
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <div className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
            <p className="text-[11px] text-white/30 uppercase tracking-widest font-[family-name:var(--font-display)]">
              Secure Environment
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-white/20">
          This is a demo interface. Access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}