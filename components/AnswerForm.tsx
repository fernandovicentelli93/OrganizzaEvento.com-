"use client";

import { useState } from "react";
import { createAnswer } from "@/app/actions";
import { CaptchaFields } from "@/components/CaptchaFields";
import type { CaptchaChallenge } from "@/lib/captcha";
import { DISPLAY_MODES } from "@/lib/constants";

type AnswerFormProps = {
  questionSlug: string;
  captcha: CaptchaChallenge;
  startedAt: number;
};

export function AnswerForm({ questionSlug, captcha, startedAt }: AnswerFormProps) {
  const [displayMode, setDisplayMode] = useState("anonymous");

  return (
    <form action={createAnswer} className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <input type="hidden" name="questionSlug" value={questionSlug} />
      <label className="block">
        <span className="text-sm font-semibold text-ink">La tua risposta</span>
        <textarea
          name="content"
          required
          minLength={10}
          rows={5}
          placeholder="Scrivi cosa faresti tu, cosa chiederesti al fornitore o cosa ti è successo in un caso simile."
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold text-ink">Pubblica come</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {DISPLAY_MODES.map((mode) => (
            <label key={mode.value} className="cursor-pointer rounded-2xl border border-line bg-cream p-3 text-sm">
              <input
                type="radio"
                name="displayMode"
                value={mode.value}
                checked={displayMode === mode.value}
                onChange={() => setDisplayMode(mode.value)}
                className="mr-2"
              />
              <span className="font-semibold text-ink">{mode.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {displayMode !== "anonymous" ? (
        <label className="block">
          <span className="text-sm font-semibold text-ink">
            {displayMode === "nickname" ? "Nickname da mostrare *" : "Nome reale da mostrare *"}
          </span>
          <input
            name="displayName"
            required
            className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold text-ink">Email privata opzionale</span>
        <input
          name="privateEmail"
          type="email"
          placeholder="Non viene mostrata sul sito"
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-ink"
        />
      </label>

      <CaptchaFields challenge={captcha} startedAt={startedAt} compact />

      <button className="focus-ring rounded-xl bg-violet-cta px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-hover">
        Pubblica risposta
      </button>
    </form>
  );
}
