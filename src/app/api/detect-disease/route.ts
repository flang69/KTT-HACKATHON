import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LANGUAGES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is missing from .env.local." },
        { status: 500 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const payload = body as {
      imageBase64?: unknown;
      mimeType?: unknown;
      language?: unknown;
      crop?: unknown;
      location?: unknown;
    };

    if (typeof payload.imageBase64 !== "string" || !payload.imageBase64.trim()) {
      return NextResponse.json({ error: "Please upload a crop image." }, { status: 400 });
    }

    const mimeType =
      typeof payload.mimeType === "string" ? payload.mimeType : "";

    if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // 5 MB decoded image limit.
    const estimatedBytes = Math.floor((payload.imageBase64.length * 3) / 4);
    if (estimatedBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Please choose an image under 5 MB." },
        { status: 413 }
      );
    }

    const language =
      typeof payload.language === "string" &&
      Object.prototype.hasOwnProperty.call(LANGUAGES, payload.language)
        ? payload.language
        : "en";

    const crop =
      typeof payload.crop === "string" ? payload.crop.trim().slice(0, 100) : "";
    const location =
      typeof payload.location === "string" ? payload.location.trim().slice(0, 150) : "";

    const context = [
      crop ? `Crop: ${crop}` : "",
      location ? `Location: ${location}` : "",
    ].filter(Boolean).join("\n");

    const prompt = `You are ShetkariMitra AI, a cautious agricultural assistant for farmers in India.
Examine the attached crop photo and respond in ${LANGUAGES[language]}.

Provide:
1. What is visibly observable in the photo.
2. One or more possible causes, clearly marked as possibilities rather than a confirmed diagnosis.
3. What additional photo or information would help distinguish the causes.
4. Safe immediate steps the farmer can take.
5. Whether to consult a local agricultural officer or Krishi Vigyan Kendra (KVK).

${context}

Safety requirements:
- Do not claim certainty from a photo alone.
- Do not invent current weather, mandi prices, or scheme details.
- Do not prescribe exact pesticide doses or recommend mixing chemicals.
- Tell the farmer to follow product labels and local agricultural guidance.
- If the image is unclear or not a plant, say so and ask for a clearer image.
- Keep the advice practical and easy to understand.`;

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
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${payload.imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    });

    const responseText = await upstream.text();
    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("OpenRouter returned non-JSON response:", responseText.slice(0, 500));
      return NextResponse.json(
        { error: "The AI provider returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    if (!upstream.ok) {
      const providerMessage =
        typeof data?.error?.message === "string"
          ? data.error.message
          : `OpenRouter request failed with status ${upstream.status}.`;

      console.error("OpenRouter vision request failed:", upstream.status, providerMessage);

      return NextResponse.json(
        {
          error:
            upstream.status === 401 || upstream.status === 403
              ? "OpenRouter authentication failed. Check OPENROUTER_API_KEY."
              : upstream.status === 429
                ? "The free model is busy or its rate limit was reached. Please try again later."
                : upstream.status === 402
                  ? "This request was not accepted as free. Check the selected model and account credits."
                  : "Image analysis failed. Try again with a clearer, smaller image.",
          details: process.env.NODE_ENV === "development" ? providerMessage : undefined,
        },
        { status: upstream.status === 429 ? 429 : 502 }
      );
    }

    const answer = data?.choices?.[0]?.message?.content;
    const text = typeof answer === "string" ? answer.trim() : "";

    if (!text) {
      return NextResponse.json(
        { error: "The AI returned no analysis. Please try another photo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer: text });
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : String(error);
    console.error("CROP DISEASE API ERROR:", details);

    return NextResponse.json(
      {
        error: "Unable to analyze the crop image right now.",
        details: process.env.NODE_ENV === "development" ? details : undefined,
      },
      { status: 500 }
    );
  }
}
