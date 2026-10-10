/**
 * Piracy Hunter — Local Evidence Analysis Engine
 * 
 * Core Philosophy:
 * "Piracy Hunter turns scattered public web search information into structured investigation intelligence."
 * 
 * Multi-dimensional analysis model:
 * 1. Content Relevance (Rejects false positives like fishing rod reviews or financial tickers)
 * 2. Source Classification (Separates News, Social, Official, and Distribution channels)
 * 3. Distribution Intent (Detects actionable access cues & file packaging signals)
 * 4. Context Classification (Distinguishes Piracy Reporting vs Distribution Signal vs Legitimate)
 * 5. Investigation Priority (Ranks evidence without asserting legal determinations)
 */

import {
  RawSearchResult,
  AnalyzedEvidence,
  InvestigationSummary,
  ContentType,
  SourceType,
  RelevanceLevel,
  ContextType,
  PriorityLevel
} from './types';

// Stop words excluded from token relevance calculation
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
  'by', 'from', 'about', 'is', 'are', 'was', 'were', 'it', 'this', 'that',
  'movie', 'film', 'series', 'book', 'author', 'novel', 'ebook', 'song', 'album'
]);

// Known domain registries
const NEWS_DOMAINS = [
  'timesofindia.indiatimes.com',
  'ndtv.com',
  'gulfnews.com',
  'sentinelassam.com',
  'thehindu.com',
  'indianexpress.com',
  'hindustantimes.com',
  'moneycontrol.com',
  'variety.com',
  'deadline.com',
  'hollywoodreporter.com',
  'koimoi.com',
  'pinkvilla.com',
  'indiatoday.in',
  'news18.com',
  'bbc.com',
  'reuters.com',
  'theverge.com',
  'techcrunch.com',
  'publishersweekly.com',
  'thebookseller.com',
  'torrentfreak.com'
];

const SOCIAL_DOMAINS = [
  'instagram.com',
  'x.com',
  'twitter.com',
  'facebook.com',
  'reddit.com',
  'tiktok.com',
  't.me',
  'telegram.org',
  'telegram.me',
  'discord.com',
  'pinterest.com',
  'threads.net',
  'quora.com'
];

// Legitimate official platforms across Books, Movies, Music, Games, Blogs
const LEGITIMATE_DOMAINS = [
  // Books & Self-Publishing Platforms
  'amazon.com',
  'amazon.in',
  'amazon.co.uk',
  'kdp.amazon.com',
  'gumroad.com',
  'payhip.com',
  'gitbook.com',
  'manobook.com',
  'easemytrip.com',
  'scribd.com',
  'goodreads.com',
  'kobo.com',
  'wattpad.com',
  'webnovel.com',
  'royalroad.com',
  'inkitt.com',
  'tapas.io',
  'wuxiaworld.com',
  'goodnovel.com',
  'dreame.com',
  'novelupdates.com',
  'barnesandnoble.com',
  'audible.com',
  'smashwords.com',
  'draft2digital.com',
  'books.google.com',
  'play.google.com',
  'apple.com',
  'penguinrandomhouse.com',
  'harpercollins.com',
  'simonandschuster.com',
  'storytel.com',
  'bookshop.org',
  'waterstones.com',
  'gutenberg.org',
  'openlibrary.org',
  'vimeo.com',

  // Movies & Series
  'imdb.com',
  'netflix.com',
  'primevideo.com',
  'hotstar.com',
  'disneyplus.com',
  'sonyliv.com',
  'zee5.com',
  'jiocinema.com',
  'hulu.com',
  'max.com',
  'paramountplus.com',
  'rottentomatoes.com',
  'wikipedia.org',

  // Music
  'spotify.com',
  'bandcamp.com',
  'soundcloud.com',
  'tidal.com',
  'deezer.com',

  // Gaming & Software
  'steampowered.com',
  'epicgames.com',
  'gog.com',
  'itch.io',
  'ea.com',
  'ubisoft.com',
  'xbox.com',
  'playstation.com',

  // Blogs / Newsletters
  'substack.com',
  'medium.com',
  'wordpress.com',
  'ghost.org',
  'patreon.com',
  'ko-fi.com'
];

const VIDEO_DOMAINS = [
  'youtube.com',
  'vimeo.com',
  'dailymotion.com'
];

// E-Book & Document Repositories (Self-Publishing Authors' Target Threat Landscape)
const BOOK_DISTRIBUTION_DOMAINS = [
  'oceanofpdf',
  'libgen',
  'library-genesis',
  'libgenesis',
  'z-library',
  'z-lib',
  'zlibrary',
  '1lib',
  'annas-archive',
  'pdfdrive',
  'epub.pub',
  'ebook-hunter',
  'mobilism',
  'bookfi',
  'booksc',
  'booksee',
  'bookzz',
  'ebook3000',
  'pdfroom',
  'free-ebooks',
  'docer.pl',
  'freebookspot',
  'epdf.pub',
  'ebookee',
  'bookyards',
  'bookdl',
  'allbooksworld',
  'pdfcoffee',
  'kupdf',
  'vdoc.pub',
  'freefullbooks',
  'sanet.st',
  'pdfhost',
  'filepdf',
  'fliphtml5'
];

// Software & Games Warez Hubs
const GAME_DISTRIBUTION_DOMAINS = [
  'fitgirl-repacks',
  'dodi-repacks',
  'skidrow',
  'steamunlocked',
  'igg-games',
  'oceanofgames',
  'crackwatch',
  'cs.rin.ru',
  'apunkagames',
  'gamecopyworld'
];

// Music & Audio Piracy Hubs
const MUSIC_DISTRIBUTION_DOMAINS = [
  'pagalsongs',
  'toxicwap',
  'dbree',
  'leakth.is',
  'flaclossless',
  'mp3clan',
  'slider.kz',
  'songslover',
  'krakenfiles'
];

// General Video, Movie, and Torrent Distribution Repositories
const GENERAL_DISTRIBUTION_DOMAIN_KEYWORDS = [
  'filmyzilla',
  '1337x',
  'torrent',
  'yts',
  'piratebay',
  'tamilrockers',
  'tamilblasters',
  'tamilmv',
  'ibomma',
  'i-bomma',
  'netmirror',
  'pagalworld',
  'mp4moviez',
  'vegamovies',
  'bolly4u',
  'khatrimaza',
  'movierulz',
  '9xmovies',
  '9xflix',
  'mkvcinemas',
  'hdhub4u',
  'moviesda',
  'isaimini',
  'fmovies',
  '123movies',
  'putlocker',
  'soap2day',
  'solarmovie',
  'watchseries',
  'worldfree4u',
  'rarbg',
  'extratorrent',
  'limetorrents',
  'nyaa',
  'skymovies',
  'cinevood',
  'katmoviehd'
];

/**
 * Generates investigation-oriented queries tailored to the selected ContentType for SerpApi
 */
export function generateInvestigationQueries(
  targetContent: string,
  contentType: ContentType = 'movies'
): string[] {
  const trimmed = targetContent.trim().replace(/^["']+|["']+$/g, '');
  if (!trimmed) return [];

  switch (contentType) {
    case 'books':
      return [
        `"${trimmed}" site:oceanofpdf.com (book OR ebook OR epub OR pdf OR download) -site:pdfcoffee.com`,
        `"${trimmed}" (site:libgen.is OR site:libgen.rs OR site:libgen.li OR site:library-genesis.org OR site:libgenesis.net) (book OR ebook OR epub OR pdf) -site:pdfcoffee.com`,
        `"${trimmed}" (site:t.me OR site:telegram.me) (book OR ebook OR epub OR pdf OR audiobook) (download OR read OR channel OR link) -site:pdfcoffee.com`,
        `"${trimmed}" (site:annas-archive.org OR site:z-lib.is OR site:zlibrary.to OR site:1lib.to) (book OR ebook OR epub OR pdf OR download) -site:pdfcoffee.com`,
        `"${trimmed}" (site:pdfdrive.com OR site:epub.pub OR site:ebook-hunter.org OR site:mobilism.org OR site:ebook3000.com OR site:bookfi.net OR site:booksc.org OR site:bookzz.org) (book OR ebook OR epub OR pdf OR download) -site:pdfcoffee.com`
      ];

    case 'series':
      return [
        `"${trimmed}" (site:movierulz OR site:tamilrockers OR site:tamilblasters OR site:tamilmv OR site:ibomma OR site:netmirror OR site:1337x OR site:hdhub4u OR site:mkvcinemas)`,
        `"${trimmed}" series torrent complete season`,
        `"${trimmed}" season episodes watch online free`,
        `"${trimmed}" (site:t.me OR site:telegram.me) ("full episodes" OR download OR "watch online")`,
        `"${trimmed}" web series leak download`
      ];

    case 'music':
      return [
        `"${trimmed}" mp3 320kbps download free`,
        `"${trimmed}" flac album download zip`,
        `"${trimmed}" discography torrent leak`,
        `"${trimmed}" (site:instagram.com OR site:t.me OR site:youtube.com) (download OR "link in bio" OR telegram)`,
        `"${trimmed}" leak song album download`
      ];

    case 'blogs':
      return [
        `"${trimmed}" scraped full text repost`,
        `"${trimmed}" bypass paywall free article`,
        `"${trimmed}" newsletter pdf copy download`,
        `"${trimmed}" (site:instagram.com OR site:t.me OR site:reddit.com) (repost OR copy OR "full text")`,
        `"${trimmed}" full post archive leak`
      ];

    case 'podcasts':
      return [
        `"${trimmed}" podcast mp3 audio download`,
        `"${trimmed}" premium episode free patreon leak`,
        `"${trimmed}" podcast torrent rss`,
        `"${trimmed}" (site:instagram.com OR site:t.me OR site:youtube.com) (download OR "link in bio" OR telegram)`,
        `"${trimmed}" bonus episodes paid feed leak`
      ];

    case 'games':
      return [
        `"${trimmed}" crack download full PC`,
        `"${trimmed}" repack torrent free`,
        `"${trimmed}" keygen license patch`,
        `"${trimmed}" (site:instagram.com OR site:t.me OR site:youtube.com) (download OR "link in bio" OR telegram)`,
        `"${trimmed}" steam rip free download full version`
      ];

    case 'other':
      return [
        `"${trimmed}" free download leak`,
        `"${trimmed}" torrent download full`,
        `"${trimmed}" mega drive link`,
        `"${trimmed}" (site:instagram.com OR site:t.me OR site:youtube.com) (download OR "link in bio" OR telegram)`,
        `"${trimmed}" direct download piracy online`
      ];

    case 'movies':
    default:
      return [
        `"${trimmed}" (site:movierulz OR site:tamilrockers OR site:tamilblasters OR site:tamilmv OR site:ibomma OR site:netmirror OR site:1337x OR site:hdhub4u OR site:mkvcinemas OR site:9xmovies OR site:fmovies OR site:123movies)`,
        `"${trimmed}" download`,
        `"${trimmed}" torrent`,
        `"${trimmed}" (site:t.me OR site:telegram.me) ("full movie" OR download OR "watch online")`,
        `"${trimmed}" (site:instagram.com OR site:youtube.com) ("full movie" OR download OR leaked)`
      ];
  }
}

/**
 * Normalizes URL for deduplication
 * Removes tracking parameters (utm_*, ref, etc.) and normalizes trailing slashes
 */
export function normalizeUrl(rawUrl: string): { normalized: string; domain: string } {
  try {
    const parsed = new URL(rawUrl.trim());
    const domain = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Strip common tracking and referrer params
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'ref_src', 'fbclid', 'gclid'];
    trackingParams.forEach(p => parsed.searchParams.delete(p));

    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    const search = parsed.searchParams.toString() ? `?${parsed.searchParams.toString()}` : '';
    const normalized = `${parsed.protocol}//${domain}${pathname}${search}`;

    return { normalized, domain };
  } catch {
    const cleaned = rawUrl.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    const domain = cleaned.split('/')[0];
    return { normalized: cleaned, domain };
  }
}

/**
 * Tokenizes target string into significant search terms
 */
export function extractTargetTokens(target: string): string[] {
  return target
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));
}

/**
 * Calculates Content Relevance against the investigated target
 * Avoids false positives like "Spey Line Review: Bridge Outfitting Torrent"
 */
export function evaluateContentRelevance(
  target: string,
  title: string,
  snippet: string,
  url: string
): { level: RelevanceLevel; score: number; tokensFound: string[] } {
  const normalizedTarget = target.trim().toLowerCase();

  const titleLower = title.toLowerCase();
  const snippetLower = snippet.toLowerCase();
  const urlLower = url.toLowerCase();

  const combinedText =
  `${titleLower} ${snippetLower} ${urlLower}`;

  const tokens = extractTargetTokens(target);

  if (tokens.length === 0) {
    return {
      level: 'NONE',
      score: 0,
      tokensFound: []
    };
  }

  /*
   * IMPORTANT:
   * Relevance is about determining whether the result is actually
   * about the target content.
   *
   * Piracy terms such as "torrent", "download", "piracy", etc.
   * are deliberately NOT used to establish relevance here.
   * They are handled later by evaluateDistributionIntent().
   */

  // Use token boundaries instead of simple substring matching.
  const tokenRegex = (token: string) =>
    new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');

  const targetRegex = new RegExp(
    `\\b${normalizedTarget
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s+')}\\b`,
    'i'
  );

  const exactPhraseInTitle = targetRegex.test(title);
  const exactPhraseInSnippet = targetRegex.test(snippet);

  const tokensFound = tokens.filter(token => {
    const regex = tokenRegex(token);
    return regex.test(title) || regex.test(snippet);
  });

  const tokenMatchRatio = tokensFound.length / tokens.length;

  /*
   * URL matching is supporting evidence only.
   * A target appearing only in a URL should never make a result
   * highly relevant by itself.
   */
  const targetInUrl = targetRegex.test(
    urlLower.replace(/[-_]+/g, ' ')
  );

  let score = 0;

  // Strongest signal: exact target phrase in title.
  if (exactPhraseInTitle) {
    score += 55;
  }

  // Target appearing in snippet provides supporting evidence.
  if (exactPhraseInSnippet) {
    score += 20;
  }

  // Multi-word targets get additional confidence when their
  // individual tokens are also present.
  score += Math.round(tokenMatchRatio * 20);

  // URL is only a small supporting signal.
  if (targetInUrl) {
    score += 5;
  }

  /*
   * SHORT / AMBIGUOUS TARGET PROTECTION
   *
   * Targets such as:
   *   RRR
   *   IT
   *   AI
   *   GTA
   *
   * can easily occur in unrelated pages.
   *
   * Therefore an exact short target in a title is NOT automatically
   * considered highly relevant.
   */
  const isShortTarget =
    tokens.length === 1 && normalizedTarget.length <= 3;

  if (isShortTarget) {
    /*
    * Very short titles such as "RRR", "IT", "AI", and "GTA"
    * are highly vulnerable to unrelated keyword collisions.
    *
    * For these targets, an exact text match alone is NOT enough.
    * We require additional content context.
    */

    const mediaContextTerms = [
      'movie',
      'film',
      'cinema',
      'trailer',
      'cast',
      'actor',
      'actress',
      'director',
      'release',
      'theatrical',
      'box office',
      'soundtrack',
      'ott',
      'streaming',
      'watch',
      'telugu',
      'hindi',
      'tamil',
      'malayalam',
      'kannada',
      '2022'
    ];

    const mediaContextFound = mediaContextTerms.filter(term =>
      combinedText.includes(term)
    );

    /*
    * No actual media context:
    * treat the short-title match as a likely collision.
    */
    if (mediaContextFound.length === 0) {
      return {
        level: 'LOW',
        score: 5,
        tokensFound
      };
    }

    /*
    * One contextual term is still weak evidence.
    */
    if (mediaContextFound.length === 1) {
      score = Math.min(score, 30);
    }
  }

  /*
   * If the target does not occur in either title or snippet,
   * relevance should remain very low even if the URL contains it.
   */
  if (!exactPhraseInTitle && !exactPhraseInSnippet) {
    score = Math.min(score, 15);
  }

  score = Math.max(0, Math.min(score, 100));

  // Determine categorical relevance.
  let level: RelevanceLevel = 'NONE';

  if (score >= 70) {
    level = 'HIGH';
  } else if (score >= 40) {
    level = 'MEDIUM';
  } else if (score >= 15) {
    level = 'LOW';
  } else {
    level = 'NONE';
  }

  return {
    level,
    score,
    tokensFound
  };
}

/**
 * Classifies Source Domain with specialized support for Authors, Book Warehouses, and Software Hubs
 */
export function classifySourceType(domain: string, title: string, snippet: string): SourceType {
  const domainLower = domain.toLowerCase();
  const combined = `${domain} ${title} ${snippet}`.toLowerCase();

  // 1. Legitimate / Official platforms (Amazon, KDP, Audible, Prime, Steam, etc.)
  for (const legDomain of LEGITIMATE_DOMAINS) {
    if (domainLower === legDomain || domainLower.endsWith('.' + legDomain)) {
      return 'Official / Legitimate';
    }
  }

  // 2. Specialized E-Book & Document Repositories (OceanofPDF, Libgen, Z-Library, etc.)
  for (const bookKeyword of BOOK_DISTRIBUTION_DOMAINS) {
    if (domainLower.includes(bookKeyword) || combined.includes(`site:${bookKeyword}`)) {
      return 'E-Book / Document Repository';
    }
  }

  // 3. Software / Warez Hubs (FitGirl, Skidrow, SteamUnlocked)
  for (const gameKeyword of GAME_DISTRIBUTION_DOMAINS) {
    if (domainLower.includes(gameKeyword)) {
      return 'Software / Warez Hub';
    }
  }

  // 4. Audio / Music Distribution Hubs
  for (const musicKeyword of MUSIC_DISTRIBUTION_DOMAINS) {
    if (domainLower.includes(musicKeyword)) {
      return 'Audio / Music Portal';
    }
  }

  // 5. Video Platforms (disentangled from generic social)
  for (const videoDomain of VIDEO_DOMAINS) {
    if (domainLower === videoDomain || domainLower.endsWith('.' + videoDomain)) {
      return 'Video Platform';
    }
  }

  // 6. News / Editorial
  for (const newsDomain of NEWS_DOMAINS) {
    if (domainLower === newsDomain || domainLower.endsWith('.' + newsDomain)) {
      return 'News / Context';
    }
  }

  // 7. Social Media & Channels (Telegram, Reddit, Instagram, etc.)
  for (const socialDomain of SOCIAL_DOMAINS) {
    if (domainLower === socialDomain || domainLower.endsWith('.' + socialDomain)) {
      return 'Social Media';
    }
  }

  // 8. Dedicated Piracy / Torrent Distribution Domains
  for (const distKeyword of GENERAL_DISTRIBUTION_DOMAIN_KEYWORDS) {
    if (domainLower.includes(distKeyword)) {
      return 'Potential Distribution Source';
    }
  }

  // 9. Community / Forums
  if (domainLower.includes('forum') || domainLower.includes('community') || domainLower.includes('board')) {
    return 'Forum / Community';
  }

  return 'Other';
}

/**
 * Evaluates Distribution Intent based on actionable calls-to-action & packaging terms across categories
 */
export function evaluateDistributionIntent(
  text: string,
  contentRelevance: RelevanceLevel,
  contentType: ContentType = 'movies'
): {
  intent: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  signals: string[];
  fileFormatDetected?: string;
} {
  const lower = text.toLowerCase();
  const signals: string[] = [];
  let fileFormatDetected: string | undefined = undefined;

  // ------------------------------------------------------------
  // FORMAT / RELEASE INDICATORS
  // ------------------------------------------------------------

  if (
    lower.includes('.pdf') ||
    lower.includes('pdf download') ||
    lower.includes('free pdf')
  ) {
    signals.push('PDF Document indicator');
    fileFormatDetected = 'PDF';
  }

  if (
    lower.includes('.epub') ||
    lower.includes('epub download') ||
    lower.includes('free epub')
  ) {
    signals.push('EPUB E-book format indicator');
    fileFormatDetected = fileFormatDetected
      ? `${fileFormatDetected} / EPUB`
      : 'EPUB';
  }

  if (
    lower.includes('.mobi') ||
    lower.includes('.azw3') ||
    lower.includes('kindle mobi')
  ) {
    signals.push('MOBI / Kindle format indicator');
    fileFormatDetected = fileFormatDetected
      ? `${fileFormatDetected} / MOBI`
      : 'MOBI';
  }

  if (
    lower.includes('audiobook') &&
    (
      lower.includes('mp3') ||
      lower.includes('unabridged') ||
      lower.includes('download')
    )
  ) {
    signals.push('Audiobook MP3 release indicator');
    fileFormatDetected = 'Audiobook (MP3)';
  }

  if (
    lower.includes('320kbps') ||
    lower.includes('flac') ||
    lower.includes('album zip')
  ) {
    signals.push('High-bitrate Audio/Album indicator');
    fileFormatDetected = lower.includes('flac')
      ? 'FLAC (Lossless)'
      : 'MP3 (320kbps)';
  }

  if (
    lower.includes('repack') ||
    lower.includes('crack download') ||
    lower.includes('keygen') ||
    lower.includes('skidrow')
  ) {
    signals.push('Game Crack / Repack indicator');
    fileFormatDetected = 'Repack / Crack';
  }

  const hasVideoReleaseTag =
    lower.includes('1080p') ||
    lower.includes('720p') ||
    lower.includes('2160p') ||
    lower.includes('4k') ||
    lower.includes('camrip') ||
    lower.includes('web-dl') ||
    lower.includes('webrip') ||
    lower.includes('brrip');

  if (hasVideoReleaseTag) {
    signals.push('Video release / rip tag indicator');

    if (!fileFormatDetected) {
      fileFormatDetected = 'Video release';
    }
  }

  // ------------------------------------------------------------
  // DIRECT ACCESS / DISTRIBUTION SIGNALS
  // ------------------------------------------------------------

  const hasDownload =
    lower.includes('download') ||
    lower.includes('download link') ||
    lower.includes('download now');

  const hasDirectDownload =
    lower.includes('download link') ||
    lower.includes('direct download') ||
    lower.includes('download now') ||
    lower.includes('click here to download');

  if (hasDirectDownload) {
    signals.push('Direct download callout');
  } else if (hasDownload) {
    signals.push('Download reference');
  }

  const hasLinkInBio = lower.includes('link in bio');

  if (hasLinkInBio) {
    signals.push('Link in bio callout');
  }

  const hasTelegram =
    lower.includes('telegram link') ||
    lower.includes('join telegram') ||
    lower.includes('t.me/') ||
    lower.includes('telegram.me/');

  if (hasTelegram) {
    signals.push('Telegram channel redirection');
  }

  const hasMagnet =
    lower.includes('magnet link') ||
    lower.includes('magnet:?xt=');

  if (hasMagnet) {
    signals.push('Torrent magnet link');
  }

  const hasTorrent = lower.includes('torrent');

  if (hasTorrent) {
    signals.push('Torrent reference');
  }

  const hasCloudStorage =
    lower.includes('google drive link') ||
    lower.includes('drive.google.com') ||
    lower.includes('mega.nz') ||
    lower.includes('mega cloud') ||
    lower.includes('cloud drive');

  if (hasCloudStorage) {
    signals.push('Third-party cloud storage link');
  }

  // ------------------------------------------------------------
  // SPECIALIZED DISTRIBUTION SOURCES
  // ------------------------------------------------------------

  if (
    lower.includes('oceanofpdf') ||
    lower.includes('z-library') ||
    lower.includes('libgen') ||
    lower.includes("anna's archive")
  ) {
    signals.push('Specialized shadow library reference');
  }

  // ------------------------------------------------------------
  // CONTENT ACCESS LANGUAGE
  // ------------------------------------------------------------

  const hasFullMovie =
    lower.includes('full movie') ||
    lower.includes('fullmov');

  if (hasFullMovie) {
    signals.push('Full movie designation');
  }

  const hasFreeStreaming =
    lower.includes('free streaming') ||
    lower.includes('watch online free');

  if (hasFreeStreaming) {
    signals.push('Free streaming solicitation');
  }

  const hasMovieDownloadLanguage =
    lower.includes('movie download') ||
    lower.includes('download movie') ||
    lower.includes('download full movie');

  if (hasMovieDownloadLanguage) {
    signals.push('Movie download language');
  }

  const hasLeak =
    lower.includes('leaked') ||
    lower.includes('leak');

  if (hasLeak) {
    signals.push('Leak status referenced');
  }

  const hasFreeBookAccess =
    lower.includes('read online free') ||
    lower.includes('download full book') ||
    lower.includes('free ebook');

  if (hasFreeBookAccess) {
    signals.push('Free e-book access language');
  }

  if (
    lower.includes('kaise dekhe') ||
    lower.includes('kaise download kare')
  ) {
    signals.push('Query language distribution intent');
  }

  // ------------------------------------------------------------
  // RELEVANCE GATE
  // ------------------------------------------------------------

  /*
   * A distribution signal means nothing if the result is unrelated
   * to the target content.
   */
  if (contentRelevance === 'NONE') {
    return {
      intent: 'NONE',
      signals: [],
      fileFormatDetected
    };
  }

  // ------------------------------------------------------------
  // HIGH-CONFIDENCE DISTRIBUTION COMBINATIONS
  // ------------------------------------------------------------

  const strongDirectAccess =
    (hasDirectDownload && !lower.includes('trailer') && !lower.includes('teaser')) ||
    hasMagnet ||
    hasCloudStorage ||
    ((hasTelegram || hasLinkInBio) &&
      (
        hasFullMovie ||
        hasFreeStreaming ||
        hasMovieDownloadLanguage ||
        hasLeak ||
        hasFreeBookAccess ||
        hasMagnet
      ));

  const strongMovieReleaseCombination =
    contentType === 'movies' &&
    (
      (hasFullMovie && hasVideoReleaseTag) ||
      (hasMovieDownloadLanguage && hasVideoReleaseTag) ||
      (hasTorrent && hasVideoReleaseTag) ||
      (hasFreeStreaming && hasVideoReleaseTag)
    );

  const strongBookCombination =
    contentType === 'books' &&
    (
      hasFreeBookAccess ||
      (
        hasDownload &&
        (
          lower.includes('pdf') ||
          lower.includes('epub') ||
          lower.includes('mobi') ||
          lower.includes('azw3')
        )
      )
    );

  const strongGameCombination =
    contentType === 'games' &&
    (
      lower.includes('crack') ||
      lower.includes('repack') ||
      lower.includes('keygen') ||
      lower.includes('skidrow')
    );

  /*
   * A torrent reference by itself is not enough.
   * A torrent + a recognizable release format is much stronger.
   */
  const strongTorrentRelease =
    hasTorrent &&
    (
      hasVideoReleaseTag ||
      lower.includes('magnet') ||
      lower.includes('.torrent')
    );

  if (
    strongDirectAccess ||
    strongMovieReleaseCombination ||
    strongBookCombination ||
    strongGameCombination ||
    strongTorrentRelease
  ) {
    return {
      intent: 'HIGH',
      signals,
      fileFormatDetected
    };
  }

  // ------------------------------------------------------------
  // MEDIUM-CONFIDENCE SIGNALS
  // ------------------------------------------------------------

  /*
   * Multiple independent distribution signals indicate a meaningful
   * investigation lead, but not necessarily direct access.
   */
  if (signals.length >= 2) {
    return {
      intent: 'MEDIUM',
      signals,
      fileFormatDetected
    };
  }

  // ------------------------------------------------------------
  // LOW-CONFIDENCE SIGNAL
  // ------------------------------------------------------------

  if (signals.length === 1) {
    return {
      intent: 'LOW',
      signals,
      fileFormatDetected
    };
  }

  return {
    intent: 'NONE',
    signals,
    fileFormatDetected
  };
}
/**
 * Contextual Evidence Synthesis & Priority Calculation
 * Adheres strictly to the responsible terminology guideline (No legal determinations)
 * Prioritizes high ranking for unauthorized distribution websites so authors and creators see threats first!
 */
export function synthesizeEvidenceContext(
  target: string,
  title: string,
  snippet: string,
  url: string,
  domain: string,
  sourceType: SourceType,
  relevance: { level: RelevanceLevel; score: number; tokensFound: string[] },
  distribution: { intent: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'; signals: string[]; fileFormatDetected?: string },
  contentType: ContentType = 'movies'
): {
  contextType: ContextType;
  priority: PriorityLevel;
  priorityScore: number;
  whyItMatters: string;
  recommendedAction: string;
} {
  // 1. Unrelated False Positive Handling (e.g. Spey Line Review, Torrent Power)
  const hasDirectDistributionSignal = distribution.signals.some(signal =>
    [
      'Direct download callout',
      'Link in bio callout',
      'Telegram channel redirection',
      'Torrent magnet link',
      'Third-party cloud storage link'
    ].includes(signal)
  );

  if (relevance.level === 'NONE' || (relevance.level === 'LOW' && !hasDirectDistributionSignal)) {
    return {
      contextType: 'Unrelated Result',
      priority: 'VERY LOW',
      priorityScore: 5,
      whyItMatters: `The search keywords matched general terms (e.g., "${domain}"), but the investigated content ("${target}") does not meaningfully appear in the title or content.`,
      recommendedAction: 'Dismiss as irrelevant search noise; no investigation required.'
    };
  }

  // 2. Official / Legitimate Platform Handling (Amazon, KDP, Goodreads, Prime Video, Netflix, Steam)
  if (sourceType === 'Official / Legitimate') {
    return {
      contextType: 'Legitimate Source',
      priority: 'LOW',
      priorityScore: 15,
      whyItMatters: `Verified official distribution or catalog platform (${domain}). Content appears under authorized listing or publisher channel.`,
      recommendedAction: 'Whitelist as authorized distribution channel; maintain as baseline reference.'
    };
  }

  // 3. News / Editorial Reporting Handling (NDTV, Times of India, Publishers Weekly, etc.)
  if (sourceType === 'News / Context') {
    return {
      contextType: 'Piracy Reporting',
      priority: 'MEDIUM',
      priorityScore: 48,
      whyItMatters: `Editorial news or trade reporting discussing piracy incidents, leak complaints, or market impact regarding "${target}". Not an unauthorized distribution source.`,
      recommendedAction: 'Log as intelligence context regarding public piracy awareness and leak timing.'
    };
  }

  // 4. Specialized E-Book & Document Shadow Libraries (OceanofPDF, Libgen, Z-Library)
  // HIGH RANKING FOR SELF-PUBLISHING AUTHORS
  if (sourceType === 'E-Book / Document Repository') {
    const formatNotice = distribution.fileFormatDetected ? ` [${distribution.fileFormatDetected}]` : '';
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 97,
      whyItMatters: `Identified on a dedicated shadow library / e-book repository (${domain}) hosting downloadable files matching "${target}"${formatNotice}.`,
      recommendedAction: 'Critical Priority for Authors: Submit formal DMCA / copyright takedown notice to the hosting provider and request search engine delisting.'
    };
  }

  // 5. Specialized Software / Warez Hubs (FitGirl, Skidrow, SteamUnlocked)
  if (sourceType === 'Software / Warez Hub') {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 96,
      whyItMatters: `Identified on a software/game cracking hub (${domain}) advertising cracked binaries or unauthorized repacks matching "${target}".`,
      recommendedAction: 'High Priority: Document file hashes/mirrors and issue copyright infringement notifications to host and CDN networks.'
    };
  }

  // 6. Audio / Music Distribution Hubs
  if (sourceType === 'Audio / Music Portal') {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 94,
      whyItMatters: `Identified on a music sharing/download portal (${domain}) offering unauthorized audio track/album downloads matching "${target}".`,
      recommendedAction: 'High Priority: Submit audio removal notice to server host and request de-indexing.'
    };
  }

  // 7. Dedicated Torrent / Unauthorized Distribution Hubs (Filmyzilla, 1337x, etc.)
  if (sourceType === 'Potential Distribution Source') {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 93,
      whyItMatters: `Identified on a known distribution repository with direct file/torrent packaging indicators matching "${target}".`,
      recommendedAction: 'Immediate review: document magnet URI/file hash and issue formal copyright notification to host and indexing services.'
    };
  }

  const isTelegramDomain =
    domain === 't.me' || domain.endsWith('.t.me') ||
    domain === 'telegram.me' || domain.endsWith('.telegram.me');
  const hasTelegramChannelSignal =
    distribution.signals.includes('Telegram channel redirection');

  if (
    isTelegramDomain &&
    hasTelegramChannelSignal &&
    (
      relevance.level === 'HIGH' ||
      relevance.level === 'MEDIUM' ||
      distribution.intent === 'HIGH'
    )
  ) {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 88,
      whyItMatters: `A Telegram channel link associated with "${target}" was found. The channel content should be verified before taking action.`,
      recommendedAction: 'High investigation priority: review the public channel or post for an unauthorized copy or distribution link and preserve relevant evidence.'
    };
  }

  const isSocialOrVideoSource =
    sourceType === 'Social Media' || sourceType === 'Video Platform';
  const hasBookBioDistributionEvidence =
    contentType === 'books' &&
    distribution.signals.includes('Link in bio callout') &&
    distribution.signals.some(signal =>
      [
        'Direct download callout',
        'Telegram channel redirection',
        'Third-party cloud storage link',
        'Free e-book access language',
        'PDF Document indicator',
        'EPUB E-book format indicator',
        'MOBI / Kindle format indicator'
      ].includes(signal)
    );

  if (
    isSocialOrVideoSource &&
    hasBookBioDistributionEvidence &&
    (relevance.level === 'HIGH' || relevance.level === 'MEDIUM')
  ) {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 84,
      whyItMatters: `A social or video result associated with "${target}" advertises a book-related bio link alongside file or distribution indicators.`,
      recommendedAction: 'Review the linked destination and verify whether it offers an unauthorized copy before taking action.'
    };
  }

  const containsPromotionalTrailerLanguage =
    /\b(trailer|teaser|official promo|official first look)\b/i.test(`${title} ${snippet}`);
  const hasUnauthorizedMediaAccessCue = distribution.signals.some(signal =>
    [
      'Full movie designation',
      'Movie download language',
      'Free streaming solicitation',
      'Leak status referenced',
      'Torrent reference',
      'Torrent magnet link',
      'Third-party cloud storage link'
    ].includes(signal)
  );

  if (
    isSocialOrVideoSource &&
    containsPromotionalTrailerLanguage &&
    !hasUnauthorizedMediaAccessCue
  ) {
    return {
      contextType: 'Unrelated Result',
      priority: 'VERY LOW',
      priorityScore: 5,
      whyItMatters: `The ${sourceType === 'Video Platform' ? 'video' : 'social post'} appears to promote a trailer or teaser for "${target}", without clear evidence of unauthorized access.`,
      recommendedAction: 'Do not treat as a piracy lead; dismiss or retain only as promotional context.'
    };
  }

  // 8. Social Media / Video Platforms
  if (isSocialOrVideoSource) {

  const strongDirectSignals = [
    'Direct download callout',
    'Link in bio callout',
    'Telegram channel redirection',
    'Torrent magnet link',
    'Third-party cloud storage link'
  ];

  const hasStrongDirectSignal = distribution.signals.some(signal =>
    strongDirectSignals.includes(signal)
  );

  const hasStrongMovieRelease =
    distribution.signals.includes('Video release / rip tag indicator') &&
    (
      distribution.signals.includes('Full movie designation') ||
      distribution.signals.includes('Movie download language') ||
      distribution.signals.includes('Torrent reference')
    );

  // Strong direct distribution evidence
  if (
    distribution.intent === 'HIGH' &&
    (hasStrongDirectSignal || hasStrongMovieRelease)
  ) {
    const leadPriorityScore =
      domain === 't.me' || domain.endsWith('.t.me') ||
      domain === 'telegram.me' || domain.endsWith('.telegram.me')
        ? 88
        : domain === 'instagram.com' || domain.endsWith('.instagram.com')
          ? 84
          : domain === 'youtube.com' || domain.endsWith('.youtube.com') ||
              domain === 'youtu.be'
            ? 80
            : 82;

    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: leadPriorityScore,
      whyItMatters:
        `Result on ${domain} contains strong distribution indicators associated with "${target}".`,
      recommendedAction:
        'High investigation priority: verify the linked destination or distribution channel and document the evidence.'
    };
  }

  // Video platforms can also be HIGH when the result itself
  // strongly presents the target as an unauthorized/full release.
  if (
    sourceType === 'Video Platform' &&
    relevance.level === 'HIGH' &&
    (
      distribution.signals.includes('Full movie designation') ||
      distribution.signals.includes('Movie download language') ||
      distribution.signals.includes('Free streaming solicitation') ||
      distribution.signals.includes('Leak status referenced')
    )
  ) {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore:
        domain === 'youtube.com' || domain.endsWith('.youtube.com') || domain === 'youtu.be'
          ? 80
          : 84,
      whyItMatters:
        `The video result is highly relevant to "${target}" and contains language associated with unauthorized content access.`,
      recommendedAction:
        'High investigation priority: inspect the video description, comments, and linked destinations for evidence of unauthorized distribution.'
    };
  }

  return {
    contextType: 'Social Media Signal',
    priority: 'MEDIUM',
    priorityScore: 45,
    whyItMatters:
      `Public discussion or search context referencing "${target}". The available preview does not provide sufficient evidence of direct unauthorized distribution.`,
    recommendedAction:
      'Monitor the post, comments, profile, or description for direct distribution links or unauthorized copies.'
  };
}
  // 9. General Web with strong distribution intent
  if (distribution.intent === 'HIGH' && relevance.level === 'HIGH') {
    return {
      contextType: 'Potential Distribution Signal',
      priority: 'HIGH',
      priorityScore: 82,
      whyItMatters: `Website displaying file availability or download indicators associated with "${target}" (${distribution.signals.slice(0, 2).join(', ')}).`,
      recommendedAction: 'Investigate landing page without executing downloads to verify whether unauthorized copies are hosted.'
    };
  }

  if (distribution.intent === 'MEDIUM') {
    return {
      contextType: 'Requires Verification',
      priority: 'MEDIUM',
      priorityScore: 58,
      whyItMatters: `The result for "${target}" has some distribution-related wording, but the available evidence does not confirm a direct unauthorized copy.`,
      recommendedAction: 'Review the page and destination manually before treating it as a piracy lead.'
    };
  }


  // 11. Default fallback: Requires Verification
  return {
    contextType: 'Requires Verification',
    priority: 'MEDIUM',
    priorityScore: 40,
    whyItMatters: `Contains search queries matching "${target}", but context is ambiguous. Requires investigator manual review.`,
    recommendedAction: 'Inspect page headers and target URL to confirm context.'
  };
}

/**
 * Main Pipeline: Deduplicates raw search results and runs the multi-dimensional local analysis
 * Ranks distribution websites with high priority so self-publishing authors & owners can spot threats immediately
 */
export function analyzeSearchResults(
  targetContent: string,
  rawResults: RawSearchResult[],
  dataSource: 'local_cached' | 'live_serpapi' = 'local_cached',
  queriesExecuted: string[] = [],
  contentType: ContentType = 'movies'
): InvestigationSummary {
  const target = targetContent.trim() || 'Kantara';

  // Step 1: Deduplicate by normalized URL, tracking which queries discovered each result
  const deduplicatedMap = new Map<string, {
    raw: RawSearchResult;
    foundBy: Set<string>;
    domain: string;
    normalizedUrl: string;
  }>();

  for (const item of rawResults) {
    if (!item.link) continue;
    const { normalized, domain } = normalizeUrl(item.link);

    if (deduplicatedMap.has(normalized)) {
      const existing = deduplicatedMap.get(normalized)!;
      if (item.searchQuery) {
        existing.foundBy.add(item.searchQuery);
      }
    } else {
      const foundBy = new Set<string>();
      if (item.searchQuery) {
        foundBy.add(item.searchQuery);
      }
      deduplicatedMap.set(normalized, {
        raw: item,
        foundBy,
        domain,
        normalizedUrl: normalized
      });
    }
  }

  // Step 2: Multi-dimensional analysis for each unique evidence item
  const evidenceList: AnalyzedEvidence[] = [];
  let idCounter = 1;

  for (const [normUrl, entry] of deduplicatedMap.entries()) {
    const title = entry.raw.title || '';
    const snippet = entry.raw.snippet || '';
    const link = entry.raw.link;
    const combinedText = `${title} ${snippet} ${link}`;

    // 1. Content Relevance
    const relevance = evaluateContentRelevance(target, title, snippet, link);

    // 2. Source Classification
    const sourceType = classifySourceType(entry.domain, title, snippet);

    // 3. Distribution Intent
    const distribution = evaluateDistributionIntent(combinedText, relevance.level, contentType);

    // 4. Synthesize Context & Evidence Priority
    const synthesis = synthesizeEvidenceContext(
      target,
      title,
      snippet,
      link,
      entry.domain,
      sourceType,
      relevance,
      distribution,
      contentType
    );

    // Multi-query cross-correlation boost
    const multiQueryBoost = entry.foundBy.size > 1 ? 4 : 0;
    const finalPriorityScore = Math.min(100, synthesis.priorityScore + multiQueryBoost);

    evidenceList.push({
      id: `ev-${idCounter++}`,
      url: link,
      normalizedUrl: normUrl,
      domain: entry.domain,
      title,
      snippet,
      foundBy: Array.from(entry.foundBy),
      contentRelevance: relevance.level,
      relevanceScore: relevance.score,
      relevanceTokensFound: relevance.tokensFound,
      sourceType,
      distributionIntent: distribution.intent,
      detectedSignals: distribution.signals,
      contextType: synthesis.contextType,
      priority: synthesis.priority,
      priorityScore: finalPriorityScore,
      whyItMatters: synthesis.whyItMatters,
      recommendedAction: synthesis.recommendedAction,
      fileFormatDetected: distribution.fileFormatDetected
    });
  }

  // Step 3: High Ranking - Sort descending by priorityScore
  // Unauthorized distribution sites appear prominently at the very top!
  evidenceList.sort((a, b) => b.priorityScore - a.priorityScore);

  // Step 4: Metric aggregations
  const highPriorityCount = evidenceList.filter(e => e.priority === 'HIGH').length;
  const mediumPriorityCount = evidenceList.filter(e => e.priority === 'MEDIUM').length;
  const requiresVerificationCount = evidenceList.filter(e => e.contextType === 'Requires Verification').length;
  const legitimateCount = evidenceList.filter(e => e.contextType === 'Legitimate Source').length;
  const unrelatedCount = evidenceList.filter(e => e.contextType === 'Unrelated Result').length;

  const sourceTypeBreakdown: Record<string, number> = {};
  const contextTypeBreakdown: Record<string, number> = {};

  evidenceList.forEach(e => {
    sourceTypeBreakdown[e.sourceType] = (sourceTypeBreakdown[e.sourceType] || 0) + 1;
    contextTypeBreakdown[e.contextType] = (contextTypeBreakdown[e.contextType] || 0) + 1;
  });

  const queries = queriesExecuted.length > 0 ? queriesExecuted : generateInvestigationQueries(target, contentType);

  return {
    target,
    contentType,
    timestamp: new Date().toISOString(),
    dataSource,
    creditsConsumed: dataSource === 'live_serpapi' ? queries.length : 0,
    searchesExecuted: queries.length,
    queries,
    totalResultsAnalyzed: rawResults.length,
    uniqueEvidenceCount: evidenceList.length,
    highPriorityCount,
    mediumPriorityCount,
    requiresVerificationCount,
    legitimateCount,
    unrelatedCount,
    sourceTypeBreakdown,
    contextTypeBreakdown,
    evidence: evidenceList
  };
}
