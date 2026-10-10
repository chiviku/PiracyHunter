import React, { useEffect, useMemo, useState } from 'react';
import { InvestigationSummary } from '../types';
import { X, Download, Copy, Check, FileText, Shield } from 'lucide-react';

interface InvestigationReportModalProps {
  summary: InvestigationSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  summary,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<Set<string>>(new Set());
  const [exportError, setExportError] = useState<string | null>(null);

  const flaggedEvidence = useMemo(
    () => summary?.evidence.filter((evidence) =>
      evidence.contextType === 'Potential Distribution Signal' ||
      evidence.priority === 'HIGH' ||
      evidence.sourceType === 'E-Book / Document Repository' ||
      evidence.sourceType === 'Potential Distribution Source' ||
      evidence.sourceType === 'Software / Warez Hub' ||
      evidence.sourceType === 'Audio / Music Portal'
    ) || [],
    [summary]
  );

  useEffect(() => {
    setSelectedEvidenceIds(new Set(flaggedEvidence.map((evidence) => evidence.id)));
    setExportError(null);
  }, [flaggedEvidence, isOpen]);

  if (!isOpen || !summary) return null;

  const selectedEvidence = flaggedEvidence.filter((evidence) =>
    selectedEvidenceIds.has(evidence.id)
  );

  const exportData = {
    content: summary.target,
    contentType: summary.contentType || 'general',
    investigationTimestamp: summary.timestamp,
    dataSource: summary.dataSource,
    searchesPerformed: summary.searchesExecuted,
    queriesExecuted: summary.queries,
    resultsAnalyzed: summary.totalResultsAnalyzed,
    uniqueEvidence: summary.uniqueEvidenceCount,
    highPriority: summary.highPriorityCount,
    mediumPriority: summary.mediumPriorityCount,
    requiresVerification: summary.requiresVerificationCount,
    likelyLegitimate: summary.legitimateCount,
    unrelatedFiltered: summary.unrelatedCount,
    evidence: summary.evidence.map((e) => ({
      priority: e.priority,
      priorityScore: e.priorityScore,
      contextType: e.contextType,
      sourceType: e.sourceType,
      domain: e.domain,
      title: e.title,
      url: e.url,
      foundByQueries: e.foundBy,
      contentRelevance: e.contentRelevance,
      relevanceScore: e.relevanceScore,
      distributionIntent: e.distributionIntent,
      detectedSignals: e.detectedSignals,
      whyItMatters: e.whyItMatters,
      recommendedAction: e.recommendedAction
    }))
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `piracy-hunter-report-${summary.target.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character] || character);

  const handleExportPdf = () => {
    setExportError(null);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setExportError('Allow pop-ups for this site to export the PDF report.');
      return;
    }

    const generatedAt = new Date().toISOString();
    const evidenceHtml = selectedEvidence.map((evidence, index) => {
      let linkHtml = escapeHtml(evidence.url);
      try {
        const parsedUrl = new URL(evidence.url);
        if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
          const safetyCheckUrl = escapeHtml(
            `https://www.virustotal.com/gui/search?query=${encodeURIComponent(parsedUrl.href)}`
          );
          linkHtml = `<a href="${safetyCheckUrl}">${escapeHtml(evidence.url)}</a>`;
        }
      } catch {
        // Keep malformed result URLs visible as plain text, not clickable links.
      }

      return `
        <article class="evidence">
          <h2>${index + 1}. ${escapeHtml(evidence.title || 'Untitled search result')}</h2>
          <p class="url"><strong>URL:</strong> ${linkHtml}</p>
          <p><strong>Snippet:</strong> ${escapeHtml(evidence.snippet || 'No snippet provided by search.')}</p>
          <p class="meta"><strong>Priority:</strong> ${escapeHtml(evidence.priority)} &nbsp; <strong>Source:</strong> ${escapeHtml(evidence.domain)}</p>
        </article>`;
    }).join('');

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${escapeHtml(summary.target)} - Investigation Evidence</title>
          <style>
            body { font: 12pt/1.5 Arial, sans-serif; color: #172033; margin: 36px; }
            h1 { font-size: 20pt; margin-bottom: 4px; }
            h2 { font-size: 13pt; margin: 0 0 8px; overflow-wrap: anywhere; }
            .timestamp, .meta { color: #526174; font-size: 10pt; }
            .evidence { border-top: 1px solid #cbd5e1; padding: 18px 0; break-inside: avoid; }
            .url { overflow-wrap: anywhere; }
            a { color: #164e9b; text-decoration: underline; }
            @media print { body { margin: 18mm; } }
          </style>
        </head>
        <body>
          <h1>Investigation Evidence Report</h1>
          <p><strong>Target:</strong> ${escapeHtml(summary.target)} &nbsp; <strong>Content type:</strong> ${escapeHtml(summary.contentType)}</p>
          <p class="timestamp"><strong>Generated (UTC):</strong> ${escapeHtml(generatedAt)}</p>
          <p>${selectedEvidence.length} flagged link${selectedEvidence.length === 1 ? '' : 's'} selected.</p>
          ${evidenceHtml || '<p>No flagged links were selected.</p>'}
          <script>window.addEventListener('load', () => window.setTimeout(() => window.print(), 250));</script>
        </body>
      </html>`);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Investigation Intelligence Report
              </h3>
              <p className="text-xs text-slate-500">
                Target: <strong>{summary.target}</strong> ({summary.contentType || 'media'}) | Automated Evidence Summary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={selectedEvidence.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Selected PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          <section>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Select flagged links for PDF
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  The PDF includes clickable URLs, the Google result title and snippet, and its UTC export timestamp. Your browser will prompt you to save or print as PDF.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvidenceIds(
                  selectedEvidenceIds.size === flaggedEvidence.length
                    ? new Set()
                    : new Set(flaggedEvidence.map((evidence) => evidence.id))
                )}
                disabled={flaggedEvidence.length === 0}
                className="shrink-0 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {selectedEvidenceIds.size === flaggedEvidence.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            {exportError && (
              <p role="alert" className="mb-2 text-xs text-rose-700">{exportError}</p>
            )}
            {flaggedEvidence.length === 0 ? (
              <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                No flagged links are available in this investigation.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                {flaggedEvidence.map((evidence) => (
                  <label key={evidence.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEvidenceIds.has(evidence.id)}
                      onChange={(event) => {
                        setSelectedEvidenceIds((current) => {
                          const next = new Set(current);
                          if (event.target.checked) next.add(evidence.id);
                          else next.delete(evidence.id);
                          return next;
                        });
                      }}
                      className="mt-0.5 accent-slate-900"
                    />
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-800">{evidence.title || 'Untitled search result'}</span>
                      <span className="block truncate text-slate-500">{evidence.url}</span>
                      <span className="block mt-1 text-slate-600 line-clamp-2">{evidence.snippet || 'No snippet provided by search.'}</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Executive Overview Notice */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Executive Investigation Brief
              </h4>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              This report structures public web search intelligence obtained via <strong>SerpApi</strong> Google indexing queries. The classification engine filters out keyword collisions, classifies source channels, identifies potential distribution calls to action, and distinguishes editorial news reporting from distribution signals.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 font-mono text-[11px]">
              <div>Target: <strong className="font-sans text-slate-900">{summary.target}</strong></div>
              <div>Searches: <strong className="font-sans text-slate-900">{summary.searchesExecuted}</strong></div>
              <div>Raw Results: <strong className="font-sans text-slate-900">{summary.totalResultsAnalyzed}</strong></div>
              <div>Unique Evidence: <strong className="font-sans text-slate-900">{summary.uniqueEvidenceCount}</strong></div>
            </div>
          </div>

          {/* Core Findings Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Investigation Findings Summary
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-3">Classification</th>
                    <th className="p-3">Count</th>
                    <th className="p-3">Methodology Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-rose-50/40">
                    <td className="p-3 font-bold text-rose-700">High Priority (Potential Distribution Signals)</td>
                    <td className="p-3 font-mono font-bold">{summary.highPriorityCount}</td>
                    <td className="p-3 text-slate-600">Target content verified with active distribution callouts (link in bio, torrent packaging, dedicated portals).</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-3 font-bold text-amber-700">Medium Priority (Context & Reporting)</td>
                    <td className="p-3 font-mono font-bold">{summary.mediumPriorityCount}</td>
                    <td className="p-3 text-slate-600">Legitimate news media covering leaks/infringement, or public video search discussions.</td>
                  </tr>
                  <tr className="bg-blue-50/40">
                    <td className="p-3 font-bold text-blue-700">Requires Verification</td>
                    <td className="p-3 font-mono font-bold">{summary.requiresVerificationCount}</td>
                    <td className="p-3 text-slate-600">Ambiguous results matching target query terms needing investigator review.</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-3 font-bold text-emerald-700">Likely Legitimate Sources</td>
                    <td className="p-3 font-mono font-bold">{summary.legitimateCount}</td>
                    <td className="p-3 text-slate-600">Official streaming and catalog platforms (e.g. Prime Video, IMDb, Wikipedia).</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-600">Unrelated Search Noise (Filtered Out)</td>
                    <td className="p-3 font-mono font-bold">{summary.unrelatedCount}</td>
                    <td className="p-3 text-slate-600">Irrelevant keyword collisions rejected by content relevance engine (e.g. fishing rod review).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional JSON export */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Raw Structured Export (JSON)
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {JSON.stringify(exportData).length} bytes
              </span>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-slate-800">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Piracy Hunter • Web Search Intelligence • Non-Accusatory Evidence Extraction
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
