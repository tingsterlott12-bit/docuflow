'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Clock,
  Eye,
  Layers,
  Download,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { getAnalyticsData } from '@/lib/dataStore';

export default function AnalyticsDashboardPage() {
  const params = useParams();
  const slug = params?.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      if (!slug) return;
      const res = await getAnalyticsData(slug);
      setData(res);
      setLoading(false);
    }
    fetchMetrics();
  }, [slug]);

  const handleExportCSV = () => {
    if (!data?.leads || data.leads.length === 0) {
      alert('No leads collected yet to export.');
      return;
    }

    const headers = ['Name', 'Email', 'Company', 'Captured At'];
    const rows = data.leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.company || ''}"`,
      `"${new Date(l.created_at).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DocuFlow_Leads_${slug}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono">Aggregating telemetry & reading sessions…</p>
      </div>
    );
  }

  const { kpis, pageViews, leads, flipbook } = data;
  const maxViews = Math.max(...pageViews.map((p) => p.views), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to FlipBooks</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>{flipbook?.title || 'Publication Analytics'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-semibold border border-brand-200">
              Live Telemetry
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Slug: /d/{slug}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/d/${slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
            <span>View Reader</span>
          </Link>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Leads CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Views</span>
            <Eye className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.totalViews}</div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Page Turns</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.totalTurns}</div>
          <div className="text-[11px] text-slate-400">Total 3D flips logged</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Avg Dwell Time</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.avgDwell}s</div>
          <div className="text-[11px] text-slate-400">Per reading session</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Leads Captured</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.totalLeads}</div>
          <div className="text-[11px] text-purple-600 font-medium">Lead gate conversion</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.completionRate}%</div>
          <div className="text-[11px] text-slate-400">Read through back cover</div>
        </div>
      </div>

      {/* Reader Engagement Heatmap / Page Views Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Page-by-Page Reader Dropoff & Attention</h2>
            <p className="text-xs text-slate-500 mt-0.5">Impressions and dwell time spent on each individual spread.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-500" /> Total Impressions</span>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          {pageViews.map((p, i) => {
            const pct = Math.round((p.views / maxViews) * 100);
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold">{p.page}</span>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>{p.avgDwell}s avg dwell</span>
                    <span className="font-bold text-slate-900">{p.views} views</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Captured Leads Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Qualified Leads & Reader Profiles</h2>
            <p className="text-xs text-slate-500 mt-0.5">Readers who unlocked content via the lead capture gate.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {leads.length} Contacts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Company</th>
                <th className="px-6 py-3.5">Captured Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{l.name || 'Anonymous'}</td>
                  <td className="px-6 py-4 font-mono text-brand-600">{l.email}</td>
                  <td className="px-6 py-4 text-slate-600">{l.company || '—'}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono">
                    {new Date(l.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
