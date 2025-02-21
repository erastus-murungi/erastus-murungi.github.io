import React from 'react';
import { Set as ImmutableSet } from 'immutable';
import { SudokuSquare } from './sudoku-square';
import { createSudokuIndex } from './models/sudoku-index';
import type {
    SudokuBoardRow,
    SudokuCell as Cell,
    Board,
    SudokuIndex,
} from './types';

interface SudokuBoardProps {
    board: Board;
    conflictingIndices: ImmutableSet<number>;
    hintIndex: number | undefined;
    selectedIndex: SudokuIndex | undefined;
    setSelectedIndex(index: SudokuIndex): void;
    notesEnabled: boolean;
    autoCheckEnabled: boolean;
    onNoteSelected(note: number): void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
    board,
    conflictingIndices,
    hintIndex,
    notesEnabled,
    selectedIndex,
    setSelectedIndex,
    onNoteSelected,
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
                        setSelectedIndex={(index) => setSelectedIndex(index)}
                        onNoteSelected={(note) => onNoteSelected(note)}
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
            setSelectedIndex,
            onNoteSelected,
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
