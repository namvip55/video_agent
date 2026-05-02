import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import pLimit from "p-limit";
import { ScriptSchema, type Script } from "./render/script-schema.js";
import { loadConfig } from "./config.js";
import { createTtsClient } from "./tts/tts-client.js";
import { fetchImage, fetchPexelsImage } from "./assets/image-fetcher.js";
import { fetchStockVideo } from "./assets/video-fetcher.js";
import { getDurationSec, concatWithSilence, mixSfxOntoVoice, type SfxMixSpec } from "./assets/audio-tools.js";
import { indexSfxLibrary, pickSfxForScene, defaultPlayback } from "./assets/sfx-selector.js";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { composeHtml } from "./render/html-composer.js";
import { renderWithHyperframes } from "./render/hyperframes-runner.js";
import { log } from "./utils/logger.js";

const TOTAL_STEPS = 7;
const DURATION_MIN_SEC = 48;
const DURATION_MAX_SEC = 72;
const SCENE_GAP_SEC = 0.3;
const OUTRO_HOLD_SEC = 3;

const __dirname = dirname(fileURLToPath(import.meta.url));
const TPL_DIR = join(__dirname, "render", "templates");
const SFX_DIR = join(__dirname, "..", "assets", "sfx");

const HYPERFRAMES_CONFIG = {
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  paths: {
    blocks: "compositions",
    components: "compositions/components",
    assets: "assets",
  },
};

export async function runPipeline(scriptPath: string): Promise<void> {
  const cfg = loadConfig();
  const outputDir = dirname(scriptPath);
  log.init(TOTAL_STEPS);
  log.info(`Output: ${outputDir}  |  TTS: ${cfg.ttsProvider}`);

  // ── STEP 1: Load env + validate script.json ─────────────────────────────
  log.step(1, TOTAL_STEPS, "Load env + validate script.json");
  const raw = JSON.parse(await readFile(scriptPath, "utf8"));
  if (raw.voice?.voiceId === "${VIETNAMESE_VOICEID}") {
    raw.voice.voiceId = cfg.ttsProvider === "lucylab" ? cfg.lucylabVoiceId! : cfg.elevenlabsVoiceId!;
  } else if (raw.voice?.voiceId === "${ELEVENLABS_VOICE_ID}") {
    raw.voice.voiceId = cfg.elevenlabsVoiceId!;
  }
  const script: Script = ScriptSchema.parse(raw);
  log.ok(`Script valid — ${script.scenes.length} scenes, title: "${script.metadata.title}"`);

  // ── STEP 2: Write script.txt for CapCut ────────────────────────────────
  log.step(2, TOTAL_STEPS, "Write script.txt for CapCut");
  const fullText = script.scenes.map((s) => s.voiceText).join("\n\n");
  await writeFile(join(outputDir, "script.txt"), fullText);
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  log.ok(`script.txt written (${script.scenes.length} scenes, ${wordCount} words)`);

  // ── STEP 3: Fetch og:image + generate TTS audio (parallel) ───────────
  log.step(3, TOTAL_STEPS, "Fetch og:image + generate TTS audio");
  const imgPath = join(outputDir, "images", "bg.jpg");
  const imgPromise = fetchImage(script.metadata.source.image, imgPath);

  const ttsClient = createTtsClient(cfg);
  const limit = pLimit(cfg.ttsConcurrency);
  const voiceDir = join(outputDir, "voice");
  await mkdir(voiceDir, { recursive: true });

  let doneTts = 0;
  const totalTts = script.scenes.length;

  const sceneAudioPromises = script.scenes.map((scene) =>
    limit(async () => {
      const out = join(voiceDir, `scene-${scene.id}.mp3`);
      const srtOut = join(voiceDir, `scene-${scene.id}.srt`);
      if (existsSync(out)) {
        const dur = await getDurationSec(out);
        doneTts++;
        log.progress(doneTts, totalTts, "TTS");
        log.info(`  scene ${scene.id}: REUSE existing mp3 (${dur.toFixed(2)}s) — delete to force re-TTS`);
        return { id: scene.id, path: out, durationSec: dur };
      }
      log.info(`  TTS scene ${scene.id} (${scene.voiceText.length} chars)...`);
      await ttsClient.generate(scene.voiceText, out, srtOut);
      const dur = await getDurationSec(out);
      doneTts++;
      log.progress(doneTts, totalTts, "TTS");
      log.info(`  scene ${scene.id}: ${dur.toFixed(2)}s`);
      return { id: scene.id, path: out, durationSec: dur };
    }),
  );

  const videoDir = join(outputDir, "videos");
  await mkdir(videoDir, { recursive: true });

  let doneVideo = 0;
  const videoScenesCount = script.scenes.filter(s => s.visual?.videoKeyword).length;

  const videoPromises = script.scenes.map((scene) =>
    limit(async () => {
      const kw = scene.visual?.videoKeyword;
      if (!kw) return { id: scene.id, success: false, reason: "no keyword" };
      const out = join(videoDir, `scene-${scene.id}.mp4`);
      if (existsSync(out)) {
        doneVideo++;
        if (videoScenesCount > 0) log.progress(doneVideo, videoScenesCount, "Video");
        return { id: scene.id, success: true, path: out };
      }
      const result = await fetchStockVideo(kw, out, cfg.pexelsApiKey);
      doneVideo++;
      if (videoScenesCount > 0) log.progress(doneVideo, videoScenesCount, "Video");
      return { id: scene.id, ...result };
    }),
  );

  const pexelsImgDir = join(outputDir, "images", "pexels");
  await mkdir(pexelsImgDir, { recursive: true });
  let doneImg = 0;
  const imgScenesCount = script.scenes.filter(s => s.visual?.imageKeyword).length;

  const pexelsImagePromises = script.scenes.map((scene) =>
    limit(async () => {
      const kw = scene.visual?.imageKeyword;
      if (!kw) return { id: scene.id, success: false };
      const out = join(pexelsImgDir, `scene-${scene.id}.jpg`);
      if (existsSync(out)) {
        doneImg++;
        if (imgScenesCount > 0) log.progress(doneImg, imgScenesCount, "Images");
        return { id: scene.id, success: true, path: out };
      }
      const result = await fetchPexelsImage(kw, out, cfg.pexelsApiKey);
      doneImg++;
      if (imgScenesCount > 0) log.progress(doneImg, imgScenesCount, "Images");
      if (!result.success) {
        log.warn(`  scene ${scene.id}: Pexels image fetch failed (${result.reason})`);
      } else {
        log.info(`  scene ${scene.id}: Pexels image saved`);
      }
      return { id: scene.id, ...result };
    }),
  );

  const [imgResult, sceneAudio, sceneVideos, pexelsImages] = await Promise.all([
    imgPromise,
    Promise.all(sceneAudioPromises),
    Promise.all(videoPromises),
    Promise.all(pexelsImagePromises),
  ]);

  const videoPaths: Record<string, string> = {};
  sceneVideos.forEach(v => { if (v.success && v.path) videoPaths[v.id] = v.path; });

  const pexelsImagePaths: Record<string, string> = {};
  pexelsImages.forEach(p => { if (p.success && p.path) pexelsImagePaths[p.id] = p.path; });

  let bgImageRelPath: string | null = null;
  if (imgResult.success) {
    bgImageRelPath = "images/bg.jpg";
    log.ok(`Background image: ${script.metadata.source.domain}`);
  } else {
    log.warn(`Background image fetch failed: ${imgResult.reason} → using gradient fallback`);
  }

  // ── STEP 4: Concat voice + mix SFX layer ──────────────────────────────
  log.step(4, TOTAL_STEPS, "Concat voice + mix SFX layer");
  const voiceRawMp3 = join(outputDir, "voice-raw.mp3");
  const voiceMp3 = join(outputDir, "voice.mp3");
  await concatWithSilence(sceneAudio.map((a) => a.path), SCENE_GAP_SEC, voiceRawMp3);

  const sceneStarts: Record<string, number> = {};
  let cursor = 0;
  for (const a of sceneAudio) {
    sceneStarts[a.id] = cursor;
    cursor += a.durationSec + SCENE_GAP_SEC;
  }

  const sfxIndex = indexSfxLibrary(SFX_DIR);
  const indexCats = Object.keys(sfxIndex).length;
  const indexFiles = Object.values(sfxIndex).reduce((s, a) => s + a.length, 0);
  log.info(`  SFX library: ${indexFiles} files in ${indexCats} categories`);

  const sfxList: SfxMixSpec[] = [];
  for (const scene of script.scenes) {
    const startSec = sceneStarts[scene.id];
    if (scene.sfx) {
      if (scene.sfx.name === "none") {
        log.info(`  scene ${scene.id}: SFX disabled (explicit "none")`);
        continue;
      }
      const sfxPath = join(SFX_DIR, `${scene.sfx.name}.mp3`);
      if (existsSync(sfxPath)) {
        sfxList.push({ path: sfxPath, startSec: startSec + scene.sfx.startOffsetSec, volume: scene.sfx.volume });
        log.info(`  scene ${scene.id}: SFX override -> ${scene.sfx.name}.mp3`);
      } else {
        log.warn(`  scene ${scene.id}: explicit SFX not found, skipping: ${scene.sfx.name}.mp3`);
      }
      continue;
    }
    const picked = pickSfxForScene({
      voiceText: scene.voiceText,
      templateName: scene.templateData.template,
      sceneId: scene.id,
      index: sfxIndex,
    });
    if (!picked) {
      log.warn(`  scene ${scene.id}: no SFX available (empty library?)`);
      continue;
    }
    const sfxPath = join(SFX_DIR, picked.relPath);
    if (!existsSync(sfxPath)) {
      const allFiles = Object.values(sfxIndex).flat();
      const fallback = allFiles.find(f => existsSync(join(SFX_DIR, f)));
      if (fallback) {
        log.warn(`  scene ${scene.id}: SFX file missing (${picked.relPath}), using fallback: ${fallback}`);
        const playback = defaultPlayback(picked);
        sfxList.push({ path: join(SFX_DIR, fallback), startSec: startSec + playback.offsetSec, volume: playback.volume });
      } else {
        log.warn(`  scene ${scene.id}: SFX file missing and no fallback found, skipping`);
      }
      continue;
    }
    const playback = defaultPlayback(picked);
    sfxList.push({ path: sfxPath, startSec: startSec + playback.offsetSec, volume: playback.volume });
    const why = picked.source === "semantic"
      ? `semantic match "${picked.matchedKeyword}"`
      : picked.source;
    log.info(`  scene ${scene.id}: SFX -> ${picked.relPath} (${why})`);
  }
  log.info(`  mixing ${sfxList.length} SFX into voice.mp3`);
  await mixSfxOntoVoice(voiceRawMp3, sfxList, voiceMp3);

  const totalAudioSec = await getDurationSec(voiceMp3);
  log.ok(`voice.mp3 total: ${totalAudioSec.toFixed(2)}s (target: 55-65s)`);
  if (totalAudioSec < DURATION_MIN_SEC || totalAudioSec > DURATION_MAX_SEC) {
    log.warn(`Total duration ${totalAudioSec.toFixed(1)}s outside [${DURATION_MIN_SEC}, ${DURATION_MAX_SEC}]s tolerance — proceeding anyway`);
  }

  // ── STEP 5: Compose HTML + project files ──────────────────────────────
  log.step(5, TOTAL_STEPS, "Compose HTML + project files");
  const findBundledAvatar = (): string => {
    const baseDir = join(__dirname, "..", "assets");
    for (const ext of ["jpg", "jpeg", "png", "webp"]) {
      const p = join(baseDir, `avatar.${ext}`);
      if (existsSync(p)) return p;
    }
    throw new Error(`No bundled avatar found. Place an image at assets/avatar.{jpg,png,webp}`);
  };
  const bundledAvatar = findBundledAvatar();
  const ttAvatarExt = bundledAvatar.split(".").pop()!.toLowerCase();
  const ttAvatarFile = `tiktok-avatar.${ttAvatarExt}`;
  const ttAvatarOut = join(outputDir, ttAvatarFile);
  if (cfg.tiktok.avatarUrl) {
    const r = await fetchImage(cfg.tiktok.avatarUrl, ttAvatarOut);
    if (!r.success) {
      log.warn(`TikTok avatar download failed: ${r.reason} → falling back to bundled default`);
      await copyFile(bundledAvatar, ttAvatarOut);
    } else {
      log.ok(`TikTok avatar downloaded`);
    }
  } else {
    await copyFile(bundledAvatar, ttAvatarOut);
    log.info(`TikTok avatar: bundled default`);
  }

  const html = composeHtml({
    script,
    sceneAudio: sceneAudio.map((a) => ({ id: a.id, durationSec: a.durationSec })),
    gapSec: SCENE_GAP_SEC,
    bgImageRelPath,
    audioRelPath: "voice.mp3",
    tiktok: cfg.tiktok,
    tiktokAvatarRelPath: ttAvatarFile,
    videoPaths,
    pexelsImagePaths,
    outroHoldSec: OUTRO_HOLD_SEC,
  });
  await writeFile(join(outputDir, "index.html"), html);
  await writeFile(join(outputDir, "hyperframes.json"), JSON.stringify(HYPERFRAMES_CONFIG, null, 2));
  const slug = basename(outputDir);
  await writeFile(join(outputDir, "meta.json"), JSON.stringify({
    id: slug,
    name: script.metadata.title,
    createdAt: new Date().toISOString(),
  }, null, 2));
  await copyFile(join(TPL_DIR, "styles.css"), join(outputDir, "styles.css"));
  await copyFile(join(TPL_DIR, "animations.js"), join(outputDir, "animations.js"));
  log.ok(`HTML + project files written to ${outputDir}`);

  // ── STEP 6: Render with Hyperframes + composite Pexels videos ────────
  log.step(6, TOTAL_STEPS, "Render with Hyperframes + composite Pexels videos");
  const videoPath = join(outputDir, "video.mp4");
  await renderWithHyperframes({ compositionDir: outputDir, outputPath: videoPath });
  log.ok(`Hyperframes render complete`);

  const footageScenes = script.scenes
    .filter(s => videoPaths[s.id])
    .map(s => ({
      id: s.id,
      path: videoPaths[s.id],
      start: sceneStarts[s.id],
      dur: (sceneAudio.find(a => a.id === s.id)!.durationSec + SCENE_GAP_SEC),
    }));

  if (footageScenes.length > 0) {
    log.info(`  Compositing ${footageScenes.length} Pexels video(s) via ffmpeg...`);
    const tmpPath = join(outputDir, "video-tmp.mp4");
    const inputs = ["-i", videoPath];
    footageScenes.forEach(bv => { inputs.push("-i", bv.path); });
    const esc = (n: number) => n.toFixed(2);
    const f: string[] = [];
    f.push("[0:v]chromakey=0xFF00FF:similarity=0.3:blend=0.05[ui]");
    footageScenes.forEach((bv, idx) => {
      const vi = idx + 1;
      f.push(
        "[" + vi + ":v]scale=1080:1920:force_original_aspect_ratio=increase," +
        "crop=1080:1920:0:ih/2-960," +
        "trim=0:" + esc(bv.dur) + ",setpts=PTS-STARTPTS+" + esc(bv.start) + "/TB[vin" + idx + "]"
      );
    });
    f.push("[0:v]scale=1080:1920,geq=0:0:0[black]");
    if (footageScenes.length === 1) {
      const bv = footageScenes[0];
      f.push("[black][vin0]overlay=enable='between(t," + esc(bv.start) + "," + esc(bv.start + bv.dur) + ")'[footage]");
    } else {
      footageScenes.forEach((bv, idx) => {
        if (idx === 0) {
          f.push("[black][vin0]overlay=enable='between(t," + esc(bv.start) + "," + esc(bv.start + bv.dur) + ")'[fmid0]");
        } else if (idx < footageScenes.length - 1) {
          f.push("[fmid" + (idx - 1) + "][vin" + idx + "]overlay=enable='between(t," + esc(bv.start) + "," + esc(bv.start + bv.dur) + ")'[fmid" + idx + "]");
        } else {
          f.push("[fmid" + (idx - 1) + "][vin" + idx + "]overlay=enable='between(t," + esc(bv.start) + "," + esc(bv.start + bv.dur) + ")'[footage]");
        }
      });
    }
    // Apply vignette darkening to footage layer (since HTML overlay is skipped for video scenes)
    f.push("[footage]drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill[footage_dark]");
    f.push("[footage_dark][ui]overlay=format=auto[out]");
    const filterGraph = f.join("; ");
    log.info(`  ffmpeg filter: ${filterGraph}`);
    await new Promise<void>((resolve, reject) => {
      const args = [
        ...inputs,
        "-filter_complex", filterGraph,
        "-map", "[out]",
        "-map", "0:a",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-c:a", "aac",
        "-shortest",
        "-y",
        tmpPath,
      ];
      const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
      // We pipe stderr to capture errors if needed, but we don't print the progress lines
      let stderr = "";
      proc.stderr.on("data", (data) => { stderr += data.toString(); });
      
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ffmpeg failed (code ${code}):\n${stderr.slice(-500)}`));
      });
      proc.on("error", reject);
    });
    const { unlink, rename } = await import("node:fs/promises");
    await unlink(videoPath);
    await rename(tmpPath, videoPath);
    log.ok(`Video composited with ${footageScenes.length} Pexels footage(s)`);
  }

  // ── STEP 7: Done ────────────────────────────────────────────────────────
  log.step(7, TOTAL_STEPS, "Done");
  log.done(`Video ready: ${script.metadata.title}`);

  const finalWordCount = script.scenes.reduce((n, s) => n + s.voiceText.split(/\s+/).filter(Boolean).length, 0);
  console.log(`\n  ${log.ansi.bold}Video:${log.ansi.reset}  [video.mp4](output/${slug}/video.mp4)`);
  console.log(`  ${log.ansi.bold}Audio:${log.ansi.reset}  [voice.mp3](output/${slug}/voice.mp3)  — cho CapCut`);
  console.log(`  ${log.ansi.bold}Script:${log.ansi.reset} [script.txt](output/${slug}/script.txt) — cho CapCut auto-caption`);
  console.log(`  ${log.ansi.bold}Thời lượng:${log.ansi.reset} ${totalAudioSec.toFixed(2)}s  (${finalWordCount} từ)`);
  console.log();
}
