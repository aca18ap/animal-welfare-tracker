'use client';

import { cn } from '@/lib/utils';
import { Chapter, Recommendation } from '@/lib/types';
import { getChapterColors } from '@/lib/constants';
import { RecommendationCard } from './recommendation-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useMemo, memo } from 'react';

interface ChapterSummaryProps {
  summary: string;
}

function ChapterSummary({ summary }: ChapterSummaryProps) {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen} className="mb-4">
      <CollapsibleTrigger asChild>
        <button className="w-full text-left flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors border border-border/50">
          <span className="text-sm font-medium">Summary</span>
          <ChevronDown
            size={16}
            className={cn(
              'text-muted-foreground flex-shrink-0 transition-transform',
              isSummaryOpen && 'rotate-180'
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 p-4 rounded-md bg-muted/30 border border-border/50">
          <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
            {summary}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ChapterSectionProps {
  chapter: Chapter;
  recommendations: Recommendation[];
  defaultOpen?: boolean;
  className?: string;
}

export const ChapterSection = memo(function ChapterSection({
  chapter,
  recommendations,
  defaultOpen = true,
  className,
}: ChapterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colors = getChapterColors(chapter.id);

  // Memoized stats calculation
  const stats = useMemo(() => ({
    completed: recommendations.filter(r => r.overall_status.status === 'completed').length,
    onTrack: recommendations.filter(r => r.overall_status.status === 'on_track').length,
    offTrack: recommendations.filter(r => r.overall_status.status === 'off_track').length,
  }), [recommendations]);

  const { completed, onTrack, offTrack } = stats;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border transition-all duration-200',
            'hover:shadow-sm',
            colors.bg,
            colors.border,
            isOpen && 'rounded-b-none border-b-0'
          )}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isOpen ? (
              <ChevronDown className={cn('h-5 w-5 flex-shrink-0', colors.text)} />
            ) : (
              <ChevronRight className={cn('h-5 w-5 flex-shrink-0', colors.text)} />
            )}
            <div className="text-left min-w-0 flex-1">
              <h2 className={cn('font-display font-bold text-lg', colors.text, 'break-words')}>
                {chapter.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            {completed > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-dark-green/10 text-dark-green whitespace-nowrap">
                {completed} done
              </span>
            )}
            {onTrack > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-dark-green/10 text-dark-green whitespace-nowrap">
                {onTrack} on track
              </span>
            )}
            {offTrack > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-deep-red/10 text-deep-red whitespace-nowrap">
                {offTrack} off track
              </span>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className={cn(
            'p-4 rounded-b-lg border border-t-0',
            colors.border,
            'bg-card'
          )}
        >
          {/* Chapter Summary - expandable, closed by default */}
          {chapter.summary && (
            <ChapterSummary summary={chapter.summary} />
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                variant="compact"
                className="animate-scale-in opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
});

