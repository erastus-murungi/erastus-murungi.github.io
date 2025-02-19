import React from 'react';
import styled from '@emotion/styled';
import { SudokuSquare, type SudokuSquareProps } from './sudoku-square';
import { createSudokuIndex } from './models/sudoku-index';
import type {
    Prettify,
    ReducerState,
    SudokuBoardRow,
    SudokuCell as Cell,
} from './types';

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
        | 'conflictingIndices'
        | 'hintIndex'
        | 'notesEnabled'
        | 'selectedIndexSet'
        | 'autoCheckEnabled'
    > &
        Pick<SudokuSquareProps, 'setSelectedIndexSet'> & {
            onNoteClick: (note: number) => void;
        }
>;

export const SudokuBoard: React.FC<BoardProps> = ({
    board,
    conflictingIndices,
    hintIndex,
    notesEnabled,
    selectedIndexSet,
    setSelectedIndexSet,
    onNoteClick,
    autoCheckEnabled,
}) => {
    const buildRow = React.useCallback(
        (rowIndex: number) =>
            function SudokuRow(_initialValue: Cell, columnIndex: number) {
                const indexSet = createSudokuIndex({ rowIndex, columnIndex });
                const cell = board.getCellAt(indexSet);

                if (!cell) {
                    return;
                }

                const boardIndex = indexSet.boardIndex;

                const showNotes =
                    notesEnabled &&
                    (cell.hasNotes() || selectedIndexSet === indexSet);

                const isWrong =
                    selectedIndexSet === indexSet &&
                    !conflictingIndices.isEmpty();

                return (
                    <SudokuSquare
                        key={`$square-${rowIndex}-${columnIndex}`}
                        cell={cell}
                        indexSet={indexSet}
                        selectedIndices={selectedIndexSet}
                        showNotes={showNotes}
                        setSelectedIndexSet={(values) =>
                            setSelectedIndexSet(values)
                        }
                        onNoteClick={(note) => onNoteClick(note)}
                        isConflictSquare={conflictingIndices.has(boardIndex)}
                        isHint={hintIndex === boardIndex}
                        isWrong={isWrong}
                        autoCheckEnabled={autoCheckEnabled}
                    />
                );
            },
        [
            conflictingIndices,
            hintIndex,
            notesEnabled,
            selectedIndexSet,
            board,
            setSelectedIndexSet,
            onNoteClick,
            autoCheckEnabled,
        ]
    );
    return (
        <StyledBoardDiv>
            {board.grid.map((rowValues: SudokuBoardRow, rowIndex: number) => {
                return (
                    <StyledRowDiv className="inline-flex" key={rowIndex}>
                        {rowValues.map(buildRow(rowIndex))}
                    </StyledRowDiv>
                );
            })}
        </StyledBoardDiv>
    );
};

SudokuBoard.displayName = 'Board';
