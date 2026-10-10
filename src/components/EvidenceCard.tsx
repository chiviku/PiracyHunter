import React, { useState } from 'react';
import { AnalyzedEvidence, ThreatIntelligenceStatus } from '../types';
import {
  ExternalLink,
  ShieldCheck,
  Flame,
  AlertTriangle,
  FilterX,
  Share2,
  Newspaper,
  Video,
  Film,
  Globe,
  BookOpen,
  Gamepad2,
  Music,
  Copy,
  Check,
  FileCode,
  ShieldAlert,
  Download,
  Loader2,
  Radar
} from 'lucide-react';

interface EvidenceCardProps {
  evidence: AnalyzedEvidence;
  targetContent: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, targetContent }) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verification, setVerification] = useState<ThreatIntelligenceStatus | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const getPriorityStyle = () => {
    switch (evidence.priority) {
      case 'HIGH':
        return {
          cardBorder: 'border-rose-200 hover:border-rose-400 bg-white shadow-xs',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: <Flame className="w-3.5 h-3.5 text-rose-600" />,
          label: 'HIGH PRIORITY'
        };
      case 'MEDIUM':
        return {
          cardBorder: 'border-amber-200 hover:border-amber-400 bg-white shadow-xs',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: 'MEDIUM PRIORITY'
        };
      case 'LOW':
        return {
          cardBorder: 'border-emerald-200 hover:border-emerald-400 bg-white shadow-xs',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'LIKELY LEGITIMATE'
        };
      case 'VERY LOW':
      default:
        return {
          cardBorder: 'border-slate-200 hover:border-slate-300 bg-slate-50/70 opacity-85',
          badgeBg: 'bg-slate-200 text-slate-700 border-slate-300',
          icon: <FilterX className="w-3.5 h-3.5 text-slate-500" />,
          label: 'LOW RELEVANCE / UNRELATED'
        };
    }
  };

  const getSourceIcon = () => {
    switch (evidence.sourceType) {
      case 'E-Book / Document Repository':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Software / Warez Hub':
        return <Gamepad2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Audio / Music Portal':
        return <Music className="w-3.5 h-3.5 text-purple-600" />;
      case 'Social Media':
        return <Share2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'News / Context':
        return <Newspaper className="w-3.5 h-3.5 text-blue-600" />;
      case 'Official / Legitimate':
        return <Film className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Video Platform':
        return <Video className="w-3.5 h-3.5 text-red-600" />;
      case 'Potential Distribution Source':
        return <Flame className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(evidence.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyUrl = async () => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch('/api/verify-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: evidence.url })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'URL verification failed.');
      }
      setVerification(result as ThreatIntelligenceStatus);
    } catch (error) {
      setVerificationError(error instanceof Error ? error.message : 'URL verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const priorityStyle = getPriorityStyle();
  const isHighThreat = evidence.priority === 'HIGH' || evidence.priorityScore >= 80;

  return (
    <div
      id={evidence.id}
      className={`rounded-2xl border p-5 transition-all ${priorityStyle.cardBorder}`}
    >
      {/* Header Badges & Domain */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityStyle.badgeBg}`}
          >
            {priorityStyle.icon}
            <span>{priorityStyle.label}</span>
          </span>

          {/* Context Classification Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <span>{evidence.contextType}</span>
          </span>

          {/* Source Type & Domain Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200">
            {getSourceIcon()}
            <span className="font-semibold text-slate-900">{evidence.domain}</span>
            <span className="text-slate-500">({evidence.sourceType})</span>
          </span>

          {/* File Format Detected Badge */}
          {evidence.fileFormatDetected && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
              <Download className="w-3 h-3 text-purple-700" />
              <span>Format: {evidence.fileFormatDetected}</span>
            </span>
          )}
        </div>

        {/* Priority & Threat Ranking Score */}
        <div className="flex items-center gap-2 text-xs font-medium">
          {isHighThreat && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
              Rank Score: {evidence.priorityScore}/100
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
              evidence.contentRelevance === 'HIGH'
                ? 'bg-emerald-100 text-emerald-800'
                : evidence.contentRelevance === 'MEDIUM'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {evidence.contentRelevance} Relevance ({evidence.relevanceScore}%)
          </span>
        </div>
      </div>

      {/* Result Title */}
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1.5 leading-snug">
        {evidence.title}
      </h3>

      {/* URL Link */}
      <div className="text-xs font-mono text-slate-500 truncate mb-3 flex items-center gap-1.5">
        <span className="text-slate-400 font-sans">Target URL:</span>
        <span className="truncate">{evidence.url}</span>
      </div>

     
      <div className="mb-3">
        <p className="mb-1.5 text-[13.8px] text-slate-500">
          Check the live URL to see whether it redirects or is reachable.
        </p>
        <button
          type="button"
          onClick={handleVerifyUrl}
          disabled={isVerifying}
          className="inline-flex items-center gap-1.5 px-2 py-1.4 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 disabled:opacity-60 transition-colors"
        >
          {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radar className="w-3.5 h-3.5" />}
          {isVerifying ? 'Checking redirects…' : verification ? 'Check link again' : 'Inspect live URL'}
        </button>
        {verification && (
          <div className={`mt-2 rounded-lg border p-3 text-xs ${
            verification.color === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-900' :
            verification.color === 'red' ? 'border-rose-200 bg-rose-50 text-rose-900' :
            verification.color === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' :
            'border-purple-200 bg-purple-50 text-purple-900'
          }`}>
            <div className="font-bold">
              {verification.status} · {verification.code}
              {verification.httpStatus ? ` · HTTP ${verification.httpStatus}` : ''}
            </div>
            {verification.finalUrl && verification.finalUrl !== verification.originalUrl && (
              <div className="mt-1 break-all">Final destination: {verification.finalUrl}</div>
            )}
            {verification.errorCode && (
              <div className="mt-1">Network detail: {verification.errorCode}</div>
            )}
            <div className="mt-1 opacity-80">
              HTTP reachability only; this status does not establish infringement.
            </div>
          </div>
        )}
        {verificationError && (
          <p role="alert" className="mt-2 text-xs text-rose-700">{verificationError}</p>
        )}
      </div>

      {/* Recommended Action (Crucial for Content Owners and Authors) */}
      {evidence.recommendedAction && (
        <div className="p-2.5 bg-slate-100/90 rounded-xl border border-slate-200/90 text-xs text-slate-800 mb-3 flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-1000 text-[15px]">Recommended Action: </span>
            <span className="text-[16px]">{evidence.recommendedAction}</span>
          </div>
        </div>
      )}

      {/* Investigation Signals & Discovery Queries */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-medium shrink-0">Triggered by:</span>
          {evidence.foundBy.map((q, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-700"
            >
              {q}
            </span>
          ))}
          {evidence.foundBy.length > 1 && (
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
              Cross-Query Match ({evidence.foundBy.length})
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 self-end sm:self-auto">
          {isHighThreat && (
            <p className="text-[11px] leading-relaxed text-amber-700">
              ⚠ This source was flagged for potential distribution signals. Consider running Check Safety first.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://www.virustotal.com/gui/search?query=${encodeURIComponent(evidence.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                isHighThreat
                  ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <span>Check Safety</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open source in a new tab: ${evidence.domain}`}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 border border-blue-800 transition-colors"
            >
              <span>Verify Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Copy URL to clipboard for DMCA takedown notice"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
