import * as fs from 'fs';

function convertMarkdownToTypst(mdContent: string): string {
  const typstContent: string[] = [];
  const lines = mdContent.split(/\r?\n/);

  let inCodeBlock = false;
  let inList = false;

  for (const line of lines) {
    const strippedLine = line.trim();

    // Handle code blocks
    if (strippedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      typstContent.push(line); // Keep backticks for Typst raw block
      continue;
    }
    if (inCodeBlock) {
      typstContent.push(line);
      continue;
    }

    // References section (specific handling)
    if (/^###\s*References\s*$/i.test(strippedLine)) {
      typstContent.push('#heading(level: 1, "References")');
      inList = false;
      continue;
    }

    // Headings
    if (strippedLine.startsWith('### ')) {
      typstContent.push('=== ' + strippedLine.substring(4));
      inList = false;
    } else if (strippedLine.startsWith('## ')) {
      typstContent.push('== ' + strippedLine.substring(3));
      inList = false;
    } else if (strippedLine.startsWith('# ')) {
      typstContent.push('= ' + strippedLine.substring(2));
      inList = false;
    }

    // Unordered lists
    else if (strippedLine.startsWith('- ') || strippedLine.startsWith('* ')) {
      typstContent.push('- ' + strippedLine.substring(2));
      inList = true;
    }
    // Ordered lists (simple)
    else if (/^\d+\.\s/.test(strippedLine)) {
      typstContent.push('+ ' + strippedLine.substring(strippedLine.indexOf('.') + 1).trim());
      inList = true;
    }

    // Blockquotes (simple conversion)
    else if (strippedLine.startsWith('> ')) {
      typstContent.push('#blockquote(' + strippedLine.substring(2) + ')');
      inList = false;
    }

    // Other content (paragraphs, bold, italics, citations)
    else {
      let processedLine = line;

      // Bold
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '*$1*');
      // Italics (single asterisk to Typst underscore style)
      processedLine = processedLine.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '_$1_');

      // IEEE numeric citations (e.g., [1], [2]-[4])
      // This is a direct pass-through for now. For actual Typst #cite, it would need bib keys.
      // Assuming the numbers are just part of the text or would be handled
      // by Typst's bibliography processing if linked correctly.

      // If not in a list context, add paragraph spacing if it's not empty
      if (strippedLine && !inList) {
        typstContent.push(processedLine);
      } else if (strippedLine && inList) {
        typstContent.push(processedLine);
      } else if (!strippedLine) {
        // Empty line for spacing
        typstContent.push('');
      }

      inList = false; // Assume paragraph breaks list context
    }
  }

  // Join the lines, adding extra newlines for paragraph breaks between non-list, non-heading content
  let finalTypst = typstContent.join('\n');
  // Post-process for paragraph breaks - look for single newlines between non-block elements
  finalTypst = finalTypst.replace(
    /\n\s*\n(?!\s*#heading|\s*#blockquote|\s*- |\s*\+ |```)/g,
    '\n\n'
  );

  return finalTypst;
}

async function main() {
  if (process.argv.length < 4) {
    console.error(
      'Usage: npx tsx markdown_to_typst_converter.ts <input_markdown_file> <output_typst_file>'
    );
    process.exit(1);
  }

  const inputMdFilePath = process.argv[2];
  const outputTypstFilePath = process.argv[3];

  if (!fs.existsSync(inputMdFilePath)) {
    console.error(`Error: Input Markdown file not found at ${inputMdFilePath}`);
    process.exit(1);
  }

  const mdContent = fs.readFileSync(inputMdFilePath, 'utf-8');

  const typstOutput = convertMarkdownToTypst(mdContent);

  fs.writeFileSync(outputTypstFilePath, typstOutput, 'utf-8');

  console.log(`Converted '${inputMdFilePath}' to Typst and saved to '${outputTypstFilePath}'`);

  // Optionally, remove the source markdown file after conversion
  // fs.unlinkSync(inputMdFilePath);
  // console.log(`Original markdown file '${inputMdFilePath}' deleted.`);
}

main();
