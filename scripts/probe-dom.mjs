/** One-off structural probe: block nesting, console errors, and route headings. */
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error" && !m.text().includes("_next/hmr")) errors.push(m.text());
});

await page.goto("http://127.0.0.1:3456/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);

const structure = await page.evaluate(() => {
  const main = document.querySelector("main");
  const chain = [];
  let n = main;
  for (let i = 0; i < 4 && n; i++) {
    chain.push(`${n.tagName}.${(n.className || "").toString().slice(0, 34)} kids=${n.children.length}`);
    n = n.children[0];
  }
  let host = main;
  while (host && host.children.length === 1) host = host.children[0];
  return {
    chain,
    hostChildren: [...(host?.children || [])].map((e) => e.tagName).join(","),
    directSections: document.querySelectorAll("main > section").length,
    anySections: document.querySelectorAll("main section").length,
  };
});

console.log("chain:", structure.chain.join("  >  "));
console.log("hostChildren:", structure.hostChildren);
console.log("main>section:", structure.directSections, " main section:", structure.anySections);
console.log("console errors:", errors.length);
for (const e of [...new Set(errors)].slice(0, 6)) console.log("  -", e.slice(0, 150));

const routes = ["/catalogue", "/products/semaglutide", "/calculator", "/journal", "/terms", "/search", "/enquiry"];
console.log("\nroute h1 text:");
for (const r of routes) {
  try {
    await page.goto(`http://127.0.0.1:3456${r}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(900);
    const h1 = await page.evaluate(() => {
      const el = document.querySelector("main h1") || document.querySelector("h1");
      return el ? el.textContent.trim().replace(/\s+/g, " ").slice(0, 56) : "(none)";
    });
    console.log(`  ${r.padEnd(24)} ${h1}`);
  } catch (e) {
    console.log(`  ${r.padEnd(24)} FAILED ${e.message.slice(0, 50)}`);
  }
}

await browser.close();
