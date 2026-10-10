import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  generateInvestigationQueries,
  analyzeSearchResults
} from './src/analysisEngine.ts';
import { RawSearchResult, ContentType } from './src/types.ts';
import { getSampleResultsForContentType } from './src/sampleDatasets.ts';
import { InvalidVerificationTargetError, verifyUrl } from './src/urlVerification.ts';

dotenv.config();

const app = express();
const PORT = 3000;
const MAX_SEARCH_QUERIES = 5;

// In-memory cache for live search results within the process session
let sessionRawResults: RawSearchResult[] = [];

app.use(express.json({ limit: '10mb' }));

// ==========================================
// API ROUTES FIRST
// ==========================================

/**
 * Health and status endpoint
 */
app.get('/api/status', (req, res) => {
  const apiKey = process.env.SERPAPI_API_KEY;

  res.json({
    serpApiConfigured: Boolean(apiKey && apiKey.trim().length > 0),
    cachedDatasetTarget: 'Kantara',
    cachedRecordsCount: sessionRawResults.length,
    defaultQueries: [
      '"Kantara" piracy',
      '"Kantara" download',
      '"Kantara" torrent'
    ]
  });
});

/**
 * Get current search records from memory
 */
app.get('/api/raw-dataset', (req, res) => {
  res.json({
    count: sessionRawResults.length,
    results: sessionRawResults
  });
});

/**
 * Verify a public result URL and report its redirect and network status.
 */
app.post('/api/verify-url', async (req, res) => {
  const url = req.body?.url;
  if (typeof url !== 'string' || url.length > 2048) {
    res.status(400).json({ error: 'A URL under 2048 characters is required.' });
    return;
  }

  try {
    res.json(await verifyUrl(url));
  } catch (error) {
    if (error instanceof InvalidVerificationTargetError) {
      res.status(400).json({ error: error.message });
      return;
    }

    console.error('URL verification error:', error);
    res.status(500).json({ error: 'Unable to verify this URL.' });
  }
});

/**
 * Main Investigation Pipeline Endpoint
 * Supports both Simulation / Curated Mode and Live SerpApi Mode
 */
app.post('/api/investigate', async (req, res) => {
  try {
    const { target = 'Kantara', contentType = 'movies', useLiveSerpApi = false } = req.body;
    const trimmedTarget = (target || 'Kantara').trim();
    const validContentType: ContentType = (
      ['movies', 'series', 'books', 'music', 'blogs', 'podcasts', 'games', 'other'].includes(contentType)
        ? contentType
        : 'movies'
    ) as ContentType;

    const allQueries = generateInvestigationQueries(trimmedTarget, validContentType);
    const selectedQueries = allQueries.slice(0, MAX_SEARCH_QUERIES);

    if (useLiveSerpApi) {
      const apiKey = process.env.SERPAPI_API_KEY;
      if (!apiKey || !apiKey.trim()) {
        res.status(400).json({
          error: 'SERPAPI_API_KEY is not configured in .env. Please configure your API key in .env or switch to Demo mode.'
        });
        return;
      }

      console.log(`[SerpApi] Initiating live investigation for "${trimmedTarget}" [${validContentType}].`);
      const rawResultsCollected: RawSearchResult[] = [];
      const successfulQueries: string[] = [];
      let failedSearchCount = 0;

      for (const query of selectedQueries) {
        try {
          const serpApiUrl = new URL('https://serpapi.com/search.json');
          serpApiUrl.searchParams.set('engine', 'google');
          serpApiUrl.searchParams.set('q', query);
          serpApiUrl.searchParams.set('api_key', apiKey.trim());

          const response = await fetch(serpApiUrl.toString(), {
            signal: AbortSignal.timeout(15000)
          });
          if (!response.ok) {
            console.error(`SerpApi request failed for query "${query}" with status ${response.status}.`);
            failedSearchCount += 1;
            continue;
          }

          const data = await response.json();
          if (data.error) {
            console.error(`SerpApi returned an error for query "${query}".`);
            failedSearchCount += 1;
            continue;
          }
          successfulQueries.push(query);
          const organicResults = Array.isArray(data.organic_results) ? data.organic_results : [];

          for (const item of organicResults) {
            if (typeof item.link !== 'string' || !item.link.trim()) continue;
            rawResultsCollected.push({
              title: item.title || '',
              link: item.link || '',
              snippet: item.snippet || '',
              searchQuery: query,
              position: item.position,
              contentType: validContentType
            });
          }
        } catch (queryErr) {
          console.error(`Failed executing SerpApi query "${query}":`, queryErr);
          failedSearchCount += 1;
        }
      }

      if (successfulQueries.length === 0) {
        res.status(502).json({
          error: 'SerpApi search failed for every query. Check your API quota and connection, then try again.'
        });
        return;
      }

      sessionRawResults = rawResultsCollected;

      // Run evidence analysis engine
      const analysis = analyzeSearchResults(
        trimmedTarget,
        rawResultsCollected,
        'live_serpapi',
        successfulQueries,
        validContentType
      );
      analysis.searchFailures = failedSearchCount;

      res.json(analysis);
      return;
    }

    // SIMULATED / DEMO INTELLIGENCE MODE
    const rawDataset = getSampleResultsForContentType(trimmedTarget, validContentType);
    sessionRawResults = rawDataset;

    const analysis = analyzeSearchResults(
      trimmedTarget,
      rawDataset,
      'local_cached',
      selectedQueries,
      validContentType
    );

    res.json(analysis);
  } catch (error: any) {
    console.error('Investigation error:', error);
    res.status(500).json({
      error: 'An error occurred while executing the investigation analysis.',
      details: error?.message || String(error)
    });
  }
});

/**
 * Re-run analysis on custom raw data without saving to disk
 */
app.post('/api/analyze-raw', (req, res) => {
  try {
    const { target = 'Kantara', rawResults = [] } = req.body;
    const queries = generateInvestigationQueries(target);
    const analysis = analyzeSearchResults(target, rawResults, 'local_cached', queries);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to analyze raw records' });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Piracy Hunter server running on http://localhost:${PORT}`);
  });
}

startServer();
