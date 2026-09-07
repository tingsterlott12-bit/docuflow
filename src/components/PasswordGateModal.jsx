'use client';

import React, { useState } from 'react';
import { KeyRound, Lock, ArrowRight } from 'lucide-react';

export default function PasswordGateModal({ flipbookTitle, onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the document password.');
      return;
    }

    setIsVerifying(true);
    // Simple verification simulation & session storage persistence
    setTimeout(() => {
      sessionStorage.setItem(`pwd_unlocked_${window.location.pathname}`, 'true');
      onUnlock(password);
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-center">
        <div className="bg-gradient-to-tr from-slate-900 to-slate-800 p-6 text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-brand-400" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Protected Publication</h2>
          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{flipbookTitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            This document is password protected. Enter the passcode provided by the author to proceed.
          </p>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-center tracking-widest font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow transition flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <span>Verifying…</span>
            ) : (
              <>
                <span>Unlock Publication</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
