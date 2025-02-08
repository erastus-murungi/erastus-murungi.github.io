import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { NoteValue } from "./types";
import type { List } from "immutable";
import React, { useState } from "react";

// Styled component for the notes container
export const StyledNotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  cursor: pointer;
`;

// Function to generate styles based on selection state
const noteStyles = ({ isSelected }: { isSelected: boolean }) => css`
  font-size: 12px;
  color: ${isSelected ? "black" : "#488470"};
  background-color: #488470;
  transition: color 0.25s ease;

  &:hover {
    color: ${!isSelected ? "white" : "black"};
    animation: ${!isSelected ? "fadeIn 0.5s linear" : "none"};
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

// Styled component for individual note items
export const NoteItem = styled.div<{ isSelected: boolean }>`
  ${noteStyles}
`;

// Main component to render the list of notes
export const NotesGrid: React.FC<{ noteValues: List<NoteValue> }> = ({
  noteValues,
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
    <StyledNotesGrid>
      {noteValues.map((noteValue, index) => (
        <NoteItem
          className="flex items-center justify-center"
          isSelected={selectedStates.get(index) ?? false}
          key={`note_${noteValue.value}`}
          onClick={() => handleToggleSelection(index)}
        >
          {noteValue.value}
        </NoteItem>
      ))}
    </StyledNotesGrid>
  );
};
