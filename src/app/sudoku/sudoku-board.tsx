import React from 'react';
import styled from '@emotion/styled';
import { SudokuSquare, type SudokuSquareProps } from './sudoku-square';
import { createIndexSet, getBoardIndex } from './utils';
import type { Prettify, ReducerState, SudokuBoardRow, Value } from './types';

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
        | 'board'
        | 'conflictBoardIndices'
        | 'hintIndex'
        | 'notesOn'
        | 'selectedIndexSet'
        | 'values'
        | 'autoCheckEnabled'
    > &
        Pick<SudokuSquareProps, 'setSelectedIndexSet'> & {
            onNoteClick: (note: number) => void;
        }
>;

export const Board: React.FC<BoardProps> = ({
    board,
    conflictBoardIndices,
    hintIndex,
    notesOn,
    selectedIndexSet,
    values,
    setSelectedIndexSet,
    onNoteClick,
    autoCheckEnabled,
}) => {
    const selectedBoardIndex = selectedIndexSet?.boardIndex;

    const buildRow = React.useCallback(
        (rowIndex: number) =>
            function SudokuRow(initialValue: Value, columnIndex: number) {
                const boardIndex = getBoardIndex(rowIndex, columnIndex);
                const value = values.get(boardIndex);

                if (!value) {
                    return;
                }

                const showNotes =
                    notesOn &&
                    (!value.notes.isEmpty() ||
                        selectedBoardIndex === boardIndex);

                const isWrong =
                    selectedIndexSet?.boardIndex === boardIndex &&
                    !conflictBoardIndices.isEmpty();

                return (
                    <SudokuSquare
                        key={`$square-${rowIndex}-${columnIndex}`}
                        value={value}
                        initialValue={initialValue}
                        indexSet={createIndexSet({ rowIndex, columnIndex })}
                        selectedIndexSet={selectedIndexSet}
                        showNotes={showNotes}
                        setSelectedIndexSet={(values) =>
                            setSelectedIndexSet(values)
                        }
                        onNoteClick={(note) => onNoteClick(note)}
                        isConflictSquare={conflictBoardIndices.has(boardIndex)}
                        isHint={hintIndex === boardIndex}
                        isWrong={isWrong}
                        autoCheckEnabled={autoCheckEnabled}
                    />
                );
            },
        [
            conflictBoardIndices,
            hintIndex,
            notesOn,
            selectedIndexSet,
            selectedBoardIndex,
            values,
            setSelectedIndexSet,
            onNoteClick,
            autoCheckEnabled,
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
};

Board.displayName = 'Board';
