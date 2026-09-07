'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Share2,
  Volume2,
  VolumeX,
  Home,
  BookOpen,
  Layers,
  Calculator,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import WorksheetDrawer from './WorksheetDrawer';

export default function FlipBookViewer({ flipbook, onTrackEvent }) {
  const containerRef = useRef(null);
  const bookRef = useRef(null);
  const pageFlipInstance = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(flipbook.pages?.length || 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Embedded Interactive Worksheet State
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [worksheetInitialTab, setWorksheetInitialTab] = useState('networth');

  // Synthesize realistic subtle paper flip sound via Web Audio API
  const playFlipSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'pink';
      // Pink noise burst simulation
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }, [soundEnabled]);

  // Handle URL hash deep linking #page=N
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#page=')) {
        const pNum = parseInt(hash.replace('#page=', ''), 10);
        if (!isNaN(pNum) && pageFlipInstance.current) {
          pageFlipInstance.current.flip(pNum - 1);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Initialize PageFlip instance
  useEffect(() => {
    let isMounted = true;

    async function initPageFlip() {
      if (!bookRef.current) return;
      const { PageFlip } = await import('page-flip');

      if (!isMounted || !bookRef.current) return;

      const width = window.innerWidth < 768 ? Math.min(window.innerWidth - 32, 420) : 500;
      const height = window.innerWidth < 768 ? Math.floor(width * 1.4) : 700;

      const pageFlip = new PageFlip(bookRef.current, {
        width,
        height,
        size: 'stretch',
        minWidth: 320,
        maxWidth: 1000,
        minHeight: 450,
        maxHeight: 1400,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: true,
        drawShadow: true,
        flippingTime: 700,
        usePortrait: window.innerWidth < 768,
        startPage: 0
      });

      pageFlipInstance.current = pageFlip;
      const htmlPages = bookRef.current.querySelectorAll('.page');
      if (htmlPages.length > 0) {
        pageFlip.loadFromHTML(htmlPages);
      }

      pageFlip.on('flip', (e) => {
        const pageIdx = e.data;
        setCurrentPage(pageIdx);
        window.history.replaceState(null, '', `#page=${pageIdx + 1}`);
        playFlipSound();

        if (onTrackEvent) {
          onTrackEvent({
            event_type: 'page_turn',
            page_number: pageIdx + 1
          });
        }
      });

      pageFlip.on('init', () => {
        setIsLoaded(true);
        if (window.location.hash.startsWith('#page=')) {
          const p = parseInt(window.location.hash.replace('#page=', ''), 10);
          if (!isNaN(p) && p > 0) {
            pageFlip.flip(p - 1);
          }
        }
      });
    }

    initPageFlip();

    return () => {
      isMounted = false;
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch (e) {}
      }
    };
  }, [flipbook, playFlipSound, onTrackEvent]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        pageFlipInstance.current?.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        pageFlipInstance.current?.flipPrev();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'w') {
        setIsWorksheetOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const flipPrev = () => pageFlipInstance.current?.flipPrev();
  const flipNext = () => pageFlipInstance.current?.flipNext();
  const flipTo = (pageIndex) => pageFlipInstance.current?.flip(pageIndex);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link to current page copied to clipboard!');
    }
  };

  const openWorksheet = (tabKey = 'networth') => {
    setWorksheetInitialTab(tabKey);
    setIsWorksheetOpen(true);
  };

  const pages = flipbook.pages || [];
  const hotspots = flipbook.hotspots || [];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between overflow-hidden select-none ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      {/* Top Floating Action Bar */}
      <div className="z-30 w-full px-4 py-3 flex items-center justify-between bg-slate-950/70 backdrop-blur-md border-b border-white/10 text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-300 hover:text-white"
            title="Back to Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white tracking-tight truncate max-w-[160px] sm:max-w-md">
              {flipbook.title}
            </h1>
            <span className="text-[11px] text-slate-400">
              Page {currentPage + 1} of {pages.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Worksheets Trigger Button */}
          <button
            onClick={() => openWorksheet('networth')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition border border-brand-400/30 animate-pulse hover:animate-none"
            title="Open Interactive Financial Worksheets (W)"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Worksheet Studio</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition text-slate-300 hover:text-white ${
              soundEnabled ? 'bg-white/10 hover:bg-white/20' : 'bg-red-500/20 text-red-400'
            }`}
            title={soundEnabled ? 'Mute Page Turn Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg transition text-slate-300 hover:text-white ${
              showThumbnails ? 'bg-brand-600 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
            title="Thumbnails Overview"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-300 hover:text-white"
            title="Share Deep Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-slate-300 hover:text-white"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Flipbook Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Navigation Arrow Left */}
        <button
          onClick={flipPrev}
          disabled={currentPage === 0}
          className="absolute left-2 sm:left-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white backdrop-blur-md flex items-center justify-center transition border border-white/10 disabled:opacity-20 disabled:pointer-events-none shadow-2xl"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The PageFlip DOM Holder */}
        <div className="flipbook-container" style={{ transform: `scale(${zoomLevel})` }}>
          <div ref={bookRef} className="st-page-flip shadow-2xl rounded-sm">
            {pages.map((p, idx) => {
              const isCover = idx === 0 || idx === pages.length - 1;
              const pageHotspots = hotspots.filter((h) => h.page_number === p.page_number);

              return (
                <div
                  key={idx}
                  className={`page ${isCover ? 'page-hard' : ''}`}
                  data-density={isCover ? 'hard' : 'soft'}
                >
                  <div className="page-content relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url}
                      alt={`Page ${p.page_number}`}
                      className="page-image"
                      loading={idx < 4 ? 'eager' : 'lazy'}
                    />

                    {/* Hotspot Overlays */}
                    {pageHotspots.map((h, hi) => (
                      <div
                        key={hi}
                        onClick={() => {
                          if (h.type === 'worksheet') {
                            openWorksheet(h.payload);
                          } else if (h.type === 'page_jump') {
                            const target = parseInt(h.payload, 10);
                            if (!isNaN(target)) flipTo(target - 1);
                          } else if (h.type === 'link') {
                            window.open(h.payload, '_blank');
                          }
                        }}
                        style={{
                          left: `${h.x_pct}%`,
                          top: `${h.y_pct}%`,
                          width: `${h.width_pct}%`,
                          height: `${h.height_pct}%`,
                        }}
                        className="absolute z-10 border-2 border-brand-400 bg-brand-500/25 hover:bg-brand-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-center shadow-lg group backdrop-blur-[2px]"
                        title={h.title || 'Interactive tool'}
                      >
                        <span className="text-[11px] font-bold text-white bg-slate-900/90 px-2 py-1 rounded-lg shadow-md border border-white/20 transition flex items-center gap-1.5">
                          <span>{h.title || 'Click to calculate'}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={flipNext}
          disabled={currentPage >= pages.length - 1}
          className="absolute right-2 sm:right-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white backdrop-blur-md flex items-center justify-center transition border border-white/10 disabled:opacity-20 disabled:pointer-events-none shadow-2xl"
          aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails Drawer Overlay */}
      {showThumbnails && (
        <div className="z-30 w-full bg-slate-950/95 backdrop-blur-lg border-t border-white/10 p-3 overflow-x-auto flex gap-3 items-center">
          {pages.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                flipTo(idx);
                setShowThumbnails(false);
              }}
              className={`relative flex-shrink-0 w-20 h-28 rounded-md overflow-hidden border-2 transition ${
                currentPage === idx ? 'border-brand-500 ring-2 ring-brand-500/50' : 'border-white/20 opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image_url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] font-medium text-white text-center py-0.5">
                {idx + 1}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Progress Bar & Zoom Controls */}
      <div className="z-30 w-full px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-1.5 rounded hover:bg-white/10 transition text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-slate-400">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 rounded hover:bg-white/10 transition text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrubber / Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-300"
              style={{
                width: `${pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <button
            onClick={() => openWorksheet('networth')}
            className="hover:text-brand-400 transition flex items-center gap-1"
          >
            <Calculator className="w-3.5 h-3.5 text-brand-500" />
            <span className="hidden sm:inline">Worksheets</span>
          </button>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {currentPage + 1} / {pages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Embedded Worksheet Drawer */}
      <WorksheetDrawer
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        initialTab={worksheetInitialTab}
      />
    </div>
  );
}
