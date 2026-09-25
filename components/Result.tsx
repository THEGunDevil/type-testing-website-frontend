import React from "react";

type ResultProps = {
  countCorrectWords: number;
  accuracy: number;
  practiceTextLettersLength: number;
  selectedTimer: number | null;
  incorrectCharacterCount: number;
  correctCharacterCount: number;
};

function Result({
  countCorrectWords,
  accuracy,
  practiceTextLettersLength,
  selectedTimer,
  incorrectCharacterCount,
  correctCharacterCount,
}: ResultProps) {
  return (
    <div className="mt-5 text-center text-amber-700">
      <h2 className="text-4xl">Time Up!</h2>

      <div className="mt-4 flex flex-col gap-2 text-xl md:flex-row md:justify-center md:gap-3">
        <p>WPM: {countCorrectWords}</p>
        <span className="hidden md:block">|</span>

        <p>Accuracy: {accuracy}%</p>
        <span className="hidden md:block">|</span>

        <p>Characters: {practiceTextLettersLength}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-xl md:flex-row md:justify-center md:gap-3">
        <p>Correct: {correctCharacterCount}</p>
        <span className="hidden md:block">|</span>

        <p>Incorrect: {incorrectCharacterCount}</p>
        <span className="hidden md:block">|</span>

        <p>Time: {selectedTimer}s</p>
      </div>
    </div>
  );
}

export default Result;