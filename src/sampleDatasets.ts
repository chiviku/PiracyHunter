import { RawSearchResult, ContentType } from './types';

export const BOOK_SAMPLE_RESULTS = (target: string): RawSearchResult[] => {
  const safeTarget = target.trim() || 'Atomic Habits';
  const slug = safeTarget.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return [
    {
      title: `[PDF] [EPUB] ${safeTarget} Free Download — OceanofPDF`,
      link: `https://oceanofpdf.com/${slug}-download-free-pdf-epub/`,
      snippet: `Download ${safeTarget} complete ebook in PDF or EPUB format. Direct download link available without registration. Full unabridged digital edition. File size: 2.4 MB.`,
      searchQuery: `"${safeTarget}" "pdf free download"`,
      position: 1
    },
    {
      title: `${safeTarget} — Library Genesis (Libgen) Mirrors & Direct GET`,
      link: `https://libgen.is/book/index.php?md5=a8f93e2b109c4d928a`,
      snippet: `Download ${safeTarget} full book. Available mirrors: Cloudflare, IPFS. Supported formats: PDF, EPUB, MOBI, AZW3. Uploaded to shadow repository.`,
      searchQuery: `"${safeTarget}" (site:oceanofpdf.com OR site:libgen.is OR site:z-lib.is OR site:annas-archive.org)`,
      position: 2
    },
    {
      title: `${safeTarget} — Free Electronic Book Download | Z-Library`,
      link: `https://z-lib.is/book/3819201/${slug}`,
      snippet: `Read online free or download ${safeTarget} in EPUB and PDF format. Send to Kindle or download direct book file instantly.`,
      searchQuery: `"${safeTarget}" "epub download"`,
      position: 3
    },
    {
      title: `DOWNLOAD LINK IN BIO — ${safeTarget} Full EPUB & Audiobook MP3`,
      link: `https://www.instagram.com/reel/C8qL9x0p123/`,
      snippet: `Download ${safeTarget} for free! Full book epub and audiobook mp3 chapters. Download link in bio or join telegram channel for direct google drive link.`,
      searchQuery: `"${safeTarget}" "pdf free download"`,
      position: 4
    },
    {
      title: `${safeTarget} Full Book PDF/EPUB Archive — Telegram Channel`,
      link: `https://t.me/s/free_books_library_pdf_epub`,
      snippet: `${safeTarget} direct download link. All formats EPUB, MOBI, PDF available. Join VIP books community for cloud drive backup mirrors.`,
      searchQuery: `"${safeTarget}" "epub download"`,
      position: 5
    },
    {
      title: `${safeTarget} (Official Authorized Edition) — Amazon Kindle & Print`,
      link: `https://www.amazon.com/dp/B07D234567/ref=${slug}`,
      snippet: `Buy ${safeTarget} on Amazon. Read with Kindle Unlimited or purchase in Paperback, Hardcover, and Audible Audiobook. Instant authorized delivery.`,
      searchQuery: `"${safeTarget}" "read online free" full book`,
      position: 6
    },
    {
      title: `${safeTarget} — Goodreads Ratings, Reviews & Authorized Retailers`,
      link: `https://www.goodreads.com/book/show/40121378-${slug}`,
      snippet: `Discover quotes, community reviews, and authorized bookstores for ${safeTarget}. Purchase through Audible, Apple Books, or local independent bookshops.`,
      searchQuery: `"${safeTarget}" "audiobook" free download mp3`,
      position: 7
    },
    {
      title: `Self-Publishing Authors Combat Shadow Libraries & Unauthorized PDF Scrapers`,
      link: `https://www.publishersweekly.com/pw/by-topic/industry-news/trade/article/94211-authors-combat-pdf-piracy.html`,
      snippet: `Author guilds and independent self-publishers step up copyright takedown enforcement as titles like ${safeTarget} face unauthorized uploads on file-hosting networks.`,
      searchQuery: `"${safeTarget}" (site:oceanofpdf.com OR site:libgen.is OR site:z-lib.is OR site:annas-archive.org)`,
      position: 8
    },
    {
      title: `Atomic Energy & Radiation Measurement Standard Report PDF Download`,
      link: `https://www.iaea.org/publications/reports/atomic-energy-measurement-standards-pdf`,
      snippet: `Comprehensive scientific documentation on atomic weight measurement and radiation safety guidelines. Official IAEA technical paper download in PDF.`,
      searchQuery: `"${safeTarget}" "pdf free download"`,
      position: 9
    }
  ];
};

export const MOVIE_SAMPLE_RESULTS = (target: string): RawSearchResult[] => {
  const safeTarget = target.trim() || 'Kantara';
  const slug = safeTarget.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return [
    {
      title: `DOWNLOAD LINK IN BIO — ${safeTarget} Full Movie HD Leaked`,
      link: `https://www.instagram.com/reel/DPQHzyRjksL/`,
      snippet: `Watch ${safeTarget} full movie leaked in 1080p! Download link in bio. Join telegram for direct google drive link.`,
      searchQuery: `"${safeTarget}" piracy`,
      position: 1
    },
    {
      title: `${safeTarget} Full Movie Download 1080p 720p Filmyzilla Free HD`,
      link: `https://filmyzilla.com.co/${slug}-full-movie-download-hd/`,
      snippet: `${safeTarget} Hindi Dubbed Full Movie Download Filmyzilla 480p 720p 1080p HD CamRip. Direct high speed server download link available.`,
      searchQuery: `"${safeTarget}" download`,
      position: 2
    },
    {
      title: `${safeTarget} 1080p WEB-DL x264 Torrent Magnet Download`,
      link: `https://1337x.to/torrent/5432109/${slug}-1080p-web-dl/`,
      snippet: `Download ${safeTarget} 1080p WEB-DL AAC 5.1 x264 full movie torrent. Magnet link, seeds: 342, leeches: 89. File size: 2.4 GB.`,
      searchQuery: `"${safeTarget}" torrent`,
      position: 3
    },
    {
      title: `${safeTarget} All Languages HD Rip — Telegram Channel Direct Links`,
      link: `https://t.me/s/${slug}_movie_download_hd`,
      snippet: `${safeTarget} full movie leaked download link in bio. All resolutions 480p, 720p, 1080p available. Join VIP channel for mega cloud drive link.`,
      searchQuery: `"${safeTarget}" download`,
      position: 4
    },
    {
      title: `${safeTarget} pirated copies out online on torrent portals, producers urge fans to report`,
      link: `https://timesofindia.indiatimes.com/entertainment/movies/news/${slug}-pirated-version-leaked-online/articleshow/94582310.cms`,
      snippet: `Producers file police cyber cell complaints over unauthorized torrent leaks and illicit uploads of ${safeTarget}. Urging audiences to support legal streams.`,
      searchQuery: `"${safeTarget}" piracy`,
      position: 5
    },
    {
      title: `${safeTarget} Official Streaming — Prime Video`,
      link: `https://www.primevideo.com/detail/${slug}/0TXYZ12345`,
      snippet: `Watch ${safeTarget} officially on Prime Video with subscription. 4K UHD and Dolby 5.1 audio available. Multiple subtitles and audio tracks.`,
      searchQuery: `"${safeTarget}" download`,
      position: 6
    },
    {
      title: `${safeTarget} — IMDb Official Cast, Crew & Ratings`,
      link: `https://www.imdb.com/title/tt15327088/`,
      snippet: `${safeTarget}: Directed by acclaimed filmmakers. Official plot summary, production company notes, and theatrical distribution information.`,
      searchQuery: `"${safeTarget}" piracy`,
      position: 7
    },
    {
      title: `Spey Line Review: Bridge Outfitting Torrent`,
      link: `https://swingthefly.com/spey-line-review-bridge-outfitting-torrent/`,
      snippet: `A thorough review of the new Bridge Outfitting Torrent spey line for two-handed fly casting. Fast recovery, balanced loop control, and river testing results.`,
      searchQuery: `"${safeTarget}" torrent`,
      position: 8
    }
  ];
};

export const GAME_SAMPLE_RESULTS = (target: string): RawSearchResult[] => {
  const safeTarget = target.trim() || 'Cyberpunk 2077';
  const slug = safeTarget.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return [
    {
      title: `${safeTarget} Repack Free Download [Lossless] — FitGirl Repacks`,
      link: `https://fitgirl-repacks.site/${slug}-repack-free/`,
      snippet: `Download ${safeTarget} full PC game repack. Direct download link and torrent magnet available. Includes all update patches, selective audio download.`,
      searchQuery: `"${safeTarget}" crack download full PC`,
      position: 1
    },
    {
      title: `${safeTarget} Crack Full Version Free Direct Download — SteamUnlocked`,
      link: `https://steamunlocked.net/${slug}-free-download/`,
      snippet: `Download ${safeTarget} free PC game pre-installed direct link. Crack applied automatically. Download without torrents or speed limits.`,
      searchQuery: `"${safeTarget}" repack torrent free`,
      position: 2
    },
    {
      title: `${safeTarget} on Steam (Official Store)`,
      link: `https://store.steampowered.com/app/1091500/${slug}/`,
      snippet: `Buy ${safeTarget} on Steam. Official developer release, cloud saves, Steam achievements, and official technical support.`,
      searchQuery: `"${safeTarget}" free download full version`,
      position: 3
    }
  ];
};

export const MUSIC_SAMPLE_RESULTS = (target: string): RawSearchResult[] => {
  const safeTarget = target.trim() || 'Midnights';
  const slug = safeTarget.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return [
    {
      title: `${safeTarget} Full Album MP3 320kbps Free Download Zip — PagalSongs`,
      link: `https://pagalsongs.com.co/album/${slug}-320kbps-zip/`,
      snippet: `Download ${safeTarget} all songs in 320kbps and 128kbps high quality audio zip file. Direct high speed server download link.`,
      searchQuery: `"${safeTarget}" mp3 320kbps download free`,
      position: 1
    },
    {
      title: `${safeTarget} [FLAC 24-bit Lossless] Album Leak Download Torrent`,
      link: `https://dbree.org/v/${slug}-flac-leak`,
      snippet: `${safeTarget} studio master FLAC tracks zip direct cloud download. Leaked before official release date.`,
      searchQuery: `"${safeTarget}" flac album download zip`,
      position: 2
    },
    {
      title: `${safeTarget} — Listen on Spotify (Official Stream)`,
      link: `https://open.spotify.com/album/${slug}123`,
      snippet: `Stream ${safeTarget} on Spotify. Official artist profile, verified lyrics, and high quality audio streaming for subscribers.`,
      searchQuery: `"${safeTarget}" leak song download`,
      position: 3
    }
  ];
};

export function getSampleResultsForContentType(target: string, contentType: ContentType): RawSearchResult[] {
  switch (contentType) {
    case 'books':
      return BOOK_SAMPLE_RESULTS(target);
    case 'games':
      return GAME_SAMPLE_RESULTS(target);
    case 'music':
      return MUSIC_SAMPLE_RESULTS(target);
    case 'series':
    case 'movies':
    case 'blogs':
    case 'podcasts':
    case 'other':
    default:
      if (target.toLowerCase().includes('habit') || target.toLowerCase().includes('book') || target.toLowerCase().includes('novel')) {
        return BOOK_SAMPLE_RESULTS(target);
      }
      return MOVIE_SAMPLE_RESULTS(target);
  }
}
