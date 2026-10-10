import React from 'react';
import { X, CheckCircle2, AlertTriangle, Shield, Layers, FileSearch } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Methodology & Intelligence Architecture
              </h3>
              <p className="text-xs text-slate-500">
                SerpApi Search Intelligence Layer + 5-Dimension Evidence Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          {/* Core Pitch Banner */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
            <h4 className="font-bold text-sm mb-1">
              "Piracy Hunter turns scattered public web search information into structured investigation intelligence."
            </h4>
            <p className="text-amber-900 leading-relaxed">
              The application organizes public search evidence; it <strong>does not make legal determinations</strong> or claim guilt.
            </p>
          </div>

          {/* The Problem Discovered: The Spey Line Case Study */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>The Problem Discovered: Naive Keyword Scoring Fails</span>
            </h4>
            <p className="text-slate-600 mb-3">
              During the initial prototype test for <strong>"Kantara"</strong>, the query <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">"Kantara" torrent</code> returned:
            </p>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 font-mono text-[11px] text-rose-950">
              <div><strong>Title:</strong> Spey Line Review: Bridge Outfitting Torrent</div>
              <div><strong>Domain:</strong> swingthefly.com</div>
              <div><strong>Naive Score:</strong> 8 (Classified as "Potentially Suspicious") ❌</div>
            </div>
            <p className="text-slate-600 mt-2">
              The word "torrent" was used in the context of fly-fishing gear. A naive keyword-only system flags this as high risk. Piracy Hunter solves this by requiring <strong>multi-dimensional contextual analysis</strong>.
            </p>
          </div>

          {/* The 5-Layer Solution */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>The 5-Dimension Evidence Analysis Engine</span>
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-0.5">1. Content Relevance Evaluation</div>
                <p className="text-slate-600">
                  Cross-checks title, snippet, and URL tokens against the investigated target. If the target content does not meaningfully appear, the result is immediately deprioritized and categorized as <em>Unrelated Result</em>.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-0.5">2. Source Domain Classification</div>
                <p className="text-slate-600">
                  Separates Official Platforms (Prime Video, Netflix, IMDb), News Editorial (Times of India, NDTV), Video/Social Platforms (YouTube, Instagram), and Distribution Repositories (Filmyzilla, 1337x).
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-0.5">3. Distribution Intent Detection</div>
                <p className="text-slate-600">
                  Detects actionable callouts such as <em>"link in bio"</em>, <em>"download link"</em>, telegram channel redirections, magnet links, and file rip indicators (1080p, camrip) in context.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-0.5">4. Contextual Synthesis</div>
                <p className="text-slate-600">
                  Distinguishes <em>Piracy Reporting</em> (news coverage of leaks) from <em>Potential Distribution Signals</em> (active download portals) and <em>Legitimate Sources</em>.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-0.5">5. Deduplication & Cross-Query Correlation</div>
                <p className="text-slate-600">
                  Normalizes URLs (stripping tracking parameters and slashes) and records which queries found each link. Multiple query hits increase evidence confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Principle 2 Compliance */}
          <div className="p-4 bg-slate-900 text-white rounded-xl">
            <h5 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Project Principle #2: Non-Accusatory Terminology</span>
            </h5>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              We strictly utilize objective, investigative terminology: <em>"Potential Distribution Signal"</em>, <em>"Piracy-related Context"</em>, <em>"Investigation Signal"</em>, and <em>"Requires Verification"</em>. We never assert legal guilt or term third-party entities "illegal".
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
