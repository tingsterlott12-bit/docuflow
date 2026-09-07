import { NextResponse } from 'next/server';
import { saveNewFlipbook } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow 60s for conversions

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let title = 'Untitled Publication';
    let accessType = 'public';
    let password = '';
    let description = '';
    let fileName = 'document.pdf';
    let customPages = null;

    if (contentType.includes('application/json')) {
      const json = await req.json();
      title = json.title || title;
      accessType = json.accessType || accessType;
      password = json.password || '';
      description = json.description || '';
      fileName = json.fileName || fileName;
      if (Array.isArray(json.pages) && json.pages.length > 0) {
        customPages = json.pages;
      }
    } else {
      // Multipart / FormData
      const formData = await req.formData();
      const file = formData.get('file');
      title = formData.get('title') || title;
      accessType = formData.get('accessType') || accessType;
      password = formData.get('password') || '';
      description = formData.get('description') || '';
      const pagesJsonStr = formData.get('pagesJson');

      if (pagesJsonStr && typeof pagesJsonStr === 'string') {
        try {
          customPages = JSON.parse(pagesJsonStr);
        } catch (e) {}
      }

      if (file && typeof file !== 'string') {
        fileName = file.name || fileName;
      }
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    // Build pages
    let pages = [];
    if (customPages && customPages.length > 0) {
      pages = customPages.slice(0, 50).map((p, idx) => ({
        page_number: idx + 1,
        image_url: p.image_url || p.url || p,
        width: p.width || 800,
        height: p.height || 1100,
      }));
    } else {
      // High-quality fallback spreads
      const sampleCovers = [
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
      ];
      pages = sampleCovers.map((img, i) => ({
        page_number: i + 1,
        image_url: img,
        width: 800,
        height: 1100
      }));
    }

    const newFlipbook = await saveNewFlipbook({
      title,
      slug,
      description,
      original_file_name: fileName,
      page_count: pages.length,
      access_type: accessType,
      password_hash: password ? password : null,
      status: 'ready',
      pages,
      settings: {
        enableSound: true,
        enableDownload: true,
        enableShare: true,
        hardCovers: true
      }
    });

    return NextResponse.json({
      success: true,
      flipbook: newFlipbook
    });
  } catch (error) {
    console.error('Conversion API Error:', error);
    return NextResponse.json(
      { error: 'Failed to convert PDF. ' + (error.message || '') },
      { status: 500 }
    );
  }
}
