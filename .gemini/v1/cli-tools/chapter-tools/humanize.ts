#!/usr/bin/env tsx
import * as crypto from 'node:crypto';
// concat-md.ts
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const sampleText = `Η αυξανόμενη ενσωμάτωση συστημάτων Επιχειρησιακής Τεχνολογίας (Operational Technology - OT) και Τεχνολογίας Πληροφοριών (Information Technology - IT) στον ναυτιλιακό τομέα έχει δημιουργήσει ένα πολύπλοκο και διασυνδεδεμένο οικοσύστημα, που συχνά αναφέρεται ως Ναυτιλιακό Διαδίκτυο των Πραγμάτων (Maritime Internet of Things - MIoT). Ενώ αυτός ο ψηφιακός μετασχηματισμός ξεκλειδώνει σημαντική αποδοτικότητα στο παγκόσμιο εμπόριο και τη λειτουργία των πλοίων, ταυτόχρονα εκθέτει τον κλάδο σε ένα νέο και δυναμικό φάσμα κυβερνοαπειλών. Το παρόν κεφάλαιο παρέχει μια ολοκληρωμένη ανασκόπηση των κρίσιμων πυλώνων κυβερνοασφάλειας που είναι απαραίτητοι για την οικοδόμηση μιας ανθεκτικής ναυτιλιακής υποδομής. Η ανάλυση εκτείνεται σε έξι βασικούς πυλώνες: τη θεμελιώδη ασφάλεια της επί του σκάφους Επιχειρησιακής Τεχνολογίας (OT), τη μοντελοποίηση των κυβερνοαπειλών πλοίου-ξηράς, την εφαρμογή Αρχιτεκτονικής Μηδενικής Εμπιστοσύνης (Zero Trust), την προστασία των κρίσιμων ναυτιλιακών υποδομών, τον ρόλο του blockchain στην ασφάλεια των εφοδιαστικών αλυσίδων και την ανάπτυξη προηγμένων Συστημάτων Ανίχνευσης Εισβολών (IDS).`;

// Load .env from the script's directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env'), quiet: true });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface HumanizeRequest {
  text: string;
  lang: string;
  mode: string;
  writingStyle: string;
  documentId: string;
  country: string;
}

interface HumanizeResponse {
  humanizer_response: {
    language: string;
    word_count: number;
    responses: string[];
    isPartialResponse: boolean;
  };
  documentId: string;
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const icons = {
  success: '✔',
  error: '✖',
  info: 'ℹ',
  warning: '⚠',
  dryRun: '🔍',
};

export const getHumanizedText = async (content: string): Promise<string> => {
  const apiKey = process.env.ISGEN_API_KEY || null;
  const authToken = process.env.ISGEN_AUTH_TOKEN || null;
  // const cookie = process.env.ISGEN_COOKIE || null;
  const maxRetries = process.env.ISGEN_MAX_RETRIES
    ? parseInt(process.env.ISGEN_MAX_RETRIES, 10)
    : 3;
  const timeoutMs = process.env.ISGEN_TIMEOUT_MS
    ? parseInt(process.env.ISGEN_TIMEOUT_MS, 10)
    : 120_000; // 120 seconds

  if (!apiKey || !authToken) {
    throw new Error('ISGEN_API_KEY and ISGEN_AUTH_TOKEN environment variables must be set.');
  }
  let response: Response | null = null;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      console.log(
        'Bearer token:',
        `...${authToken.slice(authToken.length - 20, authToken.length)}`
      ); // Debugging line
      console.log('Using API Key:', `${apiKey.slice(0, 10)}...`); // Debugging line

      response = await fetch('https://api.isgen.ai/functions/v1/humanize', {
        method: 'POST',
        headers: {
          Apikey: apiKey,
          Authorization: `Bearer ${
            authToken.startsWith('Bearer ') ? authToken.slice(7) : authToken
          }`,
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/12.2.0',
          Origin: 'https://isgen.ai',
          Referer: 'https://isgen.ai/',
          // Cookie: cookie || '',
        },
        body: JSON.stringify({
          text: content,
          lang: 'el',
          mode: 'advanced',
          writingStyle: 'adaptive',
          documentId: crypto.randomUUID(),
          country: 'GR',
        } satisfies HumanizeRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        break;
      }

      const errorText = await response.text();
      if (response.status === 504 || response.status === 502 || response.status === 429) {
        console.warn(
          `${icons.warning} ${colors.yellow}Attempt ${attempt} failed with ${response.status}. Retrying...${colors.reset}`
        );
        if (attempt < maxRetries) {
          await sleep(attempt * 2000); // Exponential backoff
          continue;
        }
      }
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    } catch (error) {
      lastError = error as Error;
      if ((error as Error).name === 'AbortError' || (error as Error).message.includes('timeout')) {
        console.warn(
          `${icons.warning} ${colors.yellow}Attempt ${attempt} timed out. Retrying...${colors.reset}`
        );
        if (attempt < maxRetries) {
          await sleep(attempt * 2000);
          continue;
        }
      }
      throw error;
    }
  }

  if (!response || !response.ok) {
    throw lastError || new Error('Failed to get a valid response from the API.');
  }

  const data = (await response.json()) as HumanizeResponse;
  const humanizedText = data.humanizer_response.responses[0];

  if (!humanizedText) {
    throw new Error('No humanized text received from API.');
  }

  return humanizedText;
};

const program = new Command();

program
  .name('humanize')
  .description('Humanize markdown files using isgen.ai API.')
  .argument('[filepaths...]', 'Paths to the markdown files or directories to humanize')
  .option('-s, --suffix <suffix>', 'Suffix for the output file (default: Humanized)', 'Humanized')
  .option('-o, --out-file <file>', 'Output markdown file (only if a single input file is provided)')
  .option('--all', 'Process all markdown files if a directory is provided')
  .option('--dry-run', 'Print planned actions without calling the API')
  .option('--test', 'Test API by sending a sample text')
  .action(async (filepaths: string[], opts) => {
    const { suffix, outFile, all, dryRun, test } = opts;

    if (test) {
      try {
        console.log(`${icons.info} ${colors.cyan}Testing API with sample text...${colors.reset}`);
        const humanized = await getHumanizedText(sampleText);
        console.log(
          `${icons.success} ${colors.green}API test successful. Sample humanized text:\n${colors.reset}${humanized}`
        );
      } catch (error) {
        console.error(
          `${icons.error} ${colors.red}API test failed: ${(error as Error).message}${colors.reset}`
        );
        process.exit(1);
      } finally {
        process.exit(0);
      }
    }

    const filesToProcess: string[] = [];
    const targets = filepaths.length > 0 ? filepaths : all ? ['.'] : [];

    for (const fp of targets) {
      const stats = fs.statSync(fp);
      if (stats.isDirectory()) {
        if (all) {
          const files = fs
            .readdirSync(fp)
            .filter(f => f.endsWith('.md') && !f.includes(`-${suffix}.md`))
            .map(f => path.join(fp, f));
          filesToProcess.push(...files);
        } else {
          console.warn(
            `${icons.warning} ${colors.yellow}Skipping directory ${fp}. Use --all to process all markdown files.${colors.reset}`
          );
        }
      } else if (fp.endsWith('.md')) {
        filesToProcess.push(fp);
      }
    }

    if (filesToProcess.length === 0) {
      console.error(
        `${icons.error} ${colors.red}No markdown files found to process. Please provide file paths or use --test.${colors.reset}`
      );
      process.exit(1);
    }

    for (const file of filesToProcess) {
      try {
        const content = fs.readFileSync(file, 'utf-8');

        if (content.length > 20000) {
          console.error(
            `${icons.error} ${colors.red}File ${file} is too long (${content.length} chars). Max 20,000.${colors.reset}`
          );
          continue;
        }

        const outputFilePath =
          outFile && filesToProcess.length === 1 ? outFile : file.replace(/\.md$/, `-${suffix}.md`);

        if (dryRun) {
          console.log(
            `${icons.dryRun} ${colors.cyan}[Dry Run] Would humanize ${file} -> ${outputFilePath}${colors.reset}`
          );
          continue;
        }

        console.log(`${icons.info} ${colors.cyan}Humanizing ${file}...${colors.reset}`);

        const humanizedText = await getHumanizedText(content);

        fs.writeFileSync(outputFilePath, humanizedText, 'utf-8');
        console.log(
          `${icons.success} ${colors.green}Saved humanized content to ${outputFilePath}${colors.reset}`
        );
      } catch (error) {
        console.error(
          `${icons.error} ${colors.red}Failed to process ${file}: ${(error as Error).message}${
            colors.reset
          }`
        );
      }
    }
  });

const isMain =
  process.argv[1] &&
  (fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith('/humanize') ||
    process.argv[1].endsWith('/humanize.ts'));

if (isMain) {
  program.parse(process.argv);
}

