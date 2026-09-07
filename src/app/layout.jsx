import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'DocuFlow — World-Class Open-Source FlipBook Platform',
  description: 'Transform static PDFs into stunning, interactive 3D flipbooks with access controls, lead gates, and deep analytics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} DocuFlow Inc. Open-source publication technology.</p>
            <div className="flex items-center gap-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition">GitHub</a>
              <a href="/d/annual-report" className="hover:text-slate-900 transition">Sample FlipBook</a>
              <a href="/upload" className="hover:text-slate-900 transition">Quick Upload</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
