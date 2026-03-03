import Papa from 'papaparse';
import yaml from 'js-yaml';

// 1. Configuration: Replace with your actual Google Sheet ID
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Map tab names to their GID (Sheet ID). 
// You can find these in the URL of your Google Sheet: #gid=12345
// Note: If you publish to web as CSV, you usually just need the Sheet Name if using the visualization API, 
// or the GID if using the export URL. The export URL is often more reliable.
const TABS = {
  meta: { gid: process.env.META_DATA_SHEET_ID ?? '', name: 'Meta' }, 
  chapters: { gid: process.env.CHAPTERS_SHEET_ID ?? '', name: 'Chapters' },
  proposals: { gid: process.env.PROPOSALS_SHEET_ID ?? '', name: 'Proposals' },
  owners: { gid: process.env.OWNERS_SHEET_ID ?? '', name: 'Owners' },
  recommendations: { gid: process.env.RECOMMENDATIONS_SHEET_ID ?? '', name: 'Recommendations' },
  updates: { gid: process.env.UPDATES_SHEET_ID ?? '', name: 'Updates' }
};
// --- Interfaces (The Strong Types) ---

// 1. Raw CSV Row Interfaces (What comes FROM Google Sheets)
interface MetaRow { Key: string; Value: string }
interface ChapterRow { id: number; title: string; summary: string }
interface ProposalRow { id: number; title: string; description: string; recommendation_ids: string | number }
interface OwnerRow { owner: string; key_people_json: string }
interface UpdateRow { 
  recommendation_id: number; 
  date: string; 
  status: string; 
  title: string; 
  description: string; 
  links_json: string 
}
interface RecRow {
  id: number;
  code: string;
  chapter_id: number;
  proposal_ids: string | number;
  title_short: string;
  title_long: string;
  text: string;
  sectors: string;
  domains: string;
  primary_owner: string;
  co_owners: string;
  key_regulators: string;
  timeline_text: string;
  target_date: string;
  revised_target_date?: string;
  timeline_notes?: string;
  impl_type: string;
  depends_on: string;
  enables: string;
  status: string;
  status_last_updated?: string;
  confidence?: string;
  status_summary: string;
  animals_impacted: number;
}

// 2. Final Data Interfaces (What goes INTO the YAML)
interface Link { title: string; url: string }
interface KeyPerson { title: string; name: string }

interface Update {
  date: string;
  status: string;
  title: string;
  description: string;
  links: Link[];
}

interface Recommendation {
  id: number;
  code: string;
  chapter_id: number;
  proposal_ids: string[]; // Normalized to array of strings
  titles: { short: string; long: string };
  text: string;
  sectors: string[];
  domains: string[];
  ownership: {
    primary_owner: string;
    co_owners: string[];
    key_regulators: string[];
  };
  delivery_timeline: {
    original_text: string;
    target_date: string;
    revised_target_date: string | null;
    notes: string | null;
  };
  implementation_type: string[];
  dependencies: {
    depends_on: string[];
    enables: string[];
  };
  overall_status: {
    status: string;
    last_updated: string;
    confidence: string;
    summary: string;
  };
  updates: Update[];
  animals_impacted: number;
}

interface FinalYamlStructure {
  last_updated: string;
  status_scales: {
    overall_status: string[];
    update_status: string[];
  };
  chapters: { id: number; title: string; summary: string }[];
  proposals: { id: number; title: string; description: string; recommendation_ids: string[] }[];
  ownership: { owner: string; key_people: KeyPerson[] }[];
  recommendations: Recommendation[];
  total_animals_impacted: number;
}

// --- Helpers ---

// Helper to fetch and parse CSV with generic type T
async function fetchSheet<T>(gid: string): Promise<T[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Failed to fetch GID ${gid}`);
    const csvText = await response.text();
    console.log(csvText); // Debug: Log raw CSV text
    return new Promise((resolve, reject) => {
      Papa.parse<T>(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true, 
        complete: (results) => resolve(results.data),
        error: (err: any) => reject(err)
      });
    });
  } catch (error) {
    console.error(`Error fetching GID ${gid}:`, error);
    return [];
  }
}

const toList = (input: string | number | null | undefined): string[] => {
  if (!input) return [];
  return input.toString().split(',').map(s => s.trim()).filter(s => s !== '');
};

const toJson = <T>(str: string | null | undefined): T[] => {
  if (!str) return [];
  try {
    return JSON.parse(str) as T[];
  } catch (e) {
    console.warn("Failed to parse JSON cell:", str);
    return [];
  }
};

// --- Main Builder Function ---

export async function fetchAndBuildYaml(): Promise<string> {
  // 1. Fetch all tabs in parallel with specific row types
  const [metaData, chapters, proposals, owners, recommendations, updates] = await Promise.all([
    fetchSheet<MetaRow>(TABS.meta.gid),
    fetchSheet<ChapterRow>(TABS.chapters.gid),
    fetchSheet<ProposalRow>(TABS.proposals.gid),
    fetchSheet<OwnerRow>(TABS.owners.gid),
    fetchSheet<RecRow>(TABS.recommendations.gid),
    fetchSheet<UpdateRow>(TABS.updates.gid)
  ]);

  // 2. Process Meta
  const metaDict: Record<string, string> = {};
  metaData.forEach(row => {
    if (row.Key && row.Value) metaDict[row.Key] = row.Value;
  });

  // 3. Process Updates (Group by recommendation_id)
  const updatesMap: Record<number, Update[]> = {};
  updates.forEach(u => {
    const rid = u.recommendation_id;
    if (!updatesMap[rid]) updatesMap[rid] = [];
    
    updatesMap[rid].push({
      date: u.date,
      status: u.status,
      title: u.title,
      description: u.description,
      links: toJson<Link>(u.links_json)
    });
  });

  // 4. Build Recommendation Objects
  const processedRecommendations: Recommendation[] = recommendations.map(rec => {
    console.log(rec)
    return {
      id: rec.id,
      code: rec.code,
      chapter_id: rec.chapter_id,
      proposal_ids: toList(rec.proposal_ids),
      titles: {
        short: rec.title_short,
        long: rec.title_long
      },
      text: rec.text,
      sectors: toList(rec.sectors),
      domains: toList(rec.domains),
      ownership: {
        primary_owner: rec.primary_owner,
        co_owners: toList(rec.co_owners),
        key_regulators: toList(rec.key_regulators)
      },
      delivery_timeline: {
        original_text: rec.timeline_text,
        target_date: rec.target_date,
        revised_target_date: rec.revised_target_date || null,
        notes: rec.timeline_notes || null
      },
      implementation_type: toList(rec.impl_type),
      dependencies: {
        depends_on: toList(rec.depends_on),
        enables: toList(rec.enables)
      },
      overall_status: {
        status: rec.status,
        last_updated: rec.status_last_updated || metaDict['last_updated'] || new Date().toISOString().split('T')[0],
        confidence: rec.confidence || 'medium',
        summary: rec.status_summary
      },
      updates: updatesMap[rec.id] || [],
      animals_impacted: parseInt(rec.animals_impacted as any) || 0
    };
  });

  // 5. Process Owners
  const processedOwners = owners.map(o => ({
    owner: o.owner,
    key_people: toJson<KeyPerson>(o.key_people_json)
  }));

  // 6. Assemble Final Object
  const finalStructure: FinalYamlStructure = {
    last_updated: metaDict['last_updated'] || new Date().toISOString().split('T')[0],
    status_scales: {
      overall_status: toList(metaDict['status_options']),
      update_status: toList(metaDict['update_options'])
    },
    chapters: chapters.map(c => ({
      id: c.id,
      title: c.title,
      summary: c.summary
    })),
    proposals: proposals.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      recommendation_ids: toList(p.recommendation_ids)
    })),
    ownership: processedOwners,
    recommendations: processedRecommendations,
    total_animals_impacted: processedRecommendations.reduce((sum, rec) => parseInt(sum as any) + parseInt(rec.animals_impacted as any), 0)
  };

  console.log(`Total Animals Impacted: ${finalStructure.total_animals_impacted}`);


  // 7. Dump to YAML
  return yaml.dump(finalStructure, { noRefs: true, lineWidth: -1 });
}