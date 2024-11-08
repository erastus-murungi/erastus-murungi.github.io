"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { css, Global } from "@emotion/react";
import { Sudoku } from "./sudoku";

export default function Home() {
  return (
    <div className="flex justify-center items-center">
      <TooltipProvider>
        <Global
          styles={css`
            .hintAnimation {
              @keyframes bounceZoom {
                0%,
                100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.5);
                }
              }
            }
          `}
        />

        <Sudoku onComplete={() => {}} hide={false} />
      </TooltipProvider>
    </div>
  );
}
