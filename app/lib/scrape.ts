// lib/scrape.ts
import scrapeTiktokV2 from "@/scraper/tiktokv2";   // taruh file scrapemu ke folder scraper
import downloadInstagram from "@/scraper/instagram";
import scrapeSpotify from "@/scraper/spotifyv2";

export { scrapeTiktokV2 as tiktok };
export { downloadInstagram as igdl };
export { scrapeSpotify as spotify };
