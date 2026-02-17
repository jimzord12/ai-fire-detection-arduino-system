# PDF Tools

CLI tools for PDF manipulation: splitting, extracting, and rotating pages.

## Tools

1. **PDF Split** - Extract a range of pages from a PDF file with optional rotation

## Installation

```bash
npm install
```

---

## PDF Split

Extract specific page ranges from PDF files using [@sylphide/pdf-actions](https://www.npmjs.com/package/@sylphide/pdf-actions).

### Usage

**From the project root:**

```bash
npm --prefix .gemini/cli-tools/pdf-tools run split -- <pdfFilePath> <range> [rotation]
```

**From the pdf-tools directory:**

```bash
npx tsx pdf-split.ts <pdfFilePath> <range> [rotation]
```

### Arguments

| Argument      | Description                                  | Required |
| ------------- | -------------------------------------------- | -------- |
| `pdfFilePath` | Path to the source PDF file                  | Yes      |
| `range`       | Page range as JSON array (e.g., `"[1, 15]"`) | Yes      |
| `rotation`    | Rotation in degrees (0, 90, 180, 270)        | No       |

### Examples

Extract pages 1-15 from a thesis:

```bash
# From project root
npm --prefix .gemini/cli-tools/pdf-tools run split -- \
  "MyThesis.pdf" "[1, 15]" "0"

# From pdf-tools directory
npx tsx pdf-split.ts "MyThesis.pdf" "[1, 15]"
```

Extract pages with 90° rotation:

```bash
npx tsx pdf-split.ts "document.pdf" "[5, 10]" "90"
```

### Output

The tool generates a new file with an auto-generated suffix to avoid overwriting the original:

| Input File     | Range     | Output File               |
| -------------- | --------- | ------------------------- |
| `MyThesis.pdf` | `[1, 15]` | `MyThesis_split_1-15.pdf` |
| `document.pdf` | `[5, 10]` | `document_split_5-10.pdf` |

The output file is saved in the same directory as the source file.

### Dependencies

- [pdf-lib](https://pdf-lib.js.org/) - PDF manipulation library
- [@sylphide/pdf-actions](https://www.npmjs.com/package/@sylphide/pdf-actions) - High-level PDF operations

## Notes

- Page numbers in the range are 1-indexed (first page is 1, not 0)
- Rotation values should be multiples of 90 (0, 90, 180, 270)
- The original file is never modified
