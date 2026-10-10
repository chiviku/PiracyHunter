import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, CheckCircle, Crosshair, ArrowRight } from 'lucide-react';
import { InvestigationSummary } from '../types';

interface QueryInspectorProps {
  summary: InvestigationSummary;
}

export const QueryInspector: React.FC<QueryInspectorProps> = ({ summary }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Terminal className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              SerpApi Search Intelligence & Query Pipeline
            </h3>
            <p className="text-[11px] text-slate-500">
              {summary.queries.length} targeted search queries executed • Deduplicated by normalized URL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="hidden sm:inline">{isOpen ? 'Hide Pipeline Details' : 'Inspect Queries & Deduplication'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-4 text-xs">
          {/* Query Matrix */}
          <div>
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-600" />
              <span>Executed SerpApi Queries</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {summary.queries.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 flex items-center justify-between shadow-2xs"
                >
                  <span className="font-semibold">{q}</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    Query #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deduplication & Multi-Discovery Highlight */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>URL Normalization & Multi-Query Evidence Correlation</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {summary.totalResultsAnalyzed} Raw ➔ {summary.uniqueEvidenceCount} Unique Records
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              When a specific URL is surfaced by multiple distinct queries (for example, appearing under both <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">"{summary.target}" download</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">"{summary.target}" torrent</code>), Piracy Hunter collapses them into a single unique evidence record while tracking all originating search vectors.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
