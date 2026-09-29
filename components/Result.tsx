"use client";

import { useEffect, useState } from "react";

type ResultProps = {
  countCorrectWords: number;
  accuracy: number;
  practiceTextLettersLength: number;
  selectedTimer: number | null;
  incorrectCharacterCount: number;
  correctCharacterCount: number;
};

const CHARS_PER_WORD = 5;

function Result({
  countCorrectWords,
  accuracy,
  practiceTextLettersLength,
  selectedTimer,
  incorrectCharacterCount,
  correctCharacterCount,
}: ResultProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Wait one frame so the initial styles are painted first.
    const frame = requestAnimationFrame(() => {
      setIsActive(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const minutes =
    selectedTimer && selectedTimer > 0 ? selectedTimer / 60 : 0;

  const wpm =
    minutes > 0
      ? Math.round(correctCharacterCount / CHARS_PER_WORD / minutes)
      : 0;

  const rawWpm =
    minutes > 0
      ? Math.round(
          practiceTextLettersLength / CHARS_PER_WORD / minutes,
        )
      : 0;

  return (
    <div
      className={`
        absolute inset-0
        flex flex-col items-center justify-center
        text-center text-amber-700

        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          isActive
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0"
        }
      `}
    >
      <h2 className="text-4xl whitespace-nowrap">Time Up!</h2>

      <div className="mt-4 whitespace-nowrap flex flex-col gap-2 text-xl md:flex-row md:justify-center md:gap-3">
        <p>WPM: {wpm}</p>

        <span className="hidden md:block">|</span>

        <p>Raw: {rawWpm}</p>

        <span className="hidden md:block">|</span>

        <p>Accuracy: {accuracy}%</p>
      </div>

      <div className="mt-4 whitespace-nowrap flex flex-col gap-2 text-xl md:flex-row md:justify-center md:gap-3">
        <p>Correct: {correctCharacterCount}</p>

        <span className="hidden md:block">|</span>

        <p>Incorrect: {incorrectCharacterCount}</p>

        <span className="hidden md:block">|</span>

        <p>Words: {countCorrectWords}</p>

        <span className="hidden md:block">|</span>

        <p>Time: {selectedTimer ?? 0}s</p>
      </div>
    </div>
  );
}

export default Result;