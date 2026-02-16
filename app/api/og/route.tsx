import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getStatusCounts } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 600; // Revalidate at most every 10 minutes (600 seconds)

export async function GET(request: NextRequest) {
  try {
    // Fetch current status counts
    const counts = await getStatusCounts();

    // Twitter/Open Graph image dimensions: 2400x1260 (2x resolution for better quality)
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F0F7F7',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: '120px',
          }}
        >
          {/* Logo area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              fontSize: '100px',
            }}
          >
            🐾
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '80px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '140px',
                fontWeight: 'bold',
                color: '#1F4D4D',
                textAlign: 'center',
                lineHeight: '1.1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Animal Welfare Tracker
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                color: '#3D7A7A',
                marginTop: '24px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              UK Voters for Animals
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '2000px',
              marginBottom: '80px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '80px',
                backgroundColor: '#D1E0E0',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Completed segment */}
              {counts.completed > 0 && (
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${(counts.completed / counts.total) * 100}%`,
                    backgroundColor: '#6EE7B7',
                  }}
                />
              )}
              {/* On Track segment */}
              {counts.on_track > 0 && (
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    left: `${(counts.completed / counts.total) * 100}%`,
                    width: `${(counts.on_track / counts.total) * 100}%`,
                    backgroundColor: 'rgba(61, 122, 122, 0.3)',
                  }}
                />
              )}
              {/* Off Track segment */}
              {counts.off_track > 0 && (
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    left: `${((counts.completed + counts.on_track) / counts.total) * 100}%`,
                    width: `${(counts.off_track / counts.total) * 100}%`,
                    backgroundColor: 'rgba(220, 38, 38, 0.3)',
                  }}
                />
              )}
            </div>
          </div>

          {/* Three Hero Boxes */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '60px',
              width: '100%',
              maxWidth: '2000px',
              justifyContent: 'center',
            }}
          >
            {/* Completed Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 80px',
                backgroundColor: 'rgba(110, 231, 183, 0.2)',
                borderRadius: '32px',
                border: '4px solid rgba(110, 231, 183, 0.3)',
                minWidth: '560px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1F4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '160px',
                  fontWeight: 'bold',
                  color: '#1F4D4D',
                  marginBottom: '24px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {counts.completed}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#1F4D4D',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Completed
              </div>
            </div>

            {/* On Track Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 80px',
                backgroundColor: 'rgba(61, 122, 122, 0.15)',
                borderRadius: '32px',
                border: '4px solid rgba(61, 122, 122, 0.25)',
                minWidth: '560px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3D7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '160px',
                  fontWeight: 'bold',
                  color: '#3D7A7A',
                  marginBottom: '24px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {counts.on_track}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#3D7A7A',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                On Track
              </div>
            </div>

            {/* Off Track Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 80px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderRadius: '32px',
                border: '4px solid rgba(220, 38, 38, 0.2)',
                minWidth: '560px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: '20px',
                }}
              >
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '160px',
                  fontWeight: 'bold',
                  color: '#DC2626',
                  marginBottom: '24px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {counts.off_track}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#DC2626',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Off Track
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 2400,
        height: 1260,
      }
    );

    const headers = new Headers(imageResponse.headers);
    headers.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400');

    return new Response(imageResponse.body, {
      status: imageResponse.status,
      statusText: imageResponse.statusText,
      headers: headers,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('OG image generation failed:', {
      message: errorMessage,
      stack: errorStack,
    });

    return new Response(
      JSON.stringify({
        error: 'Failed to generate the image',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
