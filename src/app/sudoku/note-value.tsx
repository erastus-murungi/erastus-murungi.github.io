import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { NoteValue } from "./types";
import type { List } from "immutable";

export const NotesStyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  cursor: pointer;
  background-color: #61b3fa;
  color: #61b3fa;
  padding-bottom: 1px;
`;

const noteValueStyles = ({ isSelected }: { isSelected: boolean }) => css`
  font-size: 12px;
  color: ${isSelected ? "black" : "#61b3fa"};
  background-color: #61b3fa;
  ${!isSelected &&
  css`
    :hover {
      color: white;
      animation: fadeIn 0.5s linear;

      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    }
  `}

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  transition: animation 0.5s fadeOut;
`;

export const NotesValue = styled.div`
  ${noteValueStyles}
`;

export const NotesWrapper: React.FC<{ noteValues: List<NoteValue> }> = ({
  noteValues,
}) => (
  <NotesStyledDiv>
    {noteValues.map((noteValue) => (
      <NotesValue
        className="flex items-center justify-center"
        isSelected={noteValue.isSelected}
        key={`note_${noteValue.value}`}
        onClick={() => (noteValue.isSelected = !noteValue.isSelected)}
      >
        {noteValue.value}
      </NotesValue>
    ))}
  </NotesStyledDiv>
);
