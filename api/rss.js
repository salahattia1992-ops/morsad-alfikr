export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();

    // Parse XML manually
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
      const item = match[1];
      const getTag = (tag) => {
        const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i"));
        return m ? (m[1] || m[2] || "").trim() : "";
      };
      const title = getTag("title");
      const link = getTag("link") || item.match(/<link[^>]*href="([^"]+)"/i)?.[1] || "";
      const description = getTag("description").replace(/<[^>]+>/g, "").slice(0, 400);
      const pubDate = getTag("pubDate") || getTag("dc:date") || getTag("published") || "";
      if (title) items.push({ title, link, description, pubDate });
    }

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: err.message, items: [] });
  }
}
