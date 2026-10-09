"use client";

import AnimatedBtn from "@/components/ButtonStyleAnimation";
import ChallengeOptions from "@/components/ChallengeOptions";
import KeyboardShortcuts from "@/components/keyboardShortcuts";
import Result from "@/components/Result";
import TextField from "@/components/TextField";
import Timer from "@/components/Timer";
import { useTextData } from "@/hooks/useTextData";
import { ToggleMode, useToggleMode } from "@/hooks/useToggleMode";
import { loopString, proccessedTextData } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type CompletedChunk = {
  letters: string[];
  typed: string[];
};

const CHALLENGE_OPTIONS = [30, 60];
const DEFAULT_TIMER = 30;
const TOGGLE_MODES = ["Challenge", "Practice"];
const LANGUAGE_MODES = ["English", "Bangla"];

export default function Home() {
  const { text, fetchTextOffline } = useTextData();

  const { handleToggle, activeIndex, modeType } = useToggleMode(TOGGLE_MODES);

  const {
    handleToggle: handleLanguageToggle,
    activeIndex: languageIndex,
    modeType: languageMode,
  } = useToggleMode(LANGUAGE_MODES);

  const isChallenge = modeType === "Challenge";

  useEffect(() => {
    fetchTextOffline(languageMode === "Bangla" ? "bangla" : "english");
  }, [languageMode]);

  const processedTexts: string[] = useMemo(
    () => proccessedTextData(text?.data ?? ""),
    [text],
  );

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const currentPracticeText: string =
    processedTexts.length > 0
      ? processedTexts[currentTextIndex % processedTexts.length]
      : "";

  const currentPracticeTextLetters = useMemo(
    () => loopString(currentPracticeText),
    [currentPracticeText],
  );

  /* ---------------- Typing state ---------------- */

  const [typedLetterArr, setTypedLetterArr] = useState<string[]>([]);
  const [history, setHistory] = useState<CompletedChunk[]>([]);

  /* ---------------- Session state ---------------- */

  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const [selectedTimer, setSelectedTimer] = useState(DEFAULT_TIMER);
  const [hoveredTimer, setHoveredTimer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const [timeUp, setTimeUp] = useState(false); // Challenge finished
  const [endPracticeSession, setEndPracticeSession] = useState(false); // Practice finished
  const [practiceSeconds, setPracticeSeconds] = useState(0); // Practice elapsed time

  // Either kind of session is over: lock typing and show the result
  const isFinished = timeUp || endPracticeSession;

  // Remember when typing began (used for Practice mode's elapsed time)
  const startedAtRef = useRef(0);
  useEffect(() => {
    if (isStarted) startedAtRef.current = Date.now();
  }, [isStarted]);

  // Countdown: Challenge mode only. Practice never ends by itself.
  useEffect(() => {
    if (!isStarted || !isChallenge) return;

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
  }, [isStarted, isChallenge, selectedTimer]);

  /* ---------------- Results ---------------- */

  const stats = useMemo(() => {
    const empty = { correct: 0, incorrect: 0, correctWords: 0 };
    if (!isFinished) return empty;

    // Finished texts + the text that was still in progress
    const chunks: CompletedChunk[] = [
      ...history,
      { letters: currentPracticeTextLetters, typed: typedLetterArr },
    ];

    let correct = 0;
    let incorrect = 0;
    let correctWords = 0;

    for (const { letters, typed } of chunks) {
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === letters[i]) correct++;
        else incorrect++;
      }

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

        start = end + 1;
      }
    }

    return { correct, incorrect, correctWords };
  }, [isFinished, history, currentPracticeTextLetters, typedLetterArr]);

  const totalTyped = stats.correct + stats.incorrect;
  const accuracy =
    totalTyped > 0 ? Math.round((stats.correct / totalTyped) * 100) : 0;

  /* ---------------- Handlers ---------------- */

  const resetTest = useCallback((duration: number) => {
    setTimer(duration);
    setSelectedTimer(duration);
    setTimeUp(false);
    setEndPracticeSession(false);
    setPracticeSeconds(0);
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

  // Changing mode or language always starts a clean session
  const handleModeToggle = (mode: string, index: number) => {
    handleToggle(mode, index);
    resetTest(selectedTimer);
  };

  const handleLanguageChange = (mode: string, index: number) => {
    handleLanguageToggle(mode, index);
    resetTest(selectedTimer);
  };

  const handleEndPractice = () => {
    if (!isStarted || endPracticeSession) return;

    const elapsed = (Date.now() - startedAtRef.current) / 1000;
    setPracticeSeconds(Math.max(elapsed, 1)); // avoid dividing by ~0
    setEndPracticeSession(true);
    setIsStarted(false);
  };

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

  // Clicking any button (toggles, timer options, End Practice...) must not
  // pull keyboard focus away from the typing input. The click still fires.
  const keepTypingFocus = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) e.preventDefault();
  };

  return (
    <main
      onMouseDown={keepTypingFocus}
      className="min-h-screen w-full bg-gray-800 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-72"
    >
      <section className="flex min-h-screen w-full flex-col items-center justify-center pb-6 pt-16 font-jetbrains sm:pt-14">


          {/* Mode and language controls */}
          <div className="mb-8 flex w-full justify-end sm:mb-10">
            <div className="flex w-fit max-w-full flex-col gap-1 rounded-md border-2 border-gray-500/30 p-1 sm:p-2">
              <ToggleMode
                ToggleModes={TOGGLE_MODES}
                activeIndex={activeIndex}
                onToggle={handleModeToggle}
              />
          
              <ToggleMode
                ToggleModes={LANGUAGE_MODES}
                activeIndex={languageIndex}
                onToggle={handleLanguageChange}
              />
            </div>
          </div>
          
          {/* Heading */}
          <h1 className="w-full text-center text-2xl leading-tight text-amber-700 sm:text-4xl md:text-5xl">
            Start Typing!
          </h1>

        {isChallenge && (
          <div className="w-full">
            <ChallengeOptions
              challengeOptions={CHALLENGE_OPTIONS}
              handleChangeTimeOnClick={handleChangeTimeOnClick}
              handleChangeTimeOnHover={handleChangeTimeOnHover}
              setHoveredTimer={setHoveredTimer}
              timer={timer}
            />
          </div>
        )}

        {/* Typing area */}
        <div className="relative mt-12 w-full max-w-5xl sm:mt-16">
          {isChallenge && (
            <Timer
              displayedTimer={displayedTimer}
              timer={timer}
              handleRestart={handleRestart}
              isStarted={isStarted}
            />
          )}

          <TextField
            practiceText={currentPracticeText}
            modeType={modeType}
            practiceTextLetters={currentPracticeTextLetters}
            typedLetterArr={typedLetterArr}
            setTypedLetterArr={setTypedLetterArr}
            isStarted={isStarted}
            setIsStarted={setIsStarted}
            timeUp={isFinished}
            onComplete={handleCompleteText}
          />

          {modeType === "Practice" && (
            <button
              onClick={endPracticeSession ? handleRestart : handleEndPractice}
              disabled={!endPracticeSession && !isStarted}
              className="group mt-8 flex w-fit cursor-pointer items-center gap-1 rounded-md bg-amber-800 p-2 text-sm font-bold text-gray-800 transition-colors duration-300 hover:text-amber-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-gray-800 sm:mt-10"
            >
              <AnimatedBtn isActive={false} LPunctuation="{" RPunctuation="}">
                {endPracticeSession ? "New Practice" : "End Practice"}
              </AnimatedBtn>
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-8 min-h-72 w-full sm:mt-10 sm:min-h-56">
          {isFinished && (
            <Result
              title={timeUp ? "Time Up!" : "Practice Complete"}
              countCorrectWords={stats.correctWords}
              accuracy={accuracy}
              practiceTextLettersLength={totalTyped}
              durationSeconds={timeUp ? selectedTimer : practiceSeconds}
              incorrectCharacterCount={stats.incorrect}
              correctCharacterCount={stats.correct}
            />
          )}
        </div>

        {/* Keyboard shortcuts */}
        <div className="mb-5 mt-2 w-full px-1 text-center text-[10px] leading-relaxed sm:text-xs">
          <KeyboardShortcuts />
        </div>
      </section>
    </main>
  );
}
