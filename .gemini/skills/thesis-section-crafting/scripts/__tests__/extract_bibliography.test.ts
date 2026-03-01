/**
 * Unit tests for extract_bibliography.ts
 *
 * Run with:
 *   npm test
 *   node --import tsx/esm --test __tests__/extract_bibliography.test.ts
 */

import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { test } from 'node:test';

import { extractBibliography, parseReference } from '../extract_bibliography.js';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Write a temp markdown file and return its absolute path. */
function writeTmpMd(content: string): string {
  const file = path.join(
    os.tmpdir(),
    `bib_test_${Date.now()}_${Math.random().toString(36).slice(2)}.md`
  );
  fs.writeFileSync(file, content, 'utf-8');
  return file;
}

/** Run extractBibliography on in-memory markdown; return the produced .bib content. */
function runExtract(mdContent: string): string {
  const input = writeTmpMd(mdContent);
  const output = input.replace('.md', '.bib');
  extractBibliography(input, output);
  const result = fs.readFileSync(output, 'utf-8');
  fs.unlinkSync(input);
  fs.unlinkSync(output);
  return result;
}

// ═══════════════════════════════════════════════════════════════════════
// parseReference – IEEE format
// ═══════════════════════════════════════════════════════════════════════

test('parseReference › IEEE › American punctuation (comma inside closing quote)', () => {
  // Real example from the thesis – comma comes BEFORE the closing quote
  const ref =
    'M. Müller, J. Briesenick, and K. Behnke, "Classification in early fire detection using multi-sensor nodes," _Sensors_, vol. 24, no. 4, 2024, doi: 10.3390/s24041319.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'M. Müller, J. Briesenick, and K. Behnke');
  assert.equal(p.title, 'Classification in early fire detection using multi-sensor nodes');
  assert.equal(p.year, '2024');
  assert.equal(p.doi, '10.3390/s24041319');
  assert.equal(p.url, 'https://doi.org/10.3390/s24041319');
});

test('parseReference › IEEE › British punctuation (comma outside closing quote)', () => {
  const ref =
    'A. Smith and B. Jones, "A Survey of Sensor Fusion Techniques", _IEEE Trans._, vol. 5, 2021, doi: 10.1109/abc.2021.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'A. Smith and B. Jones');
  assert.equal(p.title, 'A Survey of Sensor Fusion Techniques');
  assert.equal(p.year, '2021');
});

test('parseReference › IEEE › curly opening quote (\\u201C) with American comma', () => {
  const ref = 'C. Author, \u201CDeep Learning for Fire,\u201D _Conf._, 2022.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'C. Author');
  assert.equal(p.title, 'Deep Learning for Fire');
  assert.equal(p.year, '2022');
});

test('parseReference › IEEE › long author list with colon in title', () => {
  const ref =
    'S. Das, S. Somvanshi, S. A. Javed, M. M. Islam, R. Chakraborty, and M. Sultana, "From Tiny Machine Learning to Tiny Deep Learning: A Survey," _ACM Comput. Surv._, vol. 58, no. 7, 2025, doi: 10.1145/3776588.';
  const p = parseReference(ref);

  assert.equal(
    p.authors,
    'S. Das, S. Somvanshi, S. A. Javed, M. M. Islam, R. Chakraborty, and M. Sultana'
  );
  assert.equal(p.title, 'From Tiny Machine Learning to Tiny Deep Learning: A Survey');
  assert.equal(p.year, '2025');
  assert.equal(p.doi, '10.1145/3776588');
});

// ═══════════════════════════════════════════════════════════════════════
// parseReference – APA format
// ═══════════════════════════════════════════════════════════════════════

test('parseReference › APA › title before italic journal (*Journal*)', () => {
  const ref =
    'Park, J., Kim, K., & Choi, S. (2020). Early fire detection system based on multi-sensor fusion and deep learning. *Sensors*, *20*(22), 6542. https://doi.org/10.3390/s20226542';
  const p = parseReference(ref);

  assert.equal(p.authors, 'Park, J., Kim, K., & Choi, S');
  assert.equal(
    p.title,
    'Early fire detection system based on multi-sensor fusion and deep learning'
  );
  assert.equal(p.year, '2020');
  assert.equal(p.url, 'https://doi.org/10.3390/s20226542');
});

test('parseReference › APA › italic-wrapped title (*Title*. …)', () => {
  const ref =
    'Nekhil, R. (2023). *Fire detection using sensor fusion and TinyML – Arduino Nano 33 BLE Sense*. Edge Impulse Network.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'Nekhil, R');
  assert.equal(
    p.title,
    'Fire detection using sensor fusion and TinyML – Arduino Nano 33 BLE Sense'
  );
  assert.equal(p.year, '2023');
});

test('parseReference › APA › title before underscore-italic journal (_Journal_)', () => {
  const ref =
    'Tavakkoli Moghaddam, E., Ebadi, A., & Safarpour, H. (2023). A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation. _Fire Safety Journal_, _136_, 103988.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'Tavakkoli Moghaddam, E., Ebadi, A., & Safarpour, H');
  assert.equal(
    p.title,
    'A fire alarm judgment method using multiple smoke alarms based on Bayesian estimation'
  );
  assert.equal(p.year, '2023');
});

test('parseReference › APA › large author list with et al. ellipsis', () => {
  const ref =
    'Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., ... Moher, D. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. *BMJ*, *372*(n71). https://doi.org/10.1136/bmj.n71';
  const p = parseReference(ref);

  assert.match(p.authors, /^Page, M\. J\./);
  assert.match(p.authors, /Moher, D$/);
  assert.equal(
    p.title,
    'The PRISMA 2020 statement: An updated guideline for reporting systematic reviews'
  );
  assert.equal(p.year, '2021');
});

test('parseReference › APA › plain title fallback (no italic markers)', () => {
  const ref = 'Doe, J. (2019). A plain title without italics. Some Publisher, 100.';
  const p = parseReference(ref);

  assert.equal(p.authors, 'Doe, J');
  assert.equal(p.title, 'A plain title without italics');
  assert.equal(p.year, '2019');
});

// ═══════════════════════════════════════════════════════════════════════
// parseReference – DOI & URL extraction
// ═══════════════════════════════════════════════════════════════════════

test('parseReference › DOI › strips trailing period', () => {
  const ref = 'A. Author, "Title," _J._, 2020, doi: 10.1234/foo.bar.';
  const p = parseReference(ref);

  assert.equal(p.doi, '10.1234/foo.bar');
  assert.equal(p.url, 'https://doi.org/10.1234/foo.bar');
});

test('parseReference › DOI › strips trailing closing bracket', () => {
  const ref = 'A. Author, "Title," _J._, 2020, doi: 10.1234/foo.bar]';
  const p = parseReference(ref);

  assert.equal(p.doi, '10.1234/foo.bar');
});

test('parseReference › URL › bare URL used when no DOI prefix', () => {
  const ref = 'Nekhil, R. (2023). *A TinyML demo*. https://edgeimpulse.com/network/nekhil';
  const p = parseReference(ref);

  assert.equal(p.doi, '');
  assert.equal(p.url, 'https://edgeimpulse.com/network/nekhil');
});

test('parseReference › URL › empty when neither doi nor url present', () => {
  const ref = 'Doe, J. (2018). A title. Publisher.';
  const p = parseReference(ref);

  assert.equal(p.doi, '');
  assert.equal(p.url, '');
});

// ═══════════════════════════════════════════════════════════════════════
// parseReference – year extraction
// ═══════════════════════════════════════════════════════════════════════

test('parseReference › year › extracted from APA parenthesised form', () => {
  assert.equal(parseReference('Author, A. (2017). Title. _Journal_, 1(1), 1–10.').year, '2017');
});

test('parseReference › year › extracted from IEEE bare form (, YYYY, doi:)', () => {
  assert.equal(
    parseReference('A. Author, "Title," _J._, vol. 1, 2019, doi: 10.0000/x.').year,
    '2019'
  );
});

test('parseReference › year › empty when no year can be found', () => {
  assert.equal(parseReference('No year present in this string at all.').year, '');
});

// ═══════════════════════════════════════════════════════════════════════
// parseReference – unrecognised / fallback
// ═══════════════════════════════════════════════════════════════════════

test('parseReference › fallback › empty authors+title when format unrecognised, doi+year still extracted', () => {
  const ref = 'Unknown format, doi: 10.9999/mystery.ref, (2020)';
  const p = parseReference(ref);

  assert.equal(p.authors, '');
  assert.equal(p.title, '');
  assert.equal(p.doi, '10.9999/mystery.ref');
  assert.equal(p.year, '2020');
});

test('parseReference › fallback › all-empty fields for completely unstructured string', () => {
  assert.deepEqual(parseReference('No useful data here!'), {
    authors: '',
    title: '',
    year: '',
    doi: '',
    url: '',
  });
});

// ═══════════════════════════════════════════════════════════════════════
// extractBibliography
// ═══════════════════════════════════════════════════════════════════════

test('extractBibliography › writes empty file when no ### References section exists', () => {
  const result = runExtract('## Introduction\n\nSome text, no references section.\n');
  assert.equal(result, '');
});

test('extractBibliography › one IEEE ref produces correct @article with all fields', () => {
  const md = [
    '## Section',
    '',
    '### References',
    '',
    '- [1] A. Author, "A Great Title," _Sensors_, vol. 1, 2020, doi: 10.1234/foo.',
  ].join('\n');

  const bib = runExtract(md);

  assert.match(bib, /@article\{ref1,/);
  assert.match(bib, /title=\{\{\{A Great Title\}\}\}/);
  assert.match(bib, /author=\{\{\{A\. Author\}\}\}/);
  assert.match(bib, /year=\{\{\{2020\}\}\}/);
  assert.match(bib, /doi=\{\{\{10\.1234\/foo\}\}\}/);
  assert.match(bib, /url=\{\{\{https:\/\/doi\.org\/10\.1234\/foo\}\}\}/);
});

test('extractBibliography › one APA ref produces correct @article', () => {
  const md = [
    '### References',
    '',
    '- [1] Park, J. (2020). Early fire detection. *Sensors*, 20(22), 6542. https://doi.org/10.3390/s20226542',
  ].join('\n');

  const bib = runExtract(md);

  assert.match(bib, /@article\{ref1,/);
  assert.match(bib, /title=\{\{\{Early fire detection\}\}\}/);
  assert.match(bib, /author=\{\{\{Park, J\}\}\}/);
  assert.match(bib, /year=\{\{\{2020\}\}\}/);
});

test('extractBibliography › multiple refs use sequential keys (ref1, ref2, ref3)', () => {
  const md = [
    '### References',
    '',
    '- [1] A. First, "Title One," _J._, 2020, doi: 10.0001/a.',
    '- [2] B. Second, "Title Two," _J._, 2021, doi: 10.0002/b.',
    '- [3] C. Third, "Title Three," _J._, 2022, doi: 10.0003/c.',
  ].join('\n');

  const bib = runExtract(md);

  assert.match(bib, /@article\{ref1,/);
  assert.match(bib, /@article\{ref2,/);
  assert.match(bib, /@article\{ref3,/);
});

test('extractBibliography › note field always contains verbatim raw reference text', () => {
  const rawRef = 'A. Author, "Exact Title," _Journal_, vol. 5, 2023, doi: 10.5555/note.test.';
  const bib = runExtract(`### References\n\n- [1] ${rawRef}`);

  assert.ok(
    bib.includes(`note={{{${rawRef}}}}`),
    `note field must contain verbatim raw reference.\nGot:\n${bib}`
  );
});

test('extractBibliography › omits optional fields when none can be extracted', () => {
  const rawRef = '??Completely unstructured reference string with no known format??';
  const bib = runExtract(`### References\n\n- [1] ${rawRef}`);

  assert.ok(!bib.includes('title={{{'), 'title field should be absent');
  assert.ok(!bib.includes('author={{{'), 'author field should be absent');
  assert.ok(!bib.includes('doi={{{'), 'doi field should be absent');
  assert.ok(!bib.includes('year={{{'), 'year field should be absent');
  assert.ok(bib.includes('note={{{'), 'note field should always be present');
});

test('extractBibliography › ignores ref-style lines that appear before ### References', () => {
  const md = [
    '- [1] Fake reference before the heading',
    '',
    '### References',
    '',
    '- [1] A. Real, "Real Title," _J._, 2024, doi: 10.9999/real.',
  ].join('\n');

  const bib = runExtract(md);
  const entryCount = (bib.match(/@article\{/g) ?? []).length;

  assert.equal(entryCount, 1, 'should produce exactly one @article');
  assert.match(bib, /Real Title/);
});
