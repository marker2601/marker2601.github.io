import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("publishes a complete employer-facing portfolio", async () => {
  const html = await read("index.html");

  assert.match(html, /<title>Jagadeesh Gorla \| AI, Systems &amp; Operations<\/title>/);
  assert.match(html, /I turn messy work into[\s\S]*reliable systems\./);
  assert.match(html, /id="proof"/);
  assert.match(html, /id="method"/);
  assert.match(html, /id="experience"/);
  assert.match(html, /id="interfere"/);
  assert.match(html, /id="contact"/);
});

test("separates delivered work, prototypes, active builds, and future theses", async () => {
  const html = await read("index.html");

  for (const status of [
    "Public build",
    "Live deployment",
    "Delivered",
    "Working prototype",
    "In progress",
    "Future thesis",
  ]) {
    assert.match(html, new RegExp(status, "i"), `missing status: ${status}`);
  }
});

test("indexes verified live Vercel projects in one place", async () => {
  const html = await read("index.html");

  for (const [name, url] of [
    ["Evolv", "https://evolv-platform.vercel.app/"],
    ["Zara Scout Live", "https://zara-scout-live.vercel.app/"],
    ["ParaView Visualization Portfolio", "https://pareview-project-loader.vercel.app/"],
    ["Live QA tracker service", "https://vercel-tracker-proxy.vercel.app/"],
  ]) {
    assert.match(html, new RegExp(name));
    assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("provides accessible project filtering controls", async () => {
  const html = await read("index.html");
  const script = await read("script.js");

  assert.match(html, /aria-label="Filter project index"/);
  assert.match(html, /data-filter="live"/);
  assert.match(html, /data-project-status="live"/);
  assert.match(script, /aria-pressed/);
  assert.match(script, /hidden/);
});

test("links public proof to the authenticated GitHub account", async () => {
  const html = await read("index.html");

  for (const url of [
    "https://github.com/marker2601/splunk-ai-incident-copilot",
    "https://github.com/marker2601/Utility_hub",
    "https://github.com/marker2601",
  ]) {
    assert.match(html, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("contains no unfinished placeholders", async () => {
  const html = await read("index.html");

  assert.doesNotMatch(html, /\b(?:TODO|TBD|PLACEHOLDER|LOREM IPSUM)\b/i);
  assert.doesNotMatch(html, /href=["']#["']/i);
});

test("includes responsive and reduced-motion behavior", async () => {
  const css = await read("styles.css");

  assert.match(css, /@media \(max-width: 900px\)/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});
