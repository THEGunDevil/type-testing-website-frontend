"use client";

import React from "react";

type AnimatedBtnProps = {
  children: React.ReactNode;
  isActive?: boolean;
  LPunctuation?: string;
  RPunctuation?: string;
  animate?: boolean;
};

function AnimatedBtn({
  children,
  isActive = false,
  LPunctuation = "{",
  RPunctuation = "}",
  animate = true,
}: AnimatedBtnProps) {
  // Normal button হলে শুধু children render করবে
  if (!animate) {
    return <>{children}</>;
  }

  const punctuationClass = `
    transition-all duration-300
    ${
      isActive
        ? "translate-y-0 opacity-100"
        : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
    }
  `;

  return (
    <>
      <span className={punctuationClass}>{LPunctuation}</span>

      {children}

      <span className={punctuationClass}>{RPunctuation}</span>
    </>
  );
}

export default AnimatedBtn;
