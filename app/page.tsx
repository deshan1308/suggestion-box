"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Card } from "@/components/card";

export default function Home() {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => suggestion.trim().length > 0 && !isSubmitting,
    [isSubmitting, suggestion],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          suggestion,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit suggestion.");
      }

      setSuggestion("");
      toast.success("Suggestion submitted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
      <Card
        title="Indra HR Anonymous Suggestion Box"
        subtitle="Share feedback, ideas, or concerns with Indra HR."
      >
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <Image
            src="/indra logo.png"
            alt="Indra logo"
            width={52}
            height={52}
            className="h-12 w-12 rounded object-contain"
          />
          <p className="text-sm font-semibold text-slate-800">Indra HR</p>
        </div>

        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-4 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-800">
            Highly Confidential Notice
          </p>
          <p className="mt-2 text-sm text-rose-900">
            This suggestion box is highly confidential. HR will review suggestions,
            but they will not know who submitted what unless identifying details are
            included in your message.
          </p>
          <p className="mt-3 text-sm font-medium text-rose-900">
            Suggestions to stay fully anonymous:
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-rose-900">
            <li>Do not include your name, role, team, or contact details.</li>
            <li>Avoid mentioning specific dates or events tied only to you.</li>
            <li>Focus on the issue and impact, not personal identifiers.</li>
          </ul>

          <div
            lang="si"
            className="mt-4 border-t border-rose-200 pt-4 text-[15px] leading-relaxed text-rose-900 [font-family:system-ui,'Iskoola_Pota','Nirmala_UI','Noto_Sans_Sinhala',sans-serif]"
          >
            <p className="text-sm font-semibold text-rose-800">
              ඉතා රහස්‍යතා දැනුම්දීමක් (සිංහල)
            </p>
            <p className="mt-2 text-sm">
              මෙම යෝජනා පෙට්ටිය ඉතා රහස්‍යයි. මානව සම්පත් කාණ්ඩය යෝජනා සමාලෝචනය කරනු ඇත,
              එහෙත් ඔබගේ පණිවිඩය තුළ හඳුනාගැනීමට උපකාරී විස්තර ඇතුළත් නොකළහොත්, ඔබ කවුරුන්ද
              යන්න ඔවුන්ට නොදැනෙනු ඇත.
            </p>
            <p className="mt-3 text-sm font-medium">
              සම්පූර්ණයෙන්ම නිර්නාමිකව සිටීමට උපදේශන:
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
              <li>ඔබගේ නම, තනතුර, කණ්ඩායම හෝ සම්බන්ධතා විස්තර ඇතුළත් නොකරන්න.</li>
              <li>
                ඔබට පමණක් වැදගත් වන නිශ්චිත දින හෝ සිදුවීම් සඳහන් කිරීමෙන් වළකින්න.
              </li>
              <li>පුද්ගලික හඳුනාගැනීම් වෙනුවට ගැටලුව සහ එහි බලපෑම මත අවධානය යොමු කරන්න.</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Suggestion <span className="text-rose-600">*</span>
            <textarea
              required
              rows={6}
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-blue-300 transition focus:ring-2"
              placeholder="Share your suggestion..."
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      </Card>

    </main>
  );
}
