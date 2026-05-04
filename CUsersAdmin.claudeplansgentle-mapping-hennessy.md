# Implementation Plan: Manga OCR Integration via Gemini 2.5 Flash

## Context
The user wants to extract text from white speech bubbles in manga pages to generate voiceovers for manga recap videos. By integrating Gemini 2.5 Flash via the Google Gen AI SDK, we can OCR manga pages after download, extract the dialog text, and feed it into the existing TTS pipeline. This replaces the previous plan to use Claude Vision/Nvidia NIM.

## Approach
1. **Dependency Setup:** Install `@google/genai` and add `GEMINI_API_KEY` to the project configuration.
2. **OCR Module:** Update the dedicated processor (`src/manga/ocr-processor.ts`) to handle sending local images to Gemini Vision using the `gemini-2.5-flash` model. The prompt will be tuned to extract text from speech bubbles and narration boxes, returning natural conversational text for TTS, or a dot `.` if empty.
3. **Script Generator Updates:** Modify `generateMangaScript` to accept an array of OCR texts and map them to their corresponding scenes, turning `skipTts` off when OCR is provided.
4. **CLI Integration:** Maintain the `--enable-ocr` flag in `src/manga-cli.ts`. When present, insert the OCR phase between image downloading and script generation.

## Critical Files to Modify
- **`src/config.ts`**: Add `GEMINI_API_KEY`.
- **`src/manga/ocr-processor.ts`** *(New)*: Logic for processing images and calling the Google Gemini API.
- **`src/manga/script-generator.ts`**: Accept OCR text and assign it to scene `voiceText`.
- **`src/manga-cli.ts`**: Add `--enable-ocr` flag, invoke the OCR module, and pass results to script generator.
- **`package.json`**: Add `@google/genai`.

## Existing Functions / Utilities to Reuse
- **`log.step` and `log.progress`** from `src/utils/logger.ts`: Used for progress tracking during the OCR batching process.
- **`pLimit`**: Used to limit concurrent requests to the Gemini API.

## Verification
1. Add a dummy/test image with speech bubbles to `output/test_ocr.jpg`.
2. Run `npm run manga -- "URL_HERE" --enable-ocr --scrape-only` to verify that the OCR triggers during the scrape step and generates a script with actual text.
3. Check the generated `script.json` and ensure the `voiceText` fields are correctly populated and no longer just `.`.
4. Run the full pipeline with a short manga chapter to verify the end-to-end flow from OCR extraction to TTS audio generation.

## SKILL.md Updates
We will replace lines 625 to 670 in `.claude/skills/create-news-video/SKILL.md` (the "Special Mode: Manga/Comic Slideshow" section) with the plan detailed above.
