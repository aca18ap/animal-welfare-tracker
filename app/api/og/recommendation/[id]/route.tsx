import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getRecommendationById, getChapters } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 600; // Revalidate at most every 10 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recommendation = await getRecommendationById(parseInt(id));
    
    if (!recommendation) {
      return new Response('Recommendation not found', { status: 404 });
    }

    const chapters = await getChapters();
    const chapter = chapters.find(c => c.id === recommendation.chapter_id);
    
    const statusLabel = recommendation.overall_status.status === 'completed' ? 'Completed' :
                       recommendation.overall_status.status === 'on_track' ? 'On Track' :
                       recommendation.overall_status.status === 'off_track' ? 'Off Track' :
                       'Not Started';

    const statusColor = recommendation.overall_status.status === 'completed' ? '#6EE7B7' :
                       recommendation.overall_status.status === 'on_track' ? '#1F4D4D' :
                       recommendation.overall_status.status === 'off_track' ? '#DC2626' :
                       '#6B7280';

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F0F7F7', // teal background
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: '80px',
          }}
        >
          {/* Logo and Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: '40px',
            }}
          >
            <div style={{ fontSize: '60px' }}>🐾</div>
            <div
              style={{
                display: 'flex',
                fontSize: '36px',
                fontWeight: '600',
                color: '#0B4938',
                marginTop: '12px',
              }}
            >
              Nuclear Taskforce Tracker
            </div>
          </div>

          {/* Header with Code and Status */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '80px',
                fontWeight: 'bold',
                color: '#0B4938',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              }}
            >
              {recommendation.code}
            </div>
            <div
              style={{
                display: 'flex',
                padding: '30px 60px',
                backgroundColor: statusColor,
                borderRadius: '16px',
                fontSize: '80px',
                fontWeight: 'bold',
                color: recommendation.overall_status.status === 'completed' ? '#0B4938' : '#FFFFFF',
              }}
            >
              {statusLabel}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: '96px',
              fontWeight: 'bold',
              color: '#0B4938',
              marginBottom: '40px',
              lineHeight: '1.2',
            }}
          >
            {recommendation.titles.short}
          </div>

          {/* Chapter Info */}
          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              color: '#6B7280',
              marginBottom: '60px',
            }}
          >
            Chapter {recommendation.chapter_id}: {chapter?.title || `Chapter ${recommendation.chapter_id}`}
          </div>

          {/* Owner */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '40px',
                color: '#6B7280',
              }}
            >
              Owner:
            </div>
            <div
              style={{
                display: 'flex',
                padding: '16px 32px',
                backgroundColor: '#E5DFD0',
                borderRadius: '12px',
                fontSize: '40px',
                fontWeight: '600',
                color: '#0B4938',
              }}
            >
              {recommendation.ownership.primary_owner}
              {recommendation.ownership.co_owners && recommendation.ownership.co_owners.length > 0 && (
                <span style={{ marginLeft: '12px', color: '#6B7280' }}>
                  +{recommendation.ownership.co_owners.length}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              marginTop: 'auto',
              fontSize: '36px',
              color: '#6B7280',
            }}
          >
            Nuclear Taskforce Tracker
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
    console.error('OG image generation failed:', errorMessage);
    
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

