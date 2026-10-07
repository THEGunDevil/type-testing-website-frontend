"use client"
import { Clock } from 'lucide-react'
type ChallengeOptionProps = {
  challengeOptions: number[];
  timer: number;
  handleChangeTimeOnHover: (option: number) => void;
  setHoveredTimer: (value: number | null) => void;
  handleChangeTimeOnClick: (option: number) => void;
};
function ChallengeOptions({
  challengeOptions,
  timer,
  handleChangeTimeOnClick,
  setHoveredTimer,
  handleChangeTimeOnHover,
}:ChallengeOptionProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-5 md:flex-row md:gap-5">
      <p className="flex items-center gap-2 text-amber-600">
        <Clock size={20} />
        <span>Pick Your Challenge</span>
        <span className="hidden md:inline">→</span>
      </p>

      <div className="flex items-center gap-3">
        {challengeOptions.map((option:number) => (
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
    </div>  )
}

export default ChallengeOptions
