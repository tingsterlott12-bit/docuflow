'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Upload, LayoutDashboard, BarChart3, LogIn, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Hide main navbar on full-screen viewer route (/d/[slug])
  if (pathname && pathname.startsWith('/d/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>Docu<span className="text-brand-600">Flow</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/dashboard' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/showcase"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/showcase' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Showcase
            </Link>
            <Link
              href="/pricing"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/pricing' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/docs' ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Create FlipBook</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 text-sm font-medium hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
