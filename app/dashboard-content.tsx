'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { HeroStats, FilterControls, DeadlineSidebar } from '@/components/dashboard';
import { ChapterSection } from '@/components/recommendations';
import { ExportButton } from '@/components/shared/export-button';
import { getChapterColors } from '@/lib/constants';
import { X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ChapterWithRecommendations,
  UpcomingDeadline,
  RecentUpdate,
  FilterState,
  Chapter,
  Recommendation,
} from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

function matchesFilters(rec: Recommendation, filters: FilterState, { skipChapter = false, skipOwner = false } = {}): boolean {
  if (filters.status !== 'all' && rec.overall_status.status !== filters.status) return false;
  if (!skipOwner && filters.owner !== 'all') {
    const hasOwner = rec.ownership.primary_owner === filters.owner || rec.ownership.co_owners?.includes(filters.owner);
    if (!hasOwner) return false;
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      rec.titles.short.toLowerCase().includes(searchLower) ||
      rec.titles.long.toLowerCase().includes(searchLower) ||
      rec.text.toLowerCase().includes(searchLower) ||
      rec.code.toLowerCase().includes(searchLower);
    if (!matchesSearch) return false;
  }
  if (filters.tag) {
    const hasTag = rec.updates?.some(update => update.tags?.includes(filters.tag!));
    if (!hasTag) return false;
  }
  return true;
}

function countStatuses(recs: Recommendation[]) {
  let completed = 0, onTrack = 0, offTrack = 0;
  for (const r of recs) {
    const s = r.overall_status.status;
    if (s === 'completed') completed++;
    else if (s === 'on_track') onTrack++;
    else if (s === 'off_track') offTrack++;
  }
  return { completed, onTrack, offTrack, total: recs.length };
}

interface ChapterOverviewProps {
  chapter: Chapter;
  chapterData: ChapterWithRecommendations;
  onClear: () => void;
}

function ChapterOverview({ chapter, chapterData, onClear }: ChapterOverviewProps) {
  const { completed, onTrack, offTrack, total } = countStatuses(chapterData.recommendations);
  const colors = getChapterColors(chapter.id);
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const onTrackPercent = total > 0 ? (onTrack / total) * 100 : 0;
  const offTrackPercent = total > 0 ? (offTrack / total) * 100 : 0;

  return (
    <div data-chapter-overview className={cn('p-6 rounded-lg border mb-6', colors.bg, colors.border)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={cn('font-display font-bold text-2xl mb-2', colors.text)}>
            Chapter {chapter.id}: {chapter.title}
          </h2>
        </div>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Clear chapter filter"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar with Columns */}
      <div className="space-y-3">
        <div className="flex w-full h-8 rounded-lg overflow-hidden border border-border/50">
          {completed > 0 && (
            <div
              className="bg-neon-green flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
              style={{ width: `${completedPercent}%` }}
            >
              {completedPercent > 5 && `${completed}`}
            </div>
          )}
          {onTrack > 0 && (
            <div
              className="bg-dark-green/30 flex items-center justify-center text-foreground text-xs font-semibold transition-all duration-500"
              style={{ width: `${onTrackPercent}%` }}
            >
              {onTrackPercent > 5 && `${onTrack}`}
            </div>
          )}
          {offTrack > 0 && (
            <div
              className="bg-deep-red/30 flex items-center justify-center text-foreground text-xs font-semibold transition-all duration-500"
              style={{ width: `${offTrackPercent}%` }}
            >
              {offTrackPercent > 5 && `${offTrack}`}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-neon-green"></div>
            <span className="text-muted-foreground">Completed ({completed})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-dark-green/30"></div>
            <span className="text-muted-foreground">On Track ({onTrack})</span>
          </div>
          {offTrack > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-deep-red/30"></div>
              <span className="text-muted-foreground">Off Track ({offTrack})</span>
            </div>
          )}
          <div className="text-muted-foreground ml-auto">
            Total: {total}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmptyChaptersGroupProps {
  chapters: Chapter[];
}

function EmptyChapterItem({ chapter }: { chapter: Chapter }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-md border border-border/50 bg-muted/20">
        <CollapsibleTrigger asChild>
          <button
            className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-muted/40 transition-colors rounded-md"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-muted-foreground">
                Chapter {chapter.id}: {chapter.title}
              </div>
              <div className="text-xs text-muted-foreground/80 mt-0.5">
                (No recommendations)
              </div>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                'text-muted-foreground flex-shrink-0 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 border-t border-border/50">
            {chapter.summary ? (
              <div className="mt-3">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {chapter.summary}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-3 italic">
                No description available for this chapter.
              </p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function EmptyChaptersGroup({ chapters }: EmptyChaptersGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const chapterRange = chapters.length === 1 
    ? `Chapter ${firstChapter.id}`
    : `Chapters ${firstChapter.id}-${lastChapter.id}`;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border bg-muted/30 border-border">
        <CollapsibleTrigger asChild>
          <button
            className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-muted/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {chapterRange}
              </span>
              <span className="text-xs text-muted-foreground">
                (No recommendations)
              </span>
            </div>
            <ChevronDown
              size={16}
              className={cn(
                'text-muted-foreground flex-shrink-0 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 border-t border-border/50">
            <div className="mt-3 space-y-2">
              {chapters.map((chapter) => (
                <EmptyChapterItem key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface DashboardContentProps {
  chaptersWithRecs: ChapterWithRecommendations[];
  deadlines: UpcomingDeadline[];
  recentUpdates: RecentUpdate[];
  owners: string[];
  chapters: Chapter[];
  ownerInfo?: Record<string, Array<{ title: string; name: string }>>;
  animalImpact: { totalAnimalsHelped: number; totalAnimals: number };
}

export function DashboardContent({
  chaptersWithRecs,
  deadlines,
  recentUpdates,
  owners,
  chapters,
  ownerInfo = {},
  animalImpact,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const chapterParam = searchParams.get('chapter');
    const tagParam = searchParams.get('tag');
    const ownerParam = searchParams.get('owner');
    return {
      status: 'all',
      chapter: chapterParam ? parseInt(chapterParam) : 'all',
      owner: ownerParam || 'all',
      search: '',
      tag: tagParam || undefined,
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.chapter !== 'all') {
      params.set('chapter', filters.chapter.toString());
    }
    if (filters.owner !== 'all') {
      params.set('owner', filters.owner);
    }
    if (filters.tag) {
      params.set('tag', filters.tag);
    }
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(newUrl, { scroll: false });
  }, [filters.chapter, filters.owner, filters.tag, router]);

  // Scroll to chapter overview when chapter filter is set from URL
  useEffect(() => {
    if (filters.chapter !== 'all') {
      setTimeout(() => {
        const element = document.querySelector('[data-chapter-overview]');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [filters.chapter]);

  // Filter recommendations based on current filters
  const filteredChapters = useMemo(() => {
    return chaptersWithRecs
      .map((chapter) => {
        // Filter by chapter if specified
        if (filters.chapter !== 'all' && chapter.id !== filters.chapter) {
          return null;
        }

        // Filter recommendations within each chapter
        const filteredRecs = chapter.recommendations.filter((rec) => matchesFilters(rec, filters));

        if (filteredRecs.length === 0) return null;

        return {
          ...chapter,
          recommendations: filteredRecs,
        };
      })
      .filter((chapter): chapter is ChapterWithRecommendations => chapter !== null);
  }, [chaptersWithRecs, filters]);

  const totalFiltered = filteredChapters.reduce(
    (sum, ch) => sum + ch.recommendations.length,
    0
  );

  // Calculate owner stats when owner filter is active
  const ownerStats = useMemo(() => {
    if (filters.owner === 'all') return null;

    // Get all recommendations for this owner (from all chapters), applying non-chapter filters
    const filteredOwnerRecs = chaptersWithRecs.flatMap(chapter =>
      chapter.recommendations.filter(rec => matchesFilters(rec, filters, { skipChapter: true }))
    );

    const { completed, onTrack, offTrack, total } = countStatuses(filteredOwnerRecs);

    return {
      owner: filters.owner,
      completed,
      onTrack,
      offTrack,
      total,
      completedPercent: total > 0 ? (completed / total) * 100 : 0,
      onTrackPercent: total > 0 ? (onTrack / total) * 100 : 0,
      offTrackPercent: total > 0 ? (offTrack / total) * 100 : 0,
    };
  }, [chaptersWithRecs, filters]);

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.chapter !== 'all' ||
    filters.owner !== 'all' ||
    filters.search !== '' ||
    filters.tag !== undefined;

  // Find chapters with no recommendations (show all chapters, mark empty ones)
  const allChaptersOrdered = useMemo(() => {
    const chaptersWithRecsIds = new Set(chaptersWithRecs.map(c => c.id));
    const emptyChapters = chapters
      .filter(ch => !chaptersWithRecsIds.has(ch.id))
      .sort((a, b) => a.id - b.id);
    
    // Only show empty chapters when no active filters
    if (hasActiveFilters) return [];
    
    return emptyChapters;
  }, [chapters, chaptersWithRecs, hasActiveFilters]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-beige to-background pt-8 md:pt-16 pb-4 md:pb-6">
        <div className="container">
          <HeroStats
            totalAnimalsHelped={animalImpact.totalAnimalsHelped}
            totalAnimals={animalImpact.totalAnimals}
          />
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 md:mt-8">
            <Link href="/timeline">
              <Button
                size="default"
                variant="outline"
                className="border-dark-green text-dark-green hover:bg-dark-green/10 font-semibold px-6 py-6 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto"
              >
                <span>View timeline</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container pt-2 md:pt-4 pb-6 md:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Filter Controls */}
            <div data-filter-section>
              <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                chapters={chaptersWithRecs.map(c => ({ id: c.id, title: c.title, summary: c.summary, description: c.description }))}
                owners={owners}
                exportButton={
                  <ExportButton
                    baseUrl="/api/export/recommendations"
                    queryParams={{
                      ...(filters.status !== 'all' && { status: filters.status }),
                      ...(filters.chapter !== 'all' && { chapter: filters.chapter.toString() }),
                      ...(filters.owner !== 'all' && { owner: filters.owner }),
                      ...(filters.tag && { tag: filters.tag }),
                    }}
                    label="Export Data"
                  />
                }
              />
            </div>

            {/* Owner Overview - Combined with Key People */}
            {ownerStats && (
              <div data-owner-overview className="p-6 rounded-lg border mb-6 bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display font-bold text-2xl mb-2">
                      {ownerStats.owner}
                    </h2>
                  </div>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, owner: 'all' }))}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear owner filter"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Key People Section */}
                {ownerInfo[ownerStats.owner] && ownerInfo[ownerStats.owner].length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                      Key People
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ownerInfo[ownerStats.owner].map((person, idx) => (
                        <div
                          key={idx}
                          className="inline-flex flex-col px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/50 text-xs"
                        >
                          <div className="font-medium text-foreground">
                            {person.name}
                          </div>
                          <div className="text-muted-foreground text-[10px] leading-tight">
                            {person.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Progress Bar with Columns */}
                <div className="space-y-3">
                  <div className="flex w-full h-8 rounded-lg overflow-hidden border border-border/50">
                    {ownerStats.completed > 0 && (
                      <div
                        className="bg-neon-green flex items-center justify-center text-white text-xs font-semibold transition-all duration-500"
                        style={{ width: `${ownerStats.completedPercent}%` }}
                      >
                        {ownerStats.completedPercent > 5 && `${ownerStats.completed}`}
                      </div>
                    )}
                    {ownerStats.onTrack > 0 && (
                      <div
                        className="bg-dark-green/30 flex items-center justify-center text-foreground text-xs font-semibold transition-all duration-500"
                        style={{ width: `${ownerStats.onTrackPercent}%` }}
                      >
                        {ownerStats.onTrackPercent > 5 && `${ownerStats.onTrack}`}
                      </div>
                    )}
                    {ownerStats.offTrack > 0 && (
                      <div
                        className="bg-deep-red/30 flex items-center justify-center text-foreground text-xs font-semibold transition-all duration-500"
                        style={{ width: `${ownerStats.offTrackPercent}%` }}
                      >
                        {ownerStats.offTrackPercent > 5 && `${ownerStats.offTrack}`}
                      </div>
                    )}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-neon-green"></div>
                      <span className="text-muted-foreground">Completed ({ownerStats.completed})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-dark-green/30"></div>
                      <span className="text-muted-foreground">On Track ({ownerStats.onTrack})</span>
                    </div>
                    {ownerStats.offTrack > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-deep-red/30"></div>
                        <span className="text-muted-foreground">Off Track ({ownerStats.offTrack})</span>
                      </div>
                    )}
                    <div className="text-muted-foreground ml-auto">
                      Total: {ownerStats.total}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chapter Overview */}
            {filters.chapter !== 'all' && (() => {
              const chapter = chapters.find(c => c.id === filters.chapter);
              const chapterData = chaptersWithRecs.find(c => c.id === filters.chapter);
              if (!chapter || !chapterData) return null;
              return (
                <ChapterOverview
                  chapter={chapter}
                  chapterData={chapterData}
                  onClear={() => setFilters(prev => ({ ...prev, chapter: 'all' }))}
                />
              );
            })()}

            {/* Results count */}
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Showing {totalFiltered} recommendation{totalFiltered !== 1 ? 's' : ''}
                {filters.search && (
                  <> matching &ldquo;{filters.search}&rdquo;</>
                )}
              </p>
            )}

            {/* Chapter Sections */}
            {filteredChapters.length === 0 && allChaptersOrdered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No recommendations match your filters.</p>
                <p className="text-sm mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chapters with no recommendations - grouped in one expandable box */}
                {allChaptersOrdered.length > 0 && (
                  <EmptyChaptersGroup chapters={allChaptersOrdered} />
                )}
                
                {/* Chapters with recommendations */}
                {filteredChapters.map((chapter) => (
                  <ChapterSection
                    key={chapter.id}
                    chapter={chapter}
                    recommendations={chapter.recommendations}
                    defaultOpen={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20">
              <DeadlineSidebar
                deadlines={deadlines}
                recentUpdates={recentUpdates}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

