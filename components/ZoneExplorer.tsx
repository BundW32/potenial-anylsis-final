
import React from 'react';
import { LocationZone, DetailedLocationAnalysis } from '../types';
import { Map as MapIcon, Info, Bus, Users, LineChart, MapPin, Target, Sparkles, TrendingUp } from 'lucide-react';

interface ZoneExplorerProps {
  zones: LocationZone[];
  cityName: string;
  districtName?: string;
  qualityScore?: number;
  qualityLabel?: string;
  detailedAnalysis?: DetailedLocationAnalysis;
}

const ZoneExplorer: React.FC<ZoneExplorerProps> = ({ 
  zones, 
  cityName, 
  districtName, 
  qualityScore = 0, 
  qualityLabel = "Lage",
  detailedAnalysis 
}) => {
  
  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#f5931f'; // Orange/Gold
    if (score >= 75) return '#10b981'; // Green
    if (score >= 50) return '#3b82f6'; // Blue
    return '#94a3b8'; // Slate
  };

  const scoreColor = getScoreColor(qualityScore);

  return (
    <div className="bg-[#1e293b] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden ring-1 ring-white/5 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="px-8 py-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/20">
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f5931f]/10 rounded-xl">
                <MapIcon className="text-[#f5931f]" size={18} />
            </div>
            <div>
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                    Mikrolagen-Rating
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                    {cityName} {districtName ? `• ${districtName}` : ''}
                </p>
            </div>
        </div>
      </div>

      <div className="p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Score Gauge / Visual */}
            <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="relative mb-6">
                    {/* Background Bar */}
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                            style={{ width: `${qualityScore}%`, backgroundColor: scoreColor }}
                        ></div>
                    </div>
                    {/* Markers */}
                    <div className="flex justify-between mt-2 text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">
                        <span>Einfach</span>
                        <span>Mittel</span>
                        <span>Gut</span>
                        <span>Top</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                     <span className="text-6xl font-black text-white tracking-tighter tabular-nums">{qualityScore}</span>
                     <span className="text-lg font-bold text-slate-500">/ 100</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 w-fit">
                    <Target size={14} style={{ color: scoreColor }} />
                    <span className="text-xs font-black uppercase tracking-widest text-white">{qualityLabel}</span>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                   Der Score basiert auf Infrastruktur, Mietpreisniveau und Nachfrage-Trends im Vergleich zur Gesamtstadt.
                </p>
            </div>

            {/* Detailed Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {detailedAnalysis ? (
                    <>
                        <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                            <div className="flex items-center gap-3 mb-3">
                                <Bus size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Infrastruktur</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {detailedAnalysis.infrastructure}
                            </p>
                        </div>
                        
                        <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                             <div className="flex items-center gap-3 mb-3">
                                <Users size={16} className="text-pink-400 group-hover:scale-110 transition-transform" />
                                <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Demografie</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {detailedAnalysis.demographics}
                            </p>
                        </div>

                        <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group col-span-1 md:col-span-2">
                             <div className="flex items-center gap-3 mb-3">
                                <TrendingUp size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Markt-Dynamik & Trend</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                {detailedAnalysis.marketTrend}
                            </p>
                        </div>
                    </>
                 ) : (
                    <div className="col-span-2 flex items-center justify-center p-8 text-slate-500 text-xs">
                        Keine Detaildaten verfügbar.
                    </div>
                 )}
            </div>
        </div>

        {/* Comparison Zones (if available) - Reduced visual footprint */}
        {zones && zones.length > 0 && (
             <div className="mt-8 pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={12} /> Lage-Vergleich
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {zones.map((zone, idx) => (
                        <div key={zone.id || idx} className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color || '#94a3b8' }}></div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase">{zone.name}</span>
                            </div>
                             <span className="text-[10px] font-mono text-slate-500">{zone.impactPercent}</span>
                        </div>
                    ))}
                </div>
             </div>
        )}
      </div>
    </div>
  );
};

export default ZoneExplorer;
