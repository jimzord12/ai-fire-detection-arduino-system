import assert from 'node:assert';
import { describe, test } from 'node:test';
import {
  clearCache,
  getCacheKey,
  getCachedResult,
  parseReference,
  setCachedResult,
  verifyWithPlaywright,
  type RefMetadata,
  type ValidationResult,
} from './verify-references.js';

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

