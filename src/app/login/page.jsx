'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('password'); // 'password' or 'magic_link'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const supabase = createClient();
    if (!supabase) {
      // Offline / Demo auth fallback
      setTimeout(() => {
        setLoading(false);
        setMessage('Demo Mode: Authenticated successfully! Redirecting…');
        setTimeout(() => router.push('/dashboard'), 800);
      }, 600);
      return;
    }

    try {
      if (mode === 'magic_link') {
        const { error: magicErr } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` }
        });
        if (magicErr) throw magicErr;
        setMessage('Magic sign-in link sent! Check your email inbox.');
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) {
          // Attempt sign up if user not found
          const { error: signUpErr } = await supabase.auth.signUp({
            email,
            password
          });
          if (signUpErr) throw signUpErr;
          setMessage('Account created! Logging in…');
        }
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to DocuFlow
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to upload PDFs, customize 3D flipbooks, and view reader analytics.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 rounded-xl font-medium text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : (
              <>
                <span>{mode === 'password' ? 'Continue with Password' : 'Send Magic Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center space-y-3">
          <button
            type="button"
            onClick={() => setMode(mode === 'password' ? 'magic_link' : 'password')}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 transition"
          >
            {mode === 'password' ? 'Prefer passwordless? Use Magic Link' : 'Prefer password? Switch to Password'}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted with Supabase Auth & JWT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
