import React from 'react';
import { cn } from '@/lib/utils';
import type { SudokuCell as Cell, SudokuIndex } from './types';

const ValueValidationState = {
    AUTOCHECK_CORRECT: 'autocheck-correct',
    AUTOCHECK_WRONG: 'autocheck-wrong',
    UNKNOWN: 'unknown',
} as const;

type ValueValidationState =
    (typeof ValueValidationState)[keyof typeof ValueValidationState];

function computeValueValidationState(autoCheckEnabled: boolean, cell: Cell) {
    if (!cell.isFixed && autoCheckEnabled && !cell.isBlank) {
        return cell.isCorrectlyFilledByUser
            ? ValueValidationState.AUTOCHECK_CORRECT
            : ValueValidationState.AUTOCHECK_WRONG;
    }
    return ValueValidationState.UNKNOWN;
}

function getBackgroundColorClass(valueValidationState: ValueValidationState) {
    switch (valueValidationState) {
        case ValueValidationState.AUTOCHECK_CORRECT: {
            return 'bg-green-100 opacity-80';
        }
        case ValueValidationState.AUTOCHECK_WRONG: {
            return 'bg-red-100 opacity-80';
        }
        default: {
            return '';
        }
    }
}

function getColorClass(valueValidationState: ValueValidationState) {
    return valueValidationState === ValueValidationState.UNKNOWN
        ? 'text-green-700'
        : 'text-inherit';
}

export interface SudokuCellProps {
    index: SudokuIndex;
    cell: Cell;
    showNotes: boolean;
    isConflictSquare: boolean;
    isHint: boolean;
    isWrong: boolean;
    selectedIndex: SudokuIndex | undefined;
    setSelectedIndex(index: SudokuIndex): void;
    autoCheckEnabled: boolean;
    onNoteSelected(note: number): void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
    selectedIndex,
    index,
    cell,
    setSelectedIndex,
    showNotes,
    onNoteSelected,
    isConflictSquare,
    isHint,
    isWrong,
    autoCheckEnabled,
}) => {
    const { columnIndex, rowIndex, boardIndex } = index;
    const {
        columnIndex: selectedColumnIndex,
        rowIndex: selectedRowIndex,
        boardIndex: selectedBoardIndex,
    } = selectedIndex || {};
    const valueValidationState = computeValueValidationState(
        autoCheckEnabled,
        cell
    );

    const isSelectedBoardIndex = selectedBoardIndex === boardIndex;
    const isSelected =
        selectedColumnIndex === columnIndex || rowIndex === selectedRowIndex;

    const handleClick = () => setSelectedIndex(index);

    return (
        <div
            className={cn(
                'rainbow relative h-11 w-11 hover:cursor-pointer hover:bg-gray-400 min-[1200px]:h-20 min-[1200px]:w-20 md:h-15 md:w-15 lg:h-16 lg:w-16',
                isConflictSquare
                    ? 'bg-red-200'
                    : showNotes
                      ? 'bg-blue-500'
                      : isSelectedBoardIndex
                        ? ''
                        : isSelected
                          ? 'bg-gray-200'
                          : 'bg-transparent',
                isHint && 'animate-(--animate-hint)'
            )}
            onClick={handleClick}
            tabIndex={-1}
            onKeyDown={handleClick}
            role="gridcell"
        >
            <div
                className={`relative box-border flex h-full w-full items-center justify-center text-4xl ${getBackgroundColorClass(valueValidationState)}`}
            >
                {showNotes ? (
                    <div className="absolute top-0 left-0 grid h-full w-full grid-cols-3 grid-rows-3 text-sm text-gray-500 max-[600px]:text-[9px]">
                        {Array.from({ length: 9 }, (_, i) => i + 1).map(
                            (note) => (
                                <div
                                    className={cn(
                                        'flex items-center justify-center bg-green-600 hover:text-white',
                                        cell.containsNote(note)
                                            ? 'text-black'
                                            : 'text-green-700',
                                        'hover:text-white hover:transition-colors hover:duration-200 hover:ease-in-out'
                                    )}
                                    key={`note_${note}`}
                                    onClick={() => onNoteSelected(note)}
                                    onKeyDown={() => onNoteSelected(note)}
                                    role="gridcell"
                                    tabIndex={-1}
                                >
                                    {note}
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <>
                        {cell.isFixed ? (
                            <div className="z-1">{cell.value}</div>
                        ) : (
                            <div
                                className={`z-1 ${getColorClass(valueValidationState)}`}
                            >
                                {isWrong ? undefined : cell.value}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

SudokuCell.displayName = 'SudokuSquare';
