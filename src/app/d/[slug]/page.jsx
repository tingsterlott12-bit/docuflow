'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Home, BookOpen, Sparkles } from 'lucide-react';
import { getFlipbookBySlug } from '@/lib/dataStore';
import FlipBookViewer from '@/components/FlipBookViewer';
import LeadGateModal from '@/components/LeadGateModal';
import PasswordGateModal from '@/components/PasswordGateModal';

export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [flipbook, setFlipbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGated, setIsGated] = useState(false);
  const [gateType, setGateType] = useState(null); // 'lead_gate' | 'password' | null

  useEffect(() => {
    async function loadDoc() {
      if (!slug) return;
      setLoading(true);

      let doc = await getFlipbookBySlug(slug);

      // Also check client-side localStorage fallback for user-created books
      if (!doc && typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('docuflow_local_books') || '[]');
          doc = stored.find((b) => b.slug === slug || b.id === slug) || null;
        } catch (e) {}
      }

      if (!doc) {
        setFlipbook(null);
        setLoading(false);
        return;
      }

      setFlipbook(doc);

      // Check gating
      if (doc.access_type === 'lead_gate') {
        const unlocked = sessionStorage.getItem(`lead_unlocked_${window.location.pathname}`);
        if (!unlocked) {
          setIsGated(true);
          setGateType('lead_gate');
        }
      } else if (doc.access_type === 'password') {
        const unlocked = sessionStorage.getItem(`pwd_unlocked_${window.location.pathname}`);
        if (!unlocked) {
          setIsGated(true);
          setGateType('password');
        }
      }

      // Track view event
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flipbook_id: doc.id,
            event_type: 'view',
            page_number: 1,
          })
        });
      } catch (e) {}

      setLoading(false);
    }

    loadDoc();
  }, [slug]);

  const handleTrackEvent = (eventData) => {
    if (!flipbook) return;
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flipbook_id: flipbook.id,
          ...eventData,
        })
      });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">Loading 3D Publication…</span>
      </div>
    );
  }

  if (!flipbook) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 text-white">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Publication Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The flipbook you are trying to view does not exist or may have been removed.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden relative">
      {/* Lead Gate Modal */}
      {isGated && gateType === 'lead_gate' && (
        <LeadGateModal
          flipbookTitle={flipbook.title}
          config={flipbook.lead_gate_config || {}}
          onUnlock={() => setIsGated(false)}
        />
      )}

      {/* Password Gate Modal */}
      {isGated && gateType === 'password' && (
        <PasswordGateModal
          flipbookTitle={flipbook.title}
          onUnlock={(enteredPwd) => {
            // Check password
            if (!flipbook.password_hash || enteredPwd === flipbook.password_hash) {
              setIsGated(false);
            } else {
              alert('Incorrect passcode');
            }
          }}
        />
      )}

      {/* 3D FlipBook Viewer */}
      <FlipBookViewer flipbook={flipbook} onTrackEvent={handleTrackEvent} />
    </div>
  );
}
