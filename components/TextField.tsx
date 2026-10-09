"use client";
import { useTextData } from "@/hooks/useTextData";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Stored in typedLetterArr for letters that were skipped by pressing space
 * in the middle of a word. It never equals a real letter, so it always counts
 * as incorrect, and it keeps typedLetterArr index-aligned with the practice text.
 */
const SKIPPED = "\u200B";

/** "line" (thin bar), "block" (as wide as the letter) or "underline" */
const CARET_STYLE: "line" | "block" | "underline" = "line";

// Single-line CSS so server and client text are identical (no CRLF/LF mismatch)
const CARET_CSS =
  "@keyframes tf-caret-pulse{0%,100%{opacity:1}50%{opacity:0}}.tf-caret{animation:tf-caret-pulse 1s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.tf-caret{animation:none}}";

/** Joins class names on one line, so line endings can never cause a hydration mismatch */
const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

type TextFieldProps = {
  practiceText: string;
  modeType: string;
  practiceTextLetters: string[];
  typedLetterArr: string[];
  setTypedLetterArr: Dispatch<SetStateAction<string[]>>;
  isStarted: boolean;
  setIsStarted: Dispatch<SetStateAction<boolean>>;
  timeUp: boolean;
  onComplete: (finalArr: string[]) => void;
};

type Word = {
  start: number; // index of first char in practiceTextLetters
  chars: string[]; // letters + the trailing space (if any)
};

function TextField({
  practiceText,
  modeType,
  practiceTextLetters,
  typedLetterArr,
  setTypedLetterArr,
  isStarted,
  setIsStarted,
  timeUp,
  onComplete,
}: TextFieldProps) {
  const { deleteBack, updateCaret, applyInput } = useTextData();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const completedRef = useRef(false);

  const [isFocused, setIsFocused] = useState(false);

  const n = typedLetterArr.length;
  const len = practiceTextLetters.length;

  /* ---------- Split the text into words (trailing space included) ---------- */
  const words = useMemo<Word[]>(() => {
    const out: Word[] = [];
    let i = 0;

    while (i < len) {
      let j = i;
      while (j < len && practiceTextLetters[j] !== " ") j++;
      if (j < len) j++; // include the trailing space
      out.push({ start: i, chars: practiceTextLetters.slice(i, j) });
      i = j;
    }

    return out;
  }, [practiceTextLetters, len]);

  /* ---------- Input ---------- */

  // The textarea is always empty, so onChange only ever receives what was just typed.
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (timeUp) return;

    const next = applyInput(
      practiceTextLetters,
      typedLetterArr,
      e.target.value,
      SKIPPED,
    );
    if (next === typedLetterArr) return;

    if (!isStarted) setIsStarted(true);
    setTypedLetterArr(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (timeUp || e.key !== "Backspace") return;

    e.preventDefault();
    const wholeWord = e.ctrlKey || e.altKey || e.metaKey;
    const next = deleteBack(
      practiceTextLetters,
      typedLetterArr,
      wholeWord,
      SKIPPED,
    );
    if (next !== typedLetterArr) setTypedLetterArr(next);
  };

  /* ---------- Complete current practice text ---------- */
  useEffect(() => {
    if (len === 0 || n !== len) {
      completedRef.current = false;
      return;
    }
    if (completedRef.current) return;

    completedRef.current = true;
    onComplete(typedLetterArr);
  }, [typedLetterArr, n, len, onComplete]);

  /* ---------- Focus handling ---------- */

  // Focus on mount, when a new text appears, when the mode changes,
  // and when a finished session is restarted
  useEffect(() => {
    if (!timeUp) textareaRef.current?.focus();
  }, [practiceText, timeUp, modeType]);

  // Any printable key takes focus back, even if a button was clicked last
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (timeUp || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      const active = document.activeElement;
      const isEditable =
        active instanceof HTMLElement &&
        (active.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName));

      if (!isEditable) textareaRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [timeUp]);

  /* ---------- Caret blinks only while idle ---------- */
  // Driven directly on the DOM node (no React state), so no extra renders.
  useEffect(() => {
    const caret = caretRef.current;
    if (!caret) return;

    if (n === 0) {
      caret.style.animationName = ""; // use the CSS blink
      return;
    }

    caret.style.animationName = "none"; // solid while typing
    const id = setTimeout(() => {
      caret.style.animationName = ""; // back to blinking when idle
    }, 700);

    return () => clearTimeout(id);
  }, [n, timeUp]);

  /* ---------- Smooth caret + line scrolling ---------- */

  useLayoutEffect(() => {
    charRefs.current.length = len;
    updateCaret(innerRef, charRefs, len, n, caretRef, CARET_STYLE);
  }, [updateCaret, practiceText, len, n]);

  // Re-measure when the layout changes (window resize, font finishes loading)
  useEffect(() => {
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!viewport || !inner) return;

    const observer = new ResizeObserver(() =>
      updateCaret(innerRef, charRefs, len, n, caretRef, CARET_STYLE),
    );
    observer.observe(viewport);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [updateCaret, len, n]);

  const showFocusOverlay = !isFocused && !timeUp;

  return (
    <div className="relative w-full">
      <style>{CARET_CSS}</style>

      {/* Visible text: exactly 3 lines tall */}
      <div
        ref={viewportRef}
        className={cx(
          "relative isolate h-[4.8em] overflow-hidden font-jetbrains text-lg md:text-3xl font-semibold tracking-widest leading-[1.6] select-none transition-[filter,opacity] duration-200",
          showFocusOverlay && "opacity-50 blur-[6px]",
        )}
      >
        <div
          ref={innerRef}
          className="relative w-full transition-transform duration-150 ease-out"
        >
          {/* Single smooth caret */}
          {!timeUp && (
            <span
              ref={caretRef}
              aria-hidden
              className={cx(
                "tf-caret pointer-events-none absolute left-0 top-0 -z-10 transition-transform duration-100 ease-out",
                CARET_STYLE === "block" ? "bg-amber-700/40" : "bg-amber-700",
                !isFocused && "invisible",
              )}
            />
          )}

          {words.map((word) => {
            const wordEnd = word.start + word.chars.length;

            // Underline words you've moved past that contain a mistake
            const hasError =
              n >= wordEnd &&
              word.chars.some((c, k) => typedLetterArr[word.start + k] !== c);

            return (
              <span key={word.start} className="inline-block whitespace-pre">
                {word.chars.map((character, k) => {
                  const index = word.start + k;
                  const typed = typedLetterArr[index];

                  let color = "text-gray-600";
                  if (typed !== undefined && typed !== SKIPPED) {
                    color =
                      typed === character ? "text-gray-200" : "text-red-500";
                  }

                  return (
                    <span
                      key={index}
                      ref={(el) => {
                        charRefs.current[index] = el;
                      }}
                      className={cx(
                        color,
                        hasError &&
                          "underline decoration-red-500 decoration-2 underline-offset-4",
                      )}
                    >
                      {character}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      </div>

      {/* "Click to focus" overlay */}
      {showFocusOverlay && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-base text-gray-300 md:text-xl">
          Click here or press any key to focus
        </div>
      )}

      {/* Invisible input. Always empty; we read only what was just typed. */}
      <textarea
        ref={textareaRef}
        value=""
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        disabled={timeUp}
        aria-label="Typing input"
        className="absolute inset-0 z-10 m-0 h-full w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-transparent caret-transparent outline-none cursor-default"
      />
    </div>
  );
}

export default TextField;