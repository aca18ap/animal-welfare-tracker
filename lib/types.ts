// ========================================
// NUCLEAR TASKFORCE TRACKER - TYPE DEFINITIONS
// ========================================

// Status Types
export type OverallStatus = 
  | 'not_started' 
  | 'on_track' 
  | 'off_track' 
  | 'completed' 
  | 'abandoned';

export type UpdateStatus = 
  | 'info' 
  | 'progress' 
  | 'risk' 
  | 'on_track'
  | 'off_track' 
  | 'completed' 
  | 'blocked';

export type Confidence = 'low' | 'medium' | 'high';

// Chapter definition
export interface Chapter {
  id: number;
  title: string;
  description?: string;
  summary?: string;
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  recommendation_ids: number[];
}

export interface Titles {
  short: string;
  long: string;
}

export interface Scope {
  sectors: string[];
  domains?: string[];
}

export interface Ownership {
  primary_owner: string;
  co_owners?: string[];
  key_regulators?: string[];
}

export interface DeliveryTimeline {
  original_text: string;
  target_date: string;
  revised_target_date?: string | null;
  notes?: string | null;
}

export interface Dependencies {
  depends_on?: number[];
  enables?: number[];
}

export interface OverallStatusInfo {
  status: OverallStatus;
  last_updated?: string;
  confidence?: Confidence;
  summary?: string;
}

export interface Link {
  title: string;
  url: string;
}

export interface Source {
  type: string;
  reference?: string;
}

export interface ImpactOnOverall {
  changes_overall_status_to?: OverallStatus;
  changes_confidence_to?: Confidence;
  notes?: string;
}

export interface Update {
  date: string;
  status: UpdateStatus;
  tags?: string[];
  title: string;
  description: string;
  links?: Link[];
  source?: Source;
  impact_on_overall?: ImpactOnOverall;
}

export interface Recommendation {
  id: number;
  code: string;
  chapter_id: number;
  proposal_ids?: number[];
  titles: Titles;
  text: string;
  scope: Scope;
  ownership: Ownership;
  delivery_timeline: DeliveryTimeline;
  implementation_type?: string[];
  dependencies?: Dependencies;
  overall_status: OverallStatusInfo;
  updates?: Update[];
  notes?: string;
  animals_impacted?: number;
}

// Root Data Structure
export interface StatusScales {
  overall_status: OverallStatus[];
  update_status: UpdateStatus[];
}

export interface KeyPerson {
  title: string;
  name: string;
}

export interface OwnerInfo {
  owner: string;
  key_people?: KeyPerson[];
}

export interface TaskforceData {
  last_updated?: string;
  status_scales: StatusScales;
  chapters?: Chapter[];
  proposals: Proposal[];
  recommendations: Recommendation[];
  owner_info?: OwnerInfo[];
}

// Computed/Derived Types
export interface RecommendationWithChapter extends Recommendation {
  // Has chapter_id that references the chapters array
}

export interface ChapterWithRecommendations extends Chapter {
  recommendations: Recommendation[];
}

export interface AnimalProgressStats {
  animals_impacted_so_far: number;
  animals_impacted_in_total: number;
}

export interface StatusCounts {
  not_started: number;
  on_track: number;
  off_track: number;
  completed: number;
  abandoned: number;
  total: number;
}

export interface UpcomingDeadline {
  recommendation: Recommendation;
  daysUntil: number;
  isOverdue: boolean;
}

export interface RecentUpdate {
  update: Update;
  recommendation: Recommendation;
}

export interface TimelineItem {
  type: 'update' | 'deadline';
  date: string;
  update?: Update;
  recommendation: Recommendation;
  deadline?: {
    targetDate: string;
    revisedDate?: string | null;
    daysUntil: number;
    isOverdue: boolean;
  };
}

// UI State Types
export interface FilterState {
  status: OverallStatus | 'all';
  chapter: number | 'all';
  owner: string | 'all';
  search: string;
  tag?: string;
}
