import React from "react";
import { Sudoku } from "./sudoku";
import { Global, css } from "@emotion/react";

export default function SudokuApp() {
  return (
    <div className="items-center justify-center inline-flex flex-col">
      <Global
        styles={css`
          .bounceZoom {
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
    </div>
  );
}
