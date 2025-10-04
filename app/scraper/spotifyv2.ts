import axios from "axios";
import * as cheerio from "cheerio";

export default async function scrapeSpotify(url: string, turnstileToken: string) {
  const home = await axios.get("https://spotimate.io/");
  const $ = cheerio.load(home.data);
  const tokenInput = $("input[type='hidden']").filter((i, el) => $(el).attr("name")?.startsWith("_"));
  const tokenName = tokenInput.attr("name")!;
  const tokenValue = tokenInput.val()!;

  const cookies = home.headers["set-cookie"] || [];
  const sessionData = cookies.find((c) => c.startsWith("session_data="))?.split(";")[0].split("=")[1] || "";

  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).slice(2);
  const body = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="url"`, "",
    url,
    `--${boundary}`,
    `Content-Disposition: form-data; name="${tokenName}"`, "",
    tokenValue,
    `--${boundary}`,
    `Content-Disposition: form-data; name="cf-turnstile-response"`, "",
    turnstileToken,
    `--${boundary}--`, "",
  ].join("\r\n");

  const res = await axios.post("https://spotimate.io/action", body, {
    headers: {
      "content-type": `multipart/form-data; boundary=${boundary}`,
      cookie: `session_data=${sessionData}`,
      referer: "https://spotimate.io/",
    },
  });

  const $$ = cheerio.load(res.data.html || res.data);
  const songTitle = $$("h3 div").text().trim();
  const artist = $$("p span").text().trim();
  const coverImage = $$("img").first().attr("src");

  const mp3Link = $$("a")
    .filter((i, el) => /\/dl\?token=/.test($$(el).attr("href") || "") && /Download Mp3/i.test($$(el).text()))
    .first()
    .attr("href");

  const coverLink = $$("a")
    .filter((i, el) => /\/dl\?token=/.test($$(el).attr("href") || "") && /Download Cover/i.test($$(el).text()))
    .first()
    .attr("href");

  let spotifyMeta: any = {};
  try {
    const og = await axios.get(url);
    const $$$ = cheerio.load(og.data);
    spotifyMeta = {
      title: $$$('meta[property="og:title"]').attr("content") || "",
      description: $$$('meta[property="og:description"]').attr("content") || "",
      image: $$$('meta[property="og:image"]').attr("content") || "",
      url: $$$('meta[property="og:url"]').attr("content") || url,
    };
  } catch {}

  return {
    url: spotifyMeta.url || url,
    title: spotifyMeta.title || songTitle,
    description: spotifyMeta.description || "",
    songTitle,
    artist,
    coverImage: spotifyMeta.image || coverImage,
    mp3DownloadLink: mp3Link ? `https://spotimate.io${mp3Link}` : null,
    coverDownloadLink: coverLink ? `https://spotimate.io${coverLink}` : null,
  };
}
