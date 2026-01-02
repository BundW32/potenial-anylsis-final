
import React, { useState, useRef, useEffect } from 'react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { analyzePotential } from './services/geminiService';
import { AlertCircle, Key, ExternalLink, RefreshCcw, Sparkles, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } catch (e) { setHasKey(false); }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    try {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } catch (e) { console.error(e); }
  };

  const handleAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setResult(null);

    try {
      const analysis = await analyzePotential(data);
      setResult(analysis);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    } catch (err: any) {
      setError(err.message || "Die Analyse konnte nicht abgeschlossen werden.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="w-full bg-[#020617] flex items-center justify-center p-8 min-h-[500px] rounded-[2rem]">
        <div className="max-w-md w-full bg-[#0f172a] rounded-[2.5rem] shadow-2xl p-10 text-center space-y-6 border border-white/5 ring-1 ring-white/10">
          <div className="w-16 h-16 bg-[#f5931f]/10 rounded-2xl flex items-center justify-center mx-auto">
            <Key className="text-[#f5931f]" size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Systemzugriff erforderlich</h2>
            <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-widest font-bold">B&W Real-Time Intelligence</p>
          </div>
          <button onClick={handleOpenKeySelector} className="w-full py-5 bg-[#f5931f] text-white font-black rounded-2xl hover:bg-white hover:text-slate-950 transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
            API-Key auswählen <Sparkles size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#020617] text-slate-300 font-sans selection:bg-[#f5931f]/30 py-10 lg:py-20 rounded-[2rem] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        
        {/* Widget Branding Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="flex flex-col items-center">
             <h1 className="text-3xl font-black text-white leading-none uppercase tracking-tighter">B&W</h1>
             <p className="text-[10px] font-black text-[#f5931f] uppercase tracking-[0.4em] mt-1">Immobilien Management</p>
          </div>
          <h2 className="text-4xl lg:text-5xl font-serif italic text-white tracking-tight">Miet-Potential <span className="text-[#f5931f]">entfesseln.</span></h2>
        </div>

        <section className="animate-fade-in">
          <InputForm isLoading={isLoading} onSubmit={handleAnalysis} />
        </section>
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex items-start gap-4 animate-fade-in">
            <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-black text-rose-500 text-[10px] uppercase tracking-widest mb-1">Analyse-Fehler</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{error}</p>
              <button onClick={() => userInput && handleAnalysis(userInput)} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white underline decoration-rose-500/30">
                <RefreshCcw size={14} /> Erneut versuchen
              </button>
            </div>
          </div>
        )}

        <div ref={resultsRef} className="scroll-mt-10">
          {result && userInput && (
            <AnalysisResults result={result} input={userInput} />
          )}
        </div>

        <div className="pt-12 border-t border-white/5 opacity-40">
          <div className="flex items-start gap-4 text-slate-500 max-w-2xl mx-auto text-center flex-col items-center">
            <Scale size={18} className="text-[#f5931f]/50" />
            <p className="text-[10px] leading-loose uppercase tracking-[0.1em] font-medium">
              Diese KI-Analyse basiert auf der Netto-Kaltmiete und dient der Markt-Orientierung. 
              Die B&W Immobilien Management UG übernimmt keine Gewähr für die Prognosen. 
              Individuelle rechtliche Prüfungen sind stets erforderlich.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
