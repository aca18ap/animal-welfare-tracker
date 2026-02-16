import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TimelineBackLink } from '@/components/shared/timeline-back-link';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormattedText } from '@/components/shared/formatted-text';
import { Disclaimer } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUpdateByDate, getChapters } from '@/lib/data';
import { TWITTER_SITE_HANDLE, TWITTER_CREATOR_HANDLE } from '@/lib/constants';
import { formatDate } from '@/lib/date-utils';
import { getFullUrl } from '@/lib/url-utils';
import { 
  ArrowLeft, 
  Calendar,
  Link2,
  FileText,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string; updateId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, updateId } = await params;
  let updateData;
  
  try {
    updateData = await getUpdateByDate(parseInt(id), updateId);
  } catch (error) {
    console.error('Failed to load update for metadata:', error);
    return { 
      title: 'Error | Animal Welfare Tracker',
      description: 'An error occurred while loading this update.',
    };
  }

  if (!updateData) {
    return {
      title: 'Update Not Found | Animal Welfare Tracker',
      description: 'The requested update could not be found.',
    };
  }

  const { recommendation, update } = updateData;
  const title = `${update.title} | ${recommendation.code} | Animal Welfare Tracker`;
  const description = update.description || `Update on ${recommendation.code}: ${recommendation.titles.short}`;
  const ogImageUrl = getFullUrl(`/api/og/recommendation/${id}/update/${updateId}`);
  const pageUrl = getFullUrl(`/recommendation/${id}/update/${updateId}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Animal Welfare Tracker',
      images: [
        {
          url: ogImageUrl,
          width: 2400,
          height: 1260,
          alt: title,
        },
      ],
      locale: 'en_GB',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: TWITTER_SITE_HANDLE,
      creator: TWITTER_CREATOR_HANDLE,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `/recommendation/${id}/update/${updateId}`,
    },
  };
}

export default async function UpdatePage({ params }: PageProps) {
  const { id, updateId } = await params;
  const updateData = await getUpdateByDate(parseInt(id), updateId);

  if (!updateData) {
    notFound();
  }

  const { recommendation, update } = updateData;
  const chapters = await getChapters();
  const chapter = chapters.find(c => c.id === recommendation.chapter_id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-beige to-background py-8">
          <div className="container">
            <div className="flex items-center gap-4 mb-6">
              <TimelineBackLink />
              <Link
                href={`/recommendation/${recommendation.id}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Back to recommendation
              </Link>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-green">
                Update
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/recommendation/${recommendation.id}`}
                className="font-mono text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                {recommendation.code}
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-lg text-muted-foreground">
                {recommendation.titles.short}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container py-8">
          <div className="max-w-3xl">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <time className="text-sm font-mono text-muted-foreground">
                    {formatDate(update.date)}
                  </time>
                  <StatusBadge status={update.status} type="update" size="sm" />
                </div>
                <CardTitle className="text-2xl">{update.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <FormattedText text={update.description} />
                </div>

                {/* Tags */}
                {update.tags && update.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {update.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Links */}
                {update.links && update.links.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Link2 size={16} />
                      Related Links
                    </h3>
                    <ul className="space-y-1">
                      {update.links.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {link.title}
                            <Link2 size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Source */}
                {update.source && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Source:</span>{' '}
                      {update.source.type}
                      {update.source.reference && (
                        <>
                          {' • '}
                          <span className="font-mono">{update.source.reference}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Impact on Overall Status */}
                {update.impact_on_overall && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-2">Impact on Overall Status</h3>
                    {update.impact_on_overall.changes_overall_status_to && (
                      <div className="text-sm mb-2">
                        <span className="font-medium">Status changed to:</span>{' '}
                        <StatusBadge 
                          status={update.impact_on_overall.changes_overall_status_to} 
                          type="overall" 
                          size="sm"
                        />
                      </div>
                    )}
                    {update.impact_on_overall.changes_confidence_to && (
                      <div className="text-sm mb-2">
                        <span className="font-medium">Confidence changed to:</span>{' '}
                        <Badge variant="outline" className="ml-1">
                          {update.impact_on_overall.changes_confidence_to}
                        </Badge>
                      </div>
                    )}
                    {update.impact_on_overall.notes && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {update.impact_on_overall.notes}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendation Context */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recommendation Context</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Chapter:</span>{' '}
                    {chapter ? (
                      <>
                        Chapter {chapter.id}: {chapter.title}
                      </>
                    ) : (
                      `Chapter ${recommendation.chapter_id}`
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Owner:</span>{' '}
                    {recommendation.ownership.primary_owner}
                    {recommendation.ownership.co_owners && recommendation.ownership.co_owners.length > 0 && (
                      <span className="text-muted-foreground">
                        {' '}+ {recommendation.ownership.co_owners.length} co-owner{recommendation.ownership.co_owners.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Current Status:</span>{' '}
                    <StatusBadge 
                      status={recommendation.overall_status.status} 
                      type="overall" 
                      size="sm"
                    />
                  </div>
                </div>
                <Link
                  href={`/recommendation/${recommendation.id}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                >
                  View full recommendation
                  <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </CardContent>
            </Card>
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

