import strict from "node:assert/strict";
import { useCallback, useState } from "react";

export const useTextData = () => {
  const [text, setText] = useState<{
    data: string;
    loading: boolean;
    error: string | null;
  }>({
    data: "",
    loading: false,
    error: null,
  });

  const fetchTextOnline = async () => {
    setText((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const res = await fetch("https://gutendex.com/books?languages=en");

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();

      const book = data.results[0];

      const textUrl =
        book.formats["text/plain"] || book.formats["text/plain; charset=utf-8"];

      if (!textUrl) {
        throw new Error("Plain text format not found");
      }

      const textRes = await fetch(textUrl);

      if (!textRes.ok) {
        throw new Error(`Text fetch failed: ${textRes.status}`);
      }

      const textData = await textRes.text();

      setText({
        data: textData,
        loading: false,
        error: null,
      });

      console.log("Book:", book);
      console.log("Text:", textData);
    } catch (error) {
      console.error(error);

      setText({
        data: "",
        loading: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };
  const fetchTextOffline = async (type: string) => {
    setText((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    let filePath: string;

    if (type === "bangla") {
      filePath = "/dena_pawna.txt";
    } else {
      filePath = "/book.txt";
    }
    try {
      const res = await fetch(filePath);

      const text = await res.text();
      setText({
        data: text,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error(error);

      setText({
        data: "",
        loading: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };
  const updateCaret = useCallback(
    (
      innerRef: React.RefObject<HTMLDivElement | null>,
      charRefs: React.RefObject<(HTMLSpanElement | null)[]>,
      len: number,
      n: number,
      caretRef: React.RefObject<HTMLSpanElement | null>,
      CARET_STYLE: string | "line",
    ) => {
      const inner = innerRef.current;
      if (!inner || len === 0) return;

      const target = charRefs.current[Math.min(n, len - 1)];
      if (!target) return;

      const lineHeight =
        parseFloat(getComputedStyle(inner).lineHeight) ||
        target.offsetHeight * 1.4;

      // Keep the caret on the 2nd visible line, like Monkeytype
      const line = Math.floor(
        (target.offsetTop + target.offsetHeight / 2) / lineHeight,
      );
      const scrollLines = Math.max(0, line - 1);
      inner.style.transform = `translateY(${-scrollLines * lineHeight}px)`;

      const caret = caretRef.current;
      if (caret) {
        const x = target.offsetLeft + (n >= len ? target.offsetWidth : 0);
        let y = target.offsetTop;
        let width = 4;
        let height = target.offsetHeight;

        if (CARET_STYLE === "block") {
          width = target.offsetWidth;
        } else if (CARET_STYLE === "underline") {
          width = target.offsetWidth;
          height = 3;
          y += target.offsetHeight - height;
        }

        caret.style.width = `${width}px`;
        caret.style.height = `${height}px`;
        caret.style.transform = `translate(${x}px, ${y}px)`;
      }
    },
    [],
  );
  function deleteBack(
    letters: string[],
    typed: string[],
    wholeWord: boolean,
    SKIPPED: string,
  ) {
    if (typed.length === 0) return typed;

    const last = typed.length - 1;

    // We're at the start of a word -> going back into the previous word
    if (typed[last] === " ") {
      const prevStart = last > 0 ? letters.lastIndexOf(" ", last - 1) + 1 : 0;

      // Can't go back into a previous word that was typed correctly
      const wasCorrect = typed
        .slice(prevStart, last)
        .every((c, k) => c === letters[prevStart + k]);
      if (wasCorrect) return typed;

      if (wholeWord) return typed.slice(0, prevStart);

      // Remove the space and any skipped-letter padding
      const next = typed.slice(0, last);
      while (next.length > 0 && next[next.length - 1] === SKIPPED) next.pop();
      return next;
    }

    if (wholeWord) {
      const wordStart = letters.lastIndexOf(" ", last) + 1;
      return typed.slice(0, wordStart);
    }

    return typed.slice(0, -1);
  }
  function applyInput(
    letters: string[],
    typed: string[],
    input: string,
    SKIPPED: string,
  ) {
    let arr = typed;

    for (const ch of input) {
      if (arr.length >= letters.length) break;
      if (ch === "\n" || ch === "\r" || ch === "\t") continue;

      const i = arr.length;
      const expected = letters[i];

      if (ch === " ") {
        // Normal space at the end of a word
        if (expected === " ") {
          arr = [...arr, " "];
          continue;
        }

        // Space at the start of a word is ignored (like Monkeytype)
        const atWordStart = i === 0 || letters[i - 1] === " ";
        if (atWordStart) continue;

        // Space in the middle of a word: skip the rest of the word
        const spaceIdx = letters.indexOf(" ", i);
        if (spaceIdx === -1) continue; // last word, nothing to skip to

        arr = [...arr, ...new Array<string>(spaceIdx - i).fill(SKIPPED), " "];
        continue;
      }

      // A letter where a space is expected is ignored (press space to continue)
      if (expected === " ") continue;

      arr = [...arr, ch];
    }

    return arr;
  }
  return {
    text,
    fetchTextOnline,
    fetchTextOffline,
    deleteBack,
    updateCaret,
    applyInput,
  };
};
