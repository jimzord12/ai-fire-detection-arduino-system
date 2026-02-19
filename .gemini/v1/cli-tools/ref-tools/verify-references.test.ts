import assert from 'node:assert';
import { beforeEach, describe, test } from 'node:test';
import {
  clearCache,
  getCacheKey,
  getCachedResult,
  parseReference,
  setCachedResult,
  verifyWithCrossref,
  verifyWithPlaywright,
  verifyWithSemanticScholar,
  type RefMetadata,
  type ValidationResult,
} from './verify-references.js';

beforeEach(() => {
  clearCache();
});

describe('Reference Parser', () => {
  test('should parse a standard APA-style reference', () => {
    const text =
      'Acharya, D., Palani, S., & Kumar, S. (2024). Towards automatic anomaly detection in fisheries using deep learning. Fisheries Research, 273, 106777. https://doi.org/10.1016/j.fishres.2024.106777';
    const parsed = parseReference(text);

    assert.strictEqual(parsed.year, '2024');
    assert.strictEqual(
      parsed.title,
      'Towards automatic anomaly detection in fisheries using deep learning'
    );
    assert.ok(parsed.authors.length >= 3);
    assert.strictEqual(parsed.doi, 'https://doi.org/10.1016/j.fishres.2024.106777');
  });

  test('should parse reference with URL', () => {
    const text =
      'Abu Dhabi Ports. (2018, June 2). Abu Dhabi Ports launches blockchain technology for trade community. https://www.adports.ae/abu-dhabi-ports-launches-blockchain-technology-for-trade-community/';
    const parsed = parseReference(text);

    assert.strictEqual(parsed.year, '2018');
    assert.strictEqual(
      parsed.title,
      'Abu Dhabi Ports launches blockchain technology for trade community'
    );
    assert.strictEqual(
      parsed.url,
      'https://www.adports.ae/abu-dhabi-ports-launches-blockchain-technology-for-trade-community/'
    );
  });

  test('should handle reference without DOI or URL', () => {
    const text = 'Smith, J. (2020). Introduction to Maritime Systems. Ocean Press.';
    const parsed = parseReference(text);

    assert.strictEqual(parsed.year, '2020');
    assert.strictEqual(parsed.title, 'Introduction to Maritime Systems');
    assert.strictEqual(parsed.doi, undefined);
    assert.strictEqual(parsed.url, undefined);
  });

  test('should handle reference with multiple dates in parentheses', () => {
    const text = 'Jones, A. (2019, March 15). Article title here. Journal Name, 10(2), 123-145.';
    const parsed = parseReference(text);

    assert.strictEqual(parsed.year, '2019');
  });

  test('should parse authors with initials and "and" conjunction', () => {
    const text = 'Doe, J. F., & Smith, A. B. (2022). Title.';
    const parsed = parseReference(text);
    assert.deepStrictEqual(parsed.authors, ['Doe', 'J. F.', '& Smith', 'A. B.']);
  });

  test('should parse authors with full first names', () => {
    const text = 'Johnson, Alice, & Brown, Robert. (2021). Title.';
    const parsed = parseReference(text);
    assert.deepStrictEqual(parsed.authors, ['Johnson', 'Alice', '& Brown', 'Robert.']);
  });

  test('should parse a title with a colon', () => {
    const text = 'Author, A. (2020). Main Title: Subtitle Here. Journal.';
    const parsed = parseReference(text);
    assert.strictEqual(parsed.title, 'Main Title: Subtitle Here');
  });

  test('should parse a title with special characters', () => {
    const text = 'Author, B. (2019). "Quoted Title" with !@#$. Journal.';
    const parsed = parseReference(text);
    assert.strictEqual(parsed.title, '"Quoted Title" with !@#$');
  });

  test('should parse a title that contains a dot within (e.g., an abbreviation)', () => {
    const text = 'Author, C. (2018). An U.S. Perspective on Research. Journal.';
    const parsed = parseReference(text);
    assert.strictEqual(parsed.title, 'An U.S. Perspective on Research. Journal.');
  });

  test('should handle titles that might resemble DOIs or URLs but are not', () => {
    const text = 'Author, D. (2017). A Study of https://example.com in Practice. Journal.';
    const parsed = parseReference(text);
    assert.strictEqual(parsed.title, 'A Study of https://example.com in Practice. Journal.');
    assert.strictEqual(parsed.url, undefined); // Ensure it doesn't mistakenly extract this as a URL
  });

  test('should correctly extract DOI when URL is also present', () => {
    const text =
      'Author, E. (2016). Article. Journal. https://example.com/article https://doi.org/10.1000/123';
    const parsed = parseReference(text);
    assert.strictEqual(parsed.doi, 'https://doi.org/10.1000/123');
    assert.strictEqual(parsed.url, 'https://example.com/article');
  });
});

describe('Cache Functions', () => {
  test('should generate consistent cache keys for same reference', () => {
    const ref: RefMetadata = {
      originalText: 'Test reference',
      authors: ['Author, A.'],
      year: '2024',
      title: 'Test Title',
      doi: 'https://doi.org/10.1234/test',
    };

    const key1 = getCacheKey(ref);
    const key2 = getCacheKey(ref);

    assert.strictEqual(key1, key2);
  });

  test('should use DOI for cache key when available', () => {
    const refWithDOI: RefMetadata = {
      originalText: 'Test',
      authors: [],
      year: '2024',
      title: 'Different Title',
      doi: 'https://doi.org/10.1234/test',
    };

    const refWithSameDOI: RefMetadata = {
      originalText: 'Test2',
      authors: ['Author'],
      year: '2023',
      title: 'Another Title',
      doi: 'https://doi.org/10.1234/test',
    };

    const key1 = getCacheKey(refWithDOI);
    const key2 = getCacheKey(refWithSameDOI);

    assert.strictEqual(key1, key2, 'Same DOI should produce same cache key');
  });

  test('should use title for cache key when DOI not available', () => {
    const ref1: RefMetadata = {
      originalText: 'Test',
      authors: [],
      year: '2024',
      title: 'Same Title Here',
    };

    const ref2: RefMetadata = {
      originalText: 'Test2',
      authors: ['Different Author'],
      year: '2020',
      title: 'same title here', // Same title, different case
    };

    const key1 = getCacheKey(ref1);
    const key2 = getCacheKey(ref2);

    assert.strictEqual(key1, key2, 'Same title (case-insensitive) should produce same cache key');
  });

  test('should store and retrieve cached results', () => {
    clearCache();

    const ref: RefMetadata = {
      originalText: 'Test',
      authors: [],
      year: '2024',
      title: 'Cached Reference Test',
    };

    const result: ValidationResult = {
      ref,
      status: 'verified',
      source: 'crossref',
      matchScore: 0.95,
      confidence: 'high',
      signals: ['Test signal'],
      details: 'Test details',
    };

    assert.strictEqual(getCachedResult(ref), null, 'Should return null for uncached reference');

    setCachedResult(ref, result);

    const cached = getCachedResult(ref);
    assert.notStrictEqual(cached, null, 'Should return cached result');
    assert.strictEqual(cached?.status, 'verified');
    assert.strictEqual(cached?.matchScore, 0.95);

    clearCache();
    assert.strictEqual(getCachedResult(ref), null, 'Cache should be cleared');
  });
});

describe('Crossref Verification (Mocked)', () => {
  test('should verify a reference with a valid DOI', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          title: ['A Valid Title from Crossref'],
          author: [{ family: 'Author', given: 'A.' }],
          issued: { 'date-parts': [[2023]] },
        },
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'A Valid Title from Crossref',
      doi: '10.1234/test.doi',
    };

    const result = await verifyWithCrossref(ref);

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.status, 'verified');
    assert.strictEqual(result?.source, 'crossref');
    assert.ok(result?.matchScore > 0.9);
    assert.strictEqual(result?.confidence, 'high');
    assert.ok(result?.signals.includes('DOI verified in Crossref'));
    assert.ok(result?.signals.includes('Strong title match (>80%)'));
    assert.ok(result?.signals.includes('Year confirmed'));
  });

  test('should return suspicious for a DOI lookup with low title match', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          title: ['Completely Different Title'],
          author: [{ family: 'Author', given: 'A.' }],
          issued: { 'date-parts': [[2023]] },
        },
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'A Valid Title from Crossref',
      doi: '10.1234/test.doi',
    };

    const result = await verifyWithCrossref(ref);

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.status, 'suspicious');
    assert.strictEqual(result?.source, 'crossref');
    assert.ok(result?.matchScore < 0.7);
    assert.strictEqual(result?.confidence, 'low');
    assert.ok(result?.signals.includes('DOI verified in Crossref')); // DOI is still found
  });

  test('should verify a reference with title search', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          items: [
            {
              title: ['Another Valid Title from Crossref'],
              author: [{ family: 'Author', given: 'B.' }],
              issued: { 'date-parts': [[2024]] },
            },
            {
              title: ['A Valid Title from Crossref'], // Best match
              author: [{ family: 'Author', given: 'A.' }],
              issued: { 'date-parts': [[2023]] },
            },
          ],
        },
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'A Valid Title from Crossref',
    };

    const result = await verifyWithCrossref(ref);

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.status, 'verified');
    assert.strictEqual(result?.source, 'crossref');
    assert.ok(result?.matchScore > 0.9);
    assert.strictEqual(result?.confidence, 'high');
    assert.ok(result?.signals.includes('Strong title match (>80%)'));
    assert.ok(result?.signals.includes('Year confirmed'));
  });

  test('should return null for API error', async t => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'Any Title',
    };

    const result = await verifyWithCrossref(ref);

    assert.strictEqual(result, null);
  });

  test('should return null if no match found in items', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        message: {
          items: [], // No items
        },
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'Non Existent Title',
    };

    const result = await verifyWithCrossref(ref);

    assert.strictEqual(result, null);
  });
});

describe('Semantic Scholar Verification (Mocked)', () => {
  test('should verify a reference with a valid title', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          {
            title: 'A Valid Title from Semantic Scholar',
            authors: [{ name: 'Author A' }],
            year: 2023,
            externalIds: { DOI: '10.5678/ss.test' },
          },
        ],
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'A Valid Title from Semantic Scholar',
    };

    const result = await verifyWithSemanticScholar(ref);

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.status, 'verified');
    assert.strictEqual(result?.source, 'semantic_scholar');
    assert.ok(result?.matchScore > 0.9);
    assert.strictEqual(result?.confidence, 'high');
    assert.ok(result?.signals.includes('Found in Semantic Scholar'));
    assert.ok(result?.signals.includes('Strong title match (>80%)'));
    assert.ok(result?.signals.includes('Year confirmed'));
    assert.ok(result?.signals.includes('DOI available'));
  });

  test('should return suspicious for a title search with low title match', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [
          {
            title: 'Slightly Different Title',
            authors: [{ name: 'Author A' }],
            year: 2023,
          },
        ],
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'A Valid Title from Semantic Scholar',
    };

    const result = await verifyWithSemanticScholar(ref);

    assert.notStrictEqual(result, null);
    assert.strictEqual(result?.status, 'suspicious');
    assert.strictEqual(result?.source, 'semantic_scholar');
    assert.ok(result?.matchScore < 0.7 && result?.matchScore >= 0.5); // Between 50-70%
    assert.strictEqual(result?.confidence, 'medium');
  });

  test('should return null for Semantic Scholar API error', async t => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'Any Title',
    };

    const result = await verifyWithSemanticScholar(ref);

    assert.strictEqual(result, null);
  });

  test('should return null if no match found in data', async t => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({
        data: [], // No data
      }),
    };

    t.mock.method(global, 'fetch', async () => mockResponse);

    const ref: RefMetadata = {
      originalText: '...',
      authors: ['Author, A.'],
      year: '2023',
      title: 'Non Existent Title',
    };

    const result = await verifyWithSemanticScholar(ref);

    assert.strictEqual(result, null);
  });
});

describe('Playwright Verification (Mocked)', () => {
  test('should detect "not found" keywords in content', async () => {
    const mockPage = {
      title: async () => '404 Not Found',
      innerText: async () => 'The page you are looking for does not exist.',
      waitForTimeout: async () => {},
      goto: async () => {},
      close: async () => {},
      $eval: async () => {
        throw new Error('Not found');
      },
    };
    const mockContext = {
      newPage: async () => mockPage,
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Missing Page',
      url: 'http://example.com/missing',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.strictEqual(result.confidence, 'high');
    assert.match(result.details, /content indicates it is missing/);
  });

  test('should detect "not found" keywords in title', async () => {
    const mockPage = {
      title: async () => 'Error 404 - Page not exists',
      innerText: async () => 'Some other content',
      waitForTimeout: async () => {},
      goto: async () => {},
      close: async () => {},
      $eval: async () => {
        throw new Error('Not found');
      },
    };
    const mockContext = {
      newPage: async () => mockPage,
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Missing Page',
      url: 'http://example.com/missing',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.match(result.details, /content indicates it is missing/);
  });

  test('should detect "Access Denied" as broken link', async () => {
    const mockPage = {
      title: async () => 'Access Denied',
      innerText: async () => 'You do not have permission to access this resource.',
      waitForTimeout: async () => {},
      goto: async () => {},
      close: async () => {},
      $eval: async () => {
        throw new Error('Not found');
      },
    };
    const mockContext = {
      newPage: async () => mockPage,
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Restricted Page',
      url: 'http://example.com/restricted',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.match(result.details, /Found "not found" keywords/);
  });

  test('should verify page with matching citation_title meta tag', async () => {
    const refTitle = 'Deep Learning for Maritime Applications';
    const mockPage = {
      title: async () => 'ScienceDirect - Journal Page', // Generic page title
      innerText: async () => 'Article content here...',
      waitForTimeout: async () => {},
      goto: async () => {},
      close: async () => {},
      $eval: async (selector: string) => {
        if (selector.includes('citation_title')) {
          return refTitle; // Exact match in meta tag
        }
        throw new Error('Not found');
      },
    };
    const mockContext = {
      newPage: async () => mockPage,
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: refTitle,
      url: 'http://example.com/article',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'verified');
    assert.ok(result.matchScore > 0.8, 'Match score should be high for exact title match');
  });

  test('should handle connection errors gracefully', async () => {
    const mockContext = {
      newPage: async () => ({
        goto: async () => {
          throw new Error('net::ERR_CONNECTION_REFUSED');
        },
        close: async () => {},
      }),
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Unreachable Page',
      url: 'http://localhost:9999/unreachable',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.match(result.details, /Failed to reach URL/);
  });

  test('should return suspicious for reference without URL or DOI', async () => {
    const mockBrowser = {
      newContext: async () => ({}),
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'No URL Reference',
      // No url or doi
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'suspicious');
    assert.strictEqual(result.source, 'none');
    assert.match(result.details, /No URL or DOI available/);
  });

  test('should verify PDF URL via HEAD request successfully', async t => {
    const mockHeadResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/pdf', 'content-length': '1048576' }),
    };

    t.mock.method(global, 'fetch', async () => mockHeadResponse);

    const mockBrowser = { newContext: async () => ({}) }; // Playwright won't be used for PDF HEAD request

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'A PDF Document',
      url: 'http://example.com/document.pdf',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'verified');
    assert.strictEqual(result.source, 'playwright');
    assert.strictEqual(result.confidence, 'high');
    assert.ok(result.signals.includes('PDF URL accessible via HEAD request'));
    assert.ok(result.signals.includes('Content-Type confirmed as PDF'));
    assert.ok(result.signals.some(s => s.startsWith('File size:')));
  });

  test('should return broken_link for inaccessible PDF URL via HEAD request', async t => {
    const mockHeadResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({}),
    };

    t.mock.method(global, 'fetch', async () => mockHeadResponse);

    const mockBrowser = { newContext: async () => ({}) };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Missing PDF',
      url: 'http://example.com/missing.pdf',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.strictEqual(result.source, 'playwright');
    assert.strictEqual(result.confidence, 'high');
    assert.ok(result.signals.includes('PDF URL returned error status'));
    assert.match(result.details, /PDF URL returned HTTP 404/);
  });

  test('should handle network error during PDF HEAD request', async t => {
    t.mock.method(global, 'fetch', async () => {
      throw new Error('Network error during HEAD request');
    });

    const mockBrowser = { newContext: async () => ({}) };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Network Error PDF',
      url: 'http://example.com/network_error.pdf',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    assert.strictEqual(result.status, 'broken_link');
    assert.strictEqual(result.source, 'playwright');
    assert.strictEqual(result.confidence, 'high');
    assert.ok(result.signals.includes('Failed to reach PDF URL'));
    assert.match(result.details, /Failed to verify PDF URL: Network error/);
  });
});

describe('ValidationResult Structure', () => {
  test('should include confidence and signals in result', async () => {
    const mockPage = {
      title: async () => 'Test Article Title',
      innerText: async () => 'Normal content',
      waitForTimeout: async () => {},
      goto: async () => {},
      close: async () => {},
      $eval: async () => {
        throw new Error('Not found');
      },
    };
    const mockContext = {
      newPage: async () => mockPage,
      close: async () => {},
    };
    const mockBrowser = {
      newContext: async () => mockContext,
    };

    const ref: RefMetadata = {
      originalText: '...',
      authors: [],
      year: '2023',
      title: 'Test Article Title',
      url: 'http://example.com/article',
    };

    const result = await verifyWithPlaywright(ref, mockBrowser as any);

    // Check that new fields exist
    assert.ok('confidence' in result, 'Result should have confidence field');
    assert.ok('signals' in result, 'Result should have signals field');
    assert.ok(Array.isArray(result.signals), 'Signals should be an array');
    assert.ok(
      ['high', 'medium', 'low'].includes(result.confidence),
      'Confidence should be high, medium, or low'
    );
  });
});
