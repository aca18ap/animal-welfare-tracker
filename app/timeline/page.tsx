import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Disclaimer } from '@/components/shared';
import { TimelineHeaderControlsWrapper } from './timeline-header-controls-wrapper';
import { TimelinePageClient } from './timeline-page-client';
import { TimelineViewProvider } from './timeline-view-context';
import { getTimelineItems } from '@/lib/data';
import { generateTimelineGrid } from '@/lib/timeline-grid';
import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  let timelineItems;
  try {
    timelineItems = await getTimelineItems(true);
  } catch (error) {
    // Fallback metadata if data loading fails
    return {
      title: 'Timeline | Animal Welfare Tracker',
      description: 'Track all updates and developments on animal welfare commitments.',
    };
  }

  return {
    title: 'Timeline | Animal Welfare Tracker',
    description: `Track all ${timelineItems.length} updates and developments on animal welfare commitments. Chronological view of status changes, announcements, and deadlines.`,
    openGraph: {
      title: 'Timeline | Animal Welfare Tracker',
      description: `Track all updates and developments on animal welfare commitments. ${timelineItems.length} timeline items.`,
      type: "website",
      url: "/timeline",
      siteName: "Animal Welfare Tracker",
      images: [
        {
          url: "/icon_dark.svg",
          width: 400,
          height: 400,
          alt: "Animal Welfare Tracker Timeline",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Timeline | Animal Welfare Tracker",
      description: `Track all updates on animal welfare commitments. ${timelineItems.length} timeline items.`,
      images: [
        {
          url: "/icon_dark.svg",
          alt: "Animal Welfare Tracker Timeline",
        },
      ],
      ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
      ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
    },
    alternates: {
      canonical: "/timeline",
    },
  };
}

export default async function TimelinePage() {
  let timelineItems;
  let gridData;
  try {
    [timelineItems, gridData] = await Promise.all([
      getTimelineItems(true),
      generateTimelineGrid(52, 4), // 52 weeks ahead, 4 weeks back
    ]);
  } catch (error) {
    console.error('Failed to load timeline data:', error);
    throw new Error('Failed to load timeline data. Please try again later.');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<div className="container py-8">Loading timeline...</div>}>
          <TimelineViewProvider>
          {/* Hero */}
          <section className="bg-gradient-to-b from-beige to-background py-12">
            <div className="container">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-green">
                    Timeline
                  </h1>
                </div>
                <TimelineHeaderControlsWrapper />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Track all developments, announcements, status changes, and upcoming deadlines 
                across animal welfare commitments.
              </p>
            </div>
          </section>

          {/* Timeline Content */}
          <section className="container py-8">
            <div className={cn(
              timelineItems.length > 0 ? 'w-full' : 'max-w-3xl'
            )}>
              {timelineItems.length > 0 ? (
                <TimelinePageClient timelineItems={timelineItems} gridData={gridData} />
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No timeline items recorded yet.</p>
                  <p className="text-sm mt-2">
                    Check back as the government acts on animal welfare commitments.
                  </p>
                </div>
              )}
            </div>
          </section>
          </TimelineViewProvider>
        </Suspense>

        {/* Disclaimer */}
        <section className="container py-8">
          <Disclaimer />
        </section>
      </main>

      <Footer />
    </div>
  );
}

