import { useState } from "react";

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
      const res = await fetch(
        "https://gutendex.com/books?languages=en"
      );

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();

      const book = data.results[0];

      const textUrl =
        book.formats["text/plain"] ||
        book.formats["text/plain; charset=utf-8"];

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
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  };
  const fetchTextOffline = async () => {
    setText((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));
    try {
      const res = await fetch("/book.txt");
      const text = await res.text();
      setText((prev) => ({
        data:text,
        loading: false,
        error: null,
      }));    } catch (error) {
        console.error(error);
  
        setText({
          data: "",
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong",
        });
      }
}
  return {
    text,
    fetchTextOnline,
    fetchTextOffline,
  };
};