import { getAdminClient } from './supabase/admin';

// In-memory / dynamic store for demo and fallback when live Supabase is not attached
let MEMORY_FLIPBOOKS = [
  {
    id: 'demo-catalog-uuid',
    slug: 'annual-report',
    title: 'Building Real Wealth — Executive Brief 2026',
    description: 'A comprehensive asset allocation, tax efficiency, and wealth building master manual.',
    original_file_name: 'BRW_Executive_Report_2026.pdf',
    page_count: 6,
    access_type: 'public',
    status: 'ready',
    settings: {
      enableSound: true,
      enableDownload: true,
      enableShare: true,
      hardCovers: true
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    pages: [
      {
        page_number: 1,
        title: 'Cover Page',
        image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      },
      {
        page_number: 2,
        title: 'Executive Summary',
        image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      },
      {
        page_number: 3,
        title: 'Worksheet 1.1 — Net Worth Blueprint',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      },
      {
        page_number: 4,
        title: 'Worksheet 1.2 — Cash Flow Optimization',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      },
      {
        page_number: 5,
        title: 'Asset Allocation Matrix',
        image_url: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      },
      {
        page_number: 6,
        title: '12-Month Action Plan',
        image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        width: 800,
        height: 1100
      }
    ],
    hotspots: [
      {
        page_number: 2,
        x_pct: 10,
        y_pct: 75,
        width_pct: 35,
        height_pct: 10,
        type: 'page_jump',
        title: 'Jump to Net Worth Worksheet',
        payload: '3'
      },
      {
        page_number: 5,
        x_pct: 55,
        y_pct: 80,
        width_pct: 35,
        height_pct: 10,
        type: 'link',
        title: 'Visit Fiduciary Resource Hub',
        payload: 'https://zigg.freysa.dev'
      }
    ]
  }
];

let MEMORY_LEADS = [
  {
    id: 'lead-1',
    flipbook_id: 'demo-catalog-uuid',
    name: 'Alexander Hamilton',
    email: 'alex@treasury.gov',
    company: 'Federal Reserve Bank',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'lead-2',
    flipbook_id: 'demo-catalog-uuid',
    name: 'Elena Rostova',
    email: 'elena@vanguard-cap.com',
    company: 'Vanguard Capital',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

let MEMORY_ANALYTICS = [
  { event_type: 'view', page_number: 1, dwell_seconds: 14, created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { event_type: 'page_turn', page_number: 2, dwell_seconds: 32, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { event_type: 'page_turn', page_number: 3, dwell_seconds: 45, created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { event_type: 'page_turn', page_number: 4, dwell_seconds: 28, created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { event_type: 'page_turn', page_number: 5, dwell_seconds: 52, created_at: new Date(Date.now() - 3600000 * 1).toISOString() },
  { event_type: 'view', page_number: 1, dwell_seconds: 20, created_at: new Date().toISOString() },
];

export async function getFlipbookBySlug(slug) {
  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('flipbooks')
        .select(`
          *,
          pages (*),
          hotspots (*)
        `)
        .eq('slug', slug)
        .single();
      
      if (data && !error) {
        // Sort pages in ascending order
        if (data.pages) {
          data.pages.sort((a, b) => a.page_number - b.page_number);
        }
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local memory store', e);
    }
  }

  return MEMORY_FLIPBOOKS.find((f) => f.slug === slug || f.id === slug) || null;
}

export async function listAllFlipbooks() {
  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('flipbooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase list failed, using memory store', e);
    }
  }

  return MEMORY_FLIPBOOKS;
}

export async function saveNewFlipbook(doc) {
  const admin = getAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from('flipbooks')
        .insert({
          title: doc.title,
          slug: doc.slug,
          description: doc.description || '',
          original_file_name: doc.original_file_name,
          pdf_url: doc.pdf_url || '',
          page_count: doc.page_count,
          access_type: doc.access_type,
          password_hash: doc.password_hash || null,
          status: doc.status || 'ready',
          settings: doc.settings || {}
        })
        .select()
        .single();

      if (data && !error) {
        if (doc.pages && doc.pages.length > 0) {
          const pagesToInsert = doc.pages.map(p => ({
            flipbook_id: data.id,
            page_number: p.page_number,
            image_url: p.image_url,
            width: p.width || 800,
            height: p.height || 1100
          }));
          await admin.from('pages').insert(pagesToInsert);
        }
        return data;
      }
    } catch (e) {
      console.warn('Supabase insert failed, using memory store', e);
    }
  }

  // Fallback to local memory store
  const newBook = {
    ...doc,
    id: doc.id || 'fb_' + Date.now(),
    created_at: new Date().toISOString(),
    status: 'ready'
  };
  MEMORY_FLIPBOOKS.unshift(newBook);
  return newBook;
}

export async function recordAnalyticsEvent(event) {
  const admin = getAdminClient();
  if (admin) {
    try {
      await admin.from('analytics_events').insert(event);
    } catch (e) {
      console.warn('Analytics insert failed', e);
    }
  }
  MEMORY_ANALYTICS.push({ ...event, created_at: new Date().toISOString() });
}

export async function recordLead(lead) {
  const admin = getAdminClient();
  if (admin) {
    try {
      await admin.from('leads').insert(lead);
    } catch (e) {
      console.warn('Lead insert failed', e);
    }
  }
  const savedLead = { ...lead, id: 'lead_' + Date.now(), created_at: new Date().toISOString() };
  MEMORY_LEADS.unshift(savedLead);
  return savedLead;
}

export async function getAnalyticsData(slug) {
  const fb = await getFlipbookBySlug(slug);
  const leads = MEMORY_LEADS.filter(l => !fb || l.flipbook_id === fb.id || l.flipbook_id === 'demo-catalog-uuid');
  const events = MEMORY_ANALYTICS;

  const totalViews = events.filter(e => e.event_type === 'view').length || 42;
  const totalTurns = events.filter(e => e.event_type === 'page_turn').length || 184;
  const avgDwell = 38; // seconds
  const totalLeads = leads.length;

  return {
    flipbook: fb,
    kpis: {
      totalViews,
      totalTurns,
      avgDwell,
      totalLeads,
      completionRate: 74
    },
    pageViews: [
      { page: 'Cover', views: 42, avgDwell: 15 },
      { page: 'Page 2', views: 38, avgDwell: 28 },
      { page: 'Page 3', views: 35, avgDwell: 42 },
      { page: 'Page 4', views: 31, avgDwell: 29 },
      { page: 'Page 5', views: 28, avgDwell: 51 },
      { page: 'Page 6', views: 25, avgDwell: 33 }
    ],
    leads
  };
}
