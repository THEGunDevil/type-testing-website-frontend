"use client";

import { Keyboard } from "lucide-react";

function Logo() {
  return (
    <div className="font-jetbrains flex flex-col items-end -space-y-0.5">
      <span className="font-extrabold text-2xl">Type.</span>
      <span className="text-[12px] flex items-center"><Keyboard size={17}/>Type</span>
    </div>

  );
}

export default Logo;
