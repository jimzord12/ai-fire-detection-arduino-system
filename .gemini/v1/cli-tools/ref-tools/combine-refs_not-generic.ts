import * as fs from 'node:fs';

interface Reference {
  original: string;
  authors: string;
  year: string;
  title: string;
  doi?: string;
  url?: string;
  sortKey: string;
}

const files = [
  'final-document/references/chapters-1/prepared-references-1.md',
  'final-document/references/chapters-2-10/prepared-references-2-10.md',
];

function extractReferences(content: string): string[] {
  const lines = content.split('\n');
  const refs: string[] = [];
  let currentRef = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('- ')) {
      if (currentRef) refs.push(currentRef);
      currentRef = line.substring(2);
    } else if (
      currentRef &&
      line &&
      !line.startsWith('#') &&
      !line.startsWith('---') &&
      !line.startsWith('>')
    ) {
      currentRef += ' ' + line;
    } else if (
      line === '' ||
      line.startsWith('#') ||
      line.startsWith('---') ||
      line.startsWith('>')
    ) {
      if (currentRef) {
        refs.push(currentRef);
        currentRef = '';
      }
    }
  }
  if (currentRef) refs.push(currentRef);
  return refs.map(r => r.trim()).filter(r => r.length > 0);
}

function parseReference(ref: string): Reference {
  let authors = '';
  let year = 'n.d.';
  let title = '';
  let doi: string | undefined;
  let url: string | undefined;

  const doiMatch = ref.match(/https?:\/\/doi\.org\/[^\s]+/i);
  if (doiMatch) doi = doiMatch[0].toLowerCase().replace(/[.,]$/, '');

  const urlMatch = ref.match(/https?:\/\/[^\s]+/i);
  if (urlMatch && (!doi || urlMatch[0] !== doi)) url = urlMatch[0].replace(/[.,]$/, '');

  const yearMatch = ref.match(/(\(\d{4}[a-z]?|n\.d\.)/);
  if (yearMatch) {
    year = yearMatch[1];
    const yearIndex = ref.indexOf(yearMatch[0]);
    authors = ref.substring(0, yearIndex).replace(/\.$/, '').trim();

    const afterYear = ref.substring(yearIndex + yearMatch[0].length);
    const titleMatch = afterYear.match(/\)\.\s+([^*_]+)/); // Try to match non-formatted title
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      const parts = afterYear.split('.');
      title = parts.length > 1 ? parts[1].trim() : afterYear.trim();
    }
  } else {
    const parts = ref.split('.');
    authors = parts[0].trim();
    title = parts.length > 1 ? parts[1].trim() : '';
  }

  const cleanTitle = title.replace(/[\*_]/g, '').trim();
  let sortKey = authors.split(',')[0].toLowerCase().trim();
  const commonWords = ['the', 'a', 'an'];
  const words = sortKey.split(' ');
  if (words.length > 1 && commonWords.includes(words[0])) {
    sortKey = words.slice(1).join(' ');
  }

  return {
    original: ref,
    authors,
    year,
    title: cleanTitle,
    doi,
    url,
    sortKey,
  };
}

const allRefsRaw: string[] = [];
for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    allRefsRaw.push(...extractReferences(content));
  }
}

const parsedRefs = allRefsRaw.map(parseReference);
const uniqueRefs: Reference[] = [];
const duplicates: string[] = [];

for (const ref of parsedRefs) {
  let isDuplicate = false;
  for (const existing of uniqueRefs) {
    if (ref.doi && existing.doi && ref.doi === existing.doi) {
      isDuplicate = true;
      break;
    }
    const refTitleSnippet = ref.title.substring(0, 30).toLowerCase();
    const existingTitleSnippet = existing.title.substring(0, 30).toLowerCase();
    if (
      ref.authors.toLowerCase() === existing.authors.toLowerCase() &&
      ref.year.substring(0, 4) === existing.year.substring(0, 4) &&
      refTitleSnippet === existingTitleSnippet
    ) {
      isDuplicate = true;
      break;
    }
    if (ref.original.replace(/\s+/g, '') === existing.original.replace(/\s+/g, '')) {
      isDuplicate = true;
      break;
    }
  }

  if (isDuplicate) {
    duplicates.push(ref.original);
  } else {
    uniqueRefs.push(ref);
  }
}

uniqueRefs.sort((a, b) => {
  if (a.sortKey < b.sortKey) return -1;
  if (a.sortKey > b.sortKey) return 1;
  if (a.year < b.year) return -1;
  if (a.year > b.year) return 1;
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
});

// Add suffixes (a, b, c) for same author + year
for (let i = 0; i < uniqueRefs.length; i++) {
  const current = uniqueRefs[i];
  const sameGroup = [current];
  let j = i + 1;
  while (
    j < uniqueRefs.length &&
    uniqueRefs[j].authors === current.authors &&
    uniqueRefs[j].year.substring(0, 4) === current.year.substring(0, 4)
  ) {
    sameGroup.push(uniqueRefs[j]);
    j++;
  }

  if (sameGroup.length > 1) {
    sameGroup.forEach((ref, index) => {
      const suffix = String.fromCharCode(97 + index); // a, b, c...
      // Check if it already has a suffix
      if (!ref.year.match(/\d{4}[a-z]/)) {
        // Insert suffix into the original string and the year property
        const yearMatch = ref.original.match(/\((\d{4})/);
        if (yearMatch) {
          const yearVal = yearMatch[1];
          ref.original = ref.original.replace(`(${yearVal}`, `(${yearVal}${suffix}`);
          ref.year = ref.year.replace(yearVal, `${yearVal}${suffix}`);
        }
      }
    });
  }
  i = j - 1;
}

const date = new Date().toLocaleDateString('el-GR');
let output = `# Βιβλιογραφία

> **Total References**: ${uniqueRefs.length}
> **Source Files**:
> - ${files.join('\n> - ')}
> **Generated**: ${date}
> **Duplicates Removed**: ${duplicates.length}

---

`;

uniqueRefs.forEach(ref => {
  output += `- ${ref.original}\n`;
});

fs.writeFileSync('final-document/references/References_Final.md', output);

console.log('Successfully generated References_Final.md');
console.log(`Total Unique: ${uniqueRefs.length}`);
console.log(`Duplicates Removed: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log('\nDuplicates detected and removed:');
  duplicates.forEach(d => console.log(`- ${d.substring(0, 80)}...`));
}

