
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
          infrastructure: { type: Type.STRING, description: "Analyse der Infrastruktur im Stadtteil" },
          demographics: { type: Type.STRING, description: "Analyse der Demografie im Stadtteil" },
          marketTrend: { type: Type.STRING, description: "Analyse des Markttrends im Stadtteil" },
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

    AUFGABE (KRITISCH):
    1. Identifiziere den EXAKTEN Stadtteil (Mikrolage) dieser Adresse. 
    2. Verwende Mietpreise, die spezifisch für diesen Stadtteil gelten, NICHT den Durchschnitt der Gesamtstadt.
    3. Beispiel: Unterscheide zwischen "München-Lehel" (teuer) und "München-Hasenbergl" (günstiger), oder "Berlin-Mitte" vs "Berlin-Marzahn".
    4. Analysiere die Infrastruktur genau an diesem Standort (ÖPNV Anbindung, Lärmpegel, Nähe zu Parks).
    5. Berücksichtige Mietspiegel-Niveaus für diese spezifische Wohnlage.
    
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
