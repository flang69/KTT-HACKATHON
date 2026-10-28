"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Language = "en" | "hi" | "mr";

const labels = {
  en: {
    title: "Crop Disease Detection",
    subtitle: "Upload a clear photo of the affected plant for AI-assisted guidance.",
    crop: "Crop name (optional)",
    cropPlaceholder: "e.g. tomato, cotton, soybean",
    location: "Village / district (optional)",
    locationPlaceholder: "e.g. Pune, Maharashtra",
    language: "Response language",
    upload: "Choose crop photo",
    analyze: "Analyze image",
    analyzing: "Analyzing image…",
    result: "AI analysis",
    back: "Back to home",
    note: "AI results are preliminary, not a confirmed diagnosis. For serious crop damage, confirm with a local agricultural officer or Krishi Vigyan Kendra (KVK).",
    fileNote: "JPG, PNG, or WebP · Maximum 5 MB",
    error: "Could not analyze this image. Please try again.",
  },
  hi: {
    title: "फसल रोग पहचान",
    subtitle: "AI से सामान्य मार्गदर्शन पाने के लिए प्रभावित पौधे की साफ तस्वीर अपलोड करें।",
    crop: "फसल का नाम (वैकल्पिक)",
    cropPlaceholder: "जैसे टमाटर, कपास, सोयाबीन",
    location: "गाँव / जिला (वैकल्पिक)",
    locationPlaceholder: "जैसे पुणे, महाराष्ट्र",
    language: "जवाब की भाषा",
    upload: "फसल की फोटो चुनें",
    analyze: "तस्वीर का विश्लेषण करें",
    analyzing: "तस्वीर का विश्लेषण हो रहा है…",
    result: "AI विश्लेषण",
    back: "होम पर लौटें",
    note: "AI का परिणाम शुरुआती अनुमान है, पक्का निदान नहीं। गंभीर नुकसान होने पर स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र (KVK) से पुष्टि करें।",
    fileNote: "JPG, PNG या WebP · अधिकतम 5 MB",
    error: "तस्वीर का विश्लेषण नहीं हो पाया। कृपया फिर कोशिश करें।",
  },
  mr: {
    title: "पीक रोग ओळख",
    subtitle: "AI मार्गदर्शनासाठी बाधित झाडाचा स्पष्ट फोटो अपलोड करा.",
    crop: "पिकाचे नाव (ऐच्छिक)",
    cropPlaceholder: "उदा. टोमॅटो, कापूस, सोयाबीन",
    location: "गाव / जिल्हा (ऐच्छिक)",
    locationPlaceholder: "उदा. पुणे, महाराष्ट्र",
    language: "उत्तराची भाषा",
    upload: "पिकाचा फोटो निवडा",
    analyze: "फोटोचे विश्लेषण करा",
    analyzing: "फोटोचे विश्लेषण सुरू आहे…",
    result: "AI विश्लेषण",
    back: "मुख्य पृष्ठावर परत जा",
    note: "AI चा निष्कर्ष हा प्राथमिक अंदाज आहे, निश्चित निदान नाही. गंभीर नुकसान असल्यास स्थानिक कृषी अधिकारी किंवा कृषी विज्ञान केंद्राकडून खात्री करा.",
    fileNote: "JPG, PNG किंवा WebP · कमाल 5 MB",
    error: "फोटोचे विश्लेषण करता आले नाही. कृपया पुन्हा प्रयत्न करा.",
  },
} as const;

export default function CropDiseasePage() {
  const [language, setLanguage] = useState<Language>("mr");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const t = labels[language];

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setError("");
    setAnswer("");

    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setFile(null);
      setPreview("");
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setFile(null);
      setPreview("");
      setError("Please choose an image smaller than 5 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function analyze() {
    if (!file || busy) return;

    setBusy(true);
    setError("");
    setAnswer("");

    try {
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const value = typeof reader.result === "string" ? reader.result : "";
          const comma = value.indexOf(",");
          if (comma < 0) reject(new Error("Could not read the image."));
          else resolve(value.slice(comma + 1));
        };
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/detect-disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type,
          language,
          crop,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t.error);
      }

      setAnswer(typeof data.answer === "string" ? data.answer : t.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8f2] px-4 py-8 text-[#20331d] md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-green-800 hover:underline">
          ← {t.back}
        </Link>

        <header className="mt-6">
          <p className="text-sm font-bold uppercase tracking-widest text-green-800">ShetkariMitra AI</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">🌿 {t.title}</h1>
          <p className="mt-3 leading-7 text-gray-600">{t.subtitle}</p>
        </header>

        <section className="mt-7 rounded-2xl border border-green-200 bg-white p-5 shadow-sm md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold">
              {t.crop}
              <input
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                placeholder={t.cropPlaceholder}
                maxLength={100}
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-3 font-normal outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="block text-sm font-semibold">
              {t.location}
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={t.locationPlaceholder}
                maxLength={150}
                className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-3 font-normal outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm font-semibold">
            {t.language}
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-3 py-3 font-normal"
            >
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </label>

          <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-green-50 p-5 text-center hover:bg-green-100">
            <span className="text-3xl">📸</span>
            <span className="mt-2 font-bold text-green-900">{t.upload}</span>
            <span className="mt-1 text-xs text-gray-600">{t.fileNote}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={selectFile} className="sr-only" />
          </label>

          {preview && (
            <div className="mt-5">
              {/* Blob URLs are local previews; next/image does not add value for this temporary upload. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Selected crop" className="max-h-96 w-full rounded-xl bg-gray-50 object-contain" />
              <p className="mt-2 break-all text-sm text-gray-500">{file?.name}</p>
            </div>
          )}

          <button
            type="button"
            onClick={analyze}
            disabled={!file || busy}
            className="mt-5 w-full rounded-xl bg-green-800 px-5 py-3 font-bold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t.analyzing : t.analyze}
          </button>

          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}

          {answer && (
            <section className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 md:p-5">
              <h2 className="text-lg font-extrabold">{t.result}</h2>
              <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-800">{answer}</div>
            </section>
          )}
        </section>

        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{t.note}</p>
      </div>
    </main>
  );
}
