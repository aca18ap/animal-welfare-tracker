import { cn } from '@/lib/utils';
import { ExternalLink, Github } from 'lucide-react';
import { getLastUpdated } from '@/lib/data';

interface FooterProps {
  className?: string;
}

export async function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const lastUpdated = await getLastUpdated();

  return (
    <footer
      className={cn(
        'border-t bg-dark-green text-beige',
        className
      )}
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🐾</span>
              <span className="font-display font-bold text-lg text-beige">Animal Welfare Tracker</span>
            </div>
            <p className="text-sm text-beige/80 leading-relaxed">
              UK Voters for Animals is a non-partisan organisation campaigning for stronger animal welfare protections across the UK.
            </p>
            <p className="text-sm text-beige/80 leading-relaxed mt-2">
              This project tracks the Government&apos;s progress in delivering on animal welfare commitments and their impact on animals.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.ukvotersforanimals.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-beige/80 hover:text-beige transition-colors"
                >
                  UK Voters for Animals
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ukvotersforanimals.org/take-action"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-beige/80 hover:text-beige transition-colors"
                >
                  Take Action
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ukvotersforanimals/animal-welfare-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-beige/80 hover:text-beige transition-colors"
                >
                  GitHub
                  <Github size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Data */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3">Data</h3>
            <p className="text-sm text-beige/80 leading-relaxed mb-2">
              Data is sourced from public government announcements, parliamentary
              statements, official publications, and animal welfare organisations.
            </p>
            <p className="text-xs text-beige/60">
              Last updated: {lastUpdated
                ? new Date(lastUpdated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-beige/20">
          <p className="text-sm text-beige/60 text-center">
            © {currentYear} UK Voters for Animals. This is an independent project
            and is not affiliated with HM Government.
          </p>
        </div>
      </div>
    </footer>
  );
}

