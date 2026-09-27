"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

type TextFieldProps = {
  practiceText: string;
  practiceTextLetters: string[];
  typedLetterArr: string[];
  setTypedLetterArr: Dispatch<SetStateAction<string[]>>;
  isStarted: boolean;
  setIsStarted: Dispatch<SetStateAction<boolean>>;
  timeUp: boolean;
  onComplete: (finalArr: string[]) => void;
};

function TextField({
  practiceText,
  practiceTextLetters,
  typedLetterArr,
  setTypedLetterArr,
  isStarted,
  setIsStarted,
  timeUp,
  onComplete,
}: TextFieldProps) {
  const handleTypedText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    const value = e.target.value;

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
    }

    // TextField.tsx এর ভেতরে handleTypedText ফাংশন:

        const newTypedArr = value.split("");
        setTypedLetterArr(newTypedArr);

        if (value.length === 0) return;

        // > এর বদলে === বা >= দিন এবং ভেতরে newTypedArr পাস করুন
  };
  useEffect(() => {
      if (
        typedLetterArr.length > 0 &&
        typedLetterArr.length === practiceTextLetters.length
      ) {
        onComplete(typedLetterArr);
      }
    }, [typedLetterArr, practiceTextLetters.length]);
  return (
    <>
      <div className="absolute overflow-hidden inset-0 text-gray-600 pointer-events-none break-all whitespace-pre-wrap select-none">
        {practiceText}
      </div>
      {/* Typed Character Display Layer */}
      <div className="absolute inset-0 break-all whitespace-pre-wrap overflow-y-auto pointer-events-none">
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
        value={typedLetterArr.join("")} /* Bind value to clear field on reset */
        onChange={handleTypedText}
        spellCheck={false}
        // onPaste prevents users from pasting any text
        onPaste={(e) => e.preventDefault()}
        disabled={timeUp}
        maxLength={practiceTextLetters.length}
        className="absolute lg:w-2xl inset-0 scrollbar-none h-full w-full resize-none bg-transparent text-transparent outline-none caret-amber-700 z-10 break-all whitespace-pre-wrap"
      />
    </>
  );
}

export default TextField;
