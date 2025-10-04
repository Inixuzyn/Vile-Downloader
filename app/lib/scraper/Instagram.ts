import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

function transformResponse(apiResponse: any) {
  if (!apiResponse) return [];
  const items = Array.isArray(apiResponse) ? apiResponse : [apiResponse];
  return items
    .map((item) => ({
      thumbnail: item.thumb || "",
      url: (item.url && Array.isArray(item.url) && item.url[0]?.url) || "",
    }))
    .filter((item) => item.url);
}

async function tryFastdl(url: string) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  return new Promise<any[]>(async (resolve, reject) => {
    let done = false;
    page.on("response", async (res) => {
      if (done || !res.url().includes("/api/convert")) return;
      try {
        const data = await res.json();
        resolve(transformResponse(data));
        done = true;
        await browser.close();
      } catch (e) {
        await browser.close();
        reject(e);
      }
    });
    await page.setRequestInterception(true);
    page.on("request", (req) => (["image", "stylesheet", "font"].includes(req.resourceType()) ? req.abort() : req.continue()));
    await page.goto("https://fastdl.app/id", { waitUntil: "domcontentloaded" });
    await page.type("#search-form-input", url);
    await page.click(".search-form__button");
    setTimeout(async () => {
      if (!done) {
        await browser.close();
        reject(new Error("timeout"));
      }
    }, 30000);
  });
}

async function tryIgram(url: string) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  return new Promise<any[]>(async (resolve, reject) => {
    let done = false;
    page.on("response", async (res) => {
      if (done || !res.url().includes("/api/convert")) return;
      try {
        const data = await res.json();
        resolve(transformResponse(data));
        done = true;
        await browser.close();
      } catch (e) {
        await browser.close();
        reject(e);
      }
    });
    await page.setRequestInterception(true);
    page.on("request", (req) => (["image", "stylesheet", "font"].includes(req.resourceType()) ? req.abort() : req.continue()));
    await page.goto("https://igram.world/id/", { waitUntil: "networkidle2" });
    await page.type("#search-form-input", url);
    await page.click(".search-form__button");
    setTimeout(async () => {
      if (!done) {
        await browser.close();
        reject(new Error("timeout"));
      }
    }, 30000);
  });
}

export default async function downloadInstagram(url: string) {
  try {
    return await tryFastdl(url);
  } catch {
    return await tryIgram(url);
  }
}
