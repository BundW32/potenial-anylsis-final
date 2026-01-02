import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, AnalysisResult } from "../types";

function extractJSON(text: string): any {
  try {
    let cleanText = text.trim();
    // Remove markdown code blocks if present
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parsing Error:", e);
    console.error("Raw Text:", text);
    throw new Error("Datenanalyse fehlgeschlagen. Ungültiges Format.");
  }
}

export const analyzePotential = async (input: UserInput): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      estimatedMarketRentPerSqm: {
        type: Type.NUMBER,
        description: "Geschätzte Marktmiete pro Quadratmeter in EUR",
      },
      estimatedTotalMarketRent: {
        type: Type.NUMBER,
        description: "Geschätzte Gesamtmarktmiete in EUR (Netto Kalt)",
      },
      locationAnalysis: {
        type: Type.STRING,
        description: "Kurzes strategisches Fazit zur Lage und zum Potenzial.",
      },
      detailedLocationAnalysis: {
        type: Type.OBJECT,
        properties: {
          infrastructure: { type: Type.STRING, description: "Analyse der Infrastruktur" },
          demographics: { type: Type.STRING, description: "Analyse der Demografie" },
          marketTrend: { type: Type.STRING, description: "Analyse des Markttrends" },
        },
        required: ["infrastructure", "demographics", "marketTrend"],
      },
      potentialYearlyGain: {
        type: Type.NUMBER,
        description: "Potenzieller jährlicher Mehrertrag in EUR.",
      },
      rentGapPercentage: {
        type: Type.NUMBER,
        description: "Prozentuale Lücke zur Marktmiete.",
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: "Konfidenzscore der Schätzung (0-100).",
      },
      featureImpacts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            feature: { type: Type.STRING },
            impactPercent: { type: Type.NUMBER },
            direction: { type: Type.STRING, enum: ["positive", "negative", "neutral"] },
            description: { type: Type.STRING },
          },
          required: ["feature", "impactPercent", "direction", "description"],
        },
      },
      locationZones: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            impactPercent: { type: Type.STRING },
            color: { type: Type.STRING },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["id", "name", "description", "impactPercent"],
        },
      },
    },
    required: [
      "estimatedMarketRentPerSqm",
      "estimatedTotalMarketRent",
      "locationAnalysis",
      "detailedLocationAnalysis",
      "potentialYearlyGain",
      "rentGapPercentage",
      "confidenceScore",
      "featureImpacts",
    ],
  };

  const prompt = `
    Führe eine detaillierte Immobilien-Marktwert-Analyse für folgendes Objekt durch:
    
    ADRESSE: ${input.address}
    DETAILS:
    - Typ: ${input.propertyType}
    - Fläche: ${input.sizeSqm} m²
    - Zimmer: ${input.rooms}
    - Etage: ${input.floor}
    - Baujahr: ${input.yearBuilt}
    - Zustand: ${input.condition}
    - Energieeffizienzklasse: ${input.energyClass}
    - Aktuelle Kaltmiete: ${input.currentColdRent} EUR
    
    AUSSTATTUNG & MODERNISIERUNG:
    - EBK: ${input.hasEBK ? "Ja" : "Nein"}
    - Fußbodenheizung: ${input.hasFloorHeating ? "Ja" : "Nein"}
    - Balkon/Terrasse: ${input.hasBalcony ? "Ja" : "Nein"}
    - Aufzug: ${input.hasElevator ? "Ja" : "Nein"}
    - 3-fach Verglasung: ${input.hasTripleGlazing ? "Ja" : "Nein"}
    - Modernes Bad: ${input.hasModernBath ? "Ja" : "Nein"}
    - Stellplatz: ${input.hasParking ? "Ja" : "Nein"}
    - Ruhige Lage: ${input.isQuietLocation ? "Ja" : "Nein"}
    - Sanitär modernisiert: ${input.sanitaryModernizationYear || "Nein"}
    - Heizung modernisiert: ${input.heatingModernizationYear || "Nein"}
    - Dämmung modernisiert: ${input.insulationModernizationYear || "Nein"}

    AUFGABE:
    Berechne das realistische Mietpotenzial und analysiere die Lagequalität basierend auf deutschen Immobilienmarktdaten.
    Berücksichtige Mietspiegel-Niveaus für die Region und spezifische Wohnwertmerkmale.
    Identifiziere Hebel zur Wertsteigerung.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const text = response.text;
  if (!text) {
     throw new Error("Die KI konnte keine Antwort generieren.");
  }
  
  return extractJSON(text);
};
