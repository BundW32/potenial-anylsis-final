
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
        description: "Geschätzte Marktmiete pro Quadratmeter in EUR für die spezifische Mikrolage",
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
          infrastructure: { type: Type.STRING, description: "Analyse der Infrastruktur im Stadtteil (kurz)" },
          demographics: { type: Type.STRING, description: "Analyse der Demografie im Stadtteil (kurz)" },
          marketTrend: { type: Type.STRING, description: "Analyse des Markttrends im Stadtteil (kurz)" },
        },
        required: ["infrastructure", "demographics", "marketTrend"],
      },
      locationQualityScore: {
        type: Type.NUMBER,
        description: "Bewertung der Mikrolage auf einer Skala von 0 (Sehr schlecht) bis 100 (Absolute Top-Lage).",
      },
      locationQualityLabel: {
        type: Type.STRING,
        description: "Kurzes Label für die Lagequalität, z.B. 'A-Lage', 'Gehobene B-Lage', 'Trendviertel', 'Einfache Lage'.",
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
      "locationQualityScore",
      "locationQualityLabel",
      "potentialYearlyGain",
      "rentGapPercentage",
      "confidenceScore",
      "featureImpacts",
    ],
  };

  const districtInfo = input.district ? `STADTTEIL / MIKROLAGE: ${input.district} (Sehr wichtig!)` : "Mikrolage: Automatisch basierend auf Adresse ermitteln";

  const prompt = `
    Führe eine hochpräzise Immobilien-Marktwert-Analyse (MIKROLAGEN-ANALYSE) für folgendes Objekt durch:
    
    STANDORT:
    - Adresse: ${input.address}
    - Stadt: ${input.city || "Aus Adresse ableiten"}
    - ${districtInfo}
    
    OBJEKT-DETAILS:
    - Typ: ${input.propertyType}
    - Fläche: ${input.sizeSqm} m²
    - Zimmer: ${input.rooms}
    - Etage: ${input.floor}
    - Baujahr: ${input.yearBuilt}
    - Zustand: ${input.condition}
    - Aktuelle Kaltmiete: ${input.currentColdRent} EUR
    
    AUFGABE (KRITISCH):
    1. Identifiziere den EXAKTEN Stadtteil (Mikrolage).
    2. Bewerte die Mikrolage präzise auf einer Skala von 0-100 (locationQualityScore). 
       - 90-100: Absolute Bestlage (z.B. München Lehel, Hamburg Harvestehude)
       - 75-89: Gute bis sehr gute Lage
       - 50-74: Durchschnittliche Lage
       - <50: Einfache Lage
    3. Gib der Lage ein Label (locationQualityLabel), z.B. "Trendlage", "Familiäre Bestlage", "Entwicklungsgebiet".
    4. Analysiere Infrastruktur, Demografie und Trend für genau diesen Kiez.
    5. locationZones soll eine Einordnung enthalten (z.B. Vergleich zum Stadtdurchschnitt).
    
    Deine Schätzung muss die Realität des Stadtteils widerspiegeln.
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
