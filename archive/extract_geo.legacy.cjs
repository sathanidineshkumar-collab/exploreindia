const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../server.ts'), 'utf8');
const lines = content.split('\n');

// Lines 52 to 86 is OFFLINE_GEO_DB (0-indexed: 51 to 86)
const offlineGeoLines = lines.slice(51, 86).join('\n');

// Lines 430 to 1775 is the geoDataService body (0-indexed: 429 to 1775)
let geoServiceLines = lines.slice(429, 1775).join('\n');

geoServiceLines = geoServiceLines
  .replace('async function fetchWithTimeout', 'export async function fetchWithTimeout')
  .replace('const KNOWN_INDIAN_CITIES', 'export const KNOWN_INDIAN_CITIES')
  .replace('const LANDMARK_TO_CITY', 'export const LANDMARK_TO_CITY')
  .replace('function resolveQueryMetadata', 'export function resolveQueryMetadata')
  .replace('function extractCityName', 'export function extractCityName')
  .replace('function getSanitizedPhotos', 'export function getSanitizedPhotos')
  .replace('function getCityImage', 'export function getCityImage')
  .replace('function getCityDescription', 'export function getCityDescription')
  .replace('function generateMockPlaces', 'export function generateMockPlaces');

const header = `import { Place, PlaceType, CityInfo } from "../models/types";

export interface QueryMetadata {
  cityName: string;
  suggestedTab?: "all" | "tourism" | "stays" | "food" | "temples";
}

`;

const fullFile = header + 'export ' + offlineGeoLines + '\n\n' + geoServiceLines;

const targetPath = path.join(__dirname, '../backend/src/services/geoDataService.ts');
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, fullFile, 'utf8');
console.log('geoDataService.ts written successfully, bytes:', fullFile.length);
