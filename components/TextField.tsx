"use client";

import { loopString, matchThroughArrayOfTypedStrings } from "@/lib/utils";
import { Clock, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Result from "./Result";

function TextField() {
  const typedTextRef = useRef<HTMLTextAreaElement>(null);
  const practiceText =
    "Memories warm you up from the inside. But they also tear you apart.";
  const practiceTextLetters = loopString(practiceText);
  const [typedLetterArr, setTypedLetterArr] = useState<string[]>([]);
  const typedLetterArrToParagraph: string = typedLetterArr.join("");
  const typedWords = typedLetterArrToParagraph.split(" ");
  let countCorrectWords: number = 0;
  const [timer, setTimer] = useState<number>(30);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  // const isCompleted = typedLetterArr.length >= practiceTextLetters.length;
  const [timeUp, setTimeUp] = useState<boolean>(timer === 0);
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted]);
  const handleTypedText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const value = e.target.value;
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
    }
    const newTypedArr = value.split("");
    setTypedLetterArr(newTypedArr);
    if (value.length === 0) return;
    // Last character typed and its corresponding index
    const lastTypedIndex = value.length - 1;
    const lastTypedChar = value[lastTypedIndex];

    // Check match status for current input character
    if (lastTypedIndex < practiceTextLetters.length) {
      const isCurrentLetterCorrect = matchThroughArrayOfTypedStrings(
        practiceTextLetters,
        lastTypedChar,
        lastTypedIndex,
      );
      console.log(`Current letter input state: ${isCurrentLetterCorrect}`);
    }
  };
  for (const w of typedWords) {
    if (practiceText.includes(w)) {
      countCorrectWords++;
    }
  }
  const challengeOptions = [30, 60, 120, 400];
  const [hoveredTimer, setHoveredTimer] = useState<number | null>(null);
  const handleChangeTimeOnHover = (o: number) => {
    setHoveredTimer(o);
  };

  const handleChangeTimeOnClick = (o: number) => {
    setTimer(o);
    setSelectedTimer(o);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
  };

  const displayedTimer = hoveredTimer ?? timer;
  const correctCharacterCount = typedLetterArr.reduce(
    (count, letter, index) => {
      if (letter === practiceTextLetters[index]) {
        return count + 1;
      }

      return count;
    },
    0,
  );

  const incorrectCharacterCount = typedLetterArr.length - correctCharacterCount;

  const accuracy =
    typedLetterArr.length > 0
      ? Math.round((correctCharacterCount / typedLetterArr.length) * 100)
      : 0;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      setTimer(30);
      setTimeUp(false);
      setTypedLetterArr([]);
      setIsStarted(false);
      setHoveredTimer(null);
    }
  };
  const handleRestart = () => {
    setTimer(30);
    setTimeUp(false);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
  };
  return (
    <section className="pt-10 font-jetbrains min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-amber-700 text-5xl text-center -mt-24">
        Start Typing!
      </h1>
      <div className="mt-16 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-5">
        <p className="flex items-center gap-2 text-amber-600">
          <Clock size={20} />
          <span>Pick Your Challenge</span>
          <span className="hidden md:inline">→</span>
        </p>

        <div className="flex items-center gap-3">
          {challengeOptions.map((option) => (
            <button
              key={option}
              onMouseEnter={() => handleChangeTimeOnHover(option)}
              onMouseLeave={() => setHoveredTimer(null)}
              onClick={() => handleChangeTimeOnClick(option)}
              className={`
          min-w-14 rounded-lg px-4 py-2
          text-sm font-medium
          transition-all duration-200
          hover:bg-amber-600 hover:text-gray-900
          ${
            timer === option
              ? "bg-amber-600 text-gray-900"
              : "bg-gray-700/60 text-gray-300"
          }
        `}
            >
              {option}s
            </button>
          ))}
        </div>
      </div>
      <div className="relative mt-16 h-36 w-xs md:w-lg lg:w-2xl font-jetbrains text-lg font-semibold tracking-widest rounded-2xl border-2 border-amber-700 p-3 leading-relaxed">
        <div className="absolute -top-10 left-0 w-full flex items-center justify-between font-mono text-xl text-white">
          <div className="relative h-7 w-56 overflow-hidden">
            {/* Time */}
            <span
              className={`absolute inset-0 whitespace-nowrap transition-all duration-300 ease-in-out ${
                isStarted
                  ? "-translate-y-6 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              Time: {displayedTimer}s
            </span>

            {/* Time Left */}
            <span
              className={`absolute inset-0 whitespace-nowrap transition-all duration-300 ease-in-out ${
                isStarted
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              Time Left: {timer}s
            </span>
          </div>
          <button
            onKeyDown={handleKeyDown}
            onClick={handleRestart}
            className="hover:text-amber-700 transition-colors cursor-pointer duration-200"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="absolute inset-0 p-3 text-gray-600 pointer-events-none break-all whitespace-pre-wrap select-none">
          {practiceText}
        </div>
        {/* Typed Character Display Layer */}
        <div className="absolute inset-0 p-3 break-all whitespace-pre-wrap overflow-y-auto pointer-events-none">
          {typedLetterArr.map((letter, index) => {
            const isCorrect = letter === practiceText[index];
            return (
              <span key={index} className={isCorrect ? "" : "text-red-500"}>
                {letter}
              </span>
            );
          })}
        </div>
        {/* Transparent Interactive Textarea */}
        <textarea
          ref={typedTextRef}
          onChange={handleTypedText}
          spellCheck={false}
          disabled={timeUp}
          maxLength={
            practiceTextLetters.length
          } /* 3. maxLength যোগ করা হয়েছে */
          className="absolute lg:w-2xl inset-0 scrollbar-none h-full w-full resize-none bg-transparent p-3 text-transparent outline-none caret-amber-700 z-10 break-all whitespace-pre-wrap"
        />
      </div>
      {timeUp && (
        <Result
          countCorrectWords={countCorrectWords}
          accuracy={accuracy}
          practiceTextLettersLength={practiceTextLetters.length}
          selectedTimer={selectedTimer}
          incorrectCharacterCount={incorrectCharacterCount}
          correctCharacterCount={correctCharacterCount}
        />
      )}{" "}
      {/*
      Consistency: 87%
      */}
      <div className="text-xs mt-5">
        <p>
          <span className="bg-gray-600 text-[10px] rounded-sm text-amber-400 p-1">
            Ctrl
          </span>
          <span> + </span>
          <span className="bg-gray-600 text-[10px] rounded-sm text-amber-400 p-1">
            Enter
          </span>
          <span> → restart test</span>
        </p>
      </div>
    </section>
  );
}

export default TextField;
