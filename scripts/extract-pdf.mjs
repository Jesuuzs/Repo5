#!/usr/bin/env node
import fs from 'fs/promises';
import pdf from 'pdf-parse';

/**
 * extract-pdf.mjs
 *
 * This script reads a PDF file from the filesystem, extracts its text using
 * pdf-parse and writes a raw JSON representation to stdout. It is intended
 * to run in a CI environment as part of the GitHub Actions workflow. The
 * output can be piped into a post‑processing step that normalises the data
 * into the report schema used by the site.
 *
 * Usage: node extract-pdf.mjs <input-pdf>
 */

async function extractPdf(path) {
  const buffer = await fs.readFile(path);
  const data = await pdf(buffer);
  return {
    numPages: data.numpages,
    info: data.info,
    text: data.text,
  };
}

const inputPath = process.argv[2] || 'input/input.pdf';
try {
  const result = await extractPdf(inputPath);
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(err);
  process.exit(1);
}