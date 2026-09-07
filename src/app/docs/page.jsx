import Link from 'next/link';
import { Terminal, Code, Database, Key, Shield, Layers, Copy } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Code className="w-3.5 h-3.5" />
          <span>Developer Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          DocuFlow Architecture & API
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Learn how to self-host, embed interactive 3D flipbooks, configure Supabase Row Level Security, and consume conversion endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Navigation */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Documentation Index</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#quickstart" className="text-brand-600 font-semibold hover:underline">1. Quickstart & Deployment</a></li>
            <li><a href="#supabase" className="text-slate-600 hover:text-slate-900">2. Supabase Setup & RLS</a></li>
            <li><a href="#api-convert" className="text-slate-600 hover:text-slate-900">3. PDF Conversion Endpoint</a></li>
            <li><a href="#api-telemetry" className="text-slate-600 hover:text-slate-900">4. Telemetry & Analytics API</a></li>
            <li><a href="#embed" className="text-slate-600 hover:text-slate-900">5. Embedding in External Apps</a></li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-12 text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section id="quickstart" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-brand-600" />
              <span>1. Quickstart & Deployment</span>
            </h2>
            <p>
              DocuFlow is built with Next.js 14 App Router. To run the project locally or on your own VPS:
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-2">
              <div># 1. Clone & install dependencies</div>
              <div className="text-brand-400">git clone https://github.com/docuflow/docuflow.git</div>
              <div className="text-brand-400">cd docuflow && npm install</div>
              <div className="pt-2"># 2. Configure environment</div>
              <div className="text-brand-400">cp .env.example .env.local</div>
              <div className="pt-2"># 3. Start development server</div>
              <div className="text-emerald-400">npm run dev</div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="supabase" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>2. Supabase Setup & RLS</span>
            </h2>
            <p>
              DocuFlow utilizes Postgres Row Level Security (RLS) to ensure that only authorized flipbook owners can modify pages, view private telemetry, or download qualified reader leads.
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
              <pre className="text-xs text-slate-300">
{`-- Run in your Supabase SQL Editor:
-- Found in /supabase/schema.sql
create table if not exists public.flipbooks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text unique not null,
  access_type text check (access_type in ('public', 'lead_gate', 'password')),
  status text default 'ready'
);`}
              </pre>
            </div>
          </section>

          {/* Section 3 */}
          <section id="api-convert" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>3. PDF Conversion Endpoint</span>
            </h2>
            <p>
              Programmatically convert PDFs into 3D interactive flipbooks via <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">POST /api/convert</code>:
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
              <pre className="text-xs text-slate-300">
{`const formData = new FormData();
formData.append('file', pdfBlob, 'quarterly-review.pdf');
formData.append('title', 'Q3 Financial Review');
formData.append('accessType', 'lead_gate');

const response = await fetch('/api/convert', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log('Live publication URL:', \`/d/\${data.flipbook.slug}\`);`}
              </pre>
            </div>
          </section>

          {/* Section 4 */}
          <section id="embed" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              <span>4. Embedding in External Websites</span>
            </h2>
            <p>
              You can easily embed any DocuFlow flipbook into your blog, landing page, or documentation with a responsive iframe:
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto">
              <pre className="text-xs text-slate-300">
{`<iframe
  src="https://zigg.freysa.dev/d/annual-report"
  width="100%"
  height="700px"
  frameborder="0"
  allowfullscreen="true"
  style="border: none; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);"
></iframe>`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
