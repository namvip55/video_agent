# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- **Install Dependencies**: `npm install`
- **Build Project**: `npm run build`
- **Run Pipeline (News)**: `npm run pipeline -- path/to/script.json`
- **Run Pipeline (Manga)**: `npm run manga -- path/to/script.json`
- **Rerender Visuals Only**: `npm run rerender -- output/slug-timestamp`
- **Run Tests**: `npm test`
- **Run Single Test**: `npx vitest run src/path/to/test.ts`
- **Typecheck**: `npm run typecheck`
- **Download SFX**: `npm run sfx:download`

## Architecture & Development Rules
- **Core Pipeline**: `src/pipeline.ts` handles the end-to-end flow: Script validation -> TTS generation (LucyLab/ElevenLabs) -> Asset fetching (Pexels) -> Audio mixing (FFmpeg) -> Visual composition (HyperFrames) -> MP4 encoding.
- **Rendering System**: Uses **HyperFrames** (Puppeteer + GSAP + FFmpeg). 
  - `src/render/html-composer.ts` generates the `index.html` and injects animations.
  - Templates are in `src/render/templates/` (base.html.tmpl, styles.css, animations.js).
  - 12 scene variants are defined in `src/render/script-schema.ts`.
- **TTS Logic**: Idempotent by default (skips if file exists in `voice/`). Phonetic conversion is required for Vietnamese: `GPT 5.5` -> `GPT năm chấm năm`.
- **Manga Mode**: `src/manga/` contains specific logic for scraping and OCR.
  - **OCR Strategy**: Claude performs OCR via FileGraph MCP (`/any/to-text`) with a 6-second delay between pages to avoid Rate Limits.
  - **OCR Verification**: If Vietnamese text from OCR has typos/misspellings, fix them using **logic and story context**. Do NOT re-read the image unless the OCR output is empty or completely unintelligible.
  - **Reading Order**: Must read from **right-to-left**, **top-to-bottom**.
- **Execution Tip**: Before running `npm run manga`, copy images to `output/<slug>/pages/` and ensure `script.json` uses relative paths (`pages/XXX.png`) to avoid path errors.
- **SFX Mixing**: 3-tier selection (Override -> Semantic Match -> Template Default) with anti-repetition and anti-overlap logic in `src/assets/sfx-selector.ts`.

## Skill: /create-news-video
- **News Mode**: Scrape URL (Firecrawl) -> Generate `script.json` -> Run `npm run pipeline`.
- **Manga Mode**: Scrape manga images -> OCR via FileGraph -> Generate `script.json` -> Run `npm run manga`.
- **Output**: Always provide links to `video.mp4`, `voice.mp3` (for CapCut), and `script.txt` (for auto-captions).
