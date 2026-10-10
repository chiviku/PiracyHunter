import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, FilterX, HelpCircle, Flame } from 'lucide-react';
import { InvestigationSummary } from '../types';

interface MetricsOverviewProps {
  summary: InvestigationSummary;
  activePriorityFilter: string;
  onSelectPriorityFilter: (filter: string) => void;
}

const findingStyles = {
  high: {
    accent: '#e93f50',
    surface: '#251D2A',
    selectedSurface: '#30212B',
  },
  medium: {
    accent: '#c4871f',
    surface: '#252319',
    selectedSurface: '#30291D',
  },
  verification: {
    accent: '#82B7E5',
    surface: '#1B2532',
    selectedSurface: '#202E3C',
  },
  legitimate: {
    accent: '#7DCC9B',
    surface: '#1B2828',
    selectedSurface: '#20332D',
  },
  unrelated: {
    accent: '#9AA7B8',
    surface: '#192131',
    selectedSurface: '#242D3C',
  },
} as const;

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  summary,
  activePriorityFilter,
  onSelectPriorityFilter
}) => {
  const findings: {
    filter: string;
    label: string;
    count: number;
    description: string;
    icon: LucideIcon;
    tone: keyof typeof findingStyles;
  }[] = [
    {
      filter: 'HIGH',
      label: 'High Priority',
      count: summary.highPriorityCount,
      description: 'Potential Distribution Signals & Packaging',
      icon: Flame,
      tone: 'high',
    },
    {
      filter: 'MEDIUM',
      label: 'Medium Priority',
      count: summary.mediumPriorityCount,
      description: 'Piracy Reporting & Social Signals',
      icon: AlertTriangle,
      tone: 'medium',
    },
    {
      filter: 'VERIFICATION',
      label: 'Needs Verification',
      count: summary.requiresVerificationCount,
      description: 'Ambiguous or Secondary Channels',
      icon: HelpCircle,
      tone: 'verification',
    },
    {
      filter: 'LEGITIMATE',
      label: 'Likely Legitimate',
      count: summary.legitimateCount,
      description: 'Official OTT, Streaming, IMDb Reference',
      icon: CheckCircle2,
      tone: 'legitimate',
    },
    {
      filter: 'UNRELATED',
      label: 'Unrelated / Noise',
      count: summary.unrelatedCount,
      description: 'Keyword Collisions (e.g. Fishing rod torrent)',
      icon: FilterX,
      tone: 'unrelated',
    },
  ];

  const contentType = summary.contentType
    ? summary.contentType.charAt(0).toUpperCase() + summary.contentType.slice(1)
    : 'General Media';
  const isLiveInvestigation = summary.dataSource === 'live_serpapi';

  return (
    <section className="mb-8 space-y-4" aria-label="Investigation results">
      <header
        className="flex flex-col gap-4 rounded-xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        style={{ backgroundColor: '#0B1325', borderColor: '#303B55' }}
      >
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#AAB5C8' }}>
            Investigation Target
          </p>
          <h2 className="break-words text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: '#FFFFFF' }}>
            {summary.target}
          </h2>
          <p className="mt-1 text-sm" style={{ color: '#AAB5C8' }}>
            {contentType}
          </p>
        </div>
        <div
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
          style={{
            backgroundColor: '#172238',
            borderColor: isLiveInvestigation ? '#456B5A' : '#3B465E',
            color: isLiveInvestigation ? '#A4D7B6' : '#C2CBD8',
          }}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: isLiveInvestigation ? '#7DCC9B' : '#9AA7B8' }}
          />
          {isLiveInvestigation ? 'Live Web Investigation' : 'Investigation Complete'}
        </div>
      </header>

      <div
        className="grid grid-cols-3 overflow-hidden rounded-lg border"
        style={{ backgroundColor: '#151E32', borderColor: '#303B55' }}
        aria-label="Discovery summary"
      >
        <div className="px-3 py-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#AAB5C8' }}>Searches</p>
          <p className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl" style={{ color: '#FFFFFF' }}>
            {summary.searchesExecuted}
          </p>
        </div>
        <div className="border-x px-3 py-3 sm:px-5" style={{ borderColor: '#303B55' }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#AAB5C8' }}>Raw Results</p>
          <p className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl" style={{ color: '#FFFFFF' }}>
            {summary.totalResultsAnalyzed}
          </p>
        </div>
        <div className="px-3 py-3 sm:px-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#AAB5C8' }}>Unique Evidence</p>
          <p className="mt-1 text-2xl font-bold tabular-nums sm:text-3xl" style={{ color: '#FFFFFF' }}>
            {summary.uniqueEvidenceCount}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: '#FFFFFF' }}>
            Prioritized Findings
          </h3>
          <p className="mt-1 text-xs" style={{ color: '#AAB5C8' }}>
            Select a category to focus the evidence list below.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {findings.map((finding) => {
            const selected = activePriorityFilter === finding.filter;
            const tone = findingStyles[finding.tone];
            const Icon = finding.icon;

            return (
              <button
                key={finding.filter}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectPriorityFilter(selected ? 'ALL' : finding.filter)}
                className="min-h-[132px] rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1325] sm:p-4"
                style={{
                  backgroundColor: selected ? tone.selectedSurface : tone.surface,
                  borderColor: selected ? tone.accent : '#354057',
                  borderWidth: selected ? 2 : 1,
                  boxShadow: selected ? `inset 0 0 0 1px ${tone.accent}33` : 'none',
                }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] sm:text-[11px]"
                    style={{ color: tone.accent }}
                  >
                    {finding.label}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0"
                    style={{ color: tone.accent }}
                  />
                </span>
                <span
                  className={`mt-3 block tabular-nums ${finding.tone === 'high' ? 'text-3xl' : 'text-2xl'} font-semibold`}
                  style={{ color: '#FFFFFF' }}
                >
                  {finding.count}
                </span>
                <span className="mt-1 block text-[11px] leading-snug" style={{ color: '#AAB5C8' }}>
                  {finding.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
