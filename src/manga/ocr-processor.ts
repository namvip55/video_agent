import { readFile } from "node:fs/promises";
import pLimit from "p-limit";
import { log } from "../utils/logger.js";

/**
 * Placeholder for manga text extraction.
 * Actual transcription is performed by the AI Assistant during the pipeline setup
 * to ensure logical reading order (RTL/TTB) and context.
 */
export async function extractMangaText(imagePaths: string[]): Promise<string[]> {
  const limit = pLimit(1);
  const results: string[] = [];

  log.info(`  Preparing OCR context for ${imagePaths.length} pages...`);

  let doneCount = 0;

  const promises = imagePaths.map((path, index) =>
    limit(async () => {
      // The API connection has been removed.
      // In this workflow, Claude Code performs the transcription manually
      // or via specialized MCP tools before generating the script.json.
      doneCount++;
      log.progress(doneCount, imagePaths.length, "OCR (Assistant-Led)");
      return "";
    })
  );

  await Promise.all(promises);
  log.ok(`  OCR context prepared for ${imagePaths.length} pages.`);

  return Array(imagePaths.length).fill("");
}
