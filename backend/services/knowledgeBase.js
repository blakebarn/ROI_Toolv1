import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DIR = path.join(__dirname, '../data/knowledge-base');

// Cache for knowledge base data
let cache = {};

/**
 * Load a knowledge base JSON file
 */
function loadKBFile(filename) {
  if (cache[filename]) {
    return cache[filename];
  }

  try {
    const filepath = path.join(KB_DIR, filename);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    cache[filename] = data;
    return data;
  } catch (error) {
    console.error(`Error loading KB file ${filename}:`, error.message);
    return null;
  }
}

/**
 * Clear the cache (useful when KB is updated)
 */
export function clearCache() {
  cache = {};
}

/**
 * Get all service offerings
 */
export function getServiceOfferings() {
  return loadKBFile('service-offerings.json') || [];
}

/**
 * Get a specific service profile by ID
 */
export function getServiceProfile(serviceId) {
  const offerings = getServiceOfferings();
  return offerings.find(s => s.id === serviceId);
}

/**
 * Get all industry benchmarks
 */
export function getIndustryBenchmarks() {
  return loadKBFile('industry-benchmarks.json') || [];
}

/**
 * Get a specific industry benchmark by ID
 */
export function getIndustryBenchmark(industryId) {
  const benchmarks = getIndustryBenchmarks();
  return benchmarks.find(b => b.id === industryId);
}

/**
 * Get all modifiers (company size, maturity, engagement type)
 */
export function getModifiers() {
  return loadKBFile('modifiers.json') || {};
}

/**
 * Get cross-service synergies
 */
export function getSynergies() {
  return loadKBFile('synergies.json') || [];
}

/**
 * Get all dropdown options for forms
 */
export function getFormOptions() {
  return loadKBFile('form-options.json') || {};
}

/**
 * Get the full knowledge base
 */
export function getFullKnowledgeBase() {
  return {
    serviceOfferings: getServiceOfferings(),
    industryBenchmarks: getIndustryBenchmarks(),
    modifiers: getModifiers(),
    synergies: getSynergies(),
    formOptions: getFormOptions()
  };
}

export default {
  getServiceOfferings,
  getServiceProfile,
  getIndustryBenchmarks,
  getIndustryBenchmark,
  getModifiers,
  getSynergies,
  getFormOptions,
  getFullKnowledgeBase,
  clearCache
};
