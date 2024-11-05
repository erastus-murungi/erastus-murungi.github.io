import React from "react";
import { Sudoku } from "./sudoku";

export default function SudokuApp() {
  return (
    <div className="items-center justify-center inline-flex flex-col">
      <Sudoku onComplete={() => {}} hide={false} />
    </div>
  );
}
