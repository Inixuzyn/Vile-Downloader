import axios from "axios";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

class TikTokScraper {
  private genericUserAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  private async getInitialCookies() {
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar, withCredentials: true }));
    const headers = {
      "User-Agent": this.genericUserAgent,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Cache-Control": "max-age=0",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };
    await client.get("https://www.tiktok.com/", { headers });
    return { jar, client, headers };
  }

  private async getDownloadLinks(URL: string) {
    const home = await axios.get("https://musicaldown.com/en", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      },
    });
    const $ = cheerio.load(home.data);
    const url_name = $("#link_url").attr("name")!;
    const token_name = $("#submit-form input[type=hidden]").eq(0).attr("name")!;
    const token_value = $("#submit-form input[type=hidden]").eq(0).val()!;
    const verify = $("#submit-form input[type=hidden]").eq(1).val()!;

    const payload = new URLSearchParams({
      [url_name]: URL,
      [token_name]: token_value,
      verify,
    });

    const res = await axios.post("https://musicaldown.com/download", payload, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        cookie: home.headers["set-cookie"]?.join("; "),
        referer: "https://musicaldown.com/en",
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      },
    });

    const ch = cheerio.load(res.data);
    const result: any = { video: [], audio: null, photo: [] };

    const pushIfJWT = (sel: string, key: "video" | "audio") => {
      const href = ch(sel).attr("href");
      if (!href || !href.includes("token=")) return;
      const decoded = this.decodeJWT(href.split("token=")[1]);
      if (!decoded) return;
      if (key === "video") result.video.push(decoded.url);
      if (key === "audio") result.audio = decoded.url;
    };

    pushIfJWT('a[data-event="hd_download_click"]', "video");
    pushIfJWT('a[data-event="mp4_download_click"]', "video");
    pushIfJWT('a[data-event="mp3_download_click"]', "audio");

    ch(".card-action.center a").each((_, el) => {
      const href = ch(el).attr("href");
      if (!href?.includes("token=")) return;
      const decoded = this.decodeJWT(href.split("token=")[1]);
      if (decoded?.cover) result.photo.push(decoded.cover);
    });

    return result;
  }

  async scrape(input: string) {
    const { client, headers } = await this.getInitialCookies();
    const first = await client.get(input, { headers, maxRedirects: 0, validateStatus: () => true });
    let redirect = first.headers.location || input;
    if (redirect.includes("/photo/")) redirect = redirect.replace("/photo/", "/video/");
    const { data: html } = await client.get(redirect, { headers, maxRedirects: 10 });

    if (!html.includes("__UNIVERSAL_DATA_FOR_REHYDRATION__")) throw new Error("data_not_found");
    const json = html.split('<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1].split("</script>")[0];
    const data = JSON.parse(json);
    const vid = data["__DEFAULT_SCOPE__"]["webapp.video-detail"];
    if (!vid) throw new Error("detail_not_found");
    if (vid.statusMsg) throw new Error("post.unavailable");
    const item = vid.itemInfo.itemStruct;
    const download = await this.getDownloadLinks(input);

    return {
      metadata: {
        stats: {
          likeCount: item.stats.diggCount,
          playCount: item.stats.playCount,
          commentCount: item.stats.commentCount,
          shareCount: item.stats.shareCount,
        },
        title: item.imagePost?.title || "",
        description: item.desc,
        hashtags: item.textExtra.filter((x: any) => x.type === 1).map((x: any) => x.hashtagName),
        locationCreated: item.locationCreated,
        suggestedWords: item.suggestedWords,
      },
      download,
      postId: item.id,
    };
  }
}

export default async function scrapeTiktokV2(url: string) {
  const scraper = new TikTokScraper();
  return await scraper.scrape(url);
  }
  
