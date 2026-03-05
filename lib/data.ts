import 'server-only';
import { cache } from 'react';
import { loadTaskforceData as loadTaskforceDataRaw } from './yaml';

// Wrap with React.cache() for request-level deduplication
const loadTaskforceData = cache(loadTaskforceDataRaw);
import {
  TaskforceData,
  Recommendation,
  Chapter,
  Proposal,
  OverallStatus,
  StatusCounts,
  UpcomingDeadline,
  RecentUpdate,
  ChapterWithRecommendations,
  TimelineItem,
  Update,
} from './types';

// Re-export date utilities for convenience (these are also in date-utils.ts for client use)
export { formatDate, formatDateShort, daysUntil, isOverdue, getDeadlineStatus } from './date-utils';

// ========================================
// HELPER FUNCTIONS
// ========================================

async function getChaptersMap(): Promise<Map<number, Chapter>> {
  const data = await loadTaskforceData();
  const chaptersMap = new Map<number, Chapter>();
  
  if (data.chapters) {
    for (const chapter of data.chapters) {
      chaptersMap.set(chapter.id, chapter);
    }
  }
  
  return chaptersMap;
}

// ========================================
// DATA FETCHING (Server Only)
// ========================================

export async function getAllData(): Promise<TaskforceData> {
  return loadTaskforceData();
}

export async function getLastUpdated(): Promise<string | null> {
  const data = await loadTaskforceData();
  return data.last_updated || null;
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations;
}

export async function getChapters(): Promise<Chapter[]> {
  const data = await loadTaskforceData();
  // Get chapters from the chapters array in the YAML
  if (data.chapters && data.chapters.length > 0) {
    return data.chapters.sort((a, b) => a.id - b.id);
  }
  
  // Fallback: extract from recommendations if chapters array doesn't exist
  const chapterMap = new Map<number, Chapter>();
  const chaptersMap = new Map<number, Chapter>();
  if (data.chapters) {
    for (const chapter of data.chapters) {
      chaptersMap.set(chapter.id, chapter);
    }
  }
  
  for (const rec of data.recommendations) {
    const chapterId = rec.chapter_id;
    if (!chapterMap.has(chapterId)) {
      const chapter = chaptersMap.get(chapterId);
      if (chapter) {
        chapterMap.set(chapterId, chapter);
      } else {
        // Fallback if chapter not found in chapters array
        chapterMap.set(chapterId, {
          id: chapterId,
          title: `Chapter ${chapterId}`,
      });
      }
    }
  }
  
  return Array.from(chapterMap.values()).sort((a, b) => a.id - b.id);
}

export async function getProposals(): Promise<Proposal[]> {
  const data = await loadTaskforceData();
  return data.proposals;
}

// ========================================
// SINGLE ITEM FETCHING
// ========================================

export async function getRecommendationById(id: number): Promise<Recommendation | null> {
  const data = await loadTaskforceData();
  const recommendation = data.recommendations.find(r => r.id === id);
  return recommendation || null;
}

export async function getUpdateByDate(recommendationId: number, updateDate: string): Promise<{ recommendation: Recommendation; update: Update } | null> {
  const recommendation = await getRecommendationById(recommendationId);
  if (!recommendation || !recommendation.updates) {
    return null;
  }
  
  const update = recommendation.updates.find(u => u.date === updateDate);
  if (!update) {
    return null;
  }
  
  return { recommendation, update };
}

export async function getRecommendationByCode(code: string): Promise<Recommendation | null> {
  const data = await loadTaskforceData();
  const recommendation = data.recommendations.find(r => r.code === code);
  return recommendation || null;
}

export async function getChapterById(id: number): Promise<ChapterWithRecommendations | null> {
  const [data, chaptersMap] = await Promise.all([
    loadTaskforceData(),
    getChaptersMap(),
  ]);
  const recommendations = data.recommendations.filter(r => r.chapter_id === id);

  if (recommendations.length === 0) return null;

  const chapter = chaptersMap.get(id);
  if (!chapter) return null;

  return {
    id: chapter.id,
    title: chapter.title,
    recommendations,
  };
}

// ========================================
// FILTERED QUERIES
// ========================================

export async function getRecommendationsByChapter(chapterId: number): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => r.chapter_id === chapterId);
}

export async function getRecommendationsByStatus(status: OverallStatus): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => r.overall_status.status === status);
}

export async function getRecommendationsByOwner(owner: string): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  return data.recommendations.filter(r => 
    r.ownership.primary_owner === owner ||
    r.ownership.co_owners?.includes(owner)
  );
}

export async function searchRecommendations(query: string): Promise<Recommendation[]> {
  const data = await loadTaskforceData();
  const lowerQuery = query.toLowerCase();
  
  return data.recommendations.filter(r =>
    r.titles.short.toLowerCase().includes(lowerQuery) ||
    r.titles.long.toLowerCase().includes(lowerQuery) ||
    r.text.toLowerCase().includes(lowerQuery) ||
    r.code.toLowerCase().includes(lowerQuery)
  );
}

// ========================================
// STATISTICS & AGGREGATIONS
// ========================================

export async function getStatusCounts(): Promise<StatusCounts> {
  const data = await loadTaskforceData();
  const counts: StatusCounts = {
    not_started: 0,
    on_track: 0,
    off_track: 0,
    completed: 0,
    abandoned: 0,
    total: data.recommendations.length,
  };
  
  for (const rec of data.recommendations) {
    counts[rec.overall_status.status]++;
  }
  
  return counts;
}

export async function getChaptersWithRecommendations(): Promise<ChapterWithRecommendations[]> {
  const [data, chaptersMap] = await Promise.all([
    loadTaskforceData(),
    getChaptersMap(),
  ]);
  const chapterMap = new Map<number, ChapterWithRecommendations>();
  
  for (const rec of data.recommendations) {
    const chapterId = rec.chapter_id;
    if (!chapterMap.has(chapterId)) {
      const chapter = chaptersMap.get(chapterId);
      if (!chapter) continue; // Skip if chapter not found
      chapterMap.set(chapterId, {
        ...chapter,
        recommendations: [],
      });
    }
    chapterMap.get(chapterId)!.recommendations.push(rec);
  }
  
  return Array.from(chapterMap.values()).sort((a, b) => a.id - b.id);
}

export async function getUniqueOwners(): Promise<string[]> {
  const data = await loadTaskforceData();
  const owners = new Set<string>();
  
  for (const rec of data.recommendations) {
    owners.add(rec.ownership.primary_owner);
    rec.ownership.co_owners?.forEach(o => owners.add(o));
  }
  
  return Array.from(owners).sort();
}

// ========================================
// DEADLINES & TIMELINE
// ========================================

export async function getUpcomingDeadlines(limit: number = 10): Promise<UpcomingDeadline[]> {
  const data = await loadTaskforceData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const deadlines: UpcomingDeadline[] = data.recommendations
    .filter(r => r.overall_status.status !== 'completed' && r.overall_status.status !== 'abandoned')
    .map(r => {
      const targetDate = new Date(r.delivery_timeline.revised_target_date || r.delivery_timeline.target_date);
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        recommendation: r,
        daysUntil: diffDays,
        isOverdue: diffDays < 0,
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
  
  return deadlines.slice(0, limit);
}

export async function getRecentUpdates(limit: number = 10): Promise<RecentUpdate[]> {
  const data = await loadTaskforceData();
  const updates: RecentUpdate[] = [];
  
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        updates.push({ update, recommendation: rec });
      }
    }
  }
  
  return updates
    .sort((a, b) => new Date(b.update.date).getTime() - new Date(a.update.date).getTime())
    .slice(0, limit);
}

export async function getAllUpdates(): Promise<RecentUpdate[]> {
  const data = await loadTaskforceData();
  const updates: RecentUpdate[] = [];
  
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        updates.push({ update, recommendation: rec });
      }
    }
  }
  
  return updates.sort((a, b) => 
    new Date(b.update.date).getTime() - new Date(a.update.date).getTime()
  );
}

export async function getTimelineItems(includeFutureDeadlines: boolean = true): Promise<TimelineItem[]> {
  const data = await loadTaskforceData();
  const items: TimelineItem[] = [];
  
  // Add all updates
  for (const rec of data.recommendations) {
    if (rec.updates) {
      for (const update of rec.updates) {
        items.push({
          type: 'update',
          date: update.date,
          update,
          recommendation: rec,
        });
      }
    }
  }
  
  // Add all deadlines
  if (includeFutureDeadlines) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const rec of data.recommendations) {
      // Only include deadlines for non-completed/abandoned recommendations
      if (rec.overall_status.status !== 'completed' && rec.overall_status.status !== 'abandoned') {
        const targetDate = rec.delivery_timeline.revised_target_date || rec.delivery_timeline.target_date;
        if (targetDate) {
          const targetDateObj = new Date(targetDate);
          const diffTime = targetDateObj.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          items.push({
            type: 'deadline',
            date: targetDate,
            recommendation: rec,
            deadline: {
              targetDate: rec.delivery_timeline.target_date,
              revisedDate: rec.delivery_timeline.revised_target_date,
              daysUntil: diffDays,
              isOverdue: diffDays < 0,
            },
          });
        }
      }
    }
  }
  
  // Sort by date (soonest first - ascending order)
  return items.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

export function getProgressPercentage(counts: StatusCounts): number {
  if (counts.total === 0) return 0;
  return Math.round((counts.completed / counts.total) * 100);
}

export async function getAnimalImpactCounts(): Promise<{ totalAnimalsHelped: number; totalAnimals: number }> {
  const data = await loadTaskforceData();
  let totalAnimalsHelped = 0;
  let totalAnimals = 0;

  for (const rec of data.recommendations) {
        const impact = Number(rec.animals_impacted) || 0;

    totalAnimals += impact;
    if (rec.overall_status.status === 'completed') {
      totalAnimalsHelped += impact;
    }
  }

  return { totalAnimalsHelped, totalAnimals };
}

// ========================================
// OWNER/DEPARTMENT AGGREGATIONS
// ========================================

export interface OwnerWithStats {
  owner: string;
  recommendations: Recommendation[];
  statusCounts: StatusCounts;
  progressPercentage: number;
  keyPeople?: Array<{ title: string; name: string }>;
}

export async function getOwnersWithMoreThanNRecommendations(minCount: number = 1): Promise<OwnerWithStats[]> {
  const data = await loadTaskforceData();
  const ownerMap = new Map<string, Recommendation[]>();
  
  // Group recommendations by all owners (primary and co-owners)
  for (const rec of data.recommendations) {
    // Add primary owner
    const primaryOwner = rec.ownership.primary_owner;
    if (!ownerMap.has(primaryOwner)) {
      ownerMap.set(primaryOwner, []);
    }
    ownerMap.get(primaryOwner)!.push(rec);
    
    // Add co-owners
    if (rec.ownership.co_owners) {
      for (const coOwner of rec.ownership.co_owners) {
        if (!ownerMap.has(coOwner)) {
          ownerMap.set(coOwner, []);
        }
        ownerMap.get(coOwner)!.push(rec);
      }
    }
  }
  
  // Create a map of owner info for quick lookup
  const ownerInfoMap = new Map<string, Array<{ title: string; name: string }>>();
  if (data.owner_info) {
    for (const ownerInfo of data.owner_info) {
      if (ownerInfo.key_people) {
        ownerInfoMap.set(ownerInfo.owner, ownerInfo.key_people);
      }
    }
  }
  
  // Filter owners with more than minCount recommendations and calculate stats
  const ownersWithStats: OwnerWithStats[] = [];
  
  for (const [owner, recommendations] of ownerMap.entries()) {
    if (recommendations.length >= minCount) {
      const statusCounts: StatusCounts = {
        not_started: 0,
        on_track: 0,
        off_track: 0,
        completed: 0,
        abandoned: 0,
        total: recommendations.length,
      };
      
      for (const rec of recommendations) {
        statusCounts[rec.overall_status.status]++;
      }
      
      ownersWithStats.push({
        owner,
        recommendations,
        statusCounts,
        progressPercentage: getProgressPercentage(statusCounts),
        keyPeople: ownerInfoMap.get(owner),
      });
    }
  }
  
  // Sort by total recommendations (descending), then by progress percentage (descending)
  return ownersWithStats.sort((a, b) => {
    if (b.statusCounts.total !== a.statusCounts.total) {
      return b.statusCounts.total - a.statusCounts.total;
    }
    return b.progressPercentage - a.progressPercentage;
  });
}

export async function getOwnerInfo(owner: string): Promise<Array<{ title: string; name: string }> | null> {
  const data = await loadTaskforceData();
  if (!data.owner_info) {
    return null;
  }
  
  const ownerInfo = data.owner_info.find(info => info.owner === owner);
  return ownerInfo?.key_people || null;
}

export async function getAllOwnerInfo(): Promise<Map<string, Array<{ title: string; name: string }>>> {
  const data = await loadTaskforceData();
  const ownerInfoMap = new Map<string, Array<{ title: string; name: string }>>();
  
  if (data.owner_info) {
    for (const ownerInfo of data.owner_info) {
      if (ownerInfo.key_people && ownerInfo.key_people.length > 0) {
        ownerInfoMap.set(ownerInfo.owner, ownerInfo.key_people);
      }
    }
  }
  
  return ownerInfoMap;
}
