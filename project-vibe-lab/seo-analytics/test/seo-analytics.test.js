import test from "node:test";
import assert from "node:assert/strict";
import {
  SEO_EVIDENCE,
  auditSeo,
  buildAiPrompt,
  buildLaunchChecklist,
  buildMetadata,
  buildRobots,
  buildSeoBrief,
  buildSitemap,
  listAnalyticsEvents
} from "../src/seo-analytics.js";

test("brief keeps SEO demo away from real analytics token and ranking claims", () => {
  const brief = buildSeoBrief();

  assert.equal(brief.article, 24);
  assert.ok(brief.outOfScope.includes("不接真实统计平台 token"));
  assert.ok(brief.outOfScope.includes("不承诺搜索引擎立即收录"));
});

test("metadata includes title description and OG tags for each page", () => {
  const metadata = buildMetadata({ origin: "efficiency.example.com" });

  assert.equal(metadata.length, 3);
  assert.equal(metadata[0].url, "https://efficiency.example.com");
  assert.ok(metadata.every((page) => page.tags["og:title"]));
  assert.ok(metadata.every((page) => page.description.length > 0));
  assert.ok(metadata.every((page) => page.tags["og:url"] === page.url));
});

test("robots allows public pages but blocks api and admin", () => {
  const robots = buildRobots({ origin: "https://efficiency.example.com/" });

  assert.ok(robots.includes("Allow: /"));
  assert.ok(robots.includes("Disallow: /api/"));
  assert.ok(robots.includes("Sitemap: https://efficiency.example.com/sitemap.xml"));
});

test("sitemap contains escaped urls and page priorities", () => {
  const sitemap = buildSitemap({ origin: "https://efficiency.example.com" });

  assert.equal(sitemap.urls.length, 3);
  assert.match(sitemap.xml, /<urlset/);
  assert.ok(sitemap.xml.includes("<loc>https://efficiency.example.com</loc>"));
  assert.ok(sitemap.urls.some((url) => url.priority === 1.0));
});

test("analytics events avoid collecting raw sensitive inputs", () => {
  const events = listAnalyticsEvents();

  assert.equal(events.length, 4);
  assert.ok(events.some((event) => event.name === "plan_generate"));
  assert.ok(events.every((event) => event.risk.length > 0));
  assert.ok(events.every((event) => !event.payload.includes("phone")));
  assert.ok(events.every((event) => !event.payload.includes("email")));
  assert.ok(events.every((event) => !event.payload.includes("raw_input")));
});

test("audit blocks public traffic when sitemap privacy or analytics evidence is missing", () => {
  const audit = auditSeo({ evidence: ["custom-domain", "https", "title-description"] });

  assert.equal(audit.status, "blocked");
  assert.ok(audit.missing.includes("sitemap-xml"));
  assert.ok(audit.missing.includes("privacy-page"));
  assert.ok(audit.missing.includes("analytics-events"));
});

test("audit allows public traffic only when every evidence item exists", () => {
  const audit = auditSeo({ evidence: SEO_EVIDENCE });

  assert.equal(audit.status, "ready-for-public-traffic");
  assert.equal(audit.missing.length, 0);
});

test("launch checklist covers domain metadata crawl privacy and analytics", () => {
  const checklist = buildLaunchChecklist();

  assert.deepEqual(checklist.map((item) => item.id), ["domain", "metadata", "crawl", "privacy", "analytics"]);
  assert.ok(checklist.every((item) => item.evidence.length >= 1));
});

test("AI prompt asks for SEO and analytics audit without real tracking token", () => {
  const prompt = buildAiPrompt({ origin: "efficiency.example.com" });

  assert.match(prompt, /https:\/\/efficiency.example.com/);
  assert.match(prompt, /robots.txt/);
  assert.match(prompt, /sitemap.xml/);
  assert.match(prompt, /不要接入真实统计平台 token/);
});
