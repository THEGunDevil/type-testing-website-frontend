"use client";

import { useState } from "react";

type ToggleModeProps = {
  ToggleModes: string[];
  activeIndex: number;
  onToggle: (text: string, index: number) => void;
};

// ==========================================
// 1. THE UI COMPONENT (Declared Independently)
// ==========================================
export function ToggleMode({ ToggleModes = [], activeIndex, onToggle }: ToggleModeProps) {
  // Dimensions for translation math
  const BUTTON_WIDTH_CLASS = "w-20";
  const BUTTON_WIDTH_PX = 80; // 28 * 4px
  const GAP_PX = 8; // space-x-2 = 8px

  return (
    <div className="py-1.5 flex space-x-2 relative isolate w-fit">
      {/* The Single Sliding Background Pill */}
      <div
        className={`absolute top-1 bottom-1 ${BUTTON_WIDTH_CLASS} bg-gray-500/40 rounded z-0 transition-transform duration-300 ease-out`}
        style={{
          transform: `translateX(${activeIndex * (BUTTON_WIDTH_PX + GAP_PX)}px)`,
        }}
      />

      {/* The Interaction Buttons */}
      {ToggleModes.map((t, i) => {
        const isActive = activeIndex === i;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(t, i)}
            className={`${BUTTON_WIDTH_CLASS} cursor-pointer text-xs select-none font-medium text-center relative z-10 transition-colors duration-300 ${
              isActive ? "text-amber-400" : "text-amber-100/70 hover:text-amber-100"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ==========================================
// 2. THE CUSTOM HOOK (Manages State Only)
// ==========================================
export const useToggleMode = (initialModes: string[] = []) => {
  const [mode, setMode] = useState({
    modeType: initialModes?.[0] || "",
    modeIndex: 0,
  });

  const handleToggle = (text: string, index: number) => {
    setMode({ modeType: text, modeIndex: index });
  };

  return {
    modeType: mode.modeType,
    activeIndex: mode.modeIndex,
    handleToggle,
  };
};
