"use client";

import { ReactNode, useEffect, useState } from "react";

type ResultProps = {
  title: string; // "Time Up!" or "Practice Complete"
  countCorrectWords: number;
  accuracy: number;
  practiceTextLettersLength: number; // total characters typed
  durationSeconds: number; // test length (Challenge) or elapsed time (Practice)
  incorrectCharacterCount: number;
  correctCharacterCount: number;
};

const CHARS_PER_WORD = 5;

function formatDuration(seconds: number) {
  const total = Math.round(seconds);
  if (total < 60) return `${total}s`;

  const m = Math.floor(total / 60);
  const s = total % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

type StatProps = {
  label: string;
  value: ReactNode;
  big?: boolean;
};

/** Value on top, label underneath (dt/dd order kept for screen readers). */
function Stat({ label, value, big = false }: StatProps) {
  return (
    <div className="flex min-w-0 flex-col-reverse items-center gap-1">
      <dt className="text-[10px] uppercase tracking-widest text-amber-700/70 sm:text-xs">
        {label}
      </dt>
      <dd
        className={
          big
            ? "text-4xl font-bold leading-none sm:text-5xl md:text-6xl"
            : "text-xl leading-tight sm:text-2xl"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function Result({
  title,
  countCorrectWords,
  accuracy,
  practiceTextLettersLength,
  durationSeconds,
  incorrectCharacterCount,
  correctCharacterCount,
}: ResultProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Wait one frame so the initial styles are painted first.
    const frame = requestAnimationFrame(() => setIsActive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const minutes = durationSeconds > 0 ? durationSeconds / 60 : 0;

  const wpm =
    minutes > 0
      ? Math.round(correctCharacterCount / CHARS_PER_WORD / minutes)
      : 0;

  const rawWpm =
    minutes > 0
      ? Math.round(practiceTextLettersLength / CHARS_PER_WORD / minutes)
      : 0;

  return (
    <div
      className={`
        mx-auto flex w-full max-w-2xl flex-col items-center
        text-center text-amber-700
        transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        motion-reduce:transition-none
        ${
          isActive
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0"
        }
      `}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl">{title}</h2>

      {/* Headline numbers */}
      <dl className="mt-5 flex items-end justify-center gap-10 sm:gap-16">
        <Stat big label="WPM" value={wpm} />
        <Stat big label="Accuracy" value={`${accuracy}%`} />
      </dl>

      {/* Details: 2 columns on phones, 4 from sm up */}
      <dl className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-5 border-t border-gray-700 pt-5 sm:grid-cols-4">
        <Stat label="Raw WPM" value={rawWpm} />
        <Stat label="Words" value={countCorrectWords} />
        <Stat
          label="Correct / Incorrect"
          value={
            <>
              {correctCharacterCount}
              <span className="text-amber-700/50"> / </span>
              <span className="text-red-500">{incorrectCharacterCount}</span>
            </>
          }
        />
        <Stat label="Time" value={formatDuration(durationSeconds)} />
      </dl>
    </div>
  );
}

export default Result;