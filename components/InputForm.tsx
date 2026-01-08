
import React, { useState, useEffect, useRef } from 'react';
import { PropertyType, Condition, EnergyClass, UserInput } from '../types';
import { 
  Calculator, MapPin, Ruler, Coins, ChevronDown, ChevronUp, 
  Sparkles, Loader2, Hammer, Utensils, Home, Navigation,
  Wind, ShieldCheck, Thermometer, AlertTriangle, Layers as LayersIcon,
  ScanLine, Radio, CheckCircle2, Zap, BrainCircuit
} from 'lucide-react';

interface InputFormProps {
  isLoading: boolean;
  onSubmit: (data: UserInput) => void;
}

const ANALYSIS_STEPS = [
  "Initialisiere Core-System...",
  "Validiere Geodaten...",
  "Scanne Mikrolage & Umgebung...",
  "Analysiere Infrastruktur-Dichte...",
  "Prüfe Mietspiegel-Datenbank...",
  "Berechne Modernisierungs-Faktoren...",
  "Suche Vergleichsobjekte...",
  "Simuliere Wertsteigerungspotential...",
  "Generiere KI-Strategie...",
  "Finalisiere Exposé..."
];

const InputForm: React.FC<InputFormProps> = ({ isLoading, onSubmit }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Logic for the smooth loader
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    address: '',
    district: '',
    city: '',
    propertyType: PropertyType.APARTMENT,
    sizeSqm: 75,
    rooms: 3,
    floor: 1, 
    yearBuilt: 1980,
    condition: Condition.WELL_KEPT,
    energyClass: EnergyClass.C,
    currentColdRent: 850,
    sanitaryModernizationYear: 2015,
    heatingModernizationYear: 2010,
    insulationModernizationYear: 2018,
    hasEBK: false,
    hasFloorHeating: false,
    hasBalcony: false,
    hasElevator: false,
    hasTripleGlazing: false,
    hasModernBath: false,
    isQuietLocation: false,
    hasParking: false
  });

  const showFloorWarning = Number(formData.floor) >= 3 && !formData.hasElevator;

  // --- LOADER LOGIC ---
  useEffect(() => {
    if (isLoading) {
      setShowOverlay(true);
      setProgress(0);
    } else {
      // If loading finishes, we force progress to 100% then hide after a delay
      if (showOverlay) {
        setProgress(100);
        const timeout = setTimeout(() => {
          setShowOverlay(false);
          setProgress(0);
        }, 800); // Show 100% for 0.8 seconds
        return () => clearTimeout(timeout);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (!showOverlay || progress >= 100) return;

    // Slower interval for "deep analysis" feel
    const interval = setInterval(() => {
      setProgress(prev => {
        // If real loading is still happening, cap at 95%
        if (isLoading && prev >= 95) {
          return 95; 
        }
        // If we reached 100 (via the effect above), stay there
        if (prev >= 100) return 100;

        // Slow, slightly random increment
        const increment = Math.random() * 1.5 + 0.5; 
        return Math.min(prev + increment, 99);
      });
    }, 150); // Updates every 150ms

    return () => clearInterval(interval);
  }, [showOverlay, isLoading, progress]);

  // Calculate which text step to show based on progress
  const currentStepIndex = Math.min(
    Math.floor((progress / 100) * ANALYSIS_STEPS.length),
    ANALYSIS_STEPS.length - 1
  );
  // --------------------

  useEffect(() => {
    if (formData.address.length < 5) return;
    const timeoutId = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(formData.address)}&limit=5&lang=de`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (e) { console.error(e); } finally { setIsSearchingAddress(false); }
    }, 200); 
    return () => clearTimeout(timeoutId);
  }, [formData.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSelectSuggestion = (s: any) => {
    const p = s.properties;
    const extractedDistrict = p.district || p.suburb || p.quarter || '';
    const extractedCity = p.city || p.town || p.village || '';

    setFormData(prev => ({ 
      ...prev, 
      address: `${p.street || p.name || ''} ${p.housenumber || ''}, ${p.postcode || ''} ${p.city || ''}`,
      district: extractedDistrict,
      city: extractedCity
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      sizeSqm: Number(formData.sizeSqm),
      rooms: Number(formData.rooms),
      floor: Number(formData.floor),
      yearBuilt: Number(formData.yearBuilt),
      currentColdRent: Number(formData.currentColdRent),
      sanitaryModernizationYear: Number(formData.sanitaryModernizationYear),
      heatingModernizationYear: Number(formData.heatingModernizationYear),
      insulationModernizationYear: Number(formData.insulationModernizationYear)
    });
  };

  return (
    <div className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden ring-1 ring-white/10 orange-glow relative">
      <div className="bg-slate-950/40 px-8 py-5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#f5931f]/10 rounded-xl">
            <Calculator className="text-[#f5931f]" size={20} />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">B&W Potential-Konfigurator</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Berechnungsbasis: Netto-Kaltmiete</p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[600px]">
        {/* Advanced Scanner Loading Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 z-[200] bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-fade-in">
             <div className="w-full max-w-md flex flex-col items-center relative">
                
                {/* Radar/Scanner Visual */}
                <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                   {/* Pulsing Rings */}
                   <div className="absolute inset-0 border border-[#f5931f]/20 rounded-full animate-[ping_2s_linear_infinite]"></div>
                   <div className="absolute inset-4 border border-[#f5931f]/10 rounded-full animate-[ping_2s_linear_infinite_0.5s]"></div>
                   <div className="absolute inset-12 border border-white/5 rounded-full"></div>
                   
                   {/* Rotating Scanner */}
                   <div className="absolute inset-0 rounded-full animate-[spin_2s_linear_infinite] border-t-2 border-[#f5931f]/50 border-r border-r-transparent border-l border-l-transparent border-b border-b-transparent shadow-[0_-10px_40px_rgba(245,147,31,0.2)]"></div>
                   
                   {/* Center Content */}
                   <div className="relative z-10 w-24 h-24 bg-[#0f172a] rounded-full border border-white/10 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                     <div className="absolute inset-0 bg-[#f5931f]/5"></div>
                     <span className="text-2xl font-black text-white tabular-nums tracking-tighter z-10">
                        {Math.floor(progress)}<span className="text-xs text-[#f5931f] align-top">%</span>
                     </span>
                     {/* Brain Icon fading in/out */}
                     <BrainCircuit size={40} className="absolute text-white/5 animate-pulse" />
                   </div>
                   
                   {/* Data Particles */}
                   <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>
                   <div className="absolute bottom-10 right-10 w-1 h-1 bg-[#034933] rounded-full animate-ping delay-100"></div>
                </div>

                {/* Status Text Area */}
                <div className="space-y-6 w-full relative">
                  <div className="h-10 flex items-center justify-center overflow-hidden">
                    <p key={currentStepIndex} className="text-xs font-black text-white uppercase tracking-[0.15em] animate-in slide-in-from-bottom-1 fade-in duration-300 text-center">
                      {ANALYSIS_STEPS[currentStepIndex]}
                    </p>
                  </div>
                  
                  {/* Real Continuous Progress Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute inset-y-0 left-0 bg-[#f5931f] transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest px-1">
                    <span>System-Start</span>
                    <span className="animate-pulse text-[#f5931f]">
                        {progress < 100 ? (formData.district ? `Mikrolage: ${formData.district}` : 'Scanne Umgebung...') : 'Analyse Fertig'}
                    </span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Tech Deco Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-20">
                   <ScanLine size={100} className="text-white" />
                </div>
             </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
          {/* Standort */}
          <div className="space-y-3 relative" ref={suggestionRef}>
            <div className="flex justify-between items-baseline">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Objekt-Standort</label>
                {formData.district && (
                    <span className="text-[10px] font-bold text-[#f5931f] uppercase tracking-wider animate-in fade-in">
                        Mikrolage erkannt: {formData.district}
                    </span>
                )}
            </div>
            <div className="relative">
              <MapPin className="absolute left-5 top-4 h-5 w-5 text-[#f5931f]" />
              <input 
                type="text" name="address" value={formData.address} onChange={handleChange} required 
                placeholder="Straße, PLZ & Ort"
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-[#f5931f]/30 transition-all placeholder:text-slate-700" 
              />
              {isSearchingAddress && <Loader2 size={16} className="absolute right-5 top-4.5 text-slate-500 animate-spin" />}
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-[60] left-0 right-0 mt-3 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/50">
                {suggestions.map((s, idx) => {
                    const props = s.properties;
                    const districtInfo = props.district || props.suburb || props.quarter;
                    return (
                        <li key={idx}>
                            <button type="button" onClick={() => handleSelectSuggestion(s)} className="w-full text-left px-6 py-4 hover:bg-[#f5931f]/10 text-slate-300 text-xs border-b border-white/5 last:border-0 transition-colors group">
                                <span className="block font-medium text-white">
                                    {props.street || props.name} {props.housenumber || ''}
                                </span>
                                <span className="block text-slate-500 text-[10px] uppercase tracking-wide mt-1 group-hover:text-[#f5931f]">
                                    {props.postcode} {props.city} {districtInfo ? `• ${districtInfo}` : ''}
                                </span>
                            </button>
                        </li>
                    );
                })}
              </ul>
            )}
          </div>

          {/* Basisdaten Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Fläche (m²)</label>
              <div className="relative">
                <Ruler className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="sizeSqm" value={formData.sizeSqm} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Zimmer</label>
              <div className="relative">
                <Home className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Etage</label>
              <div className="relative">
                <LayersIcon className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="floor" value={formData.floor} onChange={handleChange} placeholder="z.B. 1" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Baujahr</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
             <div className="space-y-3 col-span-2 lg:col-span-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Zustand</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none appearance-none cursor-pointer">
                {Object.values(Condition).map(c => <option key={c} value={c} className="bg-[#0f172a]">{c}</option>)}
              </select>
            </div>
          </div>

          {/* Modernisierungsdaten */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Sanitär-Mod. (Jahr)</label>
              <div className="relative">
                <Hammer className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="sanitaryModernizationYear" value={formData.sanitaryModernizationYear} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Heizungs-Mod. (Jahr)</label>
              <div className="relative">
                <Thermometer className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="heatingModernizationYear" value={formData.heatingModernizationYear} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Dämmung-Mod. (Jahr)</label>
              <div className="relative">
                <LayersIcon className="absolute left-4 top-3.5 text-slate-600" size={16} />
                <input type="number" name="insulationModernizationYear" value={formData.insulationModernizationYear} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
             <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Ist-Miete (Netto Kalt)</label>
              <div className="relative">
                <Coins className="absolute left-5 top-3.5 text-slate-600" size={18} />
                <input type="number" name="currentColdRent" value={formData.currentColdRent} onChange={handleChange} className="w-full pl-14 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:ring-1 focus:ring-[#f5931f]" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase">Energieeffizienz-Klasse</label>
              <select name="energyClass" value={formData.energyClass} onChange={handleChange} className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none">
                {Object.values(EnergyClass).map(e => <option key={e} value={e} className="bg-[#0f172a]">{e}</option>)}
              </select>
            </div>
          </div>

          {/* Indikatoren Sektion */}
          <div className="space-y-6 pt-6 border-t border-white/5">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-[#f5931f] uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Weitere Ausstattungs-Indikatoren
                </h3>
                <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-[9px] font-black text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-[0.2em]">
                  {showAdvanced ? 'Optionen verbergen' : 'Details einblenden'}
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
             </div>

             {showAdvanced && showFloorWarning && (
                <div className="bg-[#f5931f]/10 border border-[#f5931f]/30 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="text-[#f5931f] shrink-0 mt-0.5" size={16} />
                  <div>
                    <h4 className="text-[10px] font-black text-[#f5931f] uppercase tracking-widest mb-1">Marktwert-Hinweis: Etage {formData.floor}</h4>
                    <p className="text-xs text-slate-300">
                      Objekte ab der 3. Etage ohne Aufzug erfahren am Markt oft Preisabschläge aufgrund eingeschränkter Barrierefreiheit. Dies wird in der Berechnung berücksichtigt.
                    </p>
                  </div>
                </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {showAdvanced && (
                  <>
                    {[
                      { name: 'hasEBK', label: 'Einbauküche', icon: Utensils },
                      { name: 'hasFloorHeating', label: 'Fußbodenheizung', icon: Wind },
                      { name: 'hasBalcony', label: 'Balkon/Terrasse', icon: Home },
                      { name: 'hasElevator', label: 'Aufzug', icon: Navigation },
                      { name: 'hasModernBath', label: 'Modernes Bad', icon: Hammer },
                      { name: 'hasTripleGlazing', label: '3-fach Verglasung', icon: ShieldCheck },
                      { name: 'hasParking', label: 'Stellplatz', icon: Navigation },
                      { name: 'isQuietLocation', label: 'Ruhige Lage', icon: Zap },
                    ].map(item => (
                      <label key={item.name} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                        formData[item.name] ? 'bg-[#f5931f]/10 border-[#f5931f]/40 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                      }`}>
                        <div className="relative">
                          <input type="checkbox" name={item.name} checked={formData[item.name]} onChange={handleChange} className="sr-only" />
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData[item.name] ? 'bg-[#f5931f] border-[#f5931f]' : 'border-slate-700'}`}>
                            {formData[item.name] && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           {React.createElement(item.icon, { size: 14, className: formData[item.name] ? 'text-[#f5931f]' : 'text-slate-700' })}
                           <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
                        </div>
                      </label>
                    ))}
                  </>
                )}
             </div>
          </div>

          <button type="submit" disabled={isLoading || showOverlay || !formData.address}
            className="w-full py-6 bg-[#f5931f] text-white font-black rounded-2xl shadow-2xl hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.3em] group mt-4 overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-3">Marktwert-Analyse berechnen <Sparkles size={18} /></span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputForm;
