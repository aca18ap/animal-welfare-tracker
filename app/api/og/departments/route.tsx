import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getOwnersWithMoreThanNRecommendations } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 600; // Revalidate at most every 10 minutes

export async function GET(request: NextRequest) {
  try {
    const ownersWithStats = await getOwnersWithMoreThanNRecommendations(1);
    
    // Sort by progress percentage (descending), then by total count (descending)
    const sortedOwners = [...ownersWithStats].sort((a, b) => {
      // First sort by progress percentage (descending)
      if (b.progressPercentage !== a.progressPercentage) {
        return b.progressPercentage - a.progressPercentage;
      }
      // Then by total count (descending)
      return b.statusCounts.total - a.statusCounts.total;
    });
    
    // Get top 3 organizations
    const topThree = sortedOwners.slice(0, 3);

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
            backgroundColor: '#F0F7F7', // teal background
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: '120px',
          }}
        >
          {/* Logo and Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '60px',
            }}
          >
            <div style={{ fontSize: '80px' }}>🐾</div>
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: '600',
                color: '#1F4D4D',
                marginTop: '20px',
              }}
            >
              Animal Welfare Tracker
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: '100px',
              fontWeight: 'bold',
              color: '#1F4D4D',
              textAlign: 'center',
              marginBottom: '80px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Compare Organizations
          </div>

          {/* Top 3 Organizations */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              width: '100%',
              maxWidth: '1800px',
            }}
          >
            {topThree.map((owner, index) => {
              const completed = owner.statusCounts.completed;
              const onTrack = owner.statusCounts.on_track;
              const offTrack = owner.statusCounts.off_track;
              const total = owner.statusCounts.total;
              const completedPercent = total > 0 ? (completed / total) * 100 : 0;
              const onTrackPercent = total > 0 ? (onTrack / total) * 100 : 0;
              const offTrackPercent = total > 0 ? (offTrack / total) * 100 : 0;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '40px',
                    backgroundColor: 'rgba(31, 77, 77, 0.05)',
                    borderRadius: '20px',
                    border: '2px solid rgba(31, 77, 77, 0.1)',
                  }}
                >
                  {/* Owner Name and Total */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#1F4D4D',
                      }}
                    >
                      {owner.owner}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '48px',
                        color: '#6B7280',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                      }}
                    >
                      {total} recs
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      height: '60px',
                      backgroundColor: '#D1E0E0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {completed > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${completedPercent}%`,
                          backgroundColor: '#6EE7B7',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#1F4D4D',
                        }}
                      >
                        {completedPercent > 8 && completed}
                      </div>
                    )}
                    {onTrack > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          top: 0,
                          height: '100%',
                          left: `${completedPercent}%`,
                          width: `${onTrackPercent}%`,
                          backgroundColor: 'rgba(31, 77, 77, 0.3)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#1F4D4D',
                        }}
                      >
                        {onTrackPercent > 8 && onTrack}
                      </div>
                    )}
                    {offTrack > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          top: 0,
                          height: '100%',
                          left: `${completedPercent + onTrackPercent}%`,
                          width: `${offTrackPercent}%`,
                          backgroundColor: 'rgba(220, 38, 38, 0.3)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#DC2626',
                        }}
                      >
                        {offTrackPercent > 8 && offTrack}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

