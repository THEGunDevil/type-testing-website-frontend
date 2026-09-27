
export const loopString = (str: string): string[] => {
  const stringArr: string[] = [];
  for (const s of str) {
    stringArr.push(s);
  }
  return stringArr;
};

export const matchThroughArrayOfTypedStrings = (
  arrOfStr: string[], // Target letters array
  v: string,          // Last typed individual character
  i: number,          // Index of the last typed character
): boolean => {
  // Array boundary validation check
  if (i < 0 || i >= arrOfStr.length) return false;

  // Shudhu matro target array-er oi specific index-er letter-er sathe current type kora letter check hocche
  return arrOfStr[i] === v;
};
export const proccessedTextData = (text: string): string[] => {
  const cleanText = text
    .replace(/_/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.split(" ");
  const practiceTexts: string[] = [];

  for (let i = 0; i < words.length; i += 5) {
    const practiceText = words
      .slice(i, i + 5)
      .join(" ");

    practiceTexts.push(practiceText);
  }

  return practiceTexts;
};