"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Next.js exposes the error digest for diagnostics without leaking details to visitors.
    if (process.env.NODE_ENV === "development") {
      console.error("Application route error:", error);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8f2] p-6 text-[#20331d]">
      <section className="w-full max-w-lg rounded-3xl border border-[#e5eadf] bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-[#5a8e35]">ShetkariMitra AI</p>
        <h1 className="mt-3 text-2xl font-extrabold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-[#75836f]">
          This page could not load correctly. Try again; your saved browser records should remain available.
        </p>
        {error.digest && <p className="mt-3 text-xs text-[#75836f]">Reference: {error.digest}</p>}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-[#315b28] px-5 py-3 text-sm font-bold text-white hover:bg-[#23451f]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
