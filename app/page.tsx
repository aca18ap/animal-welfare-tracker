import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardContent } from './dashboard-content';
import { 
  getStatusCounts, 
  getChaptersWithRecommendations, 
  getUpcomingDeadlines, 
  getRecentUpdates,
  getUniqueOwners,
  getChapters,
  getAllOwnerInfo,
} from '@/lib/data';
import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  let counts;
  try {
    counts = await getStatusCounts();
  } catch (error) {
    // Fallback metadata if data loading fails
    return {
      title: "Animal Welfare Tracker | UK Voters for Animals",
      description: "Tracking government progress on animal welfare commitments across the UK.",
    };
  }

  return {
    title: "Animal Welfare Tracker | UK Voters for Animals",
    description: `Tracking government progress on animal welfare commitments across the UK. ${counts.completed} completed, ${counts.on_track} on track, ${counts.off_track} off track.`,
    openGraph: {
      title: "Animal Welfare Tracker | UK Voters for Animals",
      description: `Tracking government progress on animal welfare commitments across the UK. ${counts.completed} completed, ${counts.on_track} on track, ${counts.off_track} off track.`,
      type: "website",
      url: "/",
      siteName: "Animal Welfare Tracker",
      images: [
        {
          url: "/api/og",
          width: 2400,
          height: 1260,
          alt: "Animal Welfare Tracker - Dashboard Overview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Animal Welfare Tracker",
      description: `Tracking government progress on animal welfare commitments across the UK. ${counts.completed} completed.`,
      images: [
        {
          url: "/api/og",
          alt: "Animal Welfare Tracker - Dashboard Overview showing progress statistics",
        },
      ],
      ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
      ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage() {
  // Fetch all data server-side with error handling
  let counts, chaptersWithRecs, deadlines, recentUpdates, owners, chapters, ownerInfoMap;
  
  try {
    [counts, chaptersWithRecs, deadlines, recentUpdates, owners, chapters, ownerInfoMap] = await Promise.all([
      getStatusCounts(),
      getChaptersWithRecommendations(),
      getUpcomingDeadlines(8),
      getRecentUpdates(6),
      getUniqueOwners(),
      getChapters(),
      getAllOwnerInfo(),
    ]);
  } catch (error) {
    // Log error and throw to trigger error boundary
    console.error('Failed to load dashboard data:', error);
    throw new Error('Failed to load dashboard data. Please try again later.');
  }

  // Convert Map to object for serialization
  const ownerInfo = Object.fromEntries(ownerInfoMap);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContentWrapper
            counts={counts}
            chaptersWithRecs={chaptersWithRecs}
            deadlines={deadlines}
            recentUpdates={recentUpdates}
            owners={owners}
            chapters={chapters}
            ownerInfo={ownerInfo}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function DashboardContentWrapper(props: Parameters<typeof DashboardContent>[0]) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent {...props} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="text-center space-y-4">
          <div className="h-8 w-48 bg-muted rounded-full mx-auto" />
          <div className="h-12 w-96 bg-muted rounded mx-auto" />
          <div className="h-6 w-80 bg-muted rounded mx-auto" />
        </div>
        
        {/* Stats skeleton */}
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-24 bg-muted rounded-xl" />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-80 bg-muted rounded-lg" />
            <div className="h-80 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
