import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Upload,
  BarChart3,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Next-Gen Open Source FlipBook Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Transform static PDFs into <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">interactive 3D flipbooks</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Embed realistic page-turning publications, gate content behind lead capture or passwords, overlay clickable hotspots, and track real-time reader engagement.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/upload"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Your PDF Now</span>
          </Link>
          <Link
            href="/d/annual-report"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-brand-600" />
            <span>View Live FlipBook Demo</span>
          </Link>
        </div>

        {/* Feature badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Commercial Dependencies</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Offline Capable</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supabase RLS & Storage</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deep Link #page=N</span>
        </div>
      </section>

      {/* Interactive Showcase Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Experience the True Luxury Editorial Flipbook
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Try flipping through our sample financial report directly in your browser. Supports touch swipes, arrow keys, page sound synthesis, and full-screen reading.
            </p>
            <div className="pt-4">
              <Link
                href="/d/annual-report"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-lg"
              >
                <span>Launch Interactive Reader</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern Web Publishing
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Every layer has been re-architected from the ground up for high performance, reliability, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3D StPageFlip Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Native HTML5 canvas & DOM page physics. Hardcover binding simulations, realistic paper shadows, and audio feedback.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Access Control & Lead Gates</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lock sensitive presentations behind passwords or collect qualified buyer leads (name, work email, company) before granting access.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deep Reader Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Measure total sessions, average dwell time per page, bounce rates, completion percentages, and export leads to CSV.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Hotspots</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Supercharge static content with clickable web links, page jump triggers, video popouts, and e-commerce shopping links.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deep Linking & Search</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Share exact pages with `#page=5` hashes. Full thumbnail overview scrubber and dynamic zoom controls.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Supabase RLS & Storage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enterprise-grade Postgres Row Level Security, automatic updated_at triggers, and high-speed asset streaming.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
