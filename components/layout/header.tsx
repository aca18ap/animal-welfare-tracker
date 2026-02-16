'use client';

import { cn } from '@/lib/utils';
import { ExternalLink, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-[150] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="text-2xl" aria-hidden="true">🐾</span>
          <span className="hidden sm:inline text-dark-green">
            Animal Welfare Tracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/departments"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Organisations
          </Link>
          <Link
            href="/timeline"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Timeline
          </Link>
          <a
            href="https://www.ukvotersforanimals.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            UK Voters for Animals
            <ExternalLink size={12} />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            <Link
              href="/"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/departments"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Organisations
            </Link>
            <Link
              href="/timeline"
              className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Timeline
            </Link>
            <a
              href="https://www.ukvotersforanimals.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              UK Voters for Animals
              <ExternalLink size={12} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

