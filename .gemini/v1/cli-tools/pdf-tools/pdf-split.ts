import { createPDF, splitPDF } from '@sylphide/pdf-actions';
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

program
  .name('pdf-split')
  .description('CLI tool to split PDF files using @sylphide/pdf-actions')
  .version('1.0.0')
  .argument('<pdfFilePath>', 'Path to the source PDF file')
  .argument('<range>', 'Page range as a JSON array string (e.g., "[1, 15]")')
  .argument('[rotation]', 'Rotation in degrees (default: 0)', '0')
  .action(async (pdfFilePath: string, rangeStr: string, rotationStr: string) => {
    try {
      // 1. Parse Arguments
      const range = JSON.parse(rangeStr) as unknown;
      if (
        !Array.isArray(range) ||
        range.length !== 2 ||
        typeof range[0] !== 'number' ||
        typeof range[1] !== 'number'
      ) {
        throw new Error('Range must be a JSON array with two numbers, e.g., "[1, 15]"');
      }
      const rotation = parseInt(rotationStr, 10);

      console.log(`Processing: ${pdfFilePath}`);
      console.log(`Range: Pages ${range[0]} to ${range[1]}`);
      console.log(`Rotation: ${rotation}°`);

      // 2. Load the PDF using pdf-actions' own loader to avoid PDFDocument mismatch
      const absolutePath = path.resolve(pdfFilePath);
      const pdfBytes = await fs.readFile(absolutePath);
      const pdfDoc = await createPDF.PDFDocumentFromPDFArray(pdfBytes);

      // 3. Perform the Split Action
      // Note: splitPDF returns a new PDFDocument instance
      const newPdfDoc = await splitPDF(pdfDoc, range as [number, number], rotation);

      // 4. Save the Result
      const outputBytes = await newPdfDoc.save();

      const parsedPath = path.parse(absolutePath);
      const outputFileName = `${parsedPath.name}_split_${range[0]}-${range[1]}${parsedPath.ext}`;
      const outputPath = path.join(parsedPath.dir, outputFileName);

      await fs.writeFile(outputPath, outputBytes);

      console.log(`✅ Success! Saved to: ${outputFileName}`);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
