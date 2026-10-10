/**
 * Piracy Hunter — Types and Data Models
 * Adheres strictly to the principle: Search intelligence & evidence analysis,
 * not a legal determination.
 */

export type ContentType =
  | 'movies'
  | 'series'
  | 'books'
  | 'music'
  | 'blogs'
  | 'podcasts'
  | 'games'
  | 'other';

export type SourceType =
  | 'News / Context'
  | 'Social Media'
  | 'Official / Legitimate'
  | 'Potential Distribution Source'
  | 'Forum / Community'
  | 'Video Platform'
  | 'E-Book / Document Repository'
  | 'Software / Warez Hub'
  | 'Audio / Music Portal'
  | 'Other';

export type RelevanceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type ContextType =
  | 'Potential Distribution Signal'
  | 'Piracy Reporting'
  | 'Social Media Signal'
  | 'Legitimate Source'
  | 'Requires Verification'
  | 'Unrelated Result';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY LOW';

export interface RawSearchResult {
  title: string;
  link: string;
  snippet?: string;
  searchQuery: string;
  position?: number;
  sourceDomain?: string;
  contentType?: ContentType;
}

export interface AnalyzedEvidence {
  id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  title: string;
  snippet: string;
  foundBy: string[];
  contentRelevance: RelevanceLevel;
  relevanceScore: number;
  relevanceTokensFound: string[];
  sourceType: SourceType;
  distributionIntent: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  detectedSignals: string[];
  contextType: ContextType;
  priority: PriorityLevel;
  priorityScore: number;
  whyItMatters: string;
  recommendedAction: string;
  fileFormatDetected?: string;
}

export interface ThreatIntelligenceStatus {
  status: 'Cloaked / Parked' | 'Dead Mirror (404)' | 'Active Pirate Infrastructure' | 'ISP Blocked / Offline';
  color: 'orange' | 'red' | 'green' | 'purple';
  code: 'CLOAKED' | 'DEAD' | 'ACTIVE' | 'BLOCKED';
  originalUrl: string;
  finalUrl?: string;
  httpStatus?: number;
  checkedAt: string;
  errorCode?: string;
}

export interface InvestigationSummary {
  target: string;
  contentType: ContentType;
  timestamp: string;
  dataSource: 'local_cached' | 'live_serpapi';
  creditsConsumed?: number;
  searchesExecuted: number;
  searchFailures?: number;
  queries: string[];
  totalResultsAnalyzed: number;
  uniqueEvidenceCount: number;
  highPriorityCount: number;
  mediumPriorityCount: number;
  requiresVerificationCount: number;
  legitimateCount: number;
  unrelatedCount: number;
  sourceTypeBreakdown: Record<string, number>;
  contextTypeBreakdown: Record<string, number>;
  evidence: AnalyzedEvidence[];
}

export interface ServerStatusResponse {
  serpApiConfigured: boolean;
  cachedDatasetTarget: string;
  cachedRecordsCount: number;
}
