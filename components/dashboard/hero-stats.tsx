'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Disclaimer } from '@/components/shared';
import { ProgressBar } from './progress-bar';

interface HeroStatsProps {
  totalAnimalsHelped: number;
  totalAnimals: number;
  className?: string;
}

export const HeroStats = memo(function HeroStats({ totalAnimalsHelped, totalAnimals, className }: HeroStatsProps) {
  return (
    <div className={cn('', className)}>
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="mb-3 md:mb-6">
          <span className="text-4xl" aria-hidden="true">&#x1f43e;</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark-green mb-4 tracking-tight">
          Animal Welfare Tracker
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tracking government commitments to improve animal welfare across the UK
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col items-center gap-4 sm:gap-8">
        <div className="w-full max-w-2xl">
          <ProgressBar
            total_animals_helped={totalAnimalsHelped}
            total_animals={totalAnimals}
          />
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
});
