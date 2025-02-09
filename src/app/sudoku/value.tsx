import React, { useState } from "react";
import styled from "@emotion/styled";
import { publicSans } from "@/styles/fonts";
import type { Value } from "./types";
// import type { List } from "immutable";

const SudokuCellWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-sizing: border-box;
`;

const MainNumber = styled.div`
  z-index: 1;
`;

const NotesGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  font-size: 11px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  color: #888;

  @media (max-width: 599px) {
    font-size: 6px;
  }
`;

const Note = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ isSelected }) => (isSelected ? "black" : "#488470")};
  background-color: #488470;
  transition: color 0.25s ease;

  &:hover {
    color: ${({ isSelected }) => (isSelected ? "black" : "white")};
    animation: ${({ isSelected }) =>
      isSelected ? "none" : "fadeIn 0.5s linear"};
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

interface SudokuCellProps extends Value {
  showNotes: boolean;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  noteValues,
  showNotes,
}) => {
  // Local state to manage selection
  const [selectedStates, setSelectedStates] = useState(
    noteValues.map((note) => note.isSelected)
  );

  // Toggle selection state
  const handleToggleSelection = (index: number) => {
    const updatedStates = selectedStates.update(
      index,
      (isSelected) => !isSelected
    );
    setSelectedStates(updatedStates);
  };

  return (
    <SudokuCellWrapper>
      {showNotes ? (
        <NotesGrid>
          {noteValues.map((noteValue, index) => (
            <Note
              className="flex items-center justify-center"
              isSelected={selectedStates.get(index) ?? false}
              key={`note_${noteValue.value}`}
              onClick={() => handleToggleSelection(index)}
            >
              {noteValue.value}
            </Note>
          ))}
        </NotesGrid>
      ) : (
        <MainNumber className={`${publicSans.className}`}>{value}</MainNumber>
      )}
    </SudokuCellWrapper>
  );
};
