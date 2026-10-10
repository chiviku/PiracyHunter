import React from 'react';
import { Shield, FileText, Database, Info } from 'lucide-react';

interface NavbarProps {
  serpApiConfigured: boolean;
  onOpenReport: () => void;
  onOpenMethodology: () => void;
  onOpenRawData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  serpApiConfigured,
  onOpenReport,
  onOpenMethodology,
  onOpenRawData
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/70 bg-[#0B1F3A] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-1 sm:gap-3">
        {/* Brand & Identity */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 bg-slate-700/70 text-slate-100 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="text-xs sm:text-base font-bold text-white tracking-[0.05em] sm:tracking-[0.08em] whitespace-nowrap">PIRACY HUNTER</h1>
              <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                an Anti-Piracy Web Intelligence
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-medium truncate">
              Search Intelligence &amp; Evidence Analysis Engine
            </p>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex shrink-0 items-center gap-0 sm:gap-2">
          <div
            className="flex items-center gap-1.5 px-0 sm:px-2.5 py-1 text-[10px] sm:text-xs font-medium text-slate-300"
            aria-label={serpApiConfigured ? 'SerpApi Connected' : 'SerpApi Demo / Standby'}
            title={serpApiConfigured ? 'SerpApi Connected' : 'SerpApi Demo / Standby'}
          >
            <span className={`w-2 h-2 rounded-full ${serpApiConfigured ? 'bg-emerald-400' : 'bg-slate-500'}`} aria-hidden="true" />
            <span className={`hidden sm:inline font-semibold tracking-wide ${serpApiConfigured ? 'text-emerald-300' : 'text-slate-300'}`}>
              {serpApiConfigured ? 'LIVE' : 'DEMO'}
            </span>
            <span className="hidden lg:inline text-slate-400">
              {serpApiConfigured ? 'SerpApi Connected' : 'SerpApi Standby'}
            </span>
          </div>

          <button
            id="btn-methodology"
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-1 sm:px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="View intelligence methodology"
            aria-label="Methodology"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Methodology</span>
          </button>

          <button
            id="btn-view-raw"
            onClick={onOpenRawData}
            className="flex items-center gap-1.5 px-1 sm:px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Inspect raw search records"
            aria-label="Raw Records"
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Raw Records</span>
          </button>

          <button
            id="btn-export-report"
            onClick={onOpenReport}
            className="flex items-center gap-1 px-1 sm:gap-1.5 sm:px-3.5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 transition-colors"
            aria-label="Export Report"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </button>

        </div>
      </div>
    </header>
  );
};
