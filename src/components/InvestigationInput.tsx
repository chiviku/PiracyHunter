import React, { useState } from 'react';
import { ContentType } from '../types';
import {
  Search,
  ArrowRight,
  BookOpen,
  Film,
  Tv,
  Music,
  FileText,
  Radio,
  Gamepad2,
  FolderArchive,
  ChevronDown
} from 'lucide-react';

interface InvestigationInputProps {
  currentTarget: string;
  currentContentType: ContentType;
  isInvestigating: boolean;
  serpApiConfigured: boolean;
  onInvestigate: (target: string, contentType: ContentType, useLiveSerpApi: boolean) => void;
}

interface ContentTypeOption {
  value: ContentType;
  label: string;
  shortLabel: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  samplePresets: string[];
}

export const CONTENT_TYPE_OPTIONS: ContentTypeOption[] = [
  {
    value: 'books',
    label: 'Books & E-Books (Authors / Self-Publishers)',
    shortLabel: 'Books',
    badge: 'Self-Publishing',
    description: 'Detect shadow libraries, unauthorized PDF/EPUB re-hosts, and audiobooks',
    icon: <BookOpen className="w-4 h-4 text-emerald-600" />,
    samplePresets: ['Atomic Habits', 'The Psychology of Money', 'Deep Work', 'Rich Dad Poor Dad']
  },
  {
    value: 'movies',
    label: 'Movies & Cinema',
    shortLabel: 'Movies',
    badge: 'Films',
    description: 'Detect torrent leaks, 1080p CAM/WEB-DL portals, and unauthorized streams',
    icon: <Film className="w-4 h-4 text-amber-600" />,
    samplePresets: ['Kantara', 'Pushpa 2', 'Dune: Part Two', 'Kalki 2898 AD']
  },
  {
    value: 'series',
    label: 'Series & TV Shows',
    shortLabel: 'Series',
    badge: 'Episodes',
    description: 'Detect full season torrent packs, web series rips, and telegram links',
    icon: <Tv className="w-4 h-4 text-blue-600" />,
    samplePresets: ['Stranger Things', 'House of the Dragon', 'The Family Man', 'Mirzapur']
  },
  {
    value: 'music',
    label: 'Music & Audio Albums',
    shortLabel: 'Music',
    badge: 'Discography',
    description: 'Detect 320kbps MP3 dumps, FLAC lossless leaks, and album zip archives',
    icon: <Music className="w-4 h-4 text-purple-600" />,
    samplePresets: ['Midnights', 'Starboy', 'After Hours', 'Divide']
  },
  {
    value: 'blogs',
    label: 'Blogs & Premium Newsletters',
    shortLabel: 'Blogs',
    badge: 'Articles',
    description: 'Detect paywall scrapers, stolen blog posts, and copied newsletter PDF issues',
    icon: <FileText className="w-4 h-4 text-cyan-600" />,
    samplePresets: ['Lenny\'s Newsletter', 'Stratechery', 'The Pragmatic Engineer', 'Not Boring']
  },
  {
    value: 'podcasts',
    label: 'Podcasts & Audio Shows',
    shortLabel: 'Podcasts',
    badge: 'Episodes',
    description: 'Detect Patreon leak feeds, unauthorized episode rips, and subscriber audio mp3s',
    icon: <Radio className="w-4 h-4 text-rose-600" />,
    samplePresets: ['Huberman Lab Premium', 'The Joe Rogan Experience', 'Hardcore History', 'Acquired']
  },
  {
    value: 'games',
    label: 'Games & Software Repacks',
    shortLabel: 'Games',
    badge: 'PC / Console',
    description: 'Detect cracked executables, FitGirl/DODI repacks, and pre-release warez',
    icon: <Gamepad2 className="w-4 h-4 text-indigo-600" />,
    samplePresets: ['Cyberpunk 2077', 'Elden Ring', 'GTA V', 'Black Myth: Wukong']
  },
  {
    value: 'other',
    label: 'Other Digital Works & Assets',
    shortLabel: 'Other',
    badge: 'Digital Assets',
    description: 'Detect leaked online courses, 3D asset packs, design kits, and cloud folders',
    icon: <FolderArchive className="w-4 h-4 text-slate-600" />,
    samplePresets: ['Full-Stack Masterclass', '3D Blender Pro Assets', 'UI Design Kit Pro', 'Trading Course']
  }
];

export const InvestigationInput: React.FC<InvestigationInputProps> = ({
  currentTarget,
  currentContentType = 'books',
  isInvestigating,
  serpApiConfigured,
  onInvestigate
}) => {
  const [targetInput, setTargetInput] = useState(currentTarget || 'Atomic Habits');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>(currentContentType || 'books');

  const activeOption = CONTENT_TYPE_OPTIONS.find(opt => opt.value === selectedContentType) || CONTENT_TYPE_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInput.trim() || isInvestigating) return;
    onInvestigate(targetInput.trim(), selectedContentType, true);
  };

  const handleContentTypeChange = (newType: ContentType) => {
    setSelectedContentType(newType);
    const newOption = CONTENT_TYPE_OPTIONS.find(opt => opt.value === newType);
    if (newOption && (!targetInput.trim() || targetInput === 'Kantara' || targetInput === 'Atomic Habits')) {
      setTargetInput(newOption.samplePresets[0]);
    }
  };

  return (
    <div className="mb-8 space-y-4">
      <section className="investigation-intro" aria-labelledby="product-introduction">
        <h3 id="product-introduction" className="max-w-3xl text-xl font-semibold leading-snug text-[#0B1F3A] sm:text-2xl">
          Are you a content owner concerned about unauthorized distribution of your work?
        </h3>
        <h4 id="product-introduction" className="max-w-3xl text-xl font-semibold leading-snug text-[#0B1F3A] sm:text-2xl">Protect your intellectual property with us</h4>
        <ul className="investigation-intro-points">
          <li>Piracy Hunter helps you find public-web leads that may indicate unauthorized distribution of your work.</li>
          <li>Enter the title and category, then start an investigation.</li>
          <li>We’ll review public search results, surface relevant distribution signals, and prioritize leads for your follow-up.</li>
        </ul>

        <br />

        <h6>Note : Results are investigative signals, not determinations of infringement.</h6>
      </section>

      <section className="investigation-card rounded-md border p-4 sm:p-6" aria-labelledby="investigation-heading">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h2 id="investigation-heading" className="text-lg font-bold tracking-wide text-[#0B1F3A]">INVESTIGATE CONTENT</h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">LIVE WEB INTELLIGENCE</span>
            </div>
            <p className="text-sm text-slate-700">Search the public web for distribution signals and investigation leads.</p>
          </div>
          <div className={`inline-flex shrink-0 items-center gap-2 text-xs font-semibold ${serpApiConfigured ? 'text-emerald-700' : 'text-amber-800'}`}>
            <span className={`h-2 w-2 rounded-full ${serpApiConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{serpApiConfigured ? 'LIVE SEARCH' : 'LIVE SEARCH - SETUP REQUIRED'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-12 md:gap-4">
            <div className="relative md:col-span-8">
              <label htmlFor="content-input" className="investigation-field-label mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
                Content Title / Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="content-input"
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="Enter a title, creator, or work name"
                  className="investigation-field h-11 w-full border bg-white py-2.5 pl-10 pr-4 text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
                  disabled={isInvestigating}
                />
              </div>
            </div>

            <div className="relative md:col-span-4">
              <label htmlFor="content-type-select" className="investigation-field-label mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
                Content Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {activeOption.icon}
                </div>
                <select
                  id="content-type-select"
                  value={selectedContentType}
                  onChange={(e) => handleContentTypeChange(e.target.value as ContentType)}
                  disabled={isInvestigating}
                  className="investigation-field h-11 w-full appearance-none border bg-white py-2.5 pl-9 pr-10 text-base font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  {CONTENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 border-l-2 border-slate-400 py-0.5 pl-3 text-xs">
            <span className="mt-0.5 shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{activeOption.icon}</span>
            <div>
              <span className="font-semibold text-slate-800">{activeOption.shortLabel}</span>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{activeOption.description}</p>
            </div>
          </div>

          <div className="pb-1">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Quick presets</div>
            <div className="flex flex-wrap gap-1.5">
              {activeOption.samplePresets.map((item) => (
                <button
                  key={item}
                  type="button"
                  id={`preset-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  onClick={() => setTargetInput(item)}
                  disabled={isInvestigating}
                  className={`border px-2 py-1 text-[11px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    targetInput.toLowerCase() === item.toLowerCase()
                      ? 'border-[#0B1F3A] bg-white font-semibold text-[#0B1F3A]'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pr-10 pt-0.2">
            <button
              id="btn-investigate"
              type="submit"
              disabled={isInvestigating || !targetInput.trim()}
              className="investigation-submit flex h-12 w-full items-center justify-center gap-2 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors focus-visible:outline-none disabled:cursor-not-allowed sm:w-auto"
            >
              {isInvestigating ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Investigating...</span>
                </>
              ) : (
                <>
                  <span>Start Investigation</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
