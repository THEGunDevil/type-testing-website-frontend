"use client";

import ChallengeOptions from "@/components/ChallengeOptions";
import KeyboardShortcuts from "@/components/keyboardShortcuts";
import Result from "@/components/Result";
import TextField from "@/components/TextField";
import Timer from "@/components/Timer";
import { useTextData } from "@/hooks/useTextData";
import { loopString, proccessedTextData } from "@/lib/utils";
import { useEffect, useState, useMemo, useRef } from "react"; // useRef যুক্ত করা হয়েছে

export default function Home() {
  const { text, fetchTextOffline } = useTextData();

  useEffect(() => {
    fetchTextOffline();
  }, []);

  const processedTexts = useMemo(
    () => proccessedTextData(text?.data ?? ""),
    [text],
  );
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const practiceText = processedTexts[currentTextIndex] ?? "";
  const practiceTextLetters = useMemo(
    () => loopString(practiceText),
    [practiceText],
  );

  const [typedLetterArr, setTypedLetterArr] = useState<string[]>([]);

  // লেটেস্ট টাইপ করা ডেটা ট্র্যাক করার জন্য useRef ব্যবহার করা হলো
  const typedLetterArrRef = useRef<string[]>([]);
  useEffect(() => {
    typedLetterArrRef.current = typedLetterArr;
  }, [typedLetterArr]);

  const [timer, setTimer] = useState<number>(30);
  const timerRef = useRef(timer);
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timeUp, setTimeUp] = useState<boolean>(false);
  const [hoveredTimer, setHoveredTimer] = useState<number | null>(null);

  const typedLetterArrToParagraph: string = typedLetterArr.join("");
  const typedWords = typedLetterArrToParagraph.split(" ");
  const [totalOfTypedLetters, setTotalOfTypedLetters] = useState<string[][]>(
    [],
  );
  useEffect(() => {
    if (!isStarted) return; // গেম শুরু না হলে কিছুই হবে না

    const interval = setInterval(() => {
      // timerRef.current ব্যবহার করে আমরা চেক করছি সময় ১ বা তার কম হলো কি না
      if (timerRef.current <= 1) {
        clearInterval(interval);
        setTimer(0);
        setTimeUp(true);
        setIsStarted(false);
        setTotalOfTypedLetters((prevArr) => [
          ...prevArr,
          typedLetterArrRef.current,
        ]);
      } else {
        setTimer((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup function
  }, [isStarted]); // এখানে শুধু isStarted থাকবে

  let countCorrectWords: number = 0;

  for (const w of typedWords) {
    if (w && practiceText.includes(w)) {
      countCorrectWords++;
    }
  }
  const correctCharacterCount = typedLetterArr.reduce(
    (count, letter, index) => {
      return letter === practiceTextLetters[index] ? count + 1 : count;
    },
    0,
  );

  const incorrectCharacterCount = typedLetterArr.length - correctCharacterCount;
  const accuracy =
    typedLetterArr.length > 0
      ? Math.round((correctCharacterCount / typedLetterArr.length) * 100)
      : 0;

  // Handlers
  const challengeOptions = [30, 60];

  const handleChangeTimeOnHover = (o: number) => setHoveredTimer(o);

  const handleChangeTimeOnClick = (o: number) => {
    setTimer(o);
    setSelectedTimer(o);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
    setTotalOfTypedLetters([]); // সময় পরিবর্তন করলে হিস্ট্রি ক্লিয়ার হওয়া উচিত
  };

  const handleRestart = () => {
    setTimer(selectedTimer ?? 30);
    setTimeUp(false);
    setTypedLetterArr([]);
    setIsStarted(false);
    setHoveredTimer(null);
    setTotalOfTypedLetters([]); // রিস্টার্ট করলেও হিস্ট্রি ক্লিয়ার করে দেওয়া হলো
    setCurrentTextIndex(0); // রিস্টার্টে প্রথম টেক্সটে নিয়ে আসার জন্য (প্রয়োজন হলে)
  };

  // Home.tsx এর ভেতরে:

  const handleCompleteText = (finalTypedArr: string[]) => {
    // এখানে typedLetterArr এর বদলে finalTypedArr ব্যবহার করুন!
    setTotalOfTypedLetters((prev) => [...prev, finalTypedArr]);

    const nextIndex = currentTextIndex + 1;
    if (nextIndex < processedTexts.length) {
      setCurrentTextIndex(nextIndex);
      setTypedLetterArr([]);
    } else {
      // The whole test is completely finished.
    }
  };

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
  }, [selectedTimer]);

  const displayedTimer = hoveredTimer ?? timer;

  // useEffect(() => {
  //   console.log(totalOfTypedLetters);
  // }, [totalOfTypedLetters]);
  console.log(practiceTextLetters.length);
  console.log(typedLetterArr.length);
  console.log("practiceTextLetters: ", practiceTextLetters);
  console.log("typedLetterArr: ", typedLetterArr);
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
