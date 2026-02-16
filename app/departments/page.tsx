import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getOwnersWithMoreThanNRecommendations } from '@/lib/data';
import { OWNER_FULL_NAMES } from '@/lib/constants';
import { DepartmentsContent } from './departments-content';

import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from '@/lib/constants';

export async function generateMetadata(): Promise<Metadata> {
  const ogImageUrl = '/api/og/departments';
  const description = "Compare progress across organisations responsible for animal welfare commitments";

  return {
    title: "Departments Overview | Animal Welfare Tracker",
    description,
    openGraph: {
      title: "Compare Organizations | Animal Welfare Tracker",
      description,
      type: "website",
      url: "/departments",
      siteName: "Animal Welfare Tracker",
      images: [
        {
          url: ogImageUrl,
          width: 2400,
          height: 1260,
          alt: "Animal Welfare Tracker - Compare Organizations Progress",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Compare Organizations | Animal Welfare Tracker",
      description,
      images: [
        {
          url: ogImageUrl,
          alt: "Animal Welfare Tracker - Compare Organizations Progress",
        },
      ],
      ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
      ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
    },
    alternates: {
      canonical: "/departments",
    },
  };
}

export default async function DepartmentsPage() {
  const ownersWithStats = await getOwnersWithMoreThanNRecommendations(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Suspense fallback={<DepartmentsSkeleton />}>
          <DepartmentsContent ownersWithStats={ownersWithStats} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function DepartmentsSkeleton() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-64 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

