---
name: create-news-video
description: Tạo video tin tức ngắn 9:16 (~60s) từ URL bài báo hoặc file .txt tiếng Việt. Trigger khi user yêu cầu tạo video tin tức, làm short news, làm bản tin video, render tin thành video, làm TikTok tin tức. Output: video.mp4 + voice.mp3 + script.txt cho CapCut.
trigger-phrases:
  - "tạo video so sánh giữa 2 ông lớn thống trị mã nguồn mở Github và HuggingFace"
  - "tạo video so sánh GitHub và HuggingFace"
  - "làm video so sánh 2 nền tảng GitHub vs HuggingFace"
  - "so sánh Github và HuggingFace"
  - "làm video tiểu sử"
  - "giới thiệu nhân vật"
  - "làm video chân dung"
  - "tạo video profile"
---

# Create News Video Skill

Generate a Vietnamese 9:16 motion-graphic news video from a URL or .txt file.

## Special Mode: GitHub vs HuggingFace Comparison

When user triggers with comparison phrases (see trigger-phrases above), execute the following ALL-IN-ONE workflow:

### Step 0: Check Firecrawl Availability

- Use `firecrawl_search` and `firecrawl_scrape` tools from MCP
- If not available, notify user: "Firecrawl MCP not available. Cannot auto-fetch comparison data." and stop

### Step 1: Fetch Data Automatically

**A. GitHub Data (2 URLs):**
```javascript
firecrawl_scrape({ url: "https://github.blog/news-insights/product-news/", formats: ["markdown"], onlyMainContent: true })
firecrawl_scrape({ url: "https://github.blog/news-insights/product-news/github-copilot-the-agent-awakens/", formats: ["markdown"], onlyMainContent: true })
```

**B. HuggingFace Data (2 URLs):**
```javascript
firecrawl_scrape({ url: "https://huggingface.co/blog", formats: ["markdown"], onlyMainContent: true })
firecrawl_scrape({ url: "https://huggingface.co/blog/deepseekv4", formats: ["markdown"], onlyMainContent: true })
```

**C. Get current stats:**
```javascript
firecrawl_search({ query: "GitHub statistics developers 2026", limit: 3 })
firecrawl_search({ query: "HuggingFace models datasets hub 2026", limit: 3 })
```

### Step 2: Generate Comparison Markdown

Create file: `data/firecrawl/github_vs_huggingface_<YYYYMMDD>.md` with structure:
- Tổng quan: founding year, owner, users, key products, 2026 highlights (per platform)
- So sánh trực tiếp: table with criteria rows (focus, business model, users, key product, security)
- Điểm mạnh: top 4 bullet points per platform
- Kết luận: one sentence synthesis

### Step 3: Auto-Generate Video from Markdown

1. **Read the .md file** using `Read` tool
2. **Create slug + output directory**:
   - slug = `github-vs-huggingface`
   - timestamp = current local time as `YYYYMMDD-HHmm`
   - outputDir = `output/<slug>-<timestamp>/`
   - Use Bash: `mkdir -p <outputDir>`
3. **Create script.json** in `outputDir` with structure:
   - Hook: "2 ông lớn thống trị mã nguồn mở: GitHub và HuggingFace"
   - Body scenes: alternating GitHub vs HuggingFace highlights
   - Comparison scene: side-by-side table
   - Outro: TikTok call to action
4. **Execute pipeline:**
   ```bash
   # Set extended protocol timeout for heavy GSAP/Chromium renderings
   $env:PRODUCER_PUPPETEER_PROTOCOL_TIMEOUT_MS = "600000"
   npm run pipeline -- output/github-vs-huggingface-<timestamp>/script.json
   ```
5. **Report success** with output links.

### Step 4: Fallback

- If Firecrawl unavailable, use existing data in `data/firecrawl/` folder
- If no data, ask user to provide .txt file manually

---

## Special Mode: Character Profile (Tiểu sử nhân vật)

When user triggers with character profile phrases, execute this specialized workflow:

### Step 1: Research Character
- Use `firecrawl_search` and `firecrawl_scrape` (or `WebFetch`) to find biography and key facts.
- Focus on: Full name, current role, famous quotes, net worth/major stats, top 3-5 achievements.

### Step 2: Specialized Script Structure
Create `script.json` following this specific flow for maximum engagement:

1. **Scene 0 (Hook)**:
   - Template: `hook`
   - Headline: Tên nhân vật (e.g., "Jensen Huang")
   - Subhead: Danh xưng ấn tượng (e.g., "Cha đẻ đế chế NVIDIA")
   - Visual: `bgSrc: "$source.image"` (Portrait photo)
   - Note: Metadata should set `"theme": "gold"` for premium character profiles.

2. **Scene 1 (The Quote/Legacy)**:
   - Template: `callout`
   - Statement: Câu nói nổi tiếng hoặc triết lý sống.
   - Visual: `videoKeyword`: "luxury office, successful person, motivation"
   - Options: `align: "bottom-left"` hoặc `"bottom-right"` để không che mặt nhân vật.

3. **Scene 2 (Key Statistic)**:
   - Template: `stat-hero`
   - Value: (e.g., "$100 Billion")
   - Label: (e.g., "Giá trị tài sản ròng")
   - Visual: `videoKeyword`: "wealth, money, tech stocks"

4. **Scene 3-5 (Achievements)**:
   - Template: `feature-list`
   - Title: "Cột mốc sự nghiệp"
   - Bullets: Top 3 achievements.
   - Visual: `videoKeyword`: "tech startup, global impact, futuristic"
   - Options: `align: "bottom-left"` hoặc `"bottom-right"`.

5. **Scene 6 (Call to action)**:
   - Template: `outro`
   - Standard outro format.

---


Generate a Vietnamese 9:16 motion-graphic news video from a URL or .txt file.

## Input

Single argument: a news article URL (starts with `http://` or `https://`) OR a path to a `.txt` file.

## Prerequisites

Before using this skill, ensure the following are set up:

- **Firecrawl MCP** – Must be installed and configured. The skill uses `firecrawl_search`, `firecrawl_scrape`, and optionally `firecrawl_extract`. If Firecrawl is not available, fall back to file mode only.
- **TTS Provider** – Either LucyLab or ElevenLabs with a valid API key for Vietnamese voice.
  - For LucyLab: Set `VIETNAMESE_API_KEY` and `VIETNAMESE_VOICEID` in `.env.local`. The script.json `voiceId` field uses placeholder `${VIETNAMESE_VOICEID}` — pipeline auto-substitutes.
  - For ElevenLabs: Set `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in `.env.local`. The script.json `voiceId` field uses placeholder `${ELEVENLABS_VOICE_ID}` — pipeline auto-substitutes.
  - Provider selection via `TTS_PROVIDER` env var (`lucylab` or `elevenlabs`, default: `lucylab`).
- **Pexels API Key** – Optional, for fetching video footage and stock images. Set `PEXELS_API_KEY`. If missing, scenes fall back to article image (via `bgSrc: "$source.image"`) or gradient background.

## Workflow (MUST follow these steps in order)

### Step 1: Detect input type

- Starts with `http://` or `https://` → URL mode
- Otherwise → file mode

### Step 2: Fetch content (Using Firecrawl MCP Tools)

**Check Tool Availability:**
- If Firecrawl tools (`firecrawl_search`, `firecrawl_scrape`) are not detected, automatically assume **file mode only**.
- Notify: "Firecrawl MCP not available. Please provide a .txt file with the news content."

**A. If input is a TOPIC (not a URL):**
- Use `firecrawl_search` to find relevant news articles.
- Select the best result and proceed to Step 2B with its URL.

**B. If input is a URL (or obtained from search):**
- Use `firecrawl_scrape` with `formats: ["markdown"]` to get clean, structured text.
- For extremely long pages, strongly consider using `firecrawl_extract` with a simple schema (title, main_content_summary) to avoid context window overflow.
- Extract: `title`, `content` (Markdown preferred), `ogImage` (from metadata), `domain`.
- If scraping fails → Try using standard `WebFetch` tool as a fallback. 
- If `WebFetch` also fails → tell user to save content to .txt and retry. Stop.

**File mode:**
- Use `Read` to read the .txt file
- Title = first non-empty line (strip whitespace, max 80 chars)
- Content = remaining lines joined
- ogImage = `null`
- domain = `"local"`

### Step 3: Create slug + output directory

- slug = lowercase ASCII: strip Vietnamese diacritics (đ→d), replace non-alphanumeric with `-`, trim dashes, max 40 chars
- timestamp = current local time as `YYYYMMDD-HHmm`
- outputDir = `output/<slug>-<timestamp>/`
- Use Bash: `mkdir -p <outputDir>`

### Step 4: Generate script.json

**Schema version:** The root must include `version: "1.0"` (required by Zod validation).

**Scene rules:**
- Total scenes: 5–8 (1 hook + 3–6 body + 1 outro)
- scenes[0].type === "hook" (required)
- last scene.type === "outro" (required)
- Total words in voiceText: ~150–200 Vietnamese words → ~55–65s video

**Scene structure (each scene):**
```json
{
  "id": "hook",
  "type": "hook",           // "hook" | "body" | "outro"
  "voiceText": "...",
  "visual": {
    "videoKeyword": "...",  // optional — search Pexels for B-roll footage (9:16 portrait video)
    "imageKeyword": "...",  // optional — search Pexels for still image background
    "bgSrc": "$source.image", // optional — use article hero image as background
    "background": { "type": "gradient" }  // optional override
  },
  "templateData": {
    "template": "hook",     // "hook" | "comparison" | "stat-hero" | "feature-list" | "callout" | "kinetic-text" | "outro"
    "headline": "...",
    "subhead": "...",
    "kenBurns": "zoom-in"   // "zoom-in" | "zoom-out" | "pan-left" | "pan-right"
  },
  "camera": "none"          // "none" | "punch-in" | "punch-out" | "shake"
}
```

**Visual priority (per scene type):**
- **Hook scene:** `bgSrc` (article image) → gradient fallback
- **Body scene with `videoKeyword`:** magenta placeholder → pipeline composites Pexels footage via ffmpeg in post-processing
- **Body scene with `imageKeyword`:** Pexels still image with Ken Burns → gradient fallback
- **Any scene with `bgSrc: "$source.image"`:** article image (Ken Burns) — explicit override works on all scene types
- **No background specified:** gradient fallback

> **Note:** `videoKeyword` and `imageKeyword` are independent — a scene can have both, but only one is used based on priority above. The actual Pexels video URL is downloaded by the pipeline; you only provide the keyword string in script.json.

**templateData shapes:**
```json
// hook
{ "template": "hook", "headline": "string (≤40)", "subhead": "string (≤40, optional)", "kenBurns": "zoom-in" }

// comparison
{ "template": "comparison", "left": { "label": "string (≤30)", "value": "string (≤20)", "color": "cyan|purple" }, "right": { "label": "string (≤30)", "value": "string (≤20)", "color": "cyan|purple", "winner": true|false } }

// stat-hero
{ "template": "stat-hero", "value": "string (≤20)", "label": "string (≤40)", "context": "string (≤50, optional)" }

// feature-list
{ "template": "feature-list", "title": "string (≤40)", "bullets": ["string (≤50) × 1-4 items"], "icon": "string (optional)", "align": "center|bottom-left|bottom-right" }

// callout
{ "template": "callout", "statement": "string (≤80)", "tag": "string (≤20, optional)", "align": "center|bottom-left|bottom-right" }

// kinetic-text
{ "template": "kinetic-text", "chunks": ["Phụ đề 1", "Phụ đề 2", "Phụ đề 3"], "highlightColor": "primary|secondary" }

// outro
{ "template": "outro", "ctaTop": "string (≤30)", "channelName": "string (≤30)", "source": "string (≤40)" }
```

**Theme selection:** Set `metadata.theme` in `script.json` to change the video's color palette.
Options: `"classic"` (default, Cyan/Purple), `"gold"`, `"emerald"`, `"sunset"`, `"cyber"`.

**Line length:** Each text field in `templateData` (headline, subhead, value, label, title, bullets, statement, ctaTop, channelName) is recommended to be ≤ 35 characters (SKILL rule). The schema allows up to 50 characters, but keep visible text as short as possible for 9:16 portrait readability.

**Voice + speed:**
```json
{
  "voice": {
    "provider": "lucylab",   // "lucylab" | "elevenlabs"
    "voiceId": "${VIETNAMESE_VOICEID}",  // placeholder — pipeline auto-substitutes from .env.local
    "speed": 1.2            // 0.5 – 2.0 (1.2 recommended for news)
  }
}
```

---

## Vietnamese TTS Phonetic Rules

The `voiceText` field is read aloud by LucyLab/ElevenLabs Vietnamese TTS. **Numbers and symbols are read literally** — always spell out in Vietnamese phonetic form in `voiceText`. `templateData` (visual text on screen) can keep original formatting.

| Number form | WRONG (TTS misreads) | RIGHT (Vietnamese phonetic) |
|---|---|---|
| Decimal version | `GPT 5.5` → "năm rưỡi" ❌ | `GPT năm chấm năm` ✅ |
| Decimal stat | `82.7%` | `tám mươi hai phẩy bảy phần trăm` |
| Version | `iPhone 17` | `iPhone mười bảy` (whole numbers OK as-is) |
| Version with point | `iOS 18.2` | `iOS mười tám chấm hai` |
| Tech spec | `200MP` | `hai trăm megapixel` |
| Battery | `5000mAh` | `năm nghìn miliampe giờ` |
| Tokens | `1M tokens` | `một triệu token` |
| Price VND | `21 triệu đồng` | `hai mươi mốt triệu đồng` |
| Price USD | `$5` | `năm đô la` (or `năm đô`) |
| Multiplier | `2x` | `gấp đôi` |
| Year | `2026` | `năm 2026` (or `hai nghìn không trăm hai mươi sáu`) |
| Percentage | `30%` | `ba mươi phần trăm` |
| Time | `60 giây` | `sáu mươi giây` |
| Ratio | `3:1` | `ba trên một` or `ba so với một` |

- Decimal point → `chấm` (spoken) or `phẩy` (formal); pick one and stay consistent
- Comma separator → `phẩy` (e.g., "1,000" → "một nghìn")

**English acronyms — write phonetically:**
- `AI` → `ây ai` (MANDATORY — TTS says "A-I" as separate letters, not natural)
- `API` → `ây pi ai`
- `GPT` → usually OK; if misread, write `gí pi tí`
- `iOS` → `ai ô ét` (if misread)

**English brand names — keep as-is** (TTS handles them fine):
- `Apple`, `Google`, `OpenAI`, `Microsoft`, `TikTok`, `YouTube`, `GitHub`, `HuggingFace` ✅

**Symbols to AVOID in voiceText:**
- `→` `&` `%` `$` `#` `+` `=` `/` `-` `"` (TTS says literal name, ngắt quãng hoặc skips inconsistently)
- `!` `?` at end of sentence: OK (natural intonation)
- Emoji: NEVER (TTS pronounces or skips inconsistently)
- URLs: NEVER (TTS reads dot/slash literally)

**End each sentence with `.` or `?`** for natural pause/intonation.

**Hook (most important — first 3 seconds of viewer attention):**
- Must contain a claim, statistic, or curious question
- WRONG: "Hôm nay chúng ta sẽ nói về..." (generic opener)
- RIGHT: A specific stat/claim/question about the news

**Full scene examples:**

WRONG (will sound bad on TTS):
```json
{ "voiceText": "GPT 5.5 đạt 82.7% trên Terminal-Bench, vượt GPT 5.4 (75.1%)." }
```

RIGHT (natural TTS):
```json
{
  "voiceText": "GPT năm chấm năm đạt tám mươi hai phẩy bảy phần trăm trên Terminal Bench, vượt phiên bản năm chấm bốn ở mức bảy mươi lăm phẩy một.",
  "visual": { "videoKeyword": "artificial intelligence, futuristic computer, neural network data" },
  "templateData": {
    "template": "stat-hero",
    "value": "82.7%",
    "label": "Terminal-Bench"
  }
}
```

Hook example:
```json
{
  "id": "hook",
  "type": "hook",
  "voiceText": "Apple vừa ra mắt iPhone 17 với camera hai trăm megapixel.",
  "visual": { "bgSrc": "$source.image" },
  "templateData": {
    "template": "hook",
    "headline": "iPhone 17",
    "subhead": "Camera 200MP!",
    "kenBurns": "zoom-in"
  }
}
```

Outro (fixed format — always at last scene):
```json
{
  "id": "outro",
  "type": "outro",
  "voiceText": "Theo dõi Công nghệ hai mươi bốn giờ để xem bản tin mới mỗi ngày.",
  "visual": { "background": { "type": "gradient" } },
  "templateData": {
    "template": "outro",
    "ctaTop": "Xem bản tin mới mỗi ngày",
    "channelName": "Công nghệ 24h",
    "source": "<DOMAIN>"
  }
}
```
Replace `<DOMAIN>` with actual domain (e.g., "vnexpress.net").

---

## Sound Effects (SFX)

**You almost never need to set the `sfx` field.** The pipeline has a smart 3-tier selector that picks the right SFX automatically.

**Tier 1 — Explicit override** (rarely needed):
- `scene.sfx.name` set in script.json → use exactly that file
- `{ "name": "none" }` → disable SFX for this scene
- `{ "name": "transition/whoosh-soft", "volume": 0.4, "startOffsetSec": 0.2 }`

**Tier 2 — Semantic keyword match** (automatic, no script changes needed):
- `cảnh báo / rủi ro / nguy hiểm / warning / alert` → `alert/`
- `kỷ lục / vượt / xuất sắc / breakthrough / success` → `success/`
- `thất bại / lỗi / fail / wrong` → `fail/`
- `ra mắt / công bố / launch / unveil` → `reveal/`
- `đếm ngược / tích tắc / countdown` → `countdown/`
- `hùng vĩ / hoành tráng / cinematic / epic` → `cinematic/`
- `hồi hộp / chờ đợi / drumroll / suspense` → `drumroll/`

**Tier 3 — Template default** (when no keyword matches):
- `hook` → `transition/` (dramatic entrance)
- `comparison` → `transition/` (side-by-side reveal)
- `stat-hero` → `emphasis/` (number reveal)
- `feature-list` → `transition/` (bullets pop in)
- `callout` → `alert/` (important info)
- `outro` → `outro/` (ending signature)

Within a category, selection is **deterministic by scene id** (hash-based) — same script always picks the same file (idempotent re-renders), but different scenes in the same video get different files (variety).

**Fallback mechanism:** If the selected SFX file doesn't exist on disk, the pipeline automatically picks any other file from the same category. If that category is empty, it picks from any non-empty category. The video will always have SFX — never silent.

**Available SFX categories** (browse `assets/sfx/<category>/` for exact filenames):
- `transition/` — whoosh, swoosh, swish, pop, punch, page-flip, slide, riser
- `emphasis/` — ding, tick, chime, ping, bong, pop, punch
- `alert/` — notification, alert, alarm, warning
- `success/` — applepay, achievement, win, xbox, jet-set
- `fail/` — wrong-answer-buzzer, incorrect, error, dank-meme
- `outro/` — tada, win31, noooo
- `reveal/` — magic-fairy, anime-girl, hey-female-voice
- `drumroll/` — snare, drum-roll, boom
- `countdown/` — beep, timer
- `cinematic/` — rise, impact

Reference files WITHOUT `.mp3` extension. Example: `{ "name": "success/xbox-360-achievement-sound", "volume": 0.4 }`

**Default volume + offset per category:**
- `transition`: volume 0.40, offset 0.0s
- `emphasis`: volume 0.35, offset 0.2s
- `alert`: volume 0.40, offset 0.1s
- `success`: volume 0.35, offset 0.3s
- `reveal`: volume 0.30, offset 0.2s
- `countdown`: volume 0.30, offset 0.0s
- `cinematic`: volume 0.35, offset 0.0s
- `drumroll`: volume 0.40, offset 0.0s
- `outro`: volume 0.35, offset 0.5s

---

## Self-Validate Before Writing

Before writing `script.json`, check all of the following:

| Check | Rule |
|---|---|
| Root object | Must include `"version": "1.0"` |
| Scene count | 5–8 scenes |
| First scene | `scenes[0].type === "hook"` |
| Last scene | `scenes[last].type === "outro"` |
| All template enum values | `hook`, `comparison`, `stat-hero`, `feature-list`, `callout`, `outro` |
| All scene.type enum values | `hook`, `body`, `outro` |
| templateData text fields | recommended ≤ 35 characters |
| Total word count | ~150–200 Vietnamese words |
| voiceText numbers | All spelled out phonetically in Vietnamese |
| voiceText symbols | No `→ & % $ # + =`; no emoji; no URLs |
| voiceText sentences | End with `.` or `?` |
| Visual | Use `videoKeyword` or `imageKeyword` for Pexels (not `imageKeyword` → "use imageKeyword" in visual) |
| bgSrc for article image | `visual.bgSrc: "$source.image"` — pipeline substitutes at runtime |

Fix any violations silently. Up to 2 self-correction passes. After that, write anyway — Zod validation in pipeline will surface precise errors.

---

## Pipeline Execution

**Run command:**
```bash
npm run pipeline -- output/<slug>/script.json
```
> Note: `--` (double dash) is required to pass the path argument to the script, not to npm.

**Pipeline behavior:**
1. Validates script.json via Zod (fails fast if invalid)
2. Writes `script.txt` (voiceText for CapCut auto-caption)
3. Downloads article hero image (if URL mode)
4. Generates TTS audio per scene (idempotent — skips scenes with existing `.mp3`)
5. Fetches Pexels videos for `videoKeyword` scenes (idempotent — skips existing `.mp4`)
6. Fetches Pexels images for `imageKeyword` scenes
7. Concatenates voice + 0.3s gaps, mixes SFX layer
8. Composes `index.html` + hyperframes project files
9. Renders with Hyperframes (headless browser → `.mp4`)
10. Post-process: ffmpeg chroma-key composites Pexels footage under UI layer → final `video.mp4`

**TTS Idempotency:** If a scene's `.mp3` already exists, TTS is skipped (saves API quota). To force re-generate a scene's voice: delete its `voice/<scene-id>.mp3` file before re-running.

**Duration target:** 55–65s voice (after TTS). Pipeline warns if outside 48–72s range but proceeds anyway.

**Error handling:**
- Pipeline fails → report error message + output dir path; user can fix and re-run `npm run pipeline -- <path>`
- TTS provider fails → pipeline retries once after 2s; if still failing, aborts (check `BACKUP_TTS_PROVIDER` env if needed)

---

## Report Success

```markdown
✅ Video:  [video.mp4](output/<slug>-<timestamp>/video.mp4)
✅ Audio:  [voice.mp3](output/<slug>-<timestamp>/voice.mp3) — cho CapCut
✅ Script: [script.txt](output/<slug>-<timestamp>/script.txt) — cho CapCut auto-caption
Tổng thời lượng: XX.Xs
```

---

## Edge Cases

| Situation | Action |
|---|---|
| URL paywall / JS-rendered → Firecrawl returns no content | "Không đọc được URL (có thể do paywall hoặc JS). Hãy lưu nội dung vào file .txt rồi gọi lại." Stop. |
| URL content < 200 words | Warn: "Tin gốc ngắn, video có thể không đủ chất liệu" — continue anyway |
| URL content > 2000 words | Summarize to key points, fit ~150–200 words script |
| File mode + file empty/missing | Error: "File not found or empty" — don't create output dir |
| Pexels API key missing | All `videoKeyword`/`imageKeyword` scenes fall back to gradient or article image |
| Pipeline fails | Report error + output dir; user re-runs after fixing |

## Performance & Rendering Notes

- **Heavy CSS Filters:** Avoid excessive use of `backdrop-filter: blur()`, `mix-blend-mode`, or SVG fractal noise filters in templates. These significantly slow down headless Chrome frame capture and can cause timeouts.
- **Protocol Timeout:** If the render fails with `Page.captureScreenshot timed out`, increase the protocol timeout via environment variable: `$env:PRODUCER_PUPPETEER_PROTOCOL_TIMEOUT_MS = "600000"`.
- **Composition Size:** Keep HTML composition files under 500 lines. If a scene is too complex, split it into sub-compositions using the `data-composition-src` pattern (see Hyperframes docs).
- **GPU Acceleration:** By default, PRODUCER uses software rendering. On machines without high-end GPUs, complex GSAP transforms (scale/rotate) on large images can be slow.

---

## Example Full script.json

```json
{
  "version": "1.0",
  "metadata": {
    "title": "Apple ra mắt iPhone 17 với camera 200MP",
    "source": {
      "url": "https://vnexpress.net/iphone-17-200mp",
      "domain": "vnexpress.net",
      "image": "https://i1-vnexpress.vnecdn.net/iphone17.jpg"
    },
    "channel": "Công nghệ 24h"
  },
  "voice": {
    "provider": "lucylab",
    "voiceId": "${VIETNAMESE_VOICEID}",
    "speed": 1.2
  },
  "scenes": [
    {
      "id": "hook",
      "type": "hook",
      "voiceText": "Apple vừa ra mắt iPhone 17 với camera hai trăm megapixel.",
      "visual": { "bgSrc": "$source.image" },
      "templateData": {
        "template": "hook",
        "headline": "iPhone 17",
        "subhead": "Camera 200MP!",
        "kenBurns": "zoom-in"
      }
    },
    {
      "id": "body-1",
      "type": "body",
      "voiceText": "Camera chính với độ phân giải hai trăm megapixel, cho phép chụp ảnh chi tiết cực cao.",
      "visual": {
        "videoKeyword": "smartphone camera photography, mobile technology, modern phone"
      },
      "templateData": {
        "template": "feature-list",
        "title": "Camera đột phá",
        "bullets": ["200MP main camera", "Chế độ AI Night Mode", "Quay video 8K"]
      }
    },
    {
      "id": "outro",
      "type": "outro",
      "voiceText": "Theo dõi Công nghệ hai mươi bốn giờ để xem bản tin mới mỗi ngày.",
      "visual": { "background": { "type": "gradient" } },
      "templateData": {
        "template": "outro",
        "ctaTop": "Xem bản tin mới mỗi ngày",
        "channelName": "Công nghệ 24h",
        "source": "vnexpress.net"
      }
    }
  ]
}
```
