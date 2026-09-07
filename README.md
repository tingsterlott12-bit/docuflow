---
title: DocuFlow — 3D FlipBook Platform
emoji: 📖
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 3000
pinned: false
license: mit
---

# DocuFlow — World-Class Open-Source FlipBook Platform

DocuFlow is a production-grade, zero-commercial-dependency flipbook platform built with **Next.js 14 (App Router)**, **Tailwind CSS**, **StPageFlip / page-flip**, and **Supabase (Auth, Postgres RLS, Storage)**.

---

## What was solved in this platform

| Area | Solution |
|---|---|
| **Frontend** | Modern Next.js 14 App Router + Tailwind + Lucide — dropzone PDF upload, responsive reader UI, dark mode viewer |
| **3D Flip Engine** | Full StPageFlip wrapper: toolbar (prev/next, zoom, fullscreen, share), keyboard arrows + `F`, `#page=N` deep links, progress bar, interactive hotspots, mobile swipe |
| **Access Control** | **Public** · **Lead Gate** (name / email / company capture) · **Password Gate** (passcode unlock with session persistence) |
| **Backend & APIs** | `/api/convert` (dual format JSON & multipart PDF conversion with 50-page safety cap) & `/api/track` (real-time telemetry & lead collection) |
| **Analytics Dashboard** | Live KPI cards (Views, Page Turns, Avg Dwell, Leads, Completion rate), reader engagement dropoff bar chart, leads table + CSV export |
| **Database & Security**| Supabase schema with complete Row Level Security (RLS), indexes, storage bucket policies, `updated_at` triggers |
| **Testing** | Automated Playwright end-to-end test suite for desktop and mobile viewports |

---

## Quick Start

### 1. Install Dependencies
```bash
cd docuflow
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env.local
```
Add your Supabase URL, Anon Key, and Service Role Key to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

### 3. Run Supabase Database Schema
Execute the SQL script in `supabase/schema.sql` inside your **Supabase SQL Editor** to create the tables, RLS policies, indexes, and storage bucket.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Deploying to GitHub & Hugging Face Spaces

### Deploy to Hugging Face Spaces
1. Create a new Space on [huggingface.co/new-space](https://huggingface.co/new-space).
2. Select **Docker** as the Space SDK.
3. Push this repository to your Hugging Face Space Git remote:
```bash
git remote add space https://huggingface.co/spaces/YOUR_USERNAME/docuflow
git push -u space main
```

### Deploy to GitHub / Vercel
1. Create a new repository on [github.com/new](https://github.com/new).
2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/docuflow.git
git branch -M main
git push -u origin main
```
3. Import the GitHub repo into **Vercel** or **Netlify** with one click.

---

## Running Automated E2E Tests

```bash
npx playwright install chromium
npm run test:e2e
```

---

## Production Build

```bash
npm run build
npm run start
```
Ready for immediate zero-config deployment to Vercel, Netlify, Docker, or self-hosted Node.js servers.
