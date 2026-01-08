
import React from 'react';
import { AnalysisResult, UserInput } from '../types';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { TrendingUp, ArrowRight, BarChart3, PlusCircle, MinusCircle, ShieldCheck, Bus, Users, LineChart, Quote } from 'lucide-react';
import ZoneExplorer from './ZoneExplorer';

interface AnalysisResultsProps {
  result: AnalysisResult;
  input: UserInput;
  zoneRef?: React.RefObject<HTMLDivElement>;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, input, zoneRef }) => {
  const currentPerSqm = input.currentColdRent / input.sizeSqm;
  const targetPerSqm = result.estimatedMarketRentPerSqm;

  const chartData = [
    { name: 'IST-MIETE', price: currentPerSqm, color: '#475569' },
    { name: 'MARKT-MIETE', price: targetPerSqm, color: '#f5931f' }
  ];

  const formatCurrency = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  const formatSqm = (val: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(val) + '/m²';

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">Ist (Netto Kalt)</p>
          <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(input.currentColdRent)}</p>
          <p className="text-[11px] text-slate-400 font-bold mt-2">{formatSqm(currentPerSqm)}</p>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5 ring-2 ring-[#f5931f]/20 shadow-2xl">
          <p className="text-[9px] text-[#f5931f] font-black uppercase tracking-widest mb-3">Ziel (Markt)</p>
          <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(result.estimatedTotalMarketRent)}</p>
          <p className="text-[11px] text-[#f5931f] font-black mt-2">{formatSqm(targetPerSqm)}</p>
        </div>
        <div className="bg-gradient-to-br from-[#034933] to-[#020617] p-8 rounded-[2rem] border border-emerald-500/20 shadow-2xl text-white">
          <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mb-3">Ertrag p.a.</p>
          <p className="text-3xl font-black tracking-tight">+{formatCurrency(result.potentialYearlyGain)}</p>
          <div className="flex items-center gap-2 mt-2">
             <TrendingUp size={14} className="text-emerald-400" />
             <span className="text-[11px] text-emerald-400 font-black uppercase tracking-widest">+{result.rentGapPercentage.toFixed(1)}% Gap</span>
          </div>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-white/5">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">KI-Konfidenz</p>
          <p className="text-3xl font-black text-white tracking-tight">{result.confidenceScore}%</p>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={14} className="text-sky-400" />
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Grounded AI</p>
          </div>
        </div>
      </div>

      {/* Zone Explorer with Ref for direct scrolling */}
      <div ref={zoneRef} className="scroll-mt-24">
         <ZoneExplorer 
            zones={result.locationZones || []} 
            cityName={input.city || input.address.split(',').pop()?.trim() || 'Objektort'} 
            districtName={input.district}
            qualityScore={result.locationQualityScore}
            qualityLabel={result.locationQualityLabel}
            detailedAnalysis={result.detailedLocationAnalysis}
         />
      </div>

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-[#0f172a] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
             <div className="px-10 py-6 border-b border-white/5 bg-slate-950/30 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <BarChart3 size={18} className="text-[#f5931f]" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Markt-Benchmark (Netto Kalt)</h3>
               </div>
             </div>
             <div className="p-10 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#475569'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569'}} width={40} />
                    <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                    <Bar dataKey="price" barSize={60} radius={[12, 12, 0, 0]}>
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-[#1e293b] rounded-[2.5rem] p-10 border border-white/5">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
               Wertbeeinflussende Faktoren (Hebel)
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {result.featureImpacts.map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${
                      feat.direction === 'positive' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {feat.direction === 'positive' ? <PlusCircle size={18} /> : <MinusCircle size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white tracking-tight">{feat.feature} ({feat.direction === 'positive' ? '+' : ''}{feat.impactPercent}%)</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{feat.description}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="lg:col-span-5 h-full">
           <div className="bg-[#020617] rounded-[2.5rem] p-12 text-white shadow-2xl h-full flex flex-col justify-between border border-[#f5931f]/10 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f5931f]/10 blur-[100px] group-hover:bg-[#f5931f]/20 transition-all duration-1000"></div>
              <div className="relative z-10">
                <p className="text-[10px] text-[#f5931f] font-black uppercase tracking-[0.3em] mb-8">Strategisches Fazit</p>
                <div className="flex gap-4">
                    <Quote size={24} className="text-[#f5931f] shrink-0 opacity-50" />
                    <p className="text-xl font-serif italic leading-relaxed text-slate-200">{result.locationAnalysis}</p>
                </div>
                
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Objekt-Status:</p>
                  <p className="text-xs text-white font-black uppercase tracking-widest">Optimales Steigerungspotential identifiziert.</p>
                </div>
              </div>
              
              <div className="relative z-10 mt-12 flex flex-col gap-4">
                <a 
                  href="https://bundwimmobilien.de/kontaktformular/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full py-5 bg-[#034933] text-white rounded-2xl font-black text-xs hover:bg-white hover:text-emerald-900 transition-all shadow-xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] border border-white/10"
                >
                  Jetzt Beraten Lassen <ArrowRight size={18} />
                </a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
