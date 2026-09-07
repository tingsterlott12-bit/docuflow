'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileText,
  Lock,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accessType, setAccessType] = useState('public'); // 'public', 'lead_gate', 'password'
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selected);
      setError('');
      if (!title) {
        setTitle(selected.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      if (dropped.type !== 'application/pdf' && !dropped.name.toLowerCase().endsWith('.pdf')) {
        setError('Please drop a valid PDF file.');
        return;
      }
      setFile(dropped);
      setError('');
      if (!title) {
        setTitle(dropped.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '));
      }
    }
  };

  // Convert PDF to high-resolution PNG pages via browser Canvas
  const renderPdfPages = async (pdfFile) => {
    try {
      setStatusMessage('Initializing PDF rendering engine…');
      setUploadProgress(15);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
      
      // Configure worker
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
      }

      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const totalPages = Math.min(pdfDoc.numPages, 50); // 50-page safety cap
      const renderedPages = [];

      for (let i = 1; i <= totalPages; i++) {
        setStatusMessage(`Rendering page ${i} of ${totalPages}…`);
        setUploadProgress(Math.round(20 + (i / totalPages) * 60));

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL('image/png', 0.85);
        renderedPages.push({
          page_number: i,
          image_url: dataUrl,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        });
      }

      return renderedPages;
    } catch (err) {
      console.warn('Browser-side PDF canvas rendering fallback:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a publication title.');
      return;
    }

    setIsUploading(true);
    setError('');
    setStatusMessage('Reading PDF binary stream…');
    setUploadProgress(10);

    try {
      // 1. Attempt client-side canvas rendering for ultra-crisp real PDF pages
      const renderedPages = await renderPdfPages(file);

      setStatusMessage('Finalizing publication and saving settings…');
      setUploadProgress(90);

      // 2. Transmit to backend
      const payload = {
        title: title.trim(),
        description: description.trim(),
        accessType,
        password: accessType === 'password' ? password : null,
        fileName: file.name,
        pages: renderedPages,
      };

      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to convert document.');
      }

      setUploadProgress(100);
      setStatusMessage('Publication ready! Launching 3D reader…');

      // Also persist to localStorage for fast local access
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('docuflow_local_books') || '[]');
          stored.unshift(data.flipbook);
          localStorage.setItem('docuflow_local_books', JSON.stringify(stored));
        } catch (e) {}
      }

      setTimeout(() => {
        router.push(`/d/${data.flipbook.slug}`);
      }, 600);
    } catch (err) {
      console.error('Upload Error:', err);
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PDF to 3D FlipBook Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Interactive Publication
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload your document. We render high-resolution vector pages, build 3D bindings, and configure access controls.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
              file
                ? 'border-brand-500 bg-brand-50/50'
                : 'border-slate-300 hover:border-brand-500 hover:bg-slate-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2 text-brand-700">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-900">{file.name}</span>
                <span className="text-xs text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · Click or drag to replace
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm text-slate-800">
                  Click to upload or drag & drop PDF
                </span>
                <span className="text-xs text-slate-400">
                  PDF documents up to 50MB and 50 pages supported
                </span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Publication Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2026 Wealth & Investment Strategy Report"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary for reader preview and social shares…"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Access Control & Gating */}
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Access Control & Gating
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setAccessType('public')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  accessType === 'public'
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Globe className={`w-5 h-5 ${accessType === 'public' ? 'text-brand-600' : 'text-slate-500'}`} />
                  {accessType === 'public' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Public</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Instant access for any reader</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccessType('lead_gate')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  accessType === 'lead_gate'
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className={`w-5 h-5 ${accessType === 'lead_gate' ? 'text-brand-600' : 'text-slate-500'}`} />
                  {accessType === 'lead_gate' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Lead Gate</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Collect email & company before viewing</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccessType('password')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  accessType === 'password'
                    ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Lock className={`w-5 h-5 ${accessType === 'password' ? 'text-brand-600' : 'text-slate-500'}`} />
                  {accessType === 'password' && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Password Gate</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Require secret passcode</div>
                </div>
              </button>
            </div>

            {accessType === 'password' && (
              <div className="pt-2">
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set Document Passcode (e.g. VIP2026)"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{statusMessage || `Processing PDF (${uploadProgress}%)…`}</span>
              </div>
            ) : (
              <>
                <span>Generate 3D FlipBook</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
