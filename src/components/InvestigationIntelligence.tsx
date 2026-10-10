import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  Radar,
  Search,
  ShieldAlert,
  Target,
  TrendingUp,
} from 'lucide-react';

import { InvestigationSummary } from '../types';

interface InvestigationIntelligenceProps {
  summary: InvestigationSummary;
}

export const InvestigationIntelligence: React.FC<
  InvestigationIntelligenceProps
> = ({ summary }) => {
  const [copiedEvidenceId, setCopiedEvidenceId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const evidence = Array.isArray(summary?.evidence)
    ? summary.evidence
    : [];

  const highPriority = Number(summary?.highPriorityCount || 0);
  const verification = Number(summary?.requiresVerificationCount || 0);
  const legitimate = Number(summary?.legitimateCount || 0);
  const uniqueEvidence = Number(summary?.uniqueEvidenceCount || 0);

  const topEvidence = [...evidence]
    .sort(
      (a, b) =>
        Number(b?.priorityScore || 0) -
        Number(a?.priorityScore || 0)
    )
    .slice(0, 3);

  const signalCounts: Record<string, number> = {};

  evidence.forEach((item) => {
    const signals = Array.isArray(item?.detectedSignals)
      ? item.detectedSignals
      : [];

    signals.forEach((signal) => {
      if (signal) {
        signalCounts[signal] =
          (signalCounts[signal] || 0) + 1;
      }
    });
  });

  const topSignals = Object.entries(signalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sourceBreakdown =
    summary?.sourceTypeBreakdown &&
    typeof summary.sourceTypeBreakdown === 'object'
      ? summary.sourceTypeBreakdown
      : {};

  const sourcePatterns = Object.entries(sourceBreakdown)
    .filter(([, count]) => Number(count) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5);

  const target = summary?.target || 'Unknown Target';

  const handleCopyUrl = async (id: string, url: string) => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedEvidenceId(id);
      window.setTimeout(() => setCopiedEvidenceId(null), 2000);
    } catch (error) {
      console.error('Unable to copy evidence URL:', error);
      setCopyError('Could not copy this URL. Check clipboard permissions.');
    }
  };

  return (
    <section className="mb-12">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] flex items-center justify-center">
            <Radar className="w-4 h-4 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B1F3A]">
              Investigation Intelligence
            </h2>

            <p className="text-xs text-slate-500">
              Evidence patterns and investigation priorities for{' '}
              <span className="font-semibold text-slate-700">
                {target}
              </span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {summary?.dataSource === 'live_serpapi'
            ? 'Live SerpApi'
            : 'Local Dataset'}
        </div>
      </div>

      {/* EXECUTIVE BRIEF */}
      <div className="bg-[#0B1F3A] rounded-2xl p-6 text-white mb-4 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-blue-200" />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-blue-200 mb-1">
              Executive Brief
            </div>

            <p className="text-sm leading-6 text-slate-200">
              {highPriority > 0
                ? `The investigation identified ${highPriority} high-priority lead${
                    highPriority === 1 ? '' : 's'
                  } requiring direct verification. The remaining evidence provides contextual, legitimate, and investigative signals around "${target}".`
                : `The investigation analyzed publicly visible search evidence related to "${target}". No result currently meets the highest investigation-priority threshold.`}
            </p>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500">
              High Priority
            </span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>

          <div className="text-2xl font-bold text-[#0B1F3A]">
            {highPriority}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Immediate review leads
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Verification
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>

          <div className="text-2xl font-bold text-[#0B1F3A]">
            {verification}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Leads requiring validation
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Legitimate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="text-2xl font-bold text-[#0B1F3A]">
            {legitimate}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Authorized/context sources
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Evidence
            </span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>

          <div className="text-2xl font-bold text-[#0B1F3A]">
            {uniqueEvidence}
          </div>

          <p className="text-[11px] text-slate-500 mt-1">
            Unique evidence records
          </p>
        </div>

      </div>

      {/* SOURCE + SIGNALS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        {/* SOURCE PATTERN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-5">
            <Globe2 className="w-4 h-4 text-[#0B1F3A]" />

            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Source Pattern
              </h3>

              <p className="text-[11px] text-slate-500">
                Distribution of discovered source types
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sourcePatterns.length > 0 ? (
              sourcePatterns.map(([source, count]) => {

                const percentage =
                  Number(summary.totalResultsAnalyzed || 0) > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (Number(count) /
                            Number(summary.totalResultsAnalyzed)) *
                            100
                        )
                      )
                    : 0;

                return (
                  <div key={source}>

                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">
                        {source}
                      </span>

                      <span className="text-xs font-bold text-slate-500">
                        {count}
                      </span>
                    </div>

                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#163B67] rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">
                No source pattern data available.
              </p>
            )}
          </div>

        </div>

        {/* DISTRIBUTION SIGNALS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#0B1F3A]" />

            <div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Distribution Signals
              </h3>

              <p className="text-[11px] text-slate-500">
                Signals found across the evidence set
              </p>
            </div>
          </div>

          <div className="space-y-2">

            {topSignals.length > 0 ? (
              topSignals.map(([signal, count]) => (
                <div
                  key={signal}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="text-xs text-slate-700">
                    {signal}
                  </span>

                  <span className="min-w-6 h-6 px-1.5 rounded-md bg-[#0B1F3A] text-white text-[11px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                No distribution signals detected.
              </p>
            )}

          </div>
        </div>

      </div>

      {/* TOP LEADS */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h3 className="text-sm font-bold text-[#0B1F3A]">
              Highest-Priority Leads
            </h3>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Ranked by investigation priority score
            </p>
          </div>

          <Search className="w-4 h-4 text-slate-400" />

        </div>

        {topEvidence.length > 0 ? (
          <div className="divide-y divide-slate-100">

            {topEvidence.map((item) => (

              <div
                key={item.id}
                className="p-5 hover:bg-slate-50 transition-colors"
              >

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2 mb-2">

                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold uppercase">
                        {item.priority}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        Score {item.priorityScore}
                      </span>

                    </div>

                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                      <Globe2 className="w-3 h-3" />
                      {item.domain}
                    </div>

                    <p className="mt-1 truncate font-mono text-[10px] text-slate-500" title={item.url}>
                      {item.url}
                    </p>

                    <p className="text-xs text-slate-600 leading-5 mt-2">
                      {item.whyItMatters}
                    </p>

                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                    {(item.priority === 'HIGH' || item.priorityScore >= 80) && (
                      <p className="max-w-md text-[11px] leading-relaxed text-amber-700">
                        ⚠ This source was flagged for potential distribution signals. Consider running Check Safety first.
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://www.virustotal.com/gui/search?query=${encodeURIComponent(item.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                        item.priority === 'HIGH' || item.priorityScore >= 80
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Check Safety
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open source in a new tab: ${item.domain}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-blue-800 bg-blue-700 text-xs font-semibold text-white hover:bg-blue-800"
                    >
                      Open Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.id, item.url)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      {copiedEvidenceId === item.id ? (
                        <><Check className="w-3.5 h-3.5" /> Copied</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy URL</>
                      )}
                    </button>
                    </div>
                  </div>

                </div>
                {copyError && <p role="alert" className="mt-2 text-xs text-rose-700">{copyError}</p>}

                {Array.isArray(item.detectedSignals) &&
                  item.detectedSignals.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">

                      {item.detectedSignals
                        .slice(0, 3)
                        .map((signal) => (
                          <span
                            key={signal}
                            className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium"
                          >
                            {signal}
                          </span>
                        ))}

                    </div>
                  )}

              </div>

            ))}

          </div>
        ) : (
          <div className="p-10 text-center">

            <p className="text-sm text-slate-500">
              No investigation leads available.
            </p>

          </div>
        )}

      </div>

    </section>
  );
};