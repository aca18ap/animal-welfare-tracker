'use client';

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Recommendation } from '@/lib/types';
import { formatDateShort, daysUntil, isOverdue } from '@/lib/date-utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { OwnershipTag } from '@/components/shared/ownership-tag';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface RecommendationCardProps {
  recommendation: Recommendation;
  variant?: 'compact' | 'full';
  showUpdates?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RecommendationCard = memo(function RecommendationCard({
  recommendation,
  variant = 'compact',
  showUpdates = false,
  className,
  style,
}: RecommendationCardProps) {
  const targetDate = useMemo(
    () => recommendation.delivery_timeline.revised_target_date || recommendation.delivery_timeline.target_date,
    [recommendation.delivery_timeline.revised_target_date, recommendation.delivery_timeline.target_date]
  );
  const days = useMemo(() => daysUntil(targetDate), [targetDate]);
  const isCompleted = recommendation.overall_status.status === 'completed';
  const overdue = useMemo(() => !isCompleted && isOverdue(targetDate), [targetDate, isCompleted]);
  const latestUpdate = recommendation.updates?.[0];

  if (variant === 'compact') {
    return (
      <Link href={`/recommendation/${recommendation.id}`}>
        <Card 
          className={cn(
            'group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 h-full flex flex-col',
            className
          )}
          style={style}
        >
          <CardContent className="px-4 py-3 flex flex-col flex-1">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-mono text-sm font-bold text-primary">
                {recommendation.titles.short}
              </span>
              <StatusBadge
                status={recommendation.overall_status.status}
                type="overall"
                size="sm"
                showIcon={false}
              />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm leading-tight mb-1.5 line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {recommendation.titles.long}
            </h3>

            
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Full variant
  return (
    <Link href={`/recommendation/${recommendation.id}`}>
      <Card 
        className={cn(
          'group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30',
          className
        )}
        style={style}
      >
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-primary">
                {recommendation.code}
              </span>
              <StatusBadge
                status={recommendation.overall_status.status}
                type="overall"
                size="sm"
              />
            </div>
            <ArrowRight 
              size={18} 
              className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" 
            />
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base leading-snug mb-1.5 group-hover:text-primary transition-colors">
            {recommendation.titles.short}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {recommendation.titles.long}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Owner:</span>
              <OwnershipTag owner={recommendation.ownership.primary_owner} size="sm" />
              {recommendation.ownership.co_owners && recommendation.ownership.co_owners.length > 0 && (
                <OwnershipTag owner={`+${recommendation.ownership.co_owners.length}`} size="sm" />
              )}
            </div>
            <div className={cn(
              'flex items-center gap-1.5 font-mono',
              overdue && 'text-deep-red'
            )}>
              <span className="text-muted-foreground">Due:</span>
              {formatDateShort(targetDate)}
              {overdue && <AlertTriangle size={14} />}
            </div>
          </div>

          {/* Latest update preview */}
          {showUpdates && latestUpdate && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={latestUpdate.status} type="update" size="sm" />
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDateShort(latestUpdate.date)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {latestUpdate.title}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});

