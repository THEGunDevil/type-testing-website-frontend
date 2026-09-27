"use client"

import { RotateCcw } from "lucide-react";

type TimerProps = {
  isStarted: boolean;
  displayedTimer: number;
  timer: number;
  handleRestart: () => void;
}
function Timer({
  isStarted,
  displayedTimer,
  timer,
  handleRestart,
}:TimerProps) {
  return (
    <div className="absolute -top-10 left-0 w-full flex items-center justify-between font-mono text-xl text-white">
      <div className="relative h-7  w-full overflow-hidden">
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
        onClick={handleRestart}
        className="hover:text-amber-700 transition-colors cursor-pointer duration-200"
      >
        <RotateCcw size={20} />
      </button>
    </div>  )
}

export default Timer