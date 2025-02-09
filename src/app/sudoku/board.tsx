import React from "react";
import styled from "@emotion/styled";
import { SudokuSquare, type SudokuSquareProps } from "./square";
import { getBoardIndex } from "./utils";
import type { Prettify, ReducerState, SudokuBoardRow, Value } from "./types";

const StyledBoardDiv = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: white;

  overflow: hidden;
  color: black;
  border-color: black;

  & > div {
    border-bottom: solid 1px #00000089;
  }
  & > div:nth-of-type(3n) {
    border-bottom: 2px solid black;
  }
  & > div:first-of-type {
    border-top: 2px solid black;
  }
`;

const StyledRowDiv = styled.div`
  & > div:nth-of-type(3n) {
    border-right: 2px solid black;
  }
  & > div:first-of-type {
    border-left: 2px solid black;
  }
  & > div {
    border-right: solid 1px #00000089;
  }
`;

type BoardProps = Prettify<
  Pick<
    ReducerState,
    | "board"
    | "conflictBoardIndices"
    | "hintIndex"
    | "notesOn"
    | "selectedBoardIndex"
    | "selectedColumnIndex"
    | "selectedRowIndex"
    | "values"
  > &
    Pick<SudokuSquareProps, "setSelectedBoardIndices">
>;

export const Board: React.FC<BoardProps> = React.memo(
  ({
    board,
    conflictBoardIndices,
    hintIndex,
    notesOn,
    selectedBoardIndex,
    selectedColumnIndex,
    selectedRowIndex,
    values,
    setSelectedBoardIndices,
  }) => {
    const buildRow = React.useCallback(
      (rowIndex: number) =>
        function SudokuRow(value: Value, columnIndex: number) {
          const boardIndex = getBoardIndex(rowIndex, columnIndex);
          const val = values.get(boardIndex);

          if (!val) {
            return;
          }

          const showNotes =
            notesOn &&
            (value.noteValues.some((noteValue) => noteValue.isSelected) ||
              selectedBoardIndex === boardIndex);

          return (
            <SudokuSquare
              key={`$square-${rowIndex}-${columnIndex}`}
              value={val}
              initialValue={value}
              rowIndex={rowIndex}
              boardIndex={boardIndex}
              columnIndex={columnIndex}
              selectedColumnIndex={selectedColumnIndex}
              selectedRowIndex={selectedRowIndex}
              selectedBoardIndex={selectedBoardIndex}
              showNotes={showNotes}
              setSelectedBoardIndices={(values) =>
                setSelectedBoardIndices(values)
              }
              isConflictSquare={conflictBoardIndices.has(boardIndex)}
              isHint={hintIndex === boardIndex}
            />
          );
        },
      [
        conflictBoardIndices,
        hintIndex,
        notesOn,
        selectedBoardIndex,
        selectedColumnIndex,
        selectedRowIndex,
        values,
      ]
    );
    return (
      <StyledBoardDiv>
        {board.map((rowValues: SudokuBoardRow, rowIndex: number) => {
          return (
            <StyledRowDiv className="inline-flex" key={rowIndex}>
              {rowValues.map(buildRow(rowIndex))}
            </StyledRowDiv>
          );
        })}
      </StyledBoardDiv>
    );
  }
);

Board.displayName = "Board";
