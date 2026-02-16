import { MetadataRoute } from 'next';
import { getRecommendations, getLastUpdated } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://animalwelfaretracker.uk';
  
  // Get last updated date
  const lastUpdated = await getLastUpdated();
  const lastModified = lastUpdated ? new Date(lastUpdated) : new Date();

  try {
    // Get all recommendations
    const recommendations = await getRecommendations();

    return [
      {
        url: baseUrl,
        lastModified,
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/timeline`,
        lastModified,
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...recommendations.map((rec) => ({
        url: `${baseUrl}/recommendation/${rec.id}`,
        lastModified: rec.overall_status.last_updated 
          ? new Date(rec.overall_status.last_updated)
          : lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    // Fallback sitemap if data loading fails
    console.error('Failed to generate sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/timeline`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
  }
}

