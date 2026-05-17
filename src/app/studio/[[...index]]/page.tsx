'use client';

/*
 * Brief §13 — Sanity Studio mounted at /studio for marketing-team CMS edits.
 *
 * Only loads when SANITY_PROJECT_ID is set. Otherwise renders a friendly
 * "studio not configured" placeholder so /studio doesn't 404 in dev.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity/sanity.config';

export const dynamic = 'force-static';

export default function StudioPage() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;

  if (!projectId || projectId === 'placeholder') {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0b',
          color: '#e8eaed',
          fontFamily: 'system-ui, sans-serif',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div>
          <p style={{ fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 4, fontSize: 12, color: '#8a8f97' }}>
            ATHLENCE / Studio
          </p>
          <h1 style={{ marginTop: 16, fontSize: 32, fontWeight: 800 }}>
            Studio not configured.
          </h1>
          <p style={{ marginTop: 12, color: '#c8ccd1', maxWidth: 480 }}>
            Set <code>SANITY_PROJECT_ID</code> and <code>SANITY_DATASET</code> in
            your env to enable Studio. See <code>docs/HANDOVER.md</code>.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}
