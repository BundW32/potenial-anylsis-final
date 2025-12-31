
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { performAnalysis } from './services/geminiService';
import { Key, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prüfen, ob bereits ein Key ausgewählt wurde
    if (window.aistudio) {
      window.aistudio.hasSelectedApiKey()
        .then(setHasKey)
        .catch(() => setHasKey(false));
    } else {
      // Fallback für Umgebungen ohne aistudio helper
      setHasKey(!!process.env.API_KEY);
    }
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleStartAnalysis = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserInput(data);
    setResult(null);

    try {
      const analysis = await performAnalysis(data);
      setResult(analysis);
      // Kurze Verzögerung für das UI, dann zum Ergebnis scrollen
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (e: any) {
      console.error(e);
      setError("Analyse-Fehler: Die Marktdaten konnten nicht abgerufen werden. Bitte prüfen Sie Ihre Internetverbindung oder den API-Key.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center space-y-6 border border-slate-100">
           <div className="w-20 h-20 bg-[#f5931f]/10 rounded-full flex items-center justify-center mx-auto">
             <Key className="text-[#f5931f]" size={32} />
           </div>
           <h1 className="text-2xl font-black text-slate-900">System-Zugang erforderlich</h1>
           <p className="text-slate-500 text-sm leading-relaxed">
             Um die Potentialanalyse mit Echtzeit-Marktdaten von B&W durchzuführen, wird ein verifizierter API-Key benötigt.
           </p>
           <button 
             onClick={handleOpenKey}
             className="w-full py-4 bg-[#034933] text-white font-black rounded-xl hover:bg-[#f5931f] transition-all shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
           >
             <Sparkles size={18} />
             Key auswählen
           </button>
           <p className="text-[10px] text-slate-400">
             Ein Key aus einem kostenpflichtigen Google Cloud Projekt ist erforderlich. <br/>
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">Abrechnungs-Infos</a>
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-[#f5931f]/30">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Linke Spalte: Formular */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-black text-[#034933] uppercase leading-tight tracking-tighter">
                Maximieren Sie Ihren <span className="text-[#f5931f]">Ertrag.</span>
              </h2>
              <p className="text-slate-500 mt-4 text-sm leading-relaxed max-w-sm">
                Unser KI-Modell scannt lokale Marktangebote, Mietspiegel und Bodenrichtwerte, um das exakte Potential Ihrer Immobilie zu berechnen.
              </p>
            </div>

            <InputForm isLoading={isLoading} onSubmit={handleStartAnalysis} />
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-bold text-red-800 uppercase tracking-widest">Fehler aufgetreten</p>
                  <p className="text-[11px] text-red-600 mt-0.5">{error}</p>
                  <button 
                    onClick={() => userInput && handleStartAnalysis(userInput)} 
                    className="flex items-center gap-1 mt-2 text-[10px] font-black uppercase text-red-700 hover:text-[#034933] transition-colors"
                  >
                    <RefreshCw size={12} /> Analyse wiederholen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Rechte Spalte: Ergebnisse */}
          <div className="lg:col-span-7 scroll-mt-32" ref={resultsRef}>
             {!result && !isLoading && (
               <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-300">
                 <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <Sparkles size={40} className="opacity-30" />
                 </div>
                 <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Bereit für die Analyse</p>
                 <p className="text-[11px] mt-2 max-w-xs leading-relaxed">
                   Geben Sie links die Daten Ihres Objekts ein. Die KI wird daraufhin eine Echtzeit-Recherche durchführen.
                 </p>
               </div>
             )}

             {isLoading && (
               <div className="h-full min-h-[500px] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center p-12 text-center">
                 <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-slate-100 border-t-[#f5931f] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="text-[#034933]" size={32} />
                    </div>
                 </div>
                 <h3 className="text-xl font-black text-[#034933] uppercase tracking-tight">Analyse wird erstellt...</h3>
                 <div className="space-y-2 mt-4">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                      Scanne Marktdaten für {userInput?.address.split(',')[0]}
                    </p>
                    <p className="text-slate-300 text-[9px] uppercase tracking-[0.2em]">
                      Prüfe Vergleichsobjekte & Mietspiegel
                    </p>
                 </div>
               </div>
             )}

             {result && userInput && (
               <AnalysisResults result={result} input={userInput} />
             )}
          </div>

        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 pt-12 border-t border-slate-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#034933] rounded-sm"></div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              © 2024 B&W Immobilien Management UG
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#f5931f] transition-colors">Impressum</a>
            <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#f5931f] transition-colors">Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
