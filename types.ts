
export enum PropertyType {
  APARTMENT = 'Wohnung',
  HOUSE = 'Haus',
  COMMERCIAL = 'Gewerbe'
}

export enum Condition {
  NEW = 'Neubau / Erstbezug',
  MINT = 'Neuwertig',
  MODERNIZED = 'Modernisiert',
  WELL_KEPT = 'Gepflegt',
  NEEDS_RENOVATION = 'Renovierungsbedürftig'
}

export interface UserInput {
  address: string;
  propertyType: PropertyType;
  sizeSqm: number;
  rooms: number;
  yearBuilt: number;
  condition: Condition;
  currentColdRent: number;
  hasTripleGlazing: boolean;
  hasBalcony: boolean;
  hasFloorHeating: boolean;
  isBarrierFree: boolean;
  hasModernBathroom: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface FeatureImpact {
  feature: string;
  impactPercent: number;
  direction: 'positive' | 'negative';
  description: string;
}

// Added LocationZone interface to satisfy components/ZoneExplorer.tsx and components/AnalysisResults.tsx
export interface LocationZone {
  id: string;
  name: string;
  description: string;
  color?: string;
  examples?: string[];
}

export interface AnalysisResult {
  estimatedMarketRentPerSqm: number;
  estimatedTotalMarketRent: number;
  locationAnalysis: string;
  potentialYearlyGain: number;
  rentGapPercentage: number;
  sourceType: string;
  confidenceScore: number;
  featureImpacts: FeatureImpact[];
  sources: GroundingSource[];
  // Added optional locationZones property to satisfy component usage
  locationZones?: LocationZone[];
}
