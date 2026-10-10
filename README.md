# Piracy Hunter

**Search Intelligence for Content Protection**

Piracy Hunter uses SerpApi's Google Search results to discover, organize, and prioritize publicly visible signals of possible unauthorized content distribution. It helps content owners and investigators review potential leads and organize evidence for further investigation.

The tool supports investigation; it does not establish whether a source or piece of content infringes copyright, and it does not make legal determinations.

## Key Features

* **Live Search:** Uses SerpApi to retrieve Google Search results for a selected content type.
* **Evidence Classification:** Organizes results using source information and distribution-related signals.
* **Investigation Dashboard:** Presents findings, metrics, relevance indicators, and priority levels for review.
* **URL Verification:** Offers an optional live URL check to assess reachability and redirects.
* **Safety Checks:** Provides supplementary URL safety information where supported. Safety-check results are not guarantees that a URL is safe or legitimate.
* **Investigation Reports:** Helps organize findings for further review and documentation.


## Technology Stack

* React
* TypeScript
* Vite
* Node.js
* Express
* SerpApi Google Search API
* Tailwind CSS

Check `package.json` for the complete dependency list.

## Run Locally

### Prerequisites

* Node.js and npm
* A SerpApi account and API key for live searches

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd PiracyHunter
```

Replace `YOUR_REPOSITORY_URL` with the repository's actual URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Create a local `.env` file in the project root. You can use `.env.example` as a reference.

Add your own SerpApi API key:

```dotenv
SERPAPI_API_KEY=your_serpapi_api_key_here
```

Replace the placeholder with your actual key. Never commit `.env` or publish API credentials.

### 4. Start the application

```bash
npm run dev
```

Follow the local URL printed by the development server.

### 5. Explore the application

* **Live Search:** Queries SerpApi for current search results.


Live Search requires a valid API key and is subject to API availability and account limits.

## Search Coverage and Limitations

Each live investigation makes up to five targeted SerpApi Google searches for the selected content type.

Results come from Google's publicly available organic search listings. The application deduplicates results by URL and classifies them using source and distribution-related signals.

Search coverage is not exhaustive. Results may include false positives, omit relevant sources, or reflect information that has changed since indexing. A result's presence does not prove that a source distributes unauthorized content.

If some SerpApi queries fail, the application marks the findings as partial. If all queries fail, it reports an error rather than presenting sample data as live results.

## URL Verification

Evidence cards offer an optional live URL check using `got-scraping`.

The check follows up to five redirects, applies a five-second timeout, and reports a reachability classification, such as reachable, dead, parked or cloaked, or network-blocked.

Checks are performed on demand and are limited to public HTTP/HTTPS endpoints.

**A reachable URL is not necessarily legitimate, and an unreachable URL is not necessarily infringing.** URL verification assesses technical reachability; it does not establish ownership, authorization, or copyright infringement.

## Responsible Use

Piracy Hunter is intended to support content-protection research, evidence organization, and human review of potential infringement signals.

* Treat results as investigative leads, not verified allegations.
* Independently review findings before taking action.
* Respect applicable laws, copyright rules, website terms, and third-party rights.
* Do not use search results alone as the basis for allegations or takedown requests.
* Verify the relevant facts and authorization status before escalating a finding.

Piracy Hunter is an investigative aid, not a substitute for legal advice or a determination of copyright infringement.

## API Key and Security

Live Search requires a SerpApi API key supplied through a local environment variable.

* Keep `.env` out of version control.
* Never hardcode API keys in source files.
* Do not publish credentials in documentation, screenshots, or demo recordings.
* Use your own SerpApi account and comply with its applicable terms and usage limits.

## Project Status

Piracy Hunter is a prototype for search-assisted content-protection investigation. Its classifications and coverage have limitations and should be evaluated accordingly.

## Acknowledgements

Powered by [SerpApi](https://serpapi.com/) for Google Search results.
