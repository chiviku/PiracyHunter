import React, { useState, useMemo } from 'react';
import { AnalyzedEvidence } from '../types';
import { EvidenceCard } from './EvidenceCard';
import { Filter, Search, ArrowDownWideNarrow, SlidersHorizontal, ShieldAlert, Sparkles } from 'lucide-react';

interface EvidenceListProps {
  evidenceList: AnalyzedEvidence[];
  targetContent: string;
  activePriorityFilter: string;
  onSelectPriorityFilter: (filter: string) => void;
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  evidenceList,
  targetContent,
  activePriorityFilter,
  onSelectPriorityFilter
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'relevance'>('priority');

  const filteredEvidence = useMemo(() => {
    return evidenceList.filter((item) => {
      // Priority filter
      if (activePriorityFilter === 'HIGH' && item.priority !== 'HIGH') return false;
      if (activePriorityFilter === 'DISTRIBUTION') {
        const isDist = item.priority === 'HIGH' ||
          item.sourceType === 'E-Book / Document Repository' ||
          item.sourceType === 'Potential Distribution Source' ||
          item.sourceType === 'Software / Warez Hub' ||
          item.sourceType === 'Audio / Music Portal';
        if (!isDist) return false;
      }
      if (activePriorityFilter === 'MEDIUM' && item.priority !== 'MEDIUM') return false;
      if (activePriorityFilter === 'VERIFICATION' && item.contextType !== 'Requires Verification') return false;
      if (activePriorityFilter === 'LEGITIMATE' && item.contextType !== 'Legitimate Source') return false;
      if (activePriorityFilter === 'UNRELATED' && item.contextType !== 'Unrelated Result') return false;

      // Source type filter
      if (selectedSourceType !== 'ALL' && item.sourceType !== selectedSourceType) {
        return false;
      }

      // Keyword search within results
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchSnippet = item.snippet.toLowerCase().includes(query);
        const matchDomain = item.domain.toLowerCase().includes(query);
        const matchWhy = item.whyItMatters.toLowerCase().includes(query);
        const matchFormat = (item.fileFormatDetected || '').toLowerCase().includes(query);
        return matchTitle || matchSnippet || matchDomain || matchWhy || matchFormat;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      return b.relevanceScore - a.relevanceScore;
    });
  }, [evidenceList, activePriorityFilter, selectedSourceType, searchKeyword, sortBy]);

  const sourceTypes = [
    'ALL',
    'E-Book / Document Repository',
    'Potential Distribution Source',
    'Software / Warez Hub',
    'Audio / Music Portal',
    'Social Media',
    'News / Context',
    'Official / Legitimate',
    'Video Platform'
  ];

  const distributionCount = evidenceList.filter((e) =>
    e.priority === 'HIGH' ||
    e.sourceType === 'E-Book / Document Repository' ||
    e.sourceType === 'Potential Distribution Source' ||
    e.sourceType === 'Software / Warez Hub' ||
    e.sourceType === 'Audio / Music Portal'
  ).length;

  return (
    <section className="space-y-4" aria-label="Classified search evidence">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: '#0B1325' }}>
            Classified Search Evidence
          </h3>
          <p className="mt-1 text-xs" style={{ color: '#5C6B73' }}>
            Prioritized public-web evidence identified during the investigation.
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-medium tabular-nums" style={{ color: '#5C6B73' }}>
          {evidenceList.length} records
        </span>
      </header>

      <div
        className="flex flex-col gap-3 rounded-lg border p-3 shadow-sm sm:p-3.5 lg:flex-row lg:items-center"
        style={{ backgroundColor: '#252525', borderColor: '#D5DCE5' }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: '#82909F' }} />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search evidence, domains, or signals..."
              className="w-full rounded-md border py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#c7d0d8', borderColor: '#D5DCE5', color: '#080808' }}
            />
          </div>

          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              className="shrink-0 px-2 py-1 text-xs font-medium"
              style={{ color: '#5C6B73' }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 items-center gap-1.5 text-xs" style={{ color: '#5C6B73' }}>
            <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: '#82909F' }} />
            <span className="hidden font-medium sm:inline">Source Type</span>
            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="max-w-[min(58vw,15rem)] rounded-md border px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#D5DCE5', color: '#26364D' }}
            >
              {sourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Source Types' : type}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 items-center gap-1.5 text-xs" style={{ color: '#5C6B73' }}>
            <ArrowDownWideNarrow className="h-3.5 w-3.5 shrink-0" style={{ color: '#82909F' }} />
            <span className="sr-only">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'relevance')}
              className="max-w-[min(58vw,15rem)] rounded-md border px-2.5 py-2 text-xs font-medium focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#D5DCE5', color: '#26364D' }}
            >
              <option value="priority">Sort: High Priority First</option>
              <option value="relevance">Sort: Content Relevance First</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex min-w-0 items-center overflow-x-auto pb-1">
        <div className="flex min-w-max items-center gap-2 text-xs">
          {([
            { id: 'ALL', label: 'All Evidence', count: evidenceList.length, tone: 'neutral' },
            { id: 'DISTRIBUTION', label: 'Distribution Signals', count: distributionCount, tone: 'distribution' },
            { id: 'HIGH', label: 'High Priority', count: evidenceList.filter((e) => e.priority === 'HIGH').length, tone: 'neutral' },
            { id: 'MEDIUM', label: 'Medium Priority', count: evidenceList.filter((e) => e.priority === 'MEDIUM').length, tone: 'neutral' },
            { id: 'VERIFICATION', label: 'Needs Verification', count: evidenceList.filter((e) => e.contextType === 'Requires Verification').length, tone: 'verification' },
            { id: 'LEGITIMATE', label: 'Authorized / Legitimate', count: evidenceList.filter((e) => e.contextType === 'Legitimate Source').length, tone: 'legitimate' },
            { id: 'UNRELATED', label: 'Unrelated / Noise', count: evidenceList.filter((e) => e.contextType === 'Unrelated Result').length, tone: 'unrelated' }
          ] as const).map((tab) => {
            const active = activePriorityFilter === tab.id;
            const toneColors = {
              neutral: { color: '#34445B', border: '#D5DCE5', background: '#FFFFFF' },
              distribution: { color: '#A34D59', border: '#E8C7CC', background: '#FFF8F8' },
              verification: { color: '#426B91', border: '#C8D8E8', background: '#F7FAFD' },
              legitimate: { color: '#47765A', border: '#C9DDCF', background: '#F7FBF8' },
              unrelated: { color: '#697687', border: '#D5DCE5', background: '#F8FAFC' },
            }[tab.tone];

            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id.toLowerCase()}`}
                onClick={() => onSelectPriorityFilter(tab.id)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border px-3 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
                style={{
                  backgroundColor: active ? '#0B1325' : toneColors.background,
                  borderColor: active && tab.tone === 'distribution' ? '#C47782' : active ? '#0B1325' : toneColors.border,
                  color: active ? '#FFFFFF' : toneColors.color,
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="min-w-5 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold tabular-nums"
                  style={{
                    backgroundColor: active ? 'rgb(255 255 255 / 16%)' : '#EDF1F5',
                    color: active ? '#FFFFFF' : toneColors.color,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#34445B' }}>
            Showing {filteredEvidence.length} of {evidenceList.length} records
          </span>
          <span className="text-[11px]" style={{ color: '#758293' }}>Ranked by priority</span>
        </div>
        {activePriorityFilter !== 'ALL' && (
          <button
            onClick={() => onSelectPriorityFilter('ALL')}
            className="shrink-0 text-xs font-medium hover:underline"
            style={{ color: '#34445B' }}
          >
            Reset filters
          </button>
        )}
      </div>

      {filteredEvidence.length === 0 ? (
        <div
          className="rounded-lg border border-dashed px-5 py-10 text-center"
          style={{ backgroundColor: '#d3c8c8', borderColor: '#C9D2DE' }}
        >
          <SlidersHorizontal className="mx-auto mb-3 h-5 w-5" style={{ color: '#82909F' }} />
          <h4 className="mb-1 text-sm font-semibold" style={{ color: '#26364D' }}>No matching evidence</h4>
          <p className="mx-auto mb-4 max-w-md text-xs" style={{ color: '#758293' }}>
            Try adjusting the search, source type, or priority filter.
          </p>
          <button
            onClick={() => {
              onSelectPriorityFilter('ALL');
              setSelectedSourceType('ALL');
              setSearchKeyword('');
            }}
            className="rounded-md px-3.5 py-2 text-xs font-semibold"
            style={{ backgroundColor: '#0B1325', color: '#FFFFFF' }}
          >
            Show All Evidence
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvidence.map((item) => (
            <EvidenceCard
              key={item.id}
              evidence={item}
              targetContent={targetContent}
            />
          ))}
        </div>
      )}
    </section>
  );
};
