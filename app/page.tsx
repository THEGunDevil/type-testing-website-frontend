"use client";

import ChallengeOptions from "@/components/ChallengeOptions";
import KeyboardShortcuts from "@/components/keyboardShortcuts";
import Result from "@/components/Result";
import TextField from "@/components/TextField";
import Timer from "@/components/Timer";
import { useTextData } from "@/hooks/useTextData";
import { ToggleMode, useToggleMode } from "@/hooks/useToggleMode";
import { loopString, proccessedTextData } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

type CompletedChunk = {
  letters: string[]; // the practice text that was shown
  typed: string[]; // what the user typed for it
};

const CHALLENGE_OPTIONS = [5, 30, 60];
const DEFAULT_TIMER = 30;

export default function Home() {
  const { text, fetchTextOffline } = useTextData();

  useEffect(() => {
    fetchTextOffline();
  }, []);

  /* ---------------- Text ---------------- */

  const processedTexts: string[] = useMemo(
    () => proccessedTextData(text?.data ?? ""),
    [text],
  );

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Wraps around, so a long test never runs out of text
  const currentPracticeText: string =
    processedTexts.length > 0
      ? processedTexts[currentTextIndex % processedTexts.length]
      : "";

  const currentPracticeTextLetters = useMemo(
    () => loopString(currentPracticeText),
    [currentPracticeText],
  );

  /* ---------------- Typing state ---------------- */

  // What is being typed right now (current text only)
  const [typedLetterArr, setTypedLetterArr] = useState<string[]>([]);

  // Fully completed texts. Single source of truth for the results.
  const [history, setHistory] = useState<CompletedChunk[]>([]);

  /* ---------------- Timer state ---------------- */

  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [selectedTimer, setSelectedTimer] = useState(DEFAULT_TIMER);
  const [hoveredTimer, setHoveredTimer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  // Deadline based countdown: no drift, no stale refs, no setState in the effect body
  useEffect(() => {
    if (!isStarted) return;

    const endAt = Date.now() + selectedTimer * 1000;

    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining === 0) {
        clearInterval(id);
        setIsStarted(false);
        setTimeUp(true);
      }
    }, 250);

    return () => clearInterval(id);
  }, [isStarted, selectedTimer]);

  /* ---------------- Results ---------------- */

  const stats = useMemo(() => {
    const empty = { correct: 0, incorrect: 0, correctWords: 0 };
    if (!timeUp) return empty;

    // Finished texts + the text that was still in progress when time ran out
    const chunks: CompletedChunk[] = [
      ...history,
      { letters: currentPracticeTextLetters, typed: typedLetterArr },
    ];

    let correct = 0;
    let incorrect = 0; // wrong letters + letters skipped with space
    let correctWords = 0;

    for (const { letters, typed } of chunks) {
      // Characters
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === letters[i]) correct++;
        else incorrect++; // wrong letter or SKIPPED
      }

      // Words: a word counts only if every letter of it was typed correctly
      let start = 0;
      while (start < letters.length) {
        let end = start;
        while (end < letters.length && letters[end] !== " ") end++;

        if (end > start && typed.length >= end) {
          let ok = true;
          for (let i = start; i < end; i++) {
            if (typed[i] !== letters[i]) {
              ok = false;
              break;
            }
          }
          if (ok) correctWords++;
        }

        start = end + 1; // jump over the space
      }
    }

    return { correct, incorrect, correctWords };
  }, [timeUp, history, currentPracticeTextLetters, typedLetterArr]);

  const totalTyped = stats.correct + stats.incorrect;
  const accuracy =
    totalTyped > 0 ? Math.round((stats.correct / totalTyped) * 100) : 0;

  /* ---------------- Handlers ---------------- */

  const resetTest = useCallback((duration: number) => {
    setTimer(duration);
    setSelectedTimer(duration);
    setTimeUp(false);
    setIsStarted(false);
    setHoveredTimer(null);
    setTypedLetterArr([]);
    setHistory([]);
    setCurrentTextIndex(0);
  }, []);

  const handleChangeTimeOnHover = (o: number) => setHoveredTimer(o);
  const handleChangeTimeOnClick = (o: number) => resetTest(o);
  const handleRestart = useCallback(
    () => resetTest(selectedTimer),
    [resetTest, selectedTimer],
  );

  const handleCompleteText = (finalTypedArr: string[]) => {
    setHistory((prev) => [
      ...prev,
      { letters: currentPracticeTextLetters, typed: finalTypedArr },
    ]);
    setCurrentTextIndex((prev) => prev + 1);
    setTypedLetterArr([]);
  };

  // Ctrl/Cmd + Enter restarts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRestart]);

  const displayedTimer = hoveredTimer ?? timer;
  const ToggleModes = ["Challenge", "Practice"];
  const { handleToggle, activeIndex, modeType } = useToggleMode(ToggleModes);
  return (
    <main className="min-h-screen bg-gray-800 px-5 md:px-10">
      <section className="relative flex min-h-screen flex-col items-center justify-center py-14 font-jetbrains">
        <ToggleMode
          ToggleModes={ToggleModes}
          activeIndex={activeIndex}
          onToggle={handleToggle}
        />{" "}
        <h1 className="text-center text-5xl text-amber-700">Start Typing!</h1>
        <ChallengeOptions
          challengeOptions={CHALLENGE_OPTIONS}
          handleChangeTimeOnClick={handleChangeTimeOnClick}
          handleChangeTimeOnHover={handleChangeTimeOnHover}
          setHoveredTimer={setHoveredTimer}
          timer={timer}
        />
        {/* Height now comes from the 3-line TextField, so no fixed h-96 */}
        <div className="relative mt-16 w-full max-w-5xl">
          <Timer
            displayedTimer={displayedTimer}
            timer={timer}
            handleRestart={handleRestart}
            isStarted={isStarted}
          />

          <TextField
            practiceText={currentPracticeText}
            practiceTextLetters={currentPracticeTextLetters}
            typedLetterArr={typedLetterArr}
            setTypedLetterArr={setTypedLetterArr}
            isStarted={isStarted}
            setIsStarted={setIsStarted}
            timeUp={timeUp}
            onComplete={handleCompleteText}
          />
        </div>
        <div className="relative mt-10 h-44">
          {timeUp && (
            <Result
              countCorrectWords={stats.correctWords}
              accuracy={accuracy}
              practiceTextLettersLength={totalTyped}
              selectedTimer={selectedTimer}
              incorrectCharacterCount={stats.incorrect}
              correctCharacterCount={stats.correct}
            />
          )}
        </div>
        <div className="mt-14 text-xs">
          <KeyboardShortcuts />
        </div>
      </section>
    </main>
  );
}
