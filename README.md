<a id="top"></a>

<div align="center">

<img src="./assets/logo.svg" alt="Auto Video Studio" width="120" />

# 🎬 Auto Video Studio (News & Manga)

### AI-Powered Pipeline to Turn Articles or Manga into Viral 9:16 Videos

**One command. Zero editing. Pro-grade motion graphics for TikTok, Shorts, and Reels.**

[![Stars](https://img.shields.io/github/stars/hoquanghai/Auto-Create-Video?style=for-the-badge&logo=github&color=yellow)](https://github.com/hoquanghai/Auto-Create-Video/stargazers)
[![License](https://img.shields.io/github/license/hoquanghai/Auto-Create-Video?style=for-the-badge&color=green)](LICENSE)
[![Node](https://img.shields.io/badge/node-22%2B-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-6%2B-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[**🇬🇧 English**](README.md) · [**🇻🇳 Tiếng Việt**](README.vi.md) · [**🚀 Quick Start**](#-quick-start) · [**❓ FAQ**](#-faq)

</div>

---

## 🌟 Overview

**Auto Video Studio** is an automated production pipeline designed for content creators. It bridges the gap between raw content (news articles or manga chapters) and high-quality short-form video using AI orchestration and deterministic rendering.

### 🍱 Two Powerful Modes

| Feature | 📰 News Mode | 📖 Manga Mode |
| :--- | :--- | :--- |
| **Input** | News URL, `.txt`, or `.md` | Manga URL or local folder of images |
| **Visuals** | Pexels stock footage + Article images | Original manga panels with Ken Burns |
| **Logic** | Summarization & Scene Analysis | OCR (FileGraph) + RTL Reading Order |
| **Templates** | 12 dynamic motion graphic templates | Optimized `manga-panel` slideshow |
| **Voice** | Natural TTS (LucyLab/ElevenLabs) | Character-synced or Narrator TTS |

---

## 🎥 Live Demo
👉 [**Watch Demo on YouTube Shorts**](https://youtube.com/shorts/S24JfKxV4bo)

*This video was generated **entirely** by the pipeline — Vietnamese TTS + HyperFrames + GSAP animations, no manual editing.*

---

## ✨ Key Features

- 🤖 **Claude Code Integration**: Run a single slash command `/create-news-video <url>` to start the entire process.
- 🎨 **12+ Smart Templates**: Hook, Comparison, Stat Hero, Feature List, Manga Panel, Kinetic Quote, and more.
- 👁️ **Smart Manga OCR**: Automated Vietnamese text extraction with logical reordering (Right-to-Left, Top-to-Bottom).
- 🎤 **Pro TTS Support**: Built-in integration with **LucyLab** (Vietnamese voice cloning) and **ElevenLabs**.
- 🔊 **Auto SFX Mixing**: 3-tier smart picker (Semantic Match -> Template Default -> Fallback).
- 🖼️ **Auto Thumbnail**: Generates 9:16 covers using Gemini 2.5 Flash Image.
- ♻️ **Idempotent Pipeline**: Skips expensive TTS steps if audio files already exist.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: Version 22 or higher.
- **FFmpeg**: Required for audio mixing and video encoding. 
  - *Windows*: `winget install ffmpeg`
  - *macOS*: `brew install ffmpeg`
  - *Linux*: `sudo apt install ffmpeg`
- **Claude Code**: (Optional) For automated orchestration using the `/create-news-video` command.

### 2. Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hoquanghai/Auto-Create-Video.git
   cd Auto-Create-Video
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Download SFX Assets**:
   The pipeline requires a default set of sound effects. Run this script to fetch them:
   ```bash
   npm run sfx:download
   ```

### 3. Configuration
Copy `.env.example` to `.env.local` and fill in your API keys:
- `TTS_PROVIDER`: `lucylab` or `elevenlabs`
- `FILEGRAPH_API_KEY`: For Manga OCR.
- `PEXELS_API_KEY`: For stock background videos (News mode).

### 3. Execution

**Option A: Using Claude Code (Highly Recommended)**
1. Install Claude Code CLI.
2. Run `claude` in the project root.
3. Type: `/create-news-video https://vnexpress.net/link-to-article`
   *Or for Manga:* `/create-news-video https://manga-site.com/chapter-1`

**Option B: Manual CLI**
```bash
# For News
npm run pipeline -- path/to/script.json

# For Manga (Auto-Scrape + OCR + Render)
npm run manga -- https://truyenthieunhi.vn/story-url
```

---

## 🛠️ Tech Stack

- **Engine**: [HyperFrames](https://hyperframes.heygen.com) (Puppeteer + GSAP + FFmpeg).
- **Language**: TypeScript 6 (ESM).
- **AI**: Claude 4.x (Orchestration), Gemini 2.5 (Thumbnails), FileGraph (OCR).
- **Audio**: FFmpeg (Mixing, Normalization, Concat).

---

## 📁 Output Structure
After rendering, you will find your assets in `output/<slug>/`:
- `video.mp4`: Final high-quality video.
- `voice.mp3`: Pure voiceover + SFX (perfect for further CapCut tweaks).
- `script.txt`: Clean text for auto-captions.
- `index.html`: The source code of the video composition.

---

## 🗺️ Roadmap
- [x] Auto Manga OCR & RTL Reading.
- [x] Gemini-powered Thumbnail generation.
- [ ] Automated Background Music selection by mood.
- [ ] Auto-upload to TikTok/Reels API.
- [ ] Burned-in captions via Whisper alignment.

---

## 🤝 Contributing
Contributions are welcome! Please read our `design.md` for visual guidelines and run `npm test` before submitting PRs.

## 📜 License
[MIT](LICENSE) — Use it for personal or commercial projects.

---
<div align="center">
Made with ❤️ by [Ho Quang Hai](https://github.com/hoquanghai) in 🇻🇳 Vietnam
</div>
