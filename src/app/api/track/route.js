import { NextResponse } from 'next/server';
import { recordAnalyticsEvent, recordLead } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const { event_type, flipbook_id, session_id, page_number, dwell_seconds, name, email, company } = body;

    if (event_type === 'lead_submit') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }
      const lead = await recordLead({
        flipbook_id: flipbook_id || 'demo-catalog-uuid',
        name,
        email,
        company,
        session_id: session_id || 'sess_' + Math.random().toString(36).substring(2, 9)
      });
      return NextResponse.json({ success: true, lead });
    }

    await recordAnalyticsEvent({
      flipbook_id: flipbook_id || 'demo-catalog-uuid',
      session_id: session_id || 'sess_' + Math.random().toString(36).substring(2, 9),
      event_type: event_type || 'view',
      page_number: page_number || 1,
      dwell_seconds: dwell_seconds || 0,
      referrer: req.headers.get('referer') || '',
      user_agent: req.headers.get('user-agent') || ''
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Analytics Track Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
