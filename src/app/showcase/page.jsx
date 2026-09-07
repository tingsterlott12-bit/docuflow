import Link from 'next/link';
import { BookOpen, ExternalLink, Sparkles, ArrowRight, ShieldCheck, Users, Globe } from 'lucide-react';

const SHOWCASE_ITEMS = [
  {
    slug: 'annual-report',
    title: 'Building Real Wealth — Executive Brief 2026',
    category: 'Financial Report',
    pages: 6,
    access: 'Public',
    desc: 'An editorial investment asset allocation roadmap with custom SVG charts and page jumping hotspots.',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'luxury-architecture',
    title: 'Nordic Architectural Forms & Monoliths',
    category: 'Design Lookbook',
    pages: 8,
    access: 'Lead Gate',
    desc: 'Ultra-high-res photography portfolio showcasing contemporary sustainable minimalism.',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'ai-whitepaper',
    title: 'Autonomous Multi-Agent Orchestration Whitepaper',
    category: 'Technical Whitepaper',
    pages: 12,
    access: 'Password Gate',
    desc: 'Confidential engineering guide covering distributed consensus, tool verification, and memory compaction.',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    slug: 'haute-couture',
    title: 'Atelier Spring/Summer Editorial Lookbook',
    category: 'Fashion & Retail',
    pages: 10,
    access: 'Public',
    desc: 'Interactive shopping hotspots with clickable buy buttons linking directly to e-commerce checkouts.',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
  }
];

export default function ShowcasePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Examples</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          FlipBook Showcase Gallery
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Explore production flipbooks across corporate reports, creative lookbooks, scientific journals, and gated whitepapers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SHOWCASE_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold shadow-md">
                  {item.pages} Pages
                </span>
              </div>
            </div>

            <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Access: {item.access}</span>
                </span>

                <Link
                  href={`/d/${item.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold text-xs transition shadow"
                >
                  <span>Launch 3D Reader</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
