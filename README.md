# Piracy Hunter - An Antipiracy web intelligence

**Search Intelligence for Content Protection**

Piracy Hunter helps content owners, independent creators, authors, publishers, and investigators discover and organize publicly indexed search results that may indicate unauthorized content distribution.

By combining targeted Google Search queries through SerpApi with evidence classification, and optional URL verification, Piracy Hunter brings potential leads into a single interface for human review.

The tool supports investigation; it does not establish whether a source or piece of content infringes copyright, and it does not make legal determinations.

<img width="1348" height="663" alt="Screenshot 2026-10-11 232440" src="https://github.com/user-attachments/assets/f98be030-df0d-44f7-b396-a1ef139fc268" />



## Purpose

* Content creators, self-publishing authors, filmmakers, publishers, and intellectual property owners struggle to identify potentially unauthorized distribution of their work across the public web.
* Manually searching for potential sources and organizing relevant URLs can be time-consuming.
* Piracy Hunter aims to streamline this initial discovery process by bringing publicly indexed search results into a structured investigation dashboard.
* Once the owners verify their work being distributed without authorization,they can export those URL's and can submit copyright issues and take necessary action to bring those sources down.
* The pure intension of this project is to support original creators and legitimate content-protection efforts. Findings require independent verification before any allegation or enforcement action.


## Key Features

* **Live Search:** Uses SerpApi to retrieve Google Search results for a selected content type.
* **Evidence Classification:** Organizes results using source information and distribution-related signals.
* **Investigation Dashboard:** Presents findings, relevance indicators, and priority levels for review.
* **URL Verification:** Offers an optional live URL check to assess reachability and redirects.
* **Safety Checks:** Provides supplementary URL safety information where supported. Safety-check results are not guarantees that a URL is safe or legitimate.
* **Verify Source:** Allows users to open and inspect a discovered source for further investigation. 
* **Investigation Reports:** Helps organize findings for further review and documentation.

## How It Works

1. **Select a target:** Enter a content title and choose the relevant content category.
2. **Search:** The backend uses SerpApi to retrieve results from targeted Google Search queries.
3. **Process findings:** The application deduplicates URLs and organizes results using source information and distribution-related signals.
4. **Review evidence:** Explore the investigation dashboard, relevance indicators, and priority classifications.
5. **Investigate further:** Use optional URL verification and review the collected findings to decide which leads warrant additional investigation.

The results depend on search-engine indexing and the queries used. Every finding should be treated as a potential lead rather than proof of infringement.


## Technology Stack

* React
* TypeScript
* Vite
* Node.js
* Express
* SerpApi Google Search API
* Tailwind CSS

Check `package.json` for the complete dependency list.

## Set up instructions : 

## Run Locally

### Prerequisites

* Node.js and npm
* A SerpApi account and API key for live searches

### 1. Clone the repository

git clone YOUR_PUBLIC_REPOSITORY_URL

Open the cloned project folder in VS Code and open a terminal inside that folder.

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

Follow the local URL printed by the development server. (Run 'npm run dev' again if first try fails)

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

## Project Status

Piracy Hunter is a prototype for search-assisted content-protection investigation. Its classifications and coverage have limitations and should be evaluated accordingly.

## Acknowledgements

Powered by [SerpApi](https://serpapi.com/) for Google Search results.
