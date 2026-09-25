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