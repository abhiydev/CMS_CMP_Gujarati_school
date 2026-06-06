import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const BASE_URL = "https://cmpgujaratischool.com/";
const PAGES = {
  home: "",
  about: "about.html",
  staff: "staff.html",
  gallery: "gallery.html",
};
const OUTPUT_JSON = "school-data.json";
const ASSETS_DIR = "assets";
const CONTACT_REGEX = {
  phone: /\b(?:\d{2,4}[\s/-]*)?\d{6,8}\b/g,
  email: /[\w.-]+@[\w.-]+/g,
};
const IMAGE_SAFE = /[^A-Za-z0-9_.-]+/g;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeUrl(base, url) {
  if (url === null || url === undefined) return "";
  const normalized = url.trim();
  if (!normalized) return base;
  return new URL(normalized, base).toString();
}

function safeFilename(url) {
  const parsed = new URL(url, BASE_URL);
  const basename = path.basename(parsed.pathname) || "asset";
  return basename.replace(IMAGE_SAFE, "_");
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

function extractTextSections($) {
  const sections = [];
  $("section, article, div").each((_, el) => {
    const heading = $(el).find("h1, h2, h3, h4").first().text().trim();
    const paragraphs = [];
    $(el)
      .find("p, li")
      .each((_, p) => {
        const text = $(p).text().trim();
        if (text) paragraphs.push(text);
      });
    if (paragraphs.length) {
      sections.push({ heading: heading || null, text: paragraphs.join(" \n ") });
    }
  });
  return sections;
}

function extractImages($, baseUrl) {
  const images = [];
  $("img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src");
    if (!src) return;
    images.push({ src: normalizeUrl(baseUrl, src), alt: ($(img).attr("alt") || "").trim() });
  });
  return images;
}

function extractLogoImages(images) {
  return images.filter((image) => /logo/i.test(image.src) || /logo/i.test(image.alt));
}

function extractContactInfo($) {
  const text = $("body").text();
  const phones = new Set();
  const emails = new Set();
  let match;
  while ((match = CONTACT_REGEX.phone.exec(text))) {
    phones.add(match[0].trim());
  }
  while ((match = CONTACT_REGEX.email.exec(text))) {
    emails.add(match[0].trim());
  }
  const addresses = [];
  $("address").each((_, el) => {
    const addr = $(el).text().replace(/\s+/g, " ").trim();
    if (addr) addresses.push(addr);
  });
  if (!addresses.length) {
    $("body").find("*:contains('Indore'):contains('India'):contains('Road')").each((_, el) => {
      const candidate = $(el).text().replace(/\s+/g, " ").trim();
      if (candidate && !addresses.includes(candidate)) {
        addresses.push(candidate);
      }
    });
  }
  return { phones: Array.from(phones), emails: Array.from(emails), addresses };
}

function extractFeatures($) {
  const items = [];
  $(".thumbnail .caption h3 a, .thumbnail .caption h3, .promo-content p, .feature .text, .team .thumb-caption h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) items.push(text);
  });
  return items;
}

function extractPrincipalMessages($) {
  const keywords = ["प्रधानाध्यापिका", "सन्देश", "हेड मिस्ट्रेस", "message", "chairman"];
  const messages = [];
  $("h1, h2, h3, h4").each((_, el) => {
    const heading = $(el).text().trim();
    if (!heading) return;
    const lower = heading.toLowerCase();
    if (keywords.some((word) => lower.includes(word.toLowerCase()))) {
      const content = [];
      let sibling = $(el).next();
      while (sibling.length && !/^h[1-4]$/i.test(sibling[0].name)) {
        if (["p", "blockquote", "div"].includes(sibling[0].name)) {
          const text = sibling.text().trim();
          if (text) content.push(text);
        }
        sibling = sibling.next();
      }
      if (content.length) {
        messages.push({ heading, message: content.join(" \n ") });
      }
    }
  });
  return messages;
}

function extractGalleryImages($, baseUrl) {
  const images = new Set();
  $("a.lightbox").each((_, el) => {
    const href = $(el).attr("href");
    if (href) images.add(normalizeUrl(baseUrl, href));
  });
  if (!images.size) {
    $(".grid-gallery img, .team img, .gallery img").each((_, img) => {
      const src = $(img).attr("src");
      if (src) images.add(normalizeUrl(baseUrl, src));
    });
  }
  return Array.from(images);
}

async function downloadAsset(url, outputDir) {
  const filename = safeFilename(url);
  const filePath = path.join(outputDir, filename);
  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) {
      console.warn(`Warning: failed to download ${url} (${response.status})`);
      return null;
    }
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));
    return filePath;
  } catch (error) {
    console.warn(`Warning: could not download ${url}: ${error.message}`);
    return null;
  }
}

async function scrapePage(key, pagePath) {
  const url = normalizeUrl(BASE_URL, pagePath);
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const images = extractImages($, url);
  return {
    url,
    title: $("title").text().trim() || null,
    text_sections: extractTextSections($),
    images,
    logos: extractLogoImages(images),
    contacts: extractContactInfo($),
    facilities: key === "home" ? extractFeatures($) : undefined,
    achievements: key === "home" ? extractFeatures($) : undefined,
    principal_messages: key === "about" ? extractPrincipalMessages($) : undefined,
    gallery_images: key === "gallery" ? extractGalleryImages($, url) : undefined,
  };
}

function unifyContactEntries(entries) {
  const phones = new Set();
  const emails = new Set();
  const addresses = [];
  entries.forEach((entry) => {
    entry.phones?.forEach((phone) => phones.add(phone));
    entry.emails?.forEach((email) => emails.add(email));
    entry.addresses?.forEach((addr) => {
      if (!addresses.includes(addr)) addresses.push(addr);
    });
  });
  return { phones: Array.from(phones), emails: Array.from(emails), addresses };
}

async function main() {
  const pages = {};
  const contactEntries = [];
  const allImages = new Set();
  let galleryImages = [];

  for (const [key, pagePath] of Object.entries(PAGES)) {
    const page = await scrapePage(key, pagePath);
    pages[key] = page;
    contactEntries.push(page.contacts);
    page.images.forEach((img) => allImages.add(img.src));
    if (key === "gallery") {
      galleryImages = page.gallery_images ?? [];
    }
  }

  const schoolData = {
    site_title: pages.home?.title || null,
    base_url: BASE_URL,
    pages,
    contacts: unifyContactEntries(contactEntries),
    logos: Array.from(new Set(pages.home.logos.concat(pages.about?.logos || [], pages.staff?.logos || [], pages.gallery?.logos || []).map((logo) => JSON.stringify(logo))))
      .map((json) => JSON.parse(json)),
    facilities: pages.home?.facilities || [],
    achievements: pages.home?.achievements || [],
    principal_messages: pages.about?.principal_messages || [],
    gallery_images: galleryImages,
  };

  await fs.writeFile(path.join(__dirname, OUTPUT_JSON), JSON.stringify(schoolData, null, 2), "utf8");
  console.log(`Saved extracted data to ${OUTPUT_JSON}`);

  await fs.mkdir(path.join(__dirname, ASSETS_DIR), { recursive: true });
  const assetUrls = new Set([...allImages, ...galleryImages]);
  const downloaded = [];
  for (const url of assetUrls) {
    const saved = await downloadAsset(url, path.join(__dirname, ASSETS_DIR));
    if (saved) downloaded.push(saved);
  }
  console.log(`Downloaded ${downloaded.length} asset files into ${ASSETS_DIR}/`);
}

main().catch((error) => {
  console.error("Scraper failed:", error);
  process.exit(1);
});
