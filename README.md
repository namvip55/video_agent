<div align="center">

<img src="./assets/logo.svg" alt="Auto News Video" width="120" />

# 🎬 Auto News Video

### Turn any Vietnamese tech article into a TikTok-ready video in 60 seconds

**One command. Zero editing. Studio-quality 9:16 motion graphics.**

[![Stars](https://img.shields.io/github/stars/hoquanghai/Auto-Create-Video?style=for-the-badge&logo=github&color=yellow)](https://github.com/hoquanghai/Auto-Create-Video/stargazers)
[![Forks](https://img.shields.io/github/forks/hoquanghai/Auto-Create-Video?style=for-the-badge&logo=github&color=blue)](https://github.com/hoquanghai/Auto-Create-Video/network/members)
[![License](https://img.shields.io/github/license/hoquanghai/Auto-Create-Video?style=for-the-badge&color=green)](LICENSE)
[![Node](https://img.shields.io/badge/node-22%2B-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5%2B-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-35_passing-success?style=for-the-badge&logo=vitest&logoColor=white)]()

[**🇬🇧 English**](README.md) · [**🇻🇳 Tiếng Việt**](README.vi.md) · [**📺 Watch Demo**](https://youtube.com/shorts/S24JfKxV4bo) · [**🚀 Quick Start**](#-quick-start) · [**❓ FAQ**](#-faq)

</div>

---

<div align="center">

## 🎥 Live Demo

### 👉 [**▶️ Watch on YouTube Shorts**](https://youtube.com/shorts/S24JfKxV4bo) 👈

[![Watch Demo](https://img.youtube.com/vi/S24JfKxV4bo/maxresdefault.jpg)](https://youtube.com/shorts/S24JfKxV4bo)

[![Watch on YouTube](https://img.shields.io/badge/▶️_Watch_on_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/shorts/S24JfKxV4bo)

*This video was generated **entirely** by this pipeline — Vietnamese TTS + HyperFrames + GSAP animations, no manual editing.*

</div>

---

## 🤔 Why does this exist?

Creating short-form news videos is **time-consuming and repetitive**:

- ⏰ Manually scripting → 30 min per video
- 🎨 Picking visuals + animations → 1 hour per video
- 🎙️ Recording or sourcing voiceover → 30 min
- ✂️ Editing in CapCut / Premiere → 1 hour
- 📱 **Total: ~3 hours per 60-second video**

**Auto News Video does it in 5 minutes. Just paste a URL.**

| | Manual workflow | Auto News Video |
|---|---|---|
| ⏱️ Time per video | ~3 hours | **~5 minutes** |
| 🎓 Skill required | Video editor | **None** |
| 🎯 Consistency | Varies | **Studio-grade every time** |
| 💰 Cost per video | $50–200 (freelancer) | **~$0.10 (API costs)** |
| 🇻🇳 Vietnamese voice | Hard to source | **Built-in (LucyLab cloning)** |

---

## 🚀 Quick Start

```bash
git clone https://github.com/hoquanghai/Auto-Create-Video.git
cd Auto-Create-Video
npm install
cp .env.example .env.local        # then edit .env.local with your API key
```

Open the project in [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) and run:

```
/create-news-video https://vnexpress.net/some-article
```

That's it. After ~3–5 minutes you'll have `output/<slug>/video.mp4` — a 1080×1920 MP4 ready for TikTok / Shorts / Reels.

> 💡 **Need details?** Jump to [Full Setup](#-full-setup) · [Configuration](#-configuration) · [Usage](#-usage)

---

## ✨ Features

<table>
<tr>
<td width="33%" align="center">
<h3>🎨 6 Smart Templates</h3>
<sub>Hook, Comparison, Stat-Hero, Feature-List, Callout, Outro — auto-picked by content</sub>
</td>
<td width="33%" align="center">
<h3>🎤 Multi-TTS</h3>
<sub>LucyLab (Vietnamese cloning) or ElevenLabs (30+ languages)</sub>
</td>
<td width="33%" align="center">
<h3>🤖 Claude Code Skill</h3>
<sub>One slash command:<br/><code>/create-news-video &lt;url&gt;</code></sub>
</td>
</tr>
<tr>
<td width="33%" align="center">
<h3>🎬 HeyGen-Quality Look</h3>
<sub>Studio shell + grain texture + GSAP animations + navy gradient</sub>
</td>
<td width="33%" align="center">
<h3>🔊 Auto SFX Mixing</h3>
<sub>3-tier smart picker: explicit override → semantic match → template default</sub>
</td>
<td width="33%" align="center">
<h3>🧪 Production Ready</h3>
<sub>35 unit tests, Zod schema validation, full TypeScript ESM</sub>
</td>
</tr>
<tr>
<td width="33%" align="center">
<h3>📱 9:16 Native</h3>
<sub>1080×1920 @ 30fps, ready for TikTok / Shorts / Reels</sub>
</td>
<td width="33%" align="center">
<h3>♻️ Idempotent TTS</h3>
<sub>Skips re-synthesis if voice files exist — saves API quota</sub>
</td>
<td width="33%" align="center">
<h3>📝 CapCut-Friendly</h3>
<sub>Exports <code>script.txt</code> + <code>voice.mp3</code> for auto-caption workflow</sub>
</td>
</tr>
</table>

---

## 🧠 How It Works

```mermaid
flowchart LR
    A[📰 Article URL or .txt] -->|/create-news-video| B[Claude Code]
    B -->|fetch + analyze| C[Generate script.json]
    C -->|Zod validate| D{Template Picker}
    D -->|hook| E[6 Scene Types]
    D -->|comparison| E
    D -->|stat-hero| E
    D -->|feature-list| E
    D -->|callout| E
    D -->|outro| E
    E -->|TTS per scene| F[LucyLab / ElevenLabs]
    F -->|voice.mp3 + SFX mix| G[HyperFrames]
    G -->|Puppeteer + GSAP| H[1800 frames @ 30fps]
    H -->|FFmpeg encode| I[🎬 video.mp4 1080×1920]

    style A fill:#0f172a,color:#fff
    style I fill:#10b981,color:#fff
    style B fill:#6366f1,color:#fff
    style F fill:#f59e0b,color:#fff
    style G fill:#ec4899,color:#fff
```

The pipeline is **AI for content** (Claude writes the script) and **deterministic code for production** (Node/TS/FFmpeg renders the pixels) — same input → identical frames every time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js ≥ 22, TypeScript 5+, ESM |
| **Render engine** | [HyperFrames](https://hyperframes.heygen.com) (Puppeteer + GSAP + FFmpeg) |
| **TTS providers** | [LucyLab.io](https://lucylab.io) (JSON-RPC, Vietnamese cloning) or [ElevenLabs](https://elevenlabs.io) (REST, multilingual) |
| **Schema validation** | [Zod](https://zod.dev) discriminated unions |
| **HTTP** | axios + nock (test mocking) |
| **Testing** | [Vitest](https://vitest.dev) — ESM-native |
| **Audio processing** | FFmpeg + ffprobe (mix, concat, probe) |
| **AI orchestration** | [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) skill (`/create-news-video`) |
| **Visual blocks** | HyperFrames registry: `grain-overlay`, `shimmer-sweep`, `tiktok-follow` |
| **Fonts** | Inter + Anton (Google Fonts) |

---

## 📋 Prerequisites

| Item | Version | Notes |
|---|---|---|
| **Node.js** | ≥ 22 | `node --version` |
| **FFmpeg + ffprobe** | any modern | must be in PATH (`ffmpeg -version`) |
| **Chrome / Chromium** | any | auto-downloaded by Puppeteer on first render |
| **Claude Code CLI** | latest | [install here](https://docs.claude.com/en/docs/claude-code/overview) |
| **TTS account** | one of two | LucyLab.io OR ElevenLabs |

---

## 🔧 Full Setup

```bash
# 1. Clone & enter
git clone https://github.com/hoquanghai/Auto-Create-Video.git
cd Auto-Create-Video

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# → open .env.local, set TTS_PROVIDER + API key (see Configuration below)

# 4. Verify
node --version       # ≥ 22
ffmpeg -version      # any version OK
ffprobe -version
npm test             # 35 tests should pass
```

### Install FFmpeg

| OS | Command |
|---|---|
| **Windows** | `winget install Gyan.FFmpeg` |
| **macOS** | `brew install ffmpeg` |
| **Ubuntu/Debian** | `sudo apt install ffmpeg` |

---

## ⚙️ Configuration

Open `.env.local` and pick **one of two providers**:

### Option 1 — LucyLab.io (recommended for Vietnamese)

```env
TTS_PROVIDER=lucylab
VIETNAMESE_API_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx
VIETNAMESE_VOICEID=22charvoiceiduuidhere
```

- ✅ Natural Vietnamese voice (cloning), free SRT subtitle file included
- ⚠️ Only 1 concurrent export per account (pipeline serialises automatically)
- 🔗 Sign up: https://lucylab.io

### Option 2 — ElevenLabs

```env
TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

- ✅ Multilingual (30+ languages), large voice library, high quality
- ⚠️ Pricier than LucyLab, no SRT included
- 🔗 Get key: https://elevenlabs.io/app/settings/api-keys · Browse voices: https://elevenlabs.io/app/voice-library

### TikTok follow card (optional, all defaults work)

```env
TIKTOK_DISPLAY_NAME=Công nghệ 24h
TIKTOK_HANDLE=@congnghe24h
TIKTOK_FOLLOWERS=1.2M followers
TIKTOK_AVATAR_URL=https://example.com/your-avatar.jpg   # optional
```

To customise the avatar, either replace `assets/avatar.png` with your own square ≥256×256 image, **or** set `TIKTOK_AVATAR_URL` so the pipeline downloads it on every render.

---

## 🎬 Usage

### Method 1 — Inside Claude Code (recommended)

Open Claude Code in the project directory and type:

```
/create-news-video https://vnexpress.net/iphone-17-200mp
```

Or with a local file (`.txt` or `.md`):

```
/create-news-video news/my-article.md
```

After ~3–5 minutes:

```
✓ Video:  output/<slug>-<timestamp>/video.mp4    ← final video
✓ Audio:  output/<slug>-<timestamp>/voice.mp3    ← for CapCut import
✓ Script: output/<slug>-<timestamp>/script.txt   ← for CapCut auto-caption
```

### Method 2 — Run pipeline directly (advanced)

If you already have a `script.json` (debugging or hand-written):

```bash
npm run pipeline -- output/<slug>-<timestamp>/script.json
```

### Method 3 — Re-render visuals only (saves TTS quota)

When voice files already exist in `voice/` and you only want to re-render the visuals:

```bash
npm run rerender -- output/<slug>-<timestamp>
```

---

## 📁 Output Structure

```
output/<slug>-<timestamp>/
├── script.json           # Input JSON (Claude-generated or hand-written)
├── script.txt            # Plain text for CapCut auto-caption
├── images/bg.jpg         # og:image (if URL had one)
├── voice/
│   ├── scene-hook.mp3    # TTS per scene (idempotent — skipped if exists)
│   ├── scene-hook.srt    # SRT subtitles (LucyLab only)
│   └── scene-body-1.mp3
├── voice-raw.mp3         # Concatenated voices, no SFX (intermediate)
├── voice.mp3             # Final audio with SFX mixed in (for CapCut)
├── tiktok-avatar.png     # Copy of bundled avatar
├── logo.svg              # Copy of bundled logo
├── index.html            # HyperFrames composition
├── styles.css            # Template CSS (self-contained)
├── animations.js         # GSAP timeline (self-contained)
├── hyperframes.json      # HyperFrames manifest
├── meta.json             # HyperFrames metadata
└── video.mp4             # 🎉 Final output — 1080×1920 @ 30fps
```

---

## 🎨 Visual System

Every video has a **persistent shell** throughout (header brand icon + channel + tag, footer TikTok handle, grain texture, navy gradient with cyan + purple accents) plus 5–8 scenes auto-picked by Claude:

| Template | When it's picked | Example |
|---|---|---|
| `hook` | First scene (3–5s) | "GPT 5.5" + "AI mạnh nhất!" over og:image with shimmer |
| `comparison` | Content has "X vs Y" / "exceeds" / "compared to" | 2 cards: "GPT 5.4 75.1%" cyan vs "GPT 5.5 82.7%" purple (winner) |
| `stat-hero` | Key number / % | "1M" giant gradient + "Tokens / context window" |
| `feature-list` | Listing features | Card with up to 4 bullets, cyan glow dots |
| `callout` | Statement / warning / quote | Purple glow card with "Cảnh báo: AI tự chủ cần cân nhắc" |
| `outro` | Last scene (3–5s) | "Theo dõi ngay" pill + channel name + gradient underline |

### Sound Effects (auto-mixed by template)

| Template | Default SFX | When you hear it |
|---|---|---|
| `hook` | `transition/whoosh-soft` | Dramatic intro |
| `comparison` | `transition/swoosh` | When the 2 cards appear |
| `stat-hero` | `emphasis/ding` | When the number reveals |
| `feature-list` | `transition/pop` | Each bullet appears |
| `callout` | `alert/notification` | Important statement |
| `outro` | `outro/tada` | Ending signature |

The 3-tier SFX picker (in `src/assets/sfx-selector.ts`) chooses in this order: **explicit `scene.sfx`** override → **semantic match** on Vietnamese keywords (e.g. `cảnh báo`→alert, `kỷ lục`→success) → **template default**. Within a category, files are picked deterministically by hashing the scene id, so the same script always produces the same SFX.

---

## 🎥 Showcase

<table>
<tr>
<td width="33%" align="center">
<a href="https://youtube.com/shorts/S24JfKxV4bo">
<img src="https://img.youtube.com/vi/S24JfKxV4bo/0.jpg" alt="iPhone 17 - 200MP camera" />
</a>
<br/>
<sub><b>iPhone 17 — 200MP camera</b><br/>Source: VnExpress</sub>
</td>
<td width="33%" align="center">
<i>Your video here?</i><br/><br/>
<sub>Open an issue with your output and we'll feature it.</sub>
</td>
<td width="33%" align="center">
<i>Your video here?</i><br/><br/>
<sub>Open an issue with your output and we'll feature it.</sub>
</td>
</tr>
</table>

> 🎬 **Made something cool?** Submit your video via [issue](https://github.com/hoquanghai/Auto-Create-Video/issues/new) and we'll feature it here.

---

## ❓ FAQ

<details>
<summary><b>Can I use this for languages other than Vietnamese?</b></summary>

Yes. Switch `TTS_PROVIDER=elevenlabs` in `.env.local` — ElevenLabs supports 30+ languages including English, Chinese, Japanese.

Note: the Claude Code skill currently optimises script generation for Vietnamese. For other languages you may want to adjust the prompts in `.claude/skills/create-news-video/SKILL.md`.
</details>

<details>
<summary><b>How much does it cost per video?</b></summary>

Roughly **$0.05–0.15 per video**, depending on TTS provider:

- LucyLab: ~$0.02 per video (cheapest, Vietnamese only)
- ElevenLabs: ~$0.10 per video (multilingual)
- Claude API (script generation): ~$0.03 per video
</details>

<details>
<summary><b>Can I run this without Claude Code?</b></summary>

Yes — use **Method 2** (`npm run pipeline -- script.json`) with a hand-written `script.json`. The Claude Code skill is only used for the "creative" step (writing Vietnamese script + picking templates). The pipeline itself is pure Node.js — see [`src/pipeline.ts`](src/pipeline.ts).
</details>

<details>
<summary><b>Why HyperFrames instead of Remotion?</b></summary>

HyperFrames is purpose-built for short-form video (9:16 native), has 50+ pre-built blocks for social media, and is more AI-agent friendly (Claude can author HTML directly). Remotion is more powerful for complex compositions but requires React expertise — and migrating our 6 templates would be a 2–3 week rewrite for no real win.

Architecture-wise we still borrow ideas from Remotion: frame-deterministic timeline, declarative scene timing ([`src/render/timing.ts`](src/render/timing.ts)), built-in transitions ([`src/render/transition-profiles.ts`](src/render/transition-profiles.ts)).
</details>

<details>
<summary><b>The video output is silent / has garbled audio. What's wrong?</b></summary>

Most likely FFmpeg is missing or not in PATH. Run `ffmpeg -version` to verify.

- Windows: `winget install Gyan.FFmpeg`
- macOS: `brew install ffmpeg`
- Ubuntu: `sudo apt install ffmpeg`

Then restart your terminal and re-run.
</details>

<details>
<summary><b>The TTS is mispronouncing numbers. How do I fix it?</b></summary>

Vietnamese TTS reads digits literally. Spell them out in `voiceText` (the on-screen text in `templateData` keeps the digit form):

| In `voiceText` (TTS-friendly) | On screen (`templateData`) |
|---|---|
| `năm chấm năm` | `5.5` |
| `tám mươi hai phẩy bảy phần trăm` | `82.7%` |
| `một triệu token` | `1M tokens` |
| `hai trăm megapixel` | `200MP` |

The Claude Code skill handles this automatically when generating scripts. See [`SKILL.md`](.claude/skills/create-news-video/SKILL.md) for the full phonetic ruleset.
</details>

<details>
<summary><b>Can I customise the visual style (colors, fonts)?</b></summary>

Yes — edit [`src/render/templates/styles.css`](src/render/templates/styles.css). The template system uses CSS variables so changes propagate to all 6 scene types. Animation timing lives in [`src/render/templates/animations.js`](src/render/templates/animations.js).
</details>

<details>
<summary><b>How do I force re-TTS for a single scene?</b></summary>

The TTS step is idempotent — it only synthesises scenes whose mp3 doesn't yet exist. To force a single scene, delete its file:

```bash
rm output/<slug>/voice/scene-hook.mp3
npm run pipeline -- output/<slug>/script.json
```

To re-render visuals only (keep all voice files): use `npm run rerender -- output/<slug>` instead.
</details>

<details>
<summary><b>How long can the video be?</b></summary>

The pipeline supports **45–180 seconds**. Heuristic in [`SKILL.md`](.claude/skills/create-news-video/SKILL.md):

| Source words | Script words | Scenes | Duration |
|---|---|---|---|
| < 500 | ~110 | 4–5 | ~45–55s |
| 500–1500 | ~150–200 | 5–8 | ~60–80s |
| 1500–3000 | ~250–350 | 8–12 | ~100–140s |
| > 3000 | ~400–500 | 12–18 | ~150–180s |
</details>

---

## 🧪 Testing

```bash
npm test                 # 35 unit tests (~4s)
npm run test:watch       # watch mode
npx tsc --noEmit         # type-check without build
```

Tests cover Zod schema validation, TTS clients (with `nock` HTTP mocking — no real API calls), audio tools (with fixture mp3 sine waves), beat profiles, timing computation, transition profiles, and HTML composer snapshots.

---

## 🐛 Troubleshooting

| Error | Fix |
|---|---|
| `Missing VIETNAMESE_API_KEY` / `Missing ELEVENLABS_API_KEY` | Check `.env.local` exists and `TTS_PROVIDER` matches the provider you have keys for |
| `hyperframes render failed` | Run `npx hyperframes render --help` to verify CLI; ensure Chrome can be downloaded by Puppeteer |
| `LucyLab polling timeout` | Increase `LUCYLAB_POLL_TIMEOUT_MS` in `.env.local` (default 120000ms) |
| `ElevenLabs 401 Invalid API key` | Verify the key on the ElevenLabs dashboard, re-paste into `.env.local` |
| `Total duration outside [48s, 72s]` | Either re-trigger the skill or hand-edit `script.json` to lengthen / shorten text |
| `ffprobe: command not found` | Install FFmpeg (see [Configuration](#-configuration)) |

---

## 🗺️ Roadmap

- [ ] Burned-in captions (forced alignment with Whisper)
- [ ] Auto-select background music by mood
- [ ] Multi-news compilation mode (`digest`)
- [ ] AI-generated images (Flux / Stable Diffusion when og:image unavailable)
- [ ] Auto-upload to TikTok / YouTube Shorts / Reels via API
- [ ] Custom logo overlay with positioning controls
- [ ] Multi-language script generation (English, Chinese)
- [ ] Standalone web UI (no Claude Code required)

Have a feature request? [Open an issue](https://github.com/hoquanghai/Auto-Create-Video/issues/new).

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hoquanghai/Auto-Create-Video&type=Date)](https://star-history.com/#hoquanghai/Auto-Create-Video&Date)

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork → clone → branch
git checkout -b feature/my-improvement

# Make changes, ensure tests pass
npm test
npx tsc --noEmit

# Commit using Conventional Commits
git commit -m "feat: add Google TTS provider support"

# Push and open PR
git push origin feature/my-improvement
```

Commit prefixes: `feat:` (new feature) · `fix:` (bug) · `docs:` · `refactor:` · `test:` · `chore:`

---

## 📜 License

[MIT](LICENSE) — use freely, fork freely, PRs welcome.

---

## 🙏 Acknowledgements

This project stands on the shoulders of giants:

- [HyperFrames by HeyGen](https://hyperframes.heygen.com) — the HTML-to-video framework that makes this possible
- [LucyLab.io](https://lucylab.io) — Vietnamese voice cloning API
- [ElevenLabs](https://elevenlabs.io) — multilingual TTS
- [Anthropic Claude](https://www.anthropic.com/claude) — the LLM that writes scripts via Claude Code skill
- [Remotion](https://www.remotion.dev) — inspiration for HTML-based video rendering

---

## 💖 Support this project

If this project saved you time, please consider:

- ⭐ **[Star this repo](https://github.com/hoquanghai/Auto-Create-Video)** — it really helps with discoverability
- 🐦 [Share on Twitter / X](https://twitter.com/intent/tweet?text=Check%20out%20Auto%20News%20Video%20%E2%80%94%20one-command%20Vietnamese%20short-form%20video%20generator&url=https://github.com/hoquanghai/Auto-Create-Video)
- 💬 Tell a friend who creates content
- 🐛 [Report bugs or request features](https://github.com/hoquanghai/Auto-Create-Video/issues)

<div align="center">

**[⬆ Back to top](#-auto-news-video)**

Made with ❤️ by [Ho Quang Hai](https://github.com/hoquanghai) in 🇻🇳 Vietnam

</div>
