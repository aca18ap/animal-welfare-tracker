'use client';

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { StatusCounts, OverallStatus } from '@/lib/types';
import { Disclaimer } from '@/components/shared';
import {
  AlertCircle,
  CheckCircle,
  Atom,
} from 'lucide-react';
import { ProgressBar } from './progress-bar';

// Hoisted static config outside component to prevent recreation
const MAIN_STATS_CONFIG = [
  {
    label: 'Completed',
    key: 'completed' as const,
    icon: CheckCircle,
    color: 'text-dark-green',
    bgColor: 'bg-neon-green/20',
    status: 'completed' as OverallStatus,
  },
  {
    label: 'On Track',
    key: 'on_track' as const,
    icon: Atom,
    color: 'text-dark-green',
    bgColor: 'bg-dark-green/20',
    status: 'on_track' as OverallStatus,
  },
  {
    label: 'Off Track',
    key: 'off_track' as const,
    icon: AlertCircle,
    color: 'text-deep-red',
    bgColor: 'bg-deep-red/10',
    status: 'off_track' as OverallStatus,
  },
] as const;

const TOTAL_STAT_CONFIG = {
  label: 'Total',
  icon: 'atom' as const,
  color: 'text-dark-green',
  bgColor: 'bg-dark-green/10',
  status: 'all' as const,
} as const;

interface HeroStatsProps {
  counts: StatusCounts;
  className?: string;
  onStatusClick?: (status: OverallStatus | 'all') => void;
}

export const HeroStats = memo(function HeroStats({ counts, className, onStatusClick }: HeroStatsProps) {
  const mainStats = useMemo(() =>
    MAIN_STATS_CONFIG.map(stat => ({
      ...stat,
      value: counts[stat.key],
    })),
    [counts]
  );

  const totalStat = useMemo(() => ({
    ...TOTAL_STAT_CONFIG,
    value: counts.total,
  }), [counts.total]);

  return (
    <div className={cn('', className)}>
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="mb-3 md:mb-6">
          <span className="text-4xl" aria-hidden="true">🐾</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-4 tracking-tight">
          Animal Welfare Tracker
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tracking government commitments to improve animal welfare across the UK
        </p>
      </div>

      {/* Progress Bar & Stats */}
      <div className="flex flex-col items-center gap-4 sm:gap-8">
        {/* Animal Welfare Progress Bar */}
        <div className="w-full max-w-2xl">
          <ProgressBar
            total_animals_helped={counts.completed}
            total_animals={counts.total}
          />
        </div>

        {/* Stats Grid - Centered */}
        <div className="flex justify-center w-full">
          <div className="flex flex-col w-full sm:w-auto sm:grid sm:grid-cols-3 gap-2 sm:gap-4">
            {/* Main three stats */}
            {mainStats.map((stat) => {
              const Icon = stat.icon;
              const isClickable = !!onStatusClick;
              const Component = isClickable ? 'button' : 'div';
              const percentage = counts.total === 0 ? 0 : Math.round((stat.value / counts.total) * 100);
              return (
                <Component
                  key={stat.label}
                  onClick={isClickable ? () => onStatusClick?.(stat.status) : undefined}
                  className={cn(
                    'flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-1 py-3 px-4 sm:px-8 sm:py-4 rounded-xl transition-all w-full min-w-[120px]',
                    stat.bgColor,
                    isClickable && 'cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                  )}
                >
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-1">
                    {Icon && (
                      <Icon className={cn(
                        'h-5 w-5 sm:h-6 sm:w-6',
                        stat.color,
                        stat.status === 'completed' && 'font-bold'
                      )} />
                    )}
                    <div className="flex items-center gap-1.5 sm:flex-col sm:items-center sm:gap-0">
                      <span className={cn(
                        'text-2xl sm:text-4xl font-bold font-mono',
                        stat.color,
                        stat.status === 'completed' && 'font-extrabold'
                      )}>
                        {stat.value}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-muted-foreground">
                        <span className="sm:hidden">({percentage}%)</span>
                        <span className="hidden sm:inline">{percentage}%</span>
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    'text-sm sm:text-sm sm:mt-1',
                    stat.status === 'completed' ? 'font-semibold text-dark-green' : 'text-muted-foreground'
                  )}>
                    {stat.label}
                  </span>
                </Component>
              );
            })}

            {/* Total stat - underneath on desktop, spans all 3 columns */}
            {onStatusClick ? (
              <button
                onClick={() => onStatusClick(totalStat.status)}
                className={cn(
                  'flex flex-row items-center justify-center gap-3 p-2 sm:p-3 rounded-xl transition-all w-full sm:col-span-3',
                  totalStat.bgColor,
                  'cursor-pointer hover:scale-105 hover:shadow-md active:scale-95'
                )}
              >
                <span className={cn('text-xl sm:text-2xl font-bold font-mono', totalStat.color)}>
                  {totalStat.value}
                </span>
                <span className="text-sm sm:text-sm text-muted-foreground">
                  {totalStat.label}
                </span>
              </button>
            ) : (
              <div
                className={cn(
                  'flex flex-row items-center justify-center gap-3 p-2 sm:p-3 rounded-xl transition-all w-full sm:col-span-3',
                  totalStat.bgColor,
                )}
              >
                <span className={cn('text-xl sm:text-2xl font-bold font-mono', totalStat.color)}>
                  {totalStat.value}
                </span>
                <span className="text-sm sm:text-sm text-muted-foreground">
                  {totalStat.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
});

