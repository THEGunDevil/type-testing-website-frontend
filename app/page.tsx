"use client"

import ChallengeOptions from "@/components/ChallengeOptions";
import KeyboardShortcuts from "@/components/keyboardShortcuts";
import Result from "@/components/Result";
import TextField from "@/components/TextField";
import Timer from "@/components/Timer";
import { useTextData } from "@/hooks/useTextData";
import { loopString, proccessedTextData } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";

export default function Home() {
  const { text, fetchTextOffline } = useTextData();
  
  useEffect(() => {
    fetchTextOffline();
  }, []);
  
  const processedTexts = useMemo(() => proccessedTextData(text?.data ?? ""), [text]);
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const practiceText = processedTexts[currentTextIndex] ?? ""; 
  const practiceTextLetters = useMemo(() => loopString(practiceText), [practiceText]);

  const [typedLetterArr, setTypedLetterArr] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(30);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const [hoveredTimer, setHoveredTimer] = useState<number | null>(null);

  // Unified Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeUp(true);
            setIsStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  // Statistics Calculation
  const typedLetterArrToParagraph: string = typedLetterArr.join("");
  const typedWords = typedLetterArrToParagraph.split(" ");
  let countCorrectWords: number = 0;

  for (const w of typedWords) {
    if (w && practiceText.includes(w)) {
      countCorrectWords++;
    }
  }

  const correctCharacterCount = typedLetterArr.reduce((count, letter, index) => {
    return letter === practiceTextLetters[index] ? count + 1 : count;
  }, 0);

  const incorrectCharacterCount = typedLetterArr.length - correctCharacterCount;
  const accuracy = typedLetterArr.length > 0
      ? Math.round((correctCharacterCount / typedLetterArr.length) * 100)
      : 0;

  // Handlers
  const challengeOptions = [30, 60, 120, 400];

  const handleChangeTimeOnHover = (o: number) => setHoveredTimer(o);

  const handleChangeTimeOnClick = (o: number) => {
    setTimer(o);
    setSelectedTimer(o);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
  };

  const handleRestart = () => {
    setTimer(selectedTimer ?? 30); // reset to selected time instead of defaulting to 30
    setTimeUp(false);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
  };

  const handleCompleteText = () => {
    const nextIndex = currentTextIndex + 1;
    if (nextIndex < processedTexts.length) {
      setCurrentTextIndex(nextIndex);
      setTypedLetterArr([]); // clear typed characters for the next string
    }
  };

  // Shortcut Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTimer]); // Dependency added so it pulls the right time on reset

  const displayedTimer = hoveredTimer ?? timer;

  return (
    <main className="mt-14 xl:px-72 md:px-24 px-5 bg-gray-800">
        <section className="pt-10 font-jetbrains min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-amber-700 text-5xl text-center -mt-24">
            Start Typing!
          </h1>
          
          <ChallengeOptions
            challengeOptions={challengeOptions}
            handleChangeTimeOnClick={handleChangeTimeOnClick}
            handleChangeTimeOnHover={handleChangeTimeOnHover}
            setHoveredTimer={setHoveredTimer}
            timer={timer}
          />
          
          <div className="relative mt-16 h-56 w-xs md:w-xl lg:w-2xl font-jetbrains text-lg font-semibold tracking-widest leading-relaxed">
            <Timer
              displayedTimer={displayedTimer}
              timer={timer}
              handleRestart={handleRestart}
              isStarted={isStarted}
            />
            
            <TextField 
              practiceText={practiceText}
              practiceTextLetters={practiceTextLetters}
              typedLetterArr={typedLetterArr}
              setTypedLetterArr={setTypedLetterArr}
              isStarted={isStarted}
              setIsStarted={setIsStarted}
              timeUp={timeUp}
              onComplete={handleCompleteText} 
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
          )}
          
          <KeyboardShortcuts />
        </section>
    </main>
  );
}