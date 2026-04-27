// app/api/fetch-website/route.js
// Server-side only — fetches and extracts homepage text content for AI context

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url || !url.trim()) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    // Normalise URL — add https:// if missing
    let parsedUrl;
    try {
      const normalised = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
      parsedUrl = new URL(normalised);
    } catch {
      return Response.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch homepage with a browser-like user agent and 8s timeout
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Predicta-Discovery/1.0; +https://predicta.au)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return Response.json({ error: `Website returned ${response.status}` }, { status: 400 });
    }

    const html = await response.text();

    // Strip scripts, styles, and all HTML tags — keep readable text only
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4000); // Cap at 4000 chars to keep tokens manageable

    return Response.json({ content: text, url: parsedUrl.toString() });
  } catch (error) {
    console.error("fetch-website error:", error);
    // Return gracefully — website fetch is optional, don't block the flow
    return Response.json({ error: error.message }, { status: 500 });
  }
}
