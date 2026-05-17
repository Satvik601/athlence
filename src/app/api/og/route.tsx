import { ImageResponse } from 'next/og';

/*
 * Brief §11 — OG/Twitter card sized 1200×630, dark cinematic, BLAZE can centred,
 * ATHLENCE wordmark prominent so the hierarchy reads even at thumbnail size.
 *
 * Pure JSX → ImageResponse. No external assets so it renders even with zero env.
 */
export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(60% 70% at 50% 45%, #1a1a1f 0%, #0a0a0b 70%, #000 100%)',
          color: '#e8eaed',
          position: 'relative',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row — ATHLENCE wordmark + caption (hierarchy) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 32,
              letterSpacing: 6,
              fontWeight: 800,
              color: '#e8eaed',
            }}
          >
            ATHLENCE
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              color: '#8a8f97',
              textTransform: 'uppercase',
            }}
          >
            The Movement
          </div>
        </div>

        {/* Centre — can stand-in (SVG drawn with divs) + headline */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 80,
          }}
        >
          {/* Can */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 180,
              height: 380,
              borderRadius: '24px 24px 18px 18px',
              background:
                'linear-gradient(180deg, #c8ccd1 0%, #8a8f97 35%, #1a1a1f 36%, #1a1a1f 64%, #c8ccd1 65%, #8a8f97 100%)',
              boxShadow: '0 30px 80px rgba(225, 29, 42, 0.25)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '36%',
                left: 0,
                right: 0,
                height: '28%',
                background:
                  'linear-gradient(180deg, #E11D2A 0%, #b21420 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: 6,
              }}
            >
              BLAZE
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 580,
            }}
          >
            <div
              style={{
                fontSize: 88,
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: -2,
                color: '#e8eaed',
                textTransform: 'uppercase',
              }}
            >
              Built for
              <br />
              Movement.
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: 22,
                lineHeight: 1.4,
                color: '#c8ccd1',
              }}
            >
              ATHLENCE is the movement. BLAZE is the first product powering
              it.
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            color: '#8a8f97',
            fontSize: 18,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 10,
                height: 10,
                background: '#E11D2A',
                borderRadius: 999,
              }}
            />
            Energy for the obsessed
          </div>
          <div>athlence.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
