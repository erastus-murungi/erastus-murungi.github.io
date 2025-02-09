import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { Maybe, Value } from "./types";
import { SudokuCell } from "./value";

export interface SudokuSquareProps {
  selectedColumnIndex: Maybe<number>;
  selectedRowIndex: Maybe<number>;
  selectedBoardIndex: Maybe<number>;
  rowIndex: number;
  boardIndex: number;
  index: number;
  value: Value;
  initialValue: Value;
  setSelectedBoardIndices: (values: {
    selectedBoardIndex: number;
    selectedColumnIndex: number;
    selectedRowIndex: number;
  }) => void;
  showNotes: boolean;
  isConflictSquare: boolean;
  isHint: boolean;
}

const outerDivStyles = ({
  isThickRight,
  isLastColumn,
  isThickBottom,
  isLastRow,
  isSelected,
  isShowingNotes,
  isConflictSquare,
  isSelectedBoardIndex,
  isHint,
}: {
  isThickRight: boolean;
  isSelected: boolean;
  isThickBottom: boolean;
  isLastColumn: boolean;
  isLastRow: boolean;
  isSelectedBoardIndex: boolean;
  isShowingNotes: boolean;
  isConflictSquare: boolean;
  isHint: boolean;
}) =>
  isHint
    ? css`
        @keyframes rotate {
          100% {
            transform: rotate(1turn);
          }
        }

        position: relative;
        z-index: 0;
        border-radius: 2px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

        &::before {
          content: "";
          position: absolute;
          z-index: -2;
          left: -50%;
          top: -50%;
          width: 200%;
          height: 200%;
          background-color: #399953;
          background-repeat: no-repeat;
          background-size: 50% 50%, 50% 50%;
          background-position: 0 0, 100% 0, 100% 100%, 0 100%;
          background-image: linear-gradient(#399953, #399953),
            linear-gradient(#fbb300, #fbb300), linear-gradient(#d53e33, #d53e33),
            linear-gradient(#377af5, #377af5);
          animation: rotate 4s linear infinite;
        }

        &::after {
          content: "";
          position: absolute;
          z-index: -1;
          left: 6px;
          top: 6px;
          width: calc(100% - 12px);
          height: calc(100% - 12px);
          background: white;
          border-radius: 5px;
        }

        border-right: ${isThickRight
          ? `solid 4px #000`
          : isLastColumn
          ? ""
          : "solid 1px #000"};
        border-bottom: ${isThickBottom
          ? `solid 4px #000`
          : isLastRow
          ? ""
          : "solid 1px #000"};
        &:hover {
          cursor: "pointer";
          background-color: rgba(28, 28, 28, 0.5);
        }
        background-color: ${isConflictSquare
          ? "rgba(226, 26, 12, 0.25)"
          : isShowingNotes
          ? "rgba(11, 53, 207, 0.25)"
          : isSelectedBoardIndex
          ? ""
          : isSelected
          ? "rgba(28, 28, 28, 0.25)"
          : ""};
        animation: ${isConflictSquare ? "bounceZoom 0.5s ease-in-out" : ""};
      `
    : css`
        position: relative;
        border-right: ${isThickRight
          ? `solid 4px #000`
          : isLastColumn
          ? ""
          : "solid 1px #000"};
        border-bottom: ${isThickBottom
          ? `solid 4px #000`
          : isLastRow
          ? ""
          : "solid 1px #000"};
        &:hover {
          cursor: "pointer";
          background-color: rgba(28, 28, 28, 0.5);
        }
        background-color: ${isConflictSquare
          ? "rgba(226, 26, 12, 0.25)"
          : isShowingNotes
          ? "rgba(11, 53, 207, 0.25)"
          : isSelectedBoardIndex
          ? ""
          : isSelected
          ? "rgba(28, 28, 28, 0.25)"
          : ""};
      `;

const OuterContainer = styled.div`
  ${outerDivStyles}
`;

export const SudokuSquare: React.FC<SudokuSquareProps> = ({
  selectedColumnIndex: selectedIndex,
  selectedRowIndex,
  selectedBoardIndex,
  rowIndex,
  boardIndex,
  index,
  value,
  initialValue,
  setSelectedBoardIndices,
  showNotes,
  isConflictSquare,
  isHint,
}) => {
  return (
    <OuterContainer
      className="sm:w-14 sm:h-14 w-8 h-8 rainbow"
      isSelected={selectedIndex === index || rowIndex === selectedRowIndex}
      isLastColumn={index === 8}
      isLastRow={rowIndex === 8}
      isThickRight={index === 2 || index === 5}
      isThickBottom={rowIndex === 2 || rowIndex === 5}
      isSelectedBoardIndex={selectedBoardIndex === boardIndex}
      isConflictSquare={isConflictSquare}
      isShowingNotes={showNotes}
      isHint={isHint}
      onClick={() => {
        setSelectedBoardIndices({
          selectedColumnIndex: index,
          selectedRowIndex: rowIndex,
          selectedBoardIndex: boardIndex,
        });
      }}
    >
      <SudokuCell
        answer={initialValue.answer}
        noteValues={value.noteValues}
        hasError={value.hasError}
        value={value.value || initialValue.value}
        isSelectedBoardIndex={selectedBoardIndex === boardIndex}
        isOriginal={value.isOriginal}
        showNotes={showNotes}
      />
    </OuterContainer>
  );
};

SudokuSquare.displayName = "SudokuSquare";
