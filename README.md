
# B&W Immobilien Management - Potentialanalyse KI

Dieses Projekt ist eine KI-gestützte Web-Anwendung zur Analyse von Mietpotentialen für Immobilien auf dem deutschen Markt. Sie nutzt die Google Gemini 3 API (Flash) mit Google Search Grounding für Echtzeit-Marktdaten.

## 🚀 Features
- **KI-Marktcheck**: Automatische Recherche von Vergleichsmieten via Google Search.
- **Standort-Zonen**: Einordnung des Objekts in lokale Mietspiegel-Klassen.
- **Ertragsrechner**: Berechnung des jährlichen Mehrerlöses und der Rent-Gap.
- **Einflussfaktoren**: Detaillierte Analyse, wie sich Ausstattung (Balkon, Heizung etc.) auf den Preis auswirkt.

## 🛠 Installation & Entwicklung

1. **Repository klonen**
2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```
3. **Lokal starten**:
   ```bash
   npm run dev
   ```
4. **Build für Webserver**:
   ```bash
   npm run build
   ```
   Der Inhalt des `dist`-Ordners kann auf jeden Webserver hochgeladen werden.

## 🔑 API Key
Die Anwendung benötigt einen Google Gemini API Key. In der Live-Umgebung wird dieser über den AI Studio Key-Selector abgefragt.

## ⚖️ Rechtliches
© 2024 B&W Immobilien Management UG. Alle Rechte vorbehalten.
