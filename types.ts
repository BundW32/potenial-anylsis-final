
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

export enum EnergyClass {
  APLUS = 'A+',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  UNKNOWN = 'Unbekannt'
}

export interface UserInput {
  address: string;
  district?: string;
  city?: string;
  propertyType: PropertyType;
  sizeSqm: number;
  rooms: number;
  floor: number;
  yearBuilt: number;
  condition: Condition;
  energyClass: EnergyClass;
  currentColdRent: number;
  
  hasEBK: boolean;
  hasFloorHeating: boolean;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasTripleGlazing: boolean;
  hasModernBath: boolean;
  
  isQuietLocation: boolean;
  hasParking: boolean;
  
  sanitaryModernizationYear?: number;
  heatingModernizationYear?: number;
  insulationModernizationYear?: number;
}

export interface FeatureImpact {
  feature: string;
  impactPercent: number;
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface LocationZone {
  id: string;
  name: string;
  description: string;
  impactPercent: string;
  color?: string;
  examples?: string[];
}

export interface DetailedLocationAnalysis {
  infrastructure: string;
  demographics: string;
  marketTrend: string;
}

export interface AnalysisResult {
  estimatedMarketRentPerSqm: number;
  estimatedTotalMarketRent: number;
  locationAnalysis: string;
  detailedLocationAnalysis: DetailedLocationAnalysis;
  
  // Neu: Spezifisches Lage-Scoring
  locationQualityScore: number; // 0-100
  locationQualityLabel: string; // z.B. "A-Lage", "Top Mikrolage", "Entwicklungslage"

  potentialYearlyGain: number;
  rentGapPercentage: number;
  confidenceScore: number;
  featureImpacts: FeatureImpact[];
  locationZones?: LocationZone[];
}

declare global {
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
