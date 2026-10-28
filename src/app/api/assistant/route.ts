import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const languageNames: Record<string, string> = {
  English: "English",
  Hindi: "Hindi",
  Marathi: "Marathi",
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing. Add it to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const payload = body as { question?: unknown; language?: unknown; history?: unknown };
    if (typeof payload.question !== "string" || !payload.question.trim()) {
      return NextResponse.json({ error: "Please enter a farming question." }, { status: 400 });
    }
    if (payload.question.length > 4000) {
      return NextResponse.json({ error: "Please keep your question under 4,000 characters." }, { status: 413 });
    }

    const language = typeof payload.language === "string" && languageNames[payload.language]
      ? languageNames[payload.language]
      : "English";

    const history = Array.isArray(payload.history)
      ? payload.history.slice(-10).flatMap((item: any) => {
          if (!item || !["user", "assistant"].includes(item.role) || typeof item.text !== "string") return [];
          return [{ role: item.role, content: item.text.slice(0, 4000) }];
        })
      : [];

    const systemPrompt = `You are ShetkariMitra AI, a practical agricultural information assistant for farmers in India. Reply in ${language}, using simple language and clear steps. Ask for the crop, growth stage, village/district, soil type, and visible symptoms when relevant. Be cautious: do not claim certainty from a photo-free description, do not invent live weather, mandi prices, government scheme details, or local facts. Do not prescribe exact pesticide doses or advise mixing chemicals. Encourage following product labels and consulting a local agricultural officer or Krishi Vigyan Kendra (KVK) for serious crop damage, uncertain diagnosis, or high-risk decisions. You can help with crop care, irrigation, pests, symptoms, fertilizer safety, farm costs, and market-decision checklists. Keep answers concise and actionable.`;

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "ShetkariMitra AI",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: payload.question.trim() },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });

    const raw = await upstream.text();
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "The AI provider returned an unexpected response. Please try again." }, { status: 502 });
    }

    if (!upstream.ok) {
      const message = typeof data?.error?.message === "string" ? data.error.message : "The AI provider is temporarily unavailable.";
      console.error("OpenRouter assistant error:", upstream.status, message);
      return NextResponse.json({ error: message.slice(0, 500) }, { status: upstream.status === 429 ? 429 : 502 });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ error: "The AI did not return a text answer. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Farm assistant route failed:", error);
    return NextResponse.json({ error: "Could not reach the AI assistant. Check your connection and try again." }, { status: 500 });
  }
}
