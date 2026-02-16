/**
 * Get the base URL for the application
 * In development, returns localhost
 * In production, returns the production domain
 */
export function getBaseUrl(): string {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  }
  // In production, use the actual domain
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://animalwelfaretracker.uk';
}

/**
 * Get the full URL for a given path
 * @param path - The path (e.g., '/recommendation/1' or '/api/og')
 * @returns The full URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Build a timeline URL with view state parameters
 */
export function buildTimelineUrl(view?: 'list' | 'grid', gridViewMode?: 'departments' | 'recommendations'): string {
  const params = new URLSearchParams();
  if (view) params.set('view', view);
  if (gridViewMode) params.set('gridView', gridViewMode);
  const query = params.toString();
  return `/timeline${query ? `?${query}` : ''}`;
}

/**
 * Get timeline view state from URL search params or sessionStorage
 */
export function getTimelineViewState(): { view?: 'list' | 'grid'; gridViewMode?: 'departments' | 'recommendations' } {
  if (typeof window === 'undefined') return {};
  
  // Try URL params first
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') as 'list' | 'grid' | null;
  const gridView = params.get('gridView') as 'departments' | 'recommendations' | null;
  
  if (view || gridView) {
    return {
      view: view || undefined,
      gridViewMode: gridView || undefined,
    };
  }
  
  // Fallback to sessionStorage
  try {
    const stored = sessionStorage.getItem('timelineViewState');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // Ignore errors
  }
  
  return {};
}

/**
 * Store timeline view state in sessionStorage
 */
export function storeTimelineViewState(view: 'list' | 'grid', gridViewMode: 'departments' | 'recommendations'): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('timelineViewState', JSON.stringify({ view, gridViewMode }));
  } catch (e) {
    // Ignore errors (e.g., private browsing mode)
  }
}

