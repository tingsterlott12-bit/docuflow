'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Upload,
  BarChart3,
  ExternalLink,
  Shield,
  Users,
  Globe,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { listAllFlipbooks } from '@/lib/dataStore';

export default function DashboardPage() {
  const [flipbooks, setFlipbooks] = useState([]);
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    async function load() {
      const serverBooks = await listAllFlipbooks();
      let combined = [...serverBooks];

      if (typeof window !== 'undefined') {
        try {
          const localBooks = JSON.parse(localStorage.getItem('docuflow_local_books') || '[]');
          localBooks.forEach((lb) => {
            if (!combined.some((b) => b.slug === lb.slug || b.id === lb.id)) {
              combined.unshift(lb);
            }
          });
        } catch (e) {}
      }

      setFlipbooks(combined);
    }
    load();
  }, []);

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/d/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            FlipBook Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your interactive publications, review reader metrics, and configure gating.
          </p>
        </div>

        <Link
          href="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New PDF</span>
        </Link>
      </div>

      {/* Grid of Flipbooks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flipbooks.map((fb) => (
          <div
            key={fb.id || fb.slug}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {fb.page_count} Pages
                  </span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    fb.access_type === 'public'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : fb.access_type === 'lead_gate'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}
                >
                  {fb.access_type === 'public' && <Globe className="w-3 h-3" />}
                  {fb.access_type === 'lead_gate' && <Users className="w-3 h-3" />}
                  {fb.access_type === 'password' && <Shield className="w-3 h-3" />}
                  <span className="capitalize">{fb.access_type.replace('_', ' ')}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg tracking-tight line-clamp-1">
                  {fb.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {fb.description || 'Interactive publication rendered with StPageFlip.'}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Slug: /d/{fb.slug}</span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link
                href={`/d/${fb.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition"
              >
                <span>Open Reader</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(fb.slug)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                  title="Copy Share Link"
                >
                  {copiedSlug === fb.slug ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                <Link
                  href={`/dashboard/${fb.slug}/analytics`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium shadow-sm transition"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
