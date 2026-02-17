declare module '@sylphide/pdf-actions' {
  import type { PDFDocument } from '@cantoo/pdf-lib';

  /**
   * PDF creation utilities
   */
  export const createPDF: {
    /** Create an empty PDF document */
    EmptyPDFDocument: () => Promise<PDFDocument>;
    /** Load a PDF from a file (browser File object) */
    PDFDocumentFromFile: (file: File) => Promise<PDFDocument>;
    /** Load a PDF from a Uint8Array or Buffer */
    PDFDocumentFromPDFArray: (fileArray: Uint8Array | Buffer) => Promise<PDFDocument>;
  };

  /**
   * Split a PDF document by extracting a range of pages.
   * @param pdfDoc - The source PDF document
   * @param range - A tuple of [startPage, endPage] (1-indexed)
   * @param rotation - Rotation in degrees (0, 90, 180, 270)
   * @returns A new PDFDocument containing only the extracted pages
   */
  export function splitPDF(
    pdfDoc: PDFDocument,
    range: [number, number],
    rotation?: number
  ): Promise<PDFDocument>;

  /**
   * Merge multiple PDF documents into one.
   * @param pdfDocs - Array of PDF documents to merge
   * @returns A new merged PDFDocument
   */
  export function mergePDF(pdfDocs: PDFDocument[]): Promise<PDFDocument>;

  /**
   * Rotate pages in a PDF document.
   * @param pdfDoc - The source PDF document
   * @param rotation - Rotation in degrees (0, 90, 180, 270)
   * @returns A new PDFDocument with rotated pages
   */
  export function rotatePDF(pdfDoc: PDFDocument, rotation: number): Promise<PDFDocument>;
}
