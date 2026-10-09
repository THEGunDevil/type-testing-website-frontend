
"use client";

import { useState } from "react";

type ToggleModeProps = {
  ToggleModes: string[];
  activeIndex: number;
  onToggle: (text: string, index: number) => void;
};

export function ToggleMode({
  ToggleModes = [],
  activeIndex,
  onToggle,
}: ToggleModeProps) {
  if (ToggleModes.length === 0) return null;

  return (
    <div
      className="
        relative isolate grid w-fit grid-flow-col
        auto-cols-[3.75rem] sm:auto-cols-[5rem]
        rounded-md py-1
      "
    >
      {/* Sliding background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-1 left-0
          rounded bg-gray-500/40
          transition-transform duration-300 ease-out
        "
        style={{
          width: `${100 / ToggleModes.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {/* Toggle buttons */}
      {ToggleModes.map((text, index) => {
        const isActive = activeIndex === index;

        return (
          <button
            key={text}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(text, index)}
            className={`
              relative z-10 flex w-full min-w-0
              items-center justify-center
              whitespace-nowrap px-0 py-1.5 text-[10px] sm:px-1 sm:py-2 sm:text-xs font-medium
              select-none cursor-pointer
              transition-colors duration-300
              ${
                isActive
                  ? "text-amber-400"
                  : "text-amber-100/70 hover:text-amber-100"
              }
            `}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

export const useToggleMode = (initialModes: string[] = []) => {
  const [mode, setMode] = useState({
    modeType: initialModes[0] || "",
    modeIndex: 0,
  });

  const handleToggle = (text: string, index: number) => {
    setMode({
      modeType: text,
      modeIndex: index,
    });
  };

  return {
    modeType: mode.modeType,
    activeIndex: mode.modeIndex,
    handleToggle,
  };
};