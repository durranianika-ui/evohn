#!/usr/bin/env node
/**
 * Prepare the supplied brand film for the homepage hero band.
 *
 * WHY THIS EXISTS
 * ---------------
 * The film is delivered as a phone-camera-container MOV straight out of the
 * generator that produced it, and three things in that file make it unusable
 * as a hero background. Each is fixed once, here, at prepare time, so the
 * component can point at a plain `<video>` source and the correction is
 * recorded rather than folded silently into a binary.
 *
 * 1. A CAPCUT WATERMARK sits in the upper-left corner. Measured off the
 *    source frames (1080x720) it occupies x 33-240 and y 33-75 — 3.1%-22.2%
 *    of the frame's width. The previous hero footage carried a mark small
 *    enough (8.1% of width) for the hero CTA to cover; this one is nearly
 *    three times as wide and no button can sit over it without reading as a
 *    patch. `delogo` was tried and rejected: it reconstructs cleanly over the
 *    plain white scenes and smears the dark bubble edge that crosses the box
 *    in the oil-macro shot. So the mark is CROPPED out instead.
 *
 * 2. A 16px BLACK BAR is baked into the top of the oil-macro clip — present
 *    from 1.5s to 14.5s, absent everywhere else, so it reads as a strip that
 *    blinks on and off behind the fixed header. The same crop removes it.
 *
 *    Cropping 80 rows off the top clears both, at the cost of 11% of the
 *    frame height and a ratio change from 3:2 to 27:16 (1.6875). Nothing is
 *    lost from the compositions: every shot is centred, and the top of the
 *    frame is empty background in all of them.
 *
 * 3. THE TAIL, from 25.25s, is wrong for a LOOPING band in two ways. The
 *    closing wide-pen shot renders the regulatory line on the label as "FOR
 *    REREARCH USE ONLY" — a generator typo, unique to that shot; every other
 *    pen shot spells it correctly. And behind it is a static EVOHN end card,
 *    which is a title card for a linear edit, not a loop: it collides with
 *    the h1 that sits over the film, washes the white headline out for three
 *    seconds, and at the phone's 4:5 crop (which shows the middle 47% of the
 *    frame) clips the wordmark to "VOH". The film is cut before both. The
 *    loop-out is the amber serum macro, which cuts back to the opening pen
 *    macro cleanly.
 *
 * ENCODE
 * ------
 * H.264 High at CRF 16, which is visually transparent against a 5.2 Mbit
 * HEVC source, in an MP4 that every browser can decode — the delivered HEVC
 * plays in Safari and nowhere else. No scaling: the source is 1080 wide and
 * upscaling it would add bytes, not detail. Audio is dropped, since the hero
 * video element is muted. The mixed 30/60fps source is normalised to CFR 60
 * so the 60fps passages don't judder; duplicated frames cost almost nothing.
 *
 * Usage:  node scripts/prepare-hero-film.mjs <source.mov> [--dry]
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/** Rows taken off the top: clears both the watermark and the black bar. */
const CROP = { w: 1080, h: 640, x: 0, y: 80 };
/** Cut before the misspelled label shot and the static end card. */
const DURATION = 25.25;

const OUT_VIDEO = "public/editorial/hero-film.mp4";
const OUT_POSTER = "public/editorial/hero-film-poster.jpg";

const source = process.argv[2];
const dry = process.argv.includes("--dry");

if (!source || !existsSync(source)) {
  console.error("Usage: node scripts/prepare-hero-film.mjs <source.mov> [--dry]");
  process.exit(1);
}

const video = path.resolve(OUT_VIDEO);
const poster = path.resolve(OUT_POSTER);

const encode = [
  "-v", "error", "-stats",
  "-i", source,
  "-an",
  "-t", String(DURATION),
  "-vf", `crop=${CROP.w}:${CROP.h}:${CROP.x}:${CROP.y}`,
  "-r", "60", "-fps_mode", "cfr",
  "-c:v", "libx264", "-preset", "veryslow", "-crf", "16",
  "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p",
  "-x264-params", "ref=5:bframes=5:aq-mode=3",
  "-movflags", "+faststart",
  video, "-y",
];

// The poster is the film's own first frame, so a visitor who has asked for
// reduced motion — or arrives on a metered connection — sees the identical
// composition the film opens on rather than a different photograph.
const still = ["-v", "error", "-i", video, "-frames:v", "1", "-q:v", "2", poster, "-y"];

if (dry) {
  console.log("ffmpeg " + encode.join(" "));
  console.log("ffmpeg " + still.join(" "));
  process.exit(0);
}

for (const args of [encode, still]) {
  const run = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (run.status !== 0) {
    console.error("ffmpeg failed");
    process.exit(run.status ?? 1);
  }
}

console.log(`  ${OUT_VIDEO}`);
console.log(`  ${OUT_POSTER}`);
