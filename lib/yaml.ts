import 'server-only';
import { TaskforceData } from './types';
import { fetchAndBuildYaml } from './gsheets';
import yaml from 'js-yaml';
import { promises as fs } from 'fs';
import path from 'path';

// We keep a memory cache for synchronous access if needed by other components,
// but the main loader will always bypass it to get fresh data.
let cachedData: TaskforceData | null = null;

/**
 * Load and parse the taskforce YAML data.
 * * STRATEGY: "Fresh-First, Cache-Fallback"
 * 1. Fetch fresh data from Google Sheets immediately.
 * 2. Save (Recache) it to the local file system.
 * 3. Return the fresh data.
 * 4. If Google Sheets fails, fall back to reading the local file.
 */
export async function loadTaskforceData(): Promise<TaskforceData> {
  const filePath = path.join(process.cwd(), 'public', 'taskforce.yaml');

  try {
    // --- Step 1: Fetch Fresh Data ---
    const yamlString = await fetchAndBuildYaml();

    if (!yamlString || yamlString.trim().length === 0) {
      throw new Error('Fetched YAML content is empty');
    }

    // --- Step 2: Recache to Disk ---
    // We perform this asynchronously. If it fails (e.g. read-only filesystem), 
    // we log a warning but still return the fresh data to the user.
    try {
      await fs.writeFile(filePath, yamlString, 'utf8');
    } catch (writeError) {
      console.warn('Warning: Could not write to local file (likely read-only fs), but proceeding with fresh data.');
    }

    // --- Step 3: Parse and Return ---
    const data = yaml.load(yamlString) as TaskforceData;
    validateData(data);
    
    cachedData = data; // Update memory cache
    return data;

  } catch (fetchError) {
    console.error('Fetch failed. Attempting to load from local backup...', fetchError);

    // --- Step 4: Fallback to Local File ---
    try {
      await fs.access(filePath); // Check if file exists
      const fileContents = await fs.readFile(filePath, 'utf8');
      
      const data = yaml.load(fileContents) as TaskforceData;
      validateData(data);

      cachedData = data;
      return data;
    } catch (fsError) {
      // If both Fetch and File fail, the app cannot function.
      throw new Error(`CRITICAL: Failed to load data. Google Sheets error: ${fetchError}. Local cache error: ${fsError}`);
    }
  }
}

/**
 * Validates the structure of the loaded data to prevent crashing the UI
 */
function validateData(data: TaskforceData) {
  if (!data) {
    throw new Error('Data is null or undefined');
  }
  if (!data.recommendations || !Array.isArray(data.recommendations)) {
    throw new Error('Invalid YAML structure: missing or invalid recommendations array');
  }
  if (!data.status_scales) {
    throw new Error('Invalid YAML structure: missing status_scales');
  }
}

/**
 * Get the latest loaded data synchronously.
 * Only works if loadTaskforceData() has been called at least once.
 */
export function getTaskforceDataSync(): TaskforceData | null {
  return cachedData;
}