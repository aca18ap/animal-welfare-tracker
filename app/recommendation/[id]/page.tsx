import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StatusBadge } from '@/components/shared/status-badge';
import { OwnershipList } from '@/components/shared/ownership-tag';
import { DeadlineIndicator } from '@/components/shared/deadline-indicator';
import { FormattedText } from '@/components/shared/formatted-text';
import { Disclaimer } from '@/components/shared';
import { TimelineBackLink } from '@/components/shared/timeline-back-link';
import { TimelineSection } from './timeline-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecommendationById, getRecommendations, getChapters } from '@/lib/data';
import { getChapterColors, TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from '@/lib/constants';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Calendar, 
  Target,
  Building,
  Layers,
  Link2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const recommendations = await getRecommendations();
  return recommendations.map((rec) => ({
    id: rec.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  let recommendation;
  
  try {
    recommendation = await getRecommendationById(parseInt(id));
  } catch (error) {
    console.error('Failed to load recommendation for metadata:', error);
    return { 
      title: 'Error | Animal Welfare Tracker',
      description: 'An error occurred while loading this recommendation.',
    };
  }
  
  if (!recommendation) {
    return { 
      title: 'Recommendation Not Found | Animal Welfare Tracker',
      description: 'The requested recommendation could not be found.',
    };
  }

  const chapters = await getChapters();
  const chapter = chapters.find(c => c.id === recommendation.chapter_id);
  const chapterTitle = chapter?.title || `Chapter ${recommendation.chapter_id}`;

  const statusLabel = recommendation.overall_status.status === 'completed' ? 'Completed' :
                     recommendation.overall_status.status === 'on_track' ? 'On Track' :
                     recommendation.overall_status.status === 'off_track' ? 'Off Track' :
                     'Not Started';

  const ogImageUrl = `/api/og/recommendation/${recommendation.id}`;

  return {
    title: `${recommendation.code}: ${recommendation.titles.short} | Animal Welfare Tracker`,
    description: `${recommendation.titles.long}. Status: ${statusLabel}. Chapter ${recommendation.chapter_id}: ${chapterTitle}.`,
    keywords: [
      recommendation.code,
      'animal welfare',
      'UK animal welfare',
      chapterTitle,
      statusLabel.toLowerCase(),
      ...(recommendation.scope?.sectors || []),
    ],
    openGraph: {
      title: `${recommendation.code}: ${recommendation.titles.short}`,
      description: recommendation.titles.long,
      type: "article",
      url: `/recommendation/${recommendation.id}`,
      siteName: "Animal Welfare Tracker",
      images: [
        {
          url: ogImageUrl,
          width: 2400,
          height: 1260,
          alt: `${recommendation.code} - ${recommendation.titles.short} - ${statusLabel}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${recommendation.code}: ${recommendation.titles.short}`,
      description: recommendation.titles.long,
      images: [
        {
          url: ogImageUrl,
          alt: `${recommendation.code} - ${recommendation.titles.short} - ${statusLabel}`,
        },
      ],
      ...(TWITTER_SITE_HANDLE && { site: TWITTER_SITE_HANDLE }),
      ...(TWITTER_CREATOR_HANDLE && { creator: TWITTER_CREATOR_HANDLE }),
    },
    alternates: {
      canonical: `/recommendation/${recommendation.id}`,
    },
  };
}

export default async function RecommendationPage({ params }: PageProps) {
  const { id } = await params;
  let recommendation;
  
  try {
    recommendation = await getRecommendationById(parseInt(id));
  } catch (error) {
    console.error('Failed to load recommendation:', error);
    throw new Error('Failed to load recommendation. Please try again later.');
  }

  if (!recommendation) {
    notFound();
  }

  const chapters = await getChapters();
  const chapter = chapters.find(c => c.id === recommendation.chapter_id);
  const chapterTitle = chapter?.title || `Chapter ${recommendation.chapter_id}`;

  const chapterColors = getChapterColors(recommendation.chapter_id);
  
  // Prepare updates for timeline (only updates, not deadlines, since deadline is shown in sidebar)
  const timelineItems = (recommendation.updates || [])
    .map((update) => ({
      type: 'update' as const,
      date: update.date,
      update,
      recommendation,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb & Back */}
        <div className="border-b bg-muted/30">
          <div className="container py-4">
            <div className="flex items-center gap-4">
              <TimelineBackLink />
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className={`py-8 md:py-12 ${chapterColors.bg}`}>
          <div className="container">
            {/* Chapter badge */}
            <div className="flex items-center gap-2 mb-4">
              {/* <span className={`text-sm font-medium ${chapterColors.text}`}>
                Chapter {recommendation.chapter_id}
              </span> */}
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                {chapterTitle}
              </span>
            </div>

            {/* Code and Status */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {/* <span className="font-mono text-3xl font-bold text-primary">
                {recommendation.code}
              </span> */}
              <StatusBadge
                status={recommendation.overall_status.status}
                type="overall"
                size="lg"
              />
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 max-w-4xl">
              {recommendation.titles.long}
            </h1>

            {/* Short Title */}
            <p className="text-lg text-muted-foreground max-w-3xl">
              {recommendation.titles.short}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="container py-8">
          <div className="grid grid-cols-1">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Full Text */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Full Recommendation Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <FormattedText text={recommendation.text} />
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Update Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timelineItems.length > 0 ? (
                    <TimelineSection items={timelineItems} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No updates recorded yet.</p>
                      <p className="text-sm mt-1">
                        Check back for progress on this recommendation.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-6">

              

              

              {/* Implementation Type */}
              {recommendation.implementation_type && recommendation.implementation_type.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building className="h-4 w-4 text-primary" />
                      Implementation Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendation.implementation_type.map((type) => (
                        <Badge key={type} variant="outline" className="capitalize">
                          {type.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Dependencies */}
              {recommendation.dependencies && 
               ((recommendation.dependencies.depends_on?.length ?? 0) > 0 || (recommendation.dependencies.enables?.length ?? 0) > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Link2 className="h-4 w-4 text-primary" />
                      Dependencies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recommendation.dependencies.depends_on && recommendation.dependencies.depends_on.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Depends On</p>
                        <div className="flex flex-wrap gap-1.5">
                          {recommendation.dependencies.depends_on.map((depId) => (
                            <Link key={depId} href={`/recommendation/${depId}`}>
                              <Badge variant="secondary" className="font-mono cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                R{depId.toString().padStart(2, '0')}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {recommendation.dependencies.enables && recommendation.dependencies.enables.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Enables</p>
                        <div className="flex flex-wrap gap-1.5">
                          {recommendation.dependencies.enables.map((enId) => (
                            <Link key={enId} href={`/recommendation/${enId}`}>
                              <Badge variant="secondary" className="font-mono cursor-pointer hover:bg-primary hover:text-primary-foreground">
                                R{enId.toString().padStart(2, '0')}
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="container py-8">
          <Disclaimer />
        </section>
      </main>

      <Footer />
    </div>
  );
}
