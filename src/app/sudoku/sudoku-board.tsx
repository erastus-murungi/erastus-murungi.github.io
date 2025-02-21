import React from 'react';
import { SudokuSquare, type SudokuSquareProps } from './sudoku-square';
import { createSudokuIndex } from './models/sudoku-index';
import type {
    Prettify,
    ReducerState,
    SudokuBoardRow,
    SudokuCell as Cell,
} from './types';

type BoardProps = Prettify<
    Pick<
        ReducerState,
        | 'board'
        | 'conflictingIndices'
        | 'hintIndex'
        | 'notesEnabled'
        | 'selectedIndex'
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
    selectedIndex,
    setSelectedIndexSet,
    onNoteClick,
    autoCheckEnabled,
}) => {
    const buildRow = React.useCallback(
        (rowIndex: number) =>
            function SudokuRow(_initialValue: Cell, columnIndex: number) {
                const index = createSudokuIndex({ rowIndex, columnIndex });
                const cell = board.getCellAt(index);

                if (!cell) {
                    return;
                }

                const boardIndex = index.boardIndex;

                const showNotes =
                    notesEnabled &&
                    (cell.hasNotes() || selectedIndex === index);

                const isWrong =
                    selectedIndex === index && !conflictingIndices.isEmpty();

                return (
                    <SudokuSquare
                        key={`$square-${rowIndex}-${columnIndex}`}
                        cell={cell}
                        index={index}
                        selectedIndex={selectedIndex}
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
            selectedIndex,
            board,
            setSelectedIndexSet,
            onNoteClick,
            autoCheckEnabled,
        ]
    );
    return (
        <div className="relative inline-flex w-full flex-col overflow-hidden border-black bg-white text-black [&_>_div]:border-b-1 [&_>_div]:border-black [&_>_div:first-of-type]:border-t-2 [&_>_div:first-of-type]:border-black [&_>_div:nth-of-type(3n)]:border-b-2 [&_>_div:nth-of-type(3n)]:border-black">
            {board.grid.map((rowValues: SudokuBoardRow, rowIndex: number) => {
                return (
                    <div
                        className="inline-flex [&_>_div]:border-r-1 [&_>_div]:border-black [&_>_div:first-of-type]:border-l-2 [&_>_div:first-of-type]:border-black [&_>_div:nth-of-type(3n)]:border-r-2 [&_>_div:nth-of-type(3n)]:border-black"
                        key={rowIndex}
                    >
                        {rowValues.map(buildRow(rowIndex))}
                    </div>
                );
            })}
        </div>
    );
};

SudokuBoard.displayName = 'Board';
