import { cn } from '@/lib/utils';

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div className={cn('text-center max-w-2xl mx-auto mt-4', className)}>
      <p className="text-xs text-muted-foreground leading-relaxed">
        The content in this tracker is based on publicly available government commitments and animal welfare legislation.
        We have worked hard to ensure it is accurate, but some details may be slightly different or simplified. If you find any errors or inaccuracies, please{' '}
        <a
          href="https://www.ukvotersforanimals.org/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-bold"
        >
          report them to us
        </a>
        .
      </p>
    </div>
  );
}

