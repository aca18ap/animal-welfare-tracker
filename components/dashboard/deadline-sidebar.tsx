'use client';

import { cn } from '@/lib/utils';
import { UpcomingDeadline, RecentUpdate } from '@/lib/types';
import { formatDateShort } from '@/lib/date-utils';
import { StatusBadge } from '@/components/shared/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Bell, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface DeadlineSidebarProps {
  deadlines: UpcomingDeadline[];
  recentUpdates: RecentUpdate[];
  className?: string;
}

export function DeadlineSidebar({
  deadlines,
  recentUpdates,
  className,
}: DeadlineSidebarProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Upcoming Deadlines */}
      {/* <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[280px]">
            <div className="space-y-3">
              {deadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No upcoming deadlines
                </p>
              ) : (
                deadlines.map((item) => (
                  <Link
                    key={item.recommendation.id}
                    href={`/recommendation/${item.recommendation.id}`}
                    className="block"
                  >
                    <div className={cn(
                      'p-3 rounded-lg border transition-colors hover:border-primary/30 hover:bg-muted/50',
                      item.isOverdue && 'border-deep-red/30 bg-deep-red/5'
                    )}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-primary">
                          {item.recommendation.code}
                        </span>
                        <div className={cn(
                          'flex items-center gap-1 text-xs font-mono',
                          item.isOverdue ? 'text-deep-red' : 
                          item.daysUntil <= 30 ? 'text-orange' : 
                          'text-muted-foreground'
                        )}>
                          {item.isOverdue ? (
                            <>
                              <AlertTriangle size={12} />
                              {Math.abs(item.daysUntil)}d ago
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              {item.daysUntil}d
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground line-clamp-1">
                        {item.recommendation.titles.short}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateShort(
                          item.recommendation.delivery_timeline.revised_target_date ||
                          item.recommendation.delivery_timeline.target_date
                        )}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card> */}

      {/* Recent Updates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[280px]">
            <div className="space-y-3">
              {recentUpdates.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No updates yet
                </p>
              ) : (
                recentUpdates.map((item, index) => (
                  <div key={`${item.recommendation.id}-${index}`}>
                    <Link
                      href={`/recommendation/${item.recommendation.id}`}
                      className="block p-3 rounded-lg transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge
                          status={item.update.status}
                          type="update"
                          size="sm"
                          showIcon={false}
                        />
                        <span className="text-xs text-muted-foreground font-mono">
                          {formatDateShort(item.update.date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.update.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.recommendation.code} • {item.recommendation.titles.short}
                      </p>
                    </Link>
                    {index < recentUpdates.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

