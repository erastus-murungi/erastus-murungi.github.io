import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sudoku } from "./sudoku";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

export default function SudokuApp() {
  const difficulties = React.useRef<Difficulty[]>([
    "easy",
    "medium",
    "hard",
    "expert",
  ]);
  const [selectedDifficulty, setSelectedDifficulty] =
    React.useState<Difficulty>("easy");

  return (
    <div className="items-center justify-center inline-flex flex-col">
      <Select
        onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
      >
        <SelectTrigger className={`w-[150px]`}>
          <SelectValue placeholder="Select Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Difficulty</SelectLabel>
            {difficulties.current.map((difficulty) => (
              <SelectItem
                className={`w-[150px]`}
                key={difficulty}
                value={difficulty}
              >
                {difficulty}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Sudoku
        difficulty={selectedDifficulty}
        onComplete={() => {}}
        hide={false}
      />
    </div>
  );
}
