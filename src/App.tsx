/**
 * Piracy Hunter — Web Intelligence & Evidence Analysis Dashboard
 * Search Intelligence & Content Distribution Scanning Engine
 */

import React, { useState, useEffect } from 'react';
import { InvestigationSummary, RawSearchResult, ServerStatusResponse, ContentType } from './types';
import { Navbar } from './components/Navbar';
import { InvestigationInput } from './components/InvestigationInput';
import { MetricsOverview } from './components/MetricsOverview';
import { EvidenceList } from './components/EvidenceList';
import { InvestigationReportModal } from './components/InvestigationReportModal';
import { MethodologyModal } from './components/MethodologyModal';
import { RawDataModal } from './components/RawDataModal';
import { Shield, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [target, setTarget] = useState('Atomic Habits');
  const [contentType, setContentType] = useState<ContentType>('books');
  const [isInvestigating, setIsInvestigating] = useState(false);
  const [summary, setSummary] = useState<InvestigationSummary | null>(null);
  const [rawDataset, setRawDataset] = useState<RawSearchResult[]>([]);
  const [status, setStatus] = useState<ServerStatusResponse>({
    serpApiConfigured: false,
    cachedDatasetTarget: 'Kantara',
    cachedRecordsCount: 0
  });

  const [activePriorityFilter, setActivePriorityFilter] = useState<string>('ALL');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);

  // Initial load
  useEffect(() => {
    fetchStatus();
    runInvestigation('Atomic Habits', 'books', false);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.warn('Status fetch warning:', err);
    }
  };

  const fetchRawDataset = async () => {
    try {
      const res = await fetch('/api/raw-dataset');
      if (res.ok) {
        const data = await res.json();
        setRawDataset(data.results || []);
      }
    } catch (err) {
      console.warn('Raw dataset fetch warning:', err);
    }
  };

  const runInvestigation = async (
    targetContent: string,
    selectedContentType: ContentType = contentType,
    useLiveSerpApi: boolean = false
  ) => {
    setIsInvestigating(true);
    setErrorNotice(null);
    setTarget(targetContent);
    setContentType(selectedContentType);

    try {
      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: targetContent,
          contentType: selectedContentType,
          useLiveSerpApi
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to complete investigation');
      }

      const data: InvestigationSummary = await response.json();
      setSummary(data);
      setErrorNotice(
        data.searchFailures
          ? `${data.searchFailures} of the SerpApi searches failed. These results are partial.`
          : null
      );
      await fetchRawDataset();
      await fetchStatus();
    } catch (err: any) {
      console.error('Investigation error:', err);
      setErrorNotice(err.message || 'An unexpected error occurred during analysis.');
      setSummary(null);
    } finally {
      setIsInvestigating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0B1F3A] flex flex-col font-sans antialiased">
      {/* Navbar */}
      <Navbar
        serpApiConfigured={status.serpApiConfigured}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenRawData={() => {
          fetchRawDataset();
          setIsRawDataOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error / Fallback Banner */}
        {errorNotice && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">System Notice:</span> {errorNotice}
              </div>
            </div>
            <button
              onClick={() => setErrorNotice(null)}
              className="text-amber-700 hover:text-amber-950 font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Target Content Input Section */}
        <InvestigationInput
          currentTarget={target}
          currentContentType={contentType}
          isInvestigating={isInvestigating}
          serpApiConfigured={status.serpApiConfigured}
          onInvestigate={(newTarget, newContentType, useLive) => {
            runInvestigation(newTarget, newContentType, useLive);
          }}
        />

        {/* Active Investigation Results */}
        {summary ? (
          <div>

            {/* High-level Summary Metrics */}
            <MetricsOverview
              summary={summary}
              activePriorityFilter={activePriorityFilter}
              onSelectPriorityFilter={setActivePriorityFilter}
            />

            {/* Classified Evidence List */}

            {/* Classified Evidence List */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Classified Search Evidence
                  </h3>
                  <p className="text-xs text-slate-500">
                    Each item is categorized by Source Type, Content Relevance, and Distribution Intent.
                  </p>
                </div>
              </div>

              <EvidenceList
                evidenceList={summary.evidence}
                targetContent={summary.target}
                activePriorityFilter={activePriorityFilter}
                onSelectPriorityFilter={setActivePriorityFilter}
              />
            </div>
          </div>
        ) : (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Initializing Search Intelligence Engine...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connecting local dataset and running initial multi-dimensional synthesis for Kantara.
            </p>
          </div>
        )}
      </main>

      <section className="result-followup" aria-label="Next steps after finding a link">
        <details>
          <summary>What happens after I find a link?</summary>
          <ol>
            <li><strong>Verify the link.</strong> Make sure it contains your content and is not a fan edit, review, licensed upload, or unrelated result.</li>
            <li><strong>Document the evidence.</strong> Export the report and save the source URL and relevant investigation details before taking further action.</li>
            <li><strong>Contact the appropriate service.</strong> If the distribution appears unauthorized, use the site's host or abuse contact, or the platform's official reporting process.</li>
            <li><strong>Escalate if needed.</strong> If you do not receive a response, consider contacting the hosting provider or seeking legal advice. Many situations can be handled directly through the platform or host.</li>
          </ol>
        </details>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-700/60 bg-[#0B1325] py-4">
        <div className="mx-auto max-w-7xl px-4 text-xs text-slate-400 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
              <Shield className="h-4 w-4 text-slate-300" />
              <span className="font-semibold text-slate-200">Piracy Hunter</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span>Web Investigation &amp; Evidence Intelligence</span>
            </div>
            <div className="text-center sm:text-right">
              <span>SerpApi India Hackathon 2026</span>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[15px] text-slate-500 sm:text-left">
            Results are investigative signals, not determinations of infringement.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <InvestigationReportModal
        summary={summary}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <RawDataModal
        isOpen={isRawDataOpen}
        onClose={() => setIsRawDataOpen(false)}
        rawResults={rawDataset}
      />
    </div>
  );
}
