// app/api/generate-results/route.js

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert AI revenue strategist. Analyse this self-serve discovery to identify where AI can generate NEW revenue — not reduce costs or headcount. The person completed this themselves.

Return ONLY valid JSON. No preamble, no markdown fences.

{
  "executiveSummary": "2-3 sentences synthesising the most important revenue insight. Reference specific things they said. Address them directly as 'you'. Be concrete.",
  "opportunities": [
    {
      "title": "Short punchy opportunity name (4-7 words)",
      "type": "New Revenue | Revenue Recovery | Market Expansion | Retention & Expansion",
      "score": <integer 60-95>,
      "headline": "One sentence capturing the opportunity in their language, addressing them as 'you'",
      "description": "2-3 sentences explaining what the AI solution looks like and why it fits their situation. Reference specifics from their answers. Use 'you/your'.",
      "immediacy": "One sentence on why now is the right moment, specific to their situation",
      "effort": "Low | Medium | High",
      "timeToRevenue": "e.g. 60-90 days"
    }
  ],
  "biggestRisk": "The single most important thing that could prevent them capturing these opportunities. Specific to their situation. Use 'you'.",
  "recommendedFirstMove": "One concrete action they should take in the next 30 days. Specific and actionable. Use 'you'.",
  "closingThought": "1-2 sentences that land the insight — something they'll want to share or come back to. Make it feel like a revelation, not a summary."
}

Return 2-4 opportunities ranked by score. Revenue generation only. Never mention cost reduction or headcount reduction.`;

export async function POST(request) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { answers, resolvedQuestions, name, company, industry, businessDescription } = await request.json();

    const qaBlock = resolvedQuestions
      .filter((q) => answers[q.id])
      .map((q) => `Q: ${q.resolvedText || q.text}\nA: ${answers[q.id]}`)
      .join("\n\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Name: ${name || "Unknown"}\nCompany: ${company || "Unknown"}\nIndustry: ${industry || "Unknown"}\nBusiness: ${businessDescription || "Unknown"}\n\n${qaBlock}`,
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
