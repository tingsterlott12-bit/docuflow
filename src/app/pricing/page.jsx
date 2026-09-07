import Link from 'next/link';
import { Check, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Community',
    price: '$0',
    frequency: 'forever / open-source',
    desc: 'Self-host on your own infrastructure or deploy directly with Supabase.',
    features: [
      'Unlimited flipbook conversions',
      '3D page-flip physics engine',
      'Lead gate & password protection',
      'Basic analytics & telemetry',
      'Self-hosted Supabase RLS & storage',
      'Community GitHub support'
    ],
    cta: 'Deploy Free',
    href: '/upload',
    featured: false
  },
  {
    name: 'Pro Cloud',
    price: '$29',
    frequency: 'per month',
    desc: 'Managed cloud hosting, ultra-fast CDN delivery, and priority processing.',
    features: [
      'Everything in Community',
      'Managed cloud infrastructure',
      'Unlimited leads capture & CSV export',
      'Custom domains & brand white-labeling',
      'Clickable hotspot overlays (links, video)',
      'Real-time page dropoff heatmaps',
      'Priority email support'
    ],
    cta: 'Start 14-Day Free Trial',
    href: '/upload',
    featured: true
  },
  {
    name: 'Enterprise',
    price: '$99',
    frequency: 'per month',
    desc: 'Dedicated clusters, SLA guarantees, SSO/SAML auth, and custom integrations.',
    features: [
      'Everything in Pro Cloud',
      'SOC2 / GDPR compliance guarantee',
      'SSO / SAML / Okta integration',
      'Custom DRM & watermarking',
      'Dedicated Slack channel & support engineer',
      'Custom high-volume API quotas'
    ],
    cta: 'Contact Sales',
    href: '/upload',
    featured: false
  }
];

const FAQS = [
  {
    q: 'How does DocuFlow compare to commercial flipbook tools?',
    a: 'DocuFlow is 100% open-source with zero commercial SDK dependencies. You maintain full ownership of your documents, reader data, and backend storage without exorbitant monthly viewer fees.'
  },
  {
    q: 'Are mobile devices and touch gestures supported?',
    a: 'Yes. DocuFlow leverages responsive portrait & landscape orientation switching, touch-drag page turning, and pinch-to-zoom.'
  },
  {
    q: 'How do Lead Gates work?',
    a: 'When enabled on a flipbook, readers are presented with an elegant modal requiring their work email and company name before opening the pages. Leads are logged in real-time with CSV export.'
  },
  {
    q: 'Can I link directly to a specific page?',
    a: 'Yes. Every page automatically updates the URL hash (e.g. #page=4). Sharing that link will open the flipbook directly to that specific spread.'
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Simple, Predictable Plans
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Deploy the open-source platform on your own stack or let us handle hosting, CDN, and high-speed conversions.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
              p.featured
                ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-brand-500 scale-105'
                : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xl">{p.name}</h3>
                {p.featured && (
                  <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
              </div>

              <div>
                <span className="text-4xl font-black">{p.price}</span>
                <span className={`text-xs ml-2 ${p.featured ? 'text-slate-400' : 'text-slate-500'}`}>
                  / {p.frequency}
                </span>
              </div>

              <p className={`text-xs leading-relaxed ${p.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                {p.desc}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-200/20">
                {p.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2.5 text-xs">
                    <Check className={`w-4 h-4 flex-shrink-0 ${p.featured ? 'text-brand-400' : 'text-emerald-600'}`} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={p.href}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  p.featured
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Got questions about self-hosting or embedding flipbooks? We have answers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
