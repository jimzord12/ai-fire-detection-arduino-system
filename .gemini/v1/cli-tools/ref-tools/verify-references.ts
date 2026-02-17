import { program } from 'commander';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import fetch from 'node-fetch';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import pLimit from 'p-limit';
import { chromium } from 'playwright';
import * as stringSimilarity from 'string-similarity';
import { fileURLToPath } from 'url';

export interface RefMetadata {
  originalText: string;
  authors: string[];
  year: string;
  title: string;
  doi?: string;
  url?: string;
}

export interface ValidationResult {
  ref: RefMetadata;
  status: 'verified' | 'suspicious' | 'broken_link' | 'error';
  source: 'crossref' | 'semantic_scholar' | 'playwright' | 'none';
  matchScore: number;
  details: string;
  confidence: 'high' | 'medium' | 'low';
  signals: string[];
  metadata?: {
    title?: string;
    authors?: string[];
    year?: string;
    journal?: string;
  };
}

// Cache for avoiding duplicate lookups
const resultCache = new Map<string, ValidationResult>();

// Rate limiters for API calls
const crossrefLimiter = pLimit(1);
const semanticScholarLimiter = pLimit(1);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function getCacheKey(ref: RefMetadata): string {
  const input = ref.doi || ref.title.toLowerCase().trim();
  return createHash('md5').update(input).digest('hex');
}

export function getCachedResult(ref: RefMetadata): ValidationResult | null {
  const key = getCacheKey(ref);
  return resultCache.get(key) || null;
}

export function setCachedResult(ref: RefMetadata, result: ValidationResult): void {
  const key = getCacheKey(ref);
  resultCache.set(key, result);
}

export function clearCache(): void {
  resultCache.clear();
}

export async function verifyWithCrossref(ref: RefMetadata): Promise<ValidationResult | null> {
  return crossrefLimiter(async () => {
    await delay(1000); // Rate limit: 1 request per second

    try {
      let queryUrl = '';
      let isDOILookup = false;

      if (ref.doi) {
        // Extract DOI part (e.g. 10.1016/j.fishres.2024.106777)
        const doiMatch = ref.doi.match(/10\.\d{4,}\/[^\s)]+/);
        if (doiMatch) {
          queryUrl = `https://api.crossref.org/works/${doiMatch[0]}`;
          isDOILookup = true;
        }
      }

      if (!queryUrl) {
        // Use title-specific query for better results, fetch 5 candidates
        const query = encodeURIComponent(ref.title);
        queryUrl = `https://api.crossref.org/works?query.title=${query}&rows=5`;
      }

      const response = await fetch(queryUrl, {
        headers: { 'User-Agent': 'RefValidator/2.0 (mailto:academic-reviewer@example.com)' },
      });

      if (!response.ok) {
        console.log(`Crossref API error: ${response.status} for ${queryUrl}`);
        return null;
      }

      const data: any = await response.json();

      let bestMatch: { item: any; score: number } = { item: null, score: 0 };

      if (isDOILookup) {
        // Direct DOI lookup - single result
        bestMatch = { item: data.message, score: 1.0 };
      } else {
        // Search results - find best match among candidates
        const items = data.message.items || [];
        for (const item of items) {
          const fetchedTitle = (Array.isArray(item.title) ? item.title[0] : item.title) || '';
          const score = stringSimilarity.compareTwoStrings(
            ref.title.toLowerCase(),
            fetchedTitle.toLowerCase()
          );
          if (score > bestMatch.score) {
            bestMatch = { item, score };
          }
        }
      }

      if (!bestMatch.item) return null;

      const item = bestMatch.item;
      const fetchedTitle = (Array.isArray(item.title) ? item.title[0] : item.title) || '';
      const fetchedAuthors = item.author?.map((a: any) => `${a.family}, ${a.given}`) || [];
      const fetchedYear = item.issued?.['date-parts']?.[0]?.[0]?.toString() || '';

      // Calculate title score for DOI lookups
      const titleScore = isDOILookup
        ? stringSimilarity.compareTwoStrings(ref.title.toLowerCase(), fetchedTitle.toLowerCase())
        : bestMatch.score;

      // Calculate confidence signals
      const signals: string[] = [];
      let confidenceScore = 0;

      if (isDOILookup && titleScore > 0.7) {
        signals.push('DOI verified in Crossref');
        confidenceScore += 40;
      }
      if (titleScore > 0.8) {
        signals.push('Strong title match (>80%)');
        confidenceScore += 30;
      } else if (titleScore > 0.6) {
        signals.push('Moderate title match (>60%)');
        confidenceScore += 15;
      }
      if (fetchedYear === ref.year) {
        signals.push('Year confirmed');
        confidenceScore += 15;
      }
      if (fetchedAuthors.length > 0 && ref.authors.length > 0) {
        // Check if any author surnames match
        const refSurnames = ref.authors.map(a => a.split(',')[0].toLowerCase().trim());
        const fetchedSurnames = fetchedAuthors.map((a: string) =>
          a.split(',')[0].toLowerCase().trim()
        );
        const authorOverlap = refSurnames.filter(s => fetchedSurnames.includes(s)).length;
        if (authorOverlap > 0) {
          signals.push(`${authorOverlap} author(s) matched`);
          confidenceScore += 15;
        }
      }

      const confidence: 'high' | 'medium' | 'low' =
        confidenceScore >= 70 ? 'high' : confidenceScore >= 40 ? 'medium' : 'low';

      return {
        ref,
        status: titleScore > 0.7 ? 'verified' : 'suspicious',
        source: 'crossref',
        matchScore: titleScore,
        confidence,
        signals,
        details:
          titleScore > 0.7
            ? 'High confidence match found in Crossref.'
            : `Partial match found (Score: ${(titleScore * 100).toFixed(1)}%).`,
        metadata: {
          title: fetchedTitle,
          authors: fetchedAuthors,
          year: fetchedYear,
          journal: item['container-title']?.[0],
        },
      };
    } catch (e: any) {
      console.log(`Crossref exception: ${e.message}`);
      return null;
    }
  });
}

export async function verifyWithSemanticScholar(
  ref: RefMetadata
): Promise<ValidationResult | null> {
  return semanticScholarLimiter(async () => {
    await delay(1000); // Rate limit: 1 request per second

    try {
      const query = encodeURIComponent(ref.title);
      const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&fields=title,authors,year,externalIds,venue&limit=5`,
        {
          headers: { 'User-Agent': 'RefValidator/2.0' },
        }
      );

      if (!response.ok) {
        console.log(`Semantic Scholar API error: ${response.status}`);
        return null;
      }

      const data: any = await response.json();
      const papers = data.data || [];

      if (papers.length === 0) return null;

      // Find best match
      let bestMatch: { paper: any; score: number } = { paper: null, score: 0 };
      for (const paper of papers) {
        const score = stringSimilarity.compareTwoStrings(
          ref.title.toLowerCase(),
          (paper.title || '').toLowerCase()
        );
        if (score > bestMatch.score) {
          bestMatch = { paper, score };
        }
      }

      if (!bestMatch.paper || bestMatch.score < 0.5) return null;

      const paper = bestMatch.paper;
      const fetchedAuthors = paper.authors?.map((a: any) => a.name) || [];
      const fetchedYear = paper.year?.toString() || '';

      // Calculate confidence
      const signals: string[] = ['Found in Semantic Scholar'];
      let confidenceScore = 20;

      if (bestMatch.score > 0.8) {
        signals.push('Strong title match (>80%)');
        confidenceScore += 30;
      }
      if (fetchedYear === ref.year) {
        signals.push('Year confirmed');
        confidenceScore += 15;
      }
      if (paper.externalIds?.DOI) {
        signals.push('DOI available');
        confidenceScore += 15;
      }

      const confidence: 'high' | 'medium' | 'low' =
        confidenceScore >= 60 ? 'high' : confidenceScore >= 35 ? 'medium' : 'low';

      return {
        ref,
        status: bestMatch.score > 0.7 ? 'verified' : 'suspicious',
        source: 'semantic_scholar',
        matchScore: bestMatch.score,
        confidence,
        signals,
        details:
          bestMatch.score > 0.7
            ? 'Match found in Semantic Scholar.'
            : `Partial match in Semantic Scholar (Score: ${(bestMatch.score * 100).toFixed(1)}%).`,
        metadata: {
          title: paper.title,
          authors: fetchedAuthors,
          year: fetchedYear,
          journal: paper.venue,
        },
      };
    } catch (e: any) {
      console.log(`Semantic Scholar exception: ${e.message}`);
      return null;
    }
  });
}

export async function verifyWithPlaywright(
  ref: RefMetadata,
  browser: any
): Promise<ValidationResult> {
  const targetUrl = ref.url || ref.doi;
  if (!targetUrl) {
    return {
      ref,
      status: 'suspicious',
      source: 'none',
      matchScore: 0,
      confidence: 'low',
      signals: [],
      details: 'No URL or DOI available for verification.',
    };
  }

  // Check if URL points to a PDF or other downloadable file
  const isPdfUrl =
    targetUrl.toLowerCase().endsWith('.pdf') ||
    targetUrl.toLowerCase().includes('.pdf?') ||
    targetUrl.toLowerCase().includes('/pdf/');

  // For PDF URLs, use HEAD request to verify accessibility instead of Playwright
  if (isPdfUrl) {
    try {
      const headResponse = await fetch(targetUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        },
        redirect: 'follow',
      });

      if (headResponse.ok) {
        const contentType = headResponse.headers.get('content-type') || '';
        const contentLength = headResponse.headers.get('content-length');
        const signals = ['PDF URL accessible via HEAD request'];

        if (contentType.includes('pdf')) {
          signals.push('Content-Type confirmed as PDF');
        }
        if (contentLength) {
          const sizeMB = (parseInt(contentLength, 10) / (1024 * 1024)).toFixed(2);
          signals.push(`File size: ${sizeMB} MB`);
        }

        return {
          ref,
          status: 'verified',
          source: 'playwright',
          matchScore: 1.0,
          confidence: 'high',
          signals,
          details: `PDF file is accessible and downloadable (HTTP ${headResponse.status}).`,
          metadata: {
            title: ref.title,
          },
        };
      } else {
        return {
          ref,
          status: 'broken_link',
          source: 'playwright',
          matchScore: 0,
          confidence: 'high',
          signals: ['PDF URL returned error status'],
          details: `PDF URL returned HTTP ${headResponse.status}: ${headResponse.statusText}`,
        };
      }
    } catch (e: any) {
      return {
        ref,
        status: 'broken_link',
        source: 'playwright',
        matchScore: 0,
        confidence: 'high',
        signals: ['Failed to reach PDF URL'],
        details: `Failed to verify PDF URL: ${e.message}`,
      };
    }
  }

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    acceptDownloads: true, // Enable download handling
  });
  const page = await context.newPage();

  // Track if a download starts (indicates file exists but triggers download instead of page load)
  let downloadStarted = false;
  let downloadInfo: { suggestedFilename?: string } = {};

  page.on('download', (download: any) => {
    downloadStarted = true;
    downloadInfo.suggestedFilename = download.suggestedFilename();
    // Cancel the download to avoid saving files
    download.cancel().catch(() => {});
  });

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Small delay to allow any client-side redirects or title updates
    await page.waitForTimeout(2000);

    const pageTitle = await page.title();
    const pageContent = await page.innerText('body').catch(() => '');
    const notFoundKeywords = [
      'not found',
      '404',
      'not exists',
      'page not available',
      'error 404',
      'could not be found',
      'access denied',
      'permission denied',
      'page unavailable',
      'site not found',
    ];
    const hasNotFoundKeyword = notFoundKeywords.some(
      keyword =>
        pageTitle.toLowerCase().includes(keyword) || pageContent.toLowerCase().includes(keyword)
    );

    if (hasNotFoundKeyword) {
      return {
        ref,
        status: 'broken_link',
        source: 'playwright',
        matchScore: 0,
        confidence: 'high',
        signals: ['Page indicates content is missing'],
        details: `Page loaded but content indicates it is missing (Found "not found" keywords). Title: "${pageTitle}"`,
        metadata: {
          title: pageTitle,
        },
      };
    }

    // Check multiple metadata selectors for better title extraction
    const titleSelectors = [
      'meta[name="citation_title"]',
      'meta[property="og:title"]',
      'meta[name="dc.title"]',
      'h1.article-title',
      'h1.title',
      '.document-title',
      'h1',
    ];

    let bestTitleScore = 0;
    let foundTitle = pageTitle;

    for (const selector of titleSelectors) {
      try {
        const title = await page.$eval(selector, (el: any) => el.content || el.textContent || '');
        if (title && title.trim()) {
          const score = stringSimilarity.compareTwoStrings(
            ref.title.toLowerCase(),
            title.toLowerCase().trim()
          );
          if (score > bestTitleScore) {
            bestTitleScore = score;
            foundTitle = title.trim();
          }
        }
      } catch {
        // Selector not found, continue
      }
    }

    // Also compare with page title
    const pageTitleScore = stringSimilarity.compareTwoStrings(
      ref.title.toLowerCase(),
      pageTitle.toLowerCase()
    );
    if (pageTitleScore > bestTitleScore) {
      bestTitleScore = pageTitleScore;
      foundTitle = pageTitle;
    }

    // Check for DOI match on page
    let doiVerified = false;
    if (ref.doi) {
      try {
        const pageDOI = await page.$eval(
          'meta[name="citation_doi"], meta[name="dc.identifier"], meta[property="citation_doi"]',
          (el: any) => el.content || ''
        );
        const refDoiPart = ref.doi.match(/10\.\d{4,}\/[^\s)]+/)?.[0];
        if (refDoiPart && pageDOI.includes(refDoiPart)) {
          doiVerified = true;
        }
      } catch {
        // DOI meta not found
      }
    }

    // Extract additional metadata
    const metaAuthor = await page
      .$eval(
        'meta[name="author"], meta[name="citation_author"], meta[name="dc.creator"]',
        (el: any) => el.content
      )
      .catch(() => '');
    const metaDate = await page
      .$eval(
        'meta[name="date"], meta[name="citation_publication_date"], meta[name="dc.date"]',
        (el: any) => el.content
      )
      .catch(() => '');

    // Calculate confidence
    const signals: string[] = ['URL/DOI accessible'];
    let confidenceScore = 10;

    if (doiVerified) {
      signals.push('DOI verified on page');
      confidenceScore += 40;
    }
    if (bestTitleScore > 0.8) {
      signals.push('Strong title match (>80%)');
      confidenceScore += 30;
    } else if (bestTitleScore > 0.5) {
      signals.push('Moderate title match (>50%)');
      confidenceScore += 15;
    }
    if (metaDate && ref.year && metaDate.includes(ref.year)) {
      signals.push('Year confirmed');
      confidenceScore += 10;
    }

    const confidence: 'high' | 'medium' | 'low' =
      confidenceScore >= 50 ? 'high' : confidenceScore >= 25 ? 'medium' : 'low';

    // Use higher threshold for verified status
    const isVerified = doiVerified || bestTitleScore > 0.5;

    return {
      ref,
      status: isVerified ? 'verified' : 'suspicious',
      source: 'playwright',
      matchScore: bestTitleScore,
      confidence,
      signals,
      details: isVerified
        ? `URL/DOI live and content matches. Best title match: "${foundTitle.substring(0, 60)}..."`
        : `URL/DOI live but content discrepancy. Found: "${foundTitle.substring(0, 60)}..."`,
      metadata: {
        title: foundTitle,
        year: metaDate,
        authors: metaAuthor ? [metaAuthor] : [],
      },
    };
  } catch (e: any) {
    // Check if the error was due to a download starting (file exists but triggers download)
    if (downloadStarted || (e.message && e.message.includes('Download is starting'))) {
      const signals = ['File download triggered (resource exists)'];
      if (downloadInfo.suggestedFilename) {
        signals.push(`Filename: ${downloadInfo.suggestedFilename}`);
      }
      return {
        ref,
        status: 'verified',
        source: 'playwright',
        matchScore: 1.0,
        confidence: 'high',
        signals,
        details: `URL points to a downloadable file (likely PDF or document). File exists and is accessible.`,
        metadata: {
          title: downloadInfo.suggestedFilename || ref.title,
        },
      };
    }

    return {
      ref,
      status: 'broken_link',
      source: 'playwright',
      matchScore: 0,
      confidence: 'high',
      signals: ['Failed to reach URL'],
      details: `Failed to reach URL/DOI: ${e.message}`,
    };
  } finally {
    await page.close();
    await context.close();
  }
}

export function parseReference(text: string): RefMetadata {
  const cleanText = text.replace(/^- /, '').trim();
  const doiMatch = cleanText.match(/https?:\/\/doi\.org\/[^\s)]+/);
  const urlMatch = cleanText.match(/https?:\/\/(?!doi\.org)[^\s)]+/);

  // Extract authors and year
  // Pattern: Authors. (Year). Title. ...
  const yearMatch = cleanText.match(/\((\d{4}[^)]*)\)/);
  const year = yearMatch ? yearMatch[1].substring(0, 4) : '';

  let authors: string[] = [];
  let title = '';

  if (yearMatch && yearMatch.index) {
    const authorsStr = cleanText.substring(0, yearMatch.index).replace(/\.$/, '').trim();
    authors = authorsStr.split(', ').map(a => a.trim());

    const afterYear = cleanText
      .substring(yearMatch.index + yearMatch[0].length)
      .replace(/^\.?\s*/, '');
    // Title is usually everything until the first dot that isn't part of an abbreviation, or until the DOI/URL
    const titleCandidates = afterYear.split(/\. (?=[A-Z]|http|_|\[)/);
    title = titleCandidates[0].replace(/^_|_$/g, '').trim();
  }

  return {
    originalText: text,
    authors,
    year,
    title: title || cleanText.substring(0, 100), // Fallback
    doi: doiMatch ? doiMatch[0] : undefined,
    url: urlMatch ? urlMatch[0] : undefined,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  program
    .name('ref-tools')
    .description('Verify references against Crossref and live URLs')
    .argument('<file>', 'Markdown file containing references')
    .option('-o, --output <file>', 'Output report file', 'ref-validation-report.md')
    .action(async (inputPath, options) => {
      // Resolve path relative to INIT_CWD (original cwd when using npm --prefix)
      const baseCwd = process.env.INIT_CWD || process.cwd();
      const resolvedPath = path.isAbsolute(inputPath)
        ? inputPath
        : path.resolve(baseCwd, inputPath);
      const content = fs.readFileSync(resolvedPath, 'utf-8');
      const tree = fromMarkdown(content);

      const references: RefMetadata[] = [];

      // Extract list items
      const traverse = (node: any) => {
        if (node.type === 'listItem') {
          const text = toString(node);
          if (text.trim()) {
            references.push(parseReference(text));
          }
        }
        if (node.children) node.children.forEach(traverse);
      };
      traverse(tree);

      console.log(`Found ${references.length} references. Starting validation...`);
      console.log('Using multi-source verification: Crossref → Semantic Scholar → Playwright\n');

      const browser = await chromium.launch();
      const results: ValidationResult[] = [];

      for (let i = 0; i < references.length; i++) {
        const ref = references[i];
        console.log(`[${i + 1}/${references.length}] Checking: ${ref.title.substring(0, 50)}...`);

        // Check cache first
        const cached = getCachedResult(ref);
        if (cached) {
          console.log(`  → Cache hit`);
          results.push(cached);
          continue;
        }

        let result: ValidationResult | null = null;

        // Step 1: Try Crossref first
        result = await verifyWithCrossref(ref);
        if (result && result.status === 'verified' && result.confidence === 'high') {
          console.log(`  → Crossref: ${result.status} (${result.confidence} confidence)`);
          setCachedResult(ref, result);
          results.push(result);
          continue;
        }

        // Step 2: Try Semantic Scholar as fallback
        const ssResult = await verifyWithSemanticScholar(ref);
        if (ssResult && ssResult.status === 'verified') {
          console.log(
            `  → Semantic Scholar: ${ssResult.status} (${ssResult.confidence} confidence)`
          );
          // Prefer Semantic Scholar if it's verified and Crossref was suspicious
          if (!result || result.status === 'suspicious') {
            result = ssResult;
          }
        }

        // Step 3: If still not verified or need URL check, use Playwright
        if (!result || result.status === 'suspicious' || result.confidence === 'low') {
          const pwResult = await verifyWithPlaywright(ref, browser);
          console.log(`  → Playwright: ${pwResult.status} (${pwResult.confidence} confidence)`);

          // Choose best result
          if (pwResult.status === 'verified' && pwResult.confidence !== 'low') {
            result = pwResult;
          } else if (pwResult.status === 'broken_link') {
            // If URL is broken but we have API verification, keep API result
            if (!result || result.status === 'suspicious') {
              result = pwResult;
            }
          } else if (!result) {
            result = pwResult;
          }
        }

        // Combine signals from multiple sources if we checked multiple
        if (result) {
          setCachedResult(ref, result);
          results.push(result);
        }
      }

      await browser.close();
      clearCache(); // Clear cache after run

      // Generate Report
      let report = `# Reference Validation Report\n\nGenerated on: ${new Date().toLocaleString()}\n\n`;
      report += `## Summary\n`;
      report += `- **Total:** ${results.length}\n`;
      report += `- **Verified:** ${results.filter(r => r.status === 'verified').length}\n`;
      report += `- **Suspicious:** ${results.filter(r => r.status === 'suspicious').length}\n`;
      report += `- **Broken Links:** ${results.filter(r => r.status === 'broken_link').length}\n\n`;

      // Confidence breakdown
      report += `### Confidence Levels\n`;
      report += `- High Confidence: ${results.filter(r => r.confidence === 'high').length}\n`;
      report += `- Medium Confidence: ${results.filter(r => r.confidence === 'medium').length}\n`;
      report += `- Low Confidence: ${results.filter(r => r.confidence === 'low').length}\n\n`;

      report += `## Detailed Findings\n\n`;
      results.forEach((r, idx) => {
        const statusIcon = r.status === 'verified' ? '✅' : r.status === 'suspicious' ? '⚠️' : '❌';
        const confidenceIcon =
          r.confidence === 'high' ? '🟢' : r.confidence === 'medium' ? '🟡' : '🔴';
        report += `### ${idx + 1}. ${statusIcon} ${r.ref.title}\n`;
        report += `- **Status:** ${r.status}\n`;
        report += `- **Confidence:** ${confidenceIcon} ${r.confidence}\n`;
        report += `- **Source:** ${r.source}\n`;
        report += `- **Match Score:** ${(r.matchScore * 100).toFixed(1)}%\n`;
        report += `- **Details:** ${r.details}\n`;
        if (r.signals && r.signals.length > 0) {
          report += `- **Signals:** ${r.signals.join(', ')}\n`;
        }
        if (r.metadata) {
          report += `- **Found Metadata:**\n`;
          if (r.metadata.title) report += `  - Title: ${r.metadata.title}\n`;
          if (r.metadata.authors?.length)
            report += `  - Authors: ${r.metadata.authors.join('; ')}\n`;
          if (r.metadata.year) report += `  - Year: ${r.metadata.year}\n`;
          if (r.metadata.journal) report += `  - Journal: ${r.metadata.journal}\n`;
        }
        report += `- **Original Text:** \`${r.ref.originalText}\`\n\n`;
      });

      // Resolve output path relative to INIT_CWD as well
      const outputPath = path.isAbsolute(options.output)
        ? options.output
        : path.resolve(baseCwd, options.output);
      fs.writeFileSync(outputPath, report);
      console.log(`\nValidation complete. Report written to ${outputPath}`);
    });

  program.parse();
}

