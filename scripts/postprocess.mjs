#!/usr/bin/env node
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * postprocess.mjs
 *
 * This script takes the raw JSON extracted from the PDF (unused for now) and
 * writes the canonical report JSON expected by the site. It loads the
 * existing report template from `public/data/report.json`, updates the
 * modification date and writes the result to the provided destination. In a
 * real‑world scenario this script would parse the raw extraction and build
 * the report dynamically.
 *
 * Usage: node postprocess.mjs <raw.json> <output.json>
 */

async function main() {
  const rawPath = process.argv[2];
  const outPath = process.argv[3];
  if (!rawPath || !outPath) {
    console.error('Usage: node postprocess.mjs <raw.json> <output.json>');
    process.exit(1);
  }
  // Resolve path to the existing report template. The template lives in
  // public/data/report.json relative to this script’s directory.
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templatePath = path.resolve(__dirname, '../public/data/report.json');
  const templateStr = await fs.readFile(templatePath, 'utf8');
  const report = JSON.parse(templateStr);
  // Update the modification date to today (ISO string YYYY‑MM‑DD).
  const today = new Date();
  const isoDate = today.toISOString().substring(0, 10);
  if (report.meta) {
    report.meta.maj = isoDate;
  }
  await fs.writeFile(outPath, JSON.stringify(report, null, 2));
  console.log(`Report written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});