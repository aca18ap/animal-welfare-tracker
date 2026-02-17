'use client';
import HenIcon from '../ui/icons/HenIcon'
import PigIcon from '../ui/icons/PigIcon'
import DogIcon from '../ui/icons/DogIcon'
import MouseIcon from '../ui/icons/MouseIcon'
import React from 'react';

// Small inline animal icons for the progress bar (hoisted to avoid recreation)
const SmallAnimals = () => (
    <div className="flex items-center gap-1">
        <HenIcon className="w-8 h-8" />
        <PigIcon className="w-8 h-8" />
        <DogIcon className="w-8 h-8" />
        <MouseIcon className="w-8 h-8" />
    </div>
);

const formatNumber = (num: number) => num.toLocaleString();

export const ProgressBar = ({ total_animals_helped, total_animals }: { total_animals_helped: number; total_animals: number }) => {
    const [progressPercent, setProgressPercent] = React.useState(0);

    React.useEffect(() => {
        const percent = total_animals > 0 ? (total_animals_helped / total_animals) * 100 : 0;
        setProgressPercent(percent);
    }, [total_animals_helped, total_animals]);

    return (
        <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
                <SmallAnimals />
                <div>
                    <div className="font-semibold text-foreground">Animals with Improved Welfare</div>
                    <div className="text-sm text-muted-foreground">Based on policy implementation progress</div>
                </div>
            </div>
            <div className="flex items-end justify-between mb-2">
                <div className="text-3xl font-bold text-teal">{formatNumber(total_animals_helped)}</div>
                <div className="text-muted-foreground text-sm">of {formatNumber(total_animals)} animals in strategy</div>
            </div>
            <div className="h-6 bg-muted rounded-full overflow-hidden relative mb-2">
                <div
                    className="h-full rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, var(--color-teal) 0%, var(--color-teal-light) 100%)` }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <PigIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-medium text-teal">{progressPercent.toFixed(1)}% complete</span>
                <span className="text-muted-foreground">{formatNumber(total_animals - total_animals_helped)} to go!</span>
            </div>
        </div>
    );
};
