import { OverallStatus, UpdateStatus } from './types';

// Status display names
export const OVERALL_STATUS_LABELS: Record<OverallStatus, string> = {
  not_started: 'Not Started',
  on_track: 'On Track',
  off_track: 'Off Track',
  completed: 'Completed',
  abandoned: 'Abandoned',
};

export const UPDATE_STATUS_LABELS: Record<UpdateStatus, string> = {
  info: 'Info',
  progress: 'Progress',
  risk: 'Risk',
  on_track: 'On Track',
  off_track: 'Off Track',
  completed: 'Completed',
  blocked: 'Blocked',
};

// Status CSS class mappings
export const OVERALL_STATUS_CLASSES: Record<OverallStatus, string> = {
  not_started: 'status-not-started',
  on_track: 'status-on-track',
  off_track: 'status-off-track',
  completed: 'status-completed',
  abandoned: 'status-abandoned',
};

export const UPDATE_STATUS_CLASSES: Record<UpdateStatus, string> = {
  info: 'status-info',
  progress: 'status-progress',
  risk: 'status-risk',
  on_track: 'status-on-track',
  off_track: 'status-off-track',
  completed: 'status-completed',
  blocked: 'status-blocked',
};

// Status icons (Lucide icon names)
export const OVERALL_STATUS_ICONS: Record<OverallStatus, string> = {
  not_started: 'Circle',
  on_track: 'CheckCircle2',
  off_track: 'AlertCircle',
  completed: 'CheckCircle',
  abandoned: 'XCircle',
};

export const UPDATE_STATUS_ICONS: Record<UpdateStatus, string> = {
  info: 'Info',
  progress: 'TrendingUp',
  risk: 'AlertTriangle',
  on_track: 'CheckCircle2',
  off_track: 'AlertCircle',
  completed: 'CheckCircle',
  blocked: 'Ban',
};

// Department/Owner abbreviation mappings
export const OWNER_FULL_NAMES: Record<string, string> = {
  'DEFRA': 'Department for Environment, Food & Rural Affairs',
  'APHA': 'Animal and Plant Health Agency',
  'FSA': 'Food Standards Agency',
  'RSPCA': 'Royal Society for the Prevention of Cruelty to Animals',
  'EFRA Committee': 'Environment, Food and Rural Affairs Committee',
  'Home Office': 'Home Office',
  'No. 10': 'Number 10',
  'HM Treasury': 'HM Treasury',
  'DHSC': 'Department of Health and Social Care',
  'DBT': 'Department for Business and Trade',
  'EA': 'Environment Agency',
  'NE': 'Natural England',
  'VMD': 'Veterinary Medicines Directorate',
  'AWC': 'Animal Welfare Committee',
};

// Category colors for visual distinction
export const CHAPTER_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-neon-green/10', text: 'text-dark-green', border: 'border-neon-green/30' },
  2: { bg: 'bg-light-blue/10', text: 'text-dark-blue', border: 'border-light-blue/30' },
  3: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30' },
  4: { bg: 'bg-beige/20', text: 'text-dark-green', border: 'border-beige/40' },
  5: { bg: 'bg-dark-green/10', text: 'text-dark-green', border: 'border-dark-green/20' },
  6: { bg: 'bg-light-blue/10', text: 'text-dark-blue', border: 'border-light-blue/30' },
  7: { bg: 'bg-light-red/10', text: 'text-deep-red', border: 'border-light-red/30' },
  8: { bg: 'bg-charcoal/10', text: 'text-charcoal', border: 'border-charcoal/20' },
  9: { bg: 'bg-dark-blue/10', text: 'text-dark-blue', border: 'border-dark-blue/20' },
  10: { bg: 'bg-neon-green/10', text: 'text-dark-green', border: 'border-neon-green/30' },
  11: { bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30' },
};

// Default chapter colors for unknown chapters
export const DEFAULT_CHAPTER_COLORS = { bg: 'bg-muted', text: 'text-foreground', border: 'border-border' };

export function getChapterColors(chapterNumber: number) {
  return CHAPTER_COLORS[chapterNumber] || DEFAULT_CHAPTER_COLORS;
}

// Date formatting options
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

export const DATE_FORMAT_SHORT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
};

// Social media handles (can be overridden via environment variables)
export const TWITTER_SITE_HANDLE = process.env.NEXT_PUBLIC_TWITTER_SITE_HANDLE || undefined;
export const TWITTER_CREATOR_HANDLE = process.env.NEXT_PUBLIC_TWITTER_CREATOR_HANDLE || undefined;

