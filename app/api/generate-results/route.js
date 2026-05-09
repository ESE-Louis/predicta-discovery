// app/api/generate-results/route.js

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert AI revenue strategist with deep knowledge of how AI is being applied across industries globally to generate new revenue. Analyse this self-serve discovery to identify where AI can generate NEW revenue — not reduce costs or headcount. The person completed this themselves.

Use the industry and geography context provided to make your analysis sharper and more credible:
- Reference what businesses in their industry are actually doing with AI to grow revenue (real patterns, not generic advice)
- Factor in geography — maturity of AI adoption, regulatory environment, market dynamics, and local competitive context
- Benchmark opportunities against what is realistic and proven for their industry/region combination
- Use industry-specific language and revenue models (e.g. for Financial Services: AUM, FUA, BDM capacity; for SaaS: ARR, NRR, expansion revenue; for Professional Services: utilisation, project pipeline, retainer conversion)

Return ONLY valid JSON. No preamble, no markdown fences.

{
  "executiveSummary": "2-3 sentences synthesising the most important revenue insight. Reference specific things they said AND their industry/geography context. Address them directly as 'you'. Be concrete.",
  "opportunities": [
    {
      "title": "Short punchy opportunity name (4-7 words)",
      "type": "New Revenue | Revenue Recovery | Market Expansion | Retention & Expansion",
      "score": <integer 60-95>,
      "headline": "One sentence capturing the opportunity in their language, addressing them as 'you'",
      "description": "2-3 sentences explaining what the AI solution looks like and why it fits their situation. Reference specifics from their answers AND industry context. Use 'you/your'.",
      "immediacy": "One sentence on why now is the right moment — reference industry timing, competitor activity, or market conditions in their geography",
      "effort": "Low | Medium | High",
      "timeToRevenue": "e.g. 60-90 days"
    }
  ],
  "biggestRisk": "The single most important thing that could prevent them capturing these opportunities. Factor in industry-specific barriers or geography-specific challenges. Use 'you'.",
  "recommendedFirstMove": "One concrete action they should take in the next 30 days. Specific and actionable, grounded in what works in their industry. Use 'you'.",
  "closingThought": "1-2 sentences that land the insight — reference their industry or geography to make it feel precise, not generic. Make it feel like a revelation."
}

Return 2-4 opportunities ranked by score. Revenue generation only. Never mention cost reduction or headcount reduction.`;

export async function POST(request) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { answers, resolvedQuestions, name, company, industry, geography, businessDescription, websiteContent } = await request.json();

    const qaBlock = resolvedQuestions
      .filter((q) => answers[q.id])
      .map((q) => `Q: ${q.resolvedText || q.text}\nA: ${answers[q.id]}`)
      .join("\n\n");

    const contextBlock = [
      `Name: ${name || "Unknown"}`,
      `Company: ${company || "Unknown"}`,
      `Industry: ${industry || "Unknown"}`,
      `Geography: ${geography || "Unknown"}`,
      `Business: ${businessDescription || "Unknown"}`,
      websiteContent ? `\nWebsite content (homepage extract):\n${websiteContent.slice(0, 3000)}` : null,
    ].filter(Boolean).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${contextBlock}\n\n${qaBlock}`,
        },
      ],
    });

    const raw = message.content.map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found in response");

    const results = JSON.parse(clean.slice(start, end + 1));
    return Response.json(results);
  } catch (error) {
    console.error("generate-results error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
