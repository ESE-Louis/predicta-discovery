// app/api/generate-question/route.js
// Server-side API route — Anthropic key never exposed to browser

import Anthropic from "@anthropic-ai/sdk";

const PROMPTS = {
  p2: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE follow-up question in second person (using "you/your").
Goal: Surface a customer segment or use case they've had to walk away from or under-serve because of cost or capacity.
Reference something specific they mentioned. Sound curious and conversational, not consultancy-speak. One sentence only. No preamble.`,

  p3: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE follow-up question in second person (using "you/your").
Goal: Help them articulate what they would do with 3x the capacity — this is the AI brief.
Reference their specific situation. Sound natural. One sentence only. No preamble.`,

  i1: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Implication question in second person.
Goal: Help them quantify the revenue potential of the opportunity they've surfaced.
Reference the specific opportunity or segment they mentioned. One sentence only. No preamble.`,

  i2: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Implication question in second person.
Goal: Make the cost of inaction feel real — what are they losing by not solving this now?
Reference a specific pain or gap they mentioned. Empathetic tone. One sentence only. No preamble.`,

  i3: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Implication question in second person.
Goal: Surface competitive urgency — what happens if a competitor solves this before them?
Keep it grounded in their situation. One sentence only. No preamble.`,

  v1: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Value question in second person.
Goal: Let them describe the outcome they want — without telling them what it is.
Frame it as "if you could..." and reference their specific constraint. One sentence only. No preamble.`,

  v2: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Value question in second person.
Goal: Let them quantify the value in their own words.
Reference their data or untapped assets. One sentence only. No preamble.`,

  v3: `You are helping someone complete a self-serve AI revenue discovery. Based on what they've shared, write ONE Value question in second person.
Goal: Let them articulate the bigger strategic shift — the vision of what's possible.
Reference their market or customer relationships. One sentence only. No preamble.`,
};

export async function POST(request) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { questionKey, priorQA } = await request.json();

    const systemPrompt = PROMPTS[questionKey];
    if (!systemPrompt) {
      return Response.json({ error: "Unknown question key" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 120,
      system: systemPrompt,
      messages: [{ role: "user", content: `Prior conversation:\n${priorQA}` }],
    });

    const text = message.content.map((b) => b.text || "").join("").trim().replace(/^["']|["']$/g, "");
    return Response.json({ question: text });
  } catch (error) {
    console.error("generate-question error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
