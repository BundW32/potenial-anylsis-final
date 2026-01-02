
import React, { useState } from 'react';
import { LocationZone } from '../types';
import { Map as MapIcon, Info, Navigation, ExternalLink, MapPin } from 'lucide-react';

interface ZoneExplorerProps {
  zones: LocationZone[];
  mapLink?: string;
  cityName: string;
}

const ZoneExplorer: React.FC<ZoneExplorerProps> = ({ zones, mapLink, cityName }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(zones[1]?.id || null);

  const activeZone = zones.find(z => z.id === selectedZone);

  return (
    <div className="bg-[#1e293b] rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden ring-1 ring-white/5">
      <div className="px-8 py-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/20">
        <div>
          <h3 className="text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-[0.2em]">
            <MapIcon className="text-[#f5931f]" size={14} />
            Lage-Klassifizierung: {cityName}
          </h3>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`p-4 rounded-2xl border transition-all text-center ${
                selectedZone === zone.id 
                  ? 'border-[#f5931f] bg-[#f5931f]/10 ring-2 ring-[#f5931f]/10' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ backgroundColor: zone.color || '#cbd5e1' }}></div>
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Markt</span>
              </div>
              <h4 className={`font-black text-[10px] uppercase tracking-tighter truncate ${selectedZone === zone.id ? 'text-white' : 'text-slate-500'}`}>{zone.name}</h4>
              <p className="text-[9px] font-bold text-[#f5931f] mt-1">{zone.impactPercent}</p>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeZone && (
          <div className="bg-slate-950/40 rounded-2xl p-6 border border-white/5 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/5 rounded-lg mt-0.5">
                   <Info size={14} className="text-slate-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {activeZone.description}
                </p>
              </div>

              {activeZone.examples && activeZone.examples.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {activeZone.examples.map((ex, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-white/5 text-slate-500 px-3 py-1.5 rounded-lg border border-white/5">
                      {ex}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneExplorer;
