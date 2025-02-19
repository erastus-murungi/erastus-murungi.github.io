import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Cell } from './types';
import type { IndexSet } from './utils';

export interface SudokuSquareProps {
    selectedIndices?: IndexSet;
    indexSet: IndexSet;
    cell: Cell;
    setSelectedIndexSet: (indexSet: IndexSet) => void;
    onNoteClick: (note: number) => void;
    showNotes: boolean;
    isConflictSquare: boolean;
    isHint: boolean;
    autoCheckEnabled: boolean;
    isWrong: boolean;
}

const OuterContainer = styled.div`
    ${({
        isSelected,
        isShowingNotes,
        isConflictSquare,
        isSelectedBoardIndex,
        isHint,
    }: {
        isSelected: boolean;
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
                      content: '';
                      position: absolute;
                      z-index: -2;
                      left: -50%;
                      top: -50%;
                      width: 200%;
                      height: 200%;
                      background-color: #399953;
                      background-repeat: no-repeat;
                      background-size:
                          50% 50%,
                          50% 50%;
                      background-position:
                          0 0,
                          100% 0,
                          100% 100%,
                          0 100%;
                      background-image: linear-gradient(#399953, #399953),
                          linear-gradient(#fbb300, #fbb300),
                          linear-gradient(#d53e33, #d53e33),
                          linear-gradient(#377af5, #377af5);
                      animation: rotate 4s linear infinite;
                  }

                  &::after {
                      content: '';
                      position: absolute;
                      z-index: -1;
                      left: 6px;
                      top: 6px;
                      width: calc(100% - 12px);
                      height: calc(100% - 12px);
                      background: white;
                      border-radius: 2px;
                  }
                  &:hover {
                      cursor: 'pointer';
                      background-color: rgba(28, 28, 28, 0.5);
                  }
                  background-color: ${isConflictSquare
                      ? 'rgba(226, 26, 12, 0.25)'
                      : isShowingNotes
                        ? 'rgba(11, 53, 207, 0.25)'
                        : isSelectedBoardIndex
                          ? ''
                          : isSelected
                            ? 'rgba(28, 28, 28, 0.25)'
                            : ''};
                  animation: ${isConflictSquare
                      ? 'bounceZoom 0.5s ease-in-out'
                      : ''};
              `
            : css`
                  position: relative;
                  &:hover {
                      cursor: 'pointer';
                      background-color: rgba(28, 28, 28, 0.5);
                  }
                  background-color: ${isConflictSquare
                      ? 'rgba(226, 26, 12, 0.25)'
                      : isShowingNotes
                        ? 'rgba(11, 53, 207, 0.25)'
                        : isSelectedBoardIndex
                          ? ''
                          : isSelected
                            ? 'rgba(28, 28, 28, 0.25)'
                            : ''};
              `}
`;

export const SudokuSquare: React.FC<SudokuSquareProps> = ({
    selectedIndices,
    indexSet,
    cell,
    setSelectedIndexSet,
    showNotes,
    onNoteClick,
    isConflictSquare,
    isHint,
    isWrong,
    autoCheckEnabled,
}) => {
    const { columnIndex, rowIndex, boardIndex } = indexSet;
    const {
        columnIndex: selectedColumnIndex,
        rowIndex: selectedRowIndex,
        boardIndex: selectedBoardIndex,
    } = selectedIndices || {};

    return (
        <OuterContainer
            className="rainbow h-11 w-11 min-[1200px]:h-20 min-[1200px]:w-20 md:h-15 md:w-15 lg:h-16 lg:w-16"
            isSelected={
                selectedColumnIndex === columnIndex ||
                rowIndex === selectedRowIndex
            }
            isSelectedBoardIndex={selectedBoardIndex === boardIndex}
            isConflictSquare={isConflictSquare}
            isShowingNotes={showNotes}
            isHint={isHint}
            onClick={() => {
                setSelectedIndexSet(indexSet);
            }}
        >
            <SudokuCell
                cell={cell}
                autoCheckEnabled={autoCheckEnabled}
                onNoteClick={(note) => onNoteClick(note)}
                showNotes={showNotes}
                isWrong={isWrong}
            />
        </OuterContainer>
    );
};

SudokuSquare.displayName = 'SudokuSquare';

const CorrectBackground = css`
    opacity: 0.8;
    background-color: #e0f2e3;
`;

const WrongBackground = css`
    opacity: 0.8;
    background-color: #fb5951;
`;

const ValueValidationState = {
    AUTOCHECK_CORRECT: 'autocheck-correct',
    AUTOCHECK_WRONG: 'autocheck-wrong',
    UNKWOWN: 'unknown',
} as const;

type ValueValidationState =
    (typeof ValueValidationState)[keyof typeof ValueValidationState];

function computeValueValidationState(autoCheckEnabled: boolean, cell: Cell) {
    if (autoCheckEnabled) {
        return cell.isUserSolved
            ? ValueValidationState.AUTOCHECK_CORRECT
            : ValueValidationState.AUTOCHECK_WRONG;
    }

    return ValueValidationState.UNKWOWN;
}

function getBackgroundColorStyleForValueValidationState(
    valueValidationState: ValueValidationState
) {
    switch (valueValidationState) {
        case ValueValidationState.AUTOCHECK_CORRECT: {
            return CorrectBackground;
        }
        case ValueValidationState.AUTOCHECK_WRONG: {
            return WrongBackground;
        }
        default: {
            return '';
        }
    }
}

function getColorStyleForValueValidationState(
    valueValidationState: ValueValidationState
) {
    switch (valueValidationState) {
        case ValueValidationState.AUTOCHECK_CORRECT: {
            return css`
                color: 'inherit';
            `;
        }
        case ValueValidationState.AUTOCHECK_WRONG: {
            return css`
                color: 'inherit';
            `;
        }
        default: {
            return css`
                color: #488470;
            `;
        }
    }
}

const SudokuCellWrapper = styled.div<{
    valueValidationState: ValueValidationState;
}>`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-sizing: border-box;
    ${({ valueValidationState }) =>
        getBackgroundColorStyleForValueValidationState(valueValidationState)};
`;

const CurrentEntry = styled.div<{
    valueValidationState: ValueValidationState;
}>`
    z-index: 1;
    ${({ valueValidationState }) =>
        getColorStyleForValueValidationState(valueValidationState)};
`;

const OriginalNumber = styled.div`
    z-index: 1;
    color: 'inherit';
`;

const NotesGrid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    font-size: 14px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    color: #888;

    @media (max-width: 599px) {
        font-size: 9px;
    }
`;

const Note = styled.div<{ isSelected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ isSelected }) => (isSelected ? 'black' : '#488470')};
    background-color: #488470;
    transition: color 0.25s ease;

    &:hover {
        color: ${({ isSelected }) => (isSelected ? 'black' : 'white')};
        animation: ${({ isSelected }) =>
            isSelected ? 'none' : 'fadeIn 0.5s linear'};
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

type SudokuCellProps = {
    cell: Cell;
    showNotes: boolean;
    onNoteClick: (note: number) => void;
    autoCheckEnabled: boolean;
    isWrong?: boolean;
};

const SudokuCell: React.FC<SudokuCellProps> = ({
    cell,
    showNotes,
    onNoteClick,
    autoCheckEnabled,
    isWrong = false,
}) => {
    const valueValidationState = cell
        ? computeValueValidationState(autoCheckEnabled, cell)
        : ValueValidationState.UNKWOWN;

    return (
        <SudokuCellWrapper valueValidationState={valueValidationState}>
            {showNotes ? (
                <NotesGrid>
                    {Array.from({ length: 9 }, (_x, i) => i + 1).map((note) => {
                        const isSelected = cell.hasNoteValue(note);
                        return (
                            <Note
                                className="flex items-center justify-center"
                                isSelected={isSelected}
                                key={`note_${note}`}
                                onClick={() => onNoteClick(note)}
                            >
                                {note}
                            </Note>
                        );
                    })}
                </NotesGrid>
            ) : (
                <>
                    {cell.isOriginal ? (
                        <OriginalNumber>{cell.value}</OriginalNumber>
                    ) : (
                        <CurrentEntry
                            valueValidationState={valueValidationState}
                        >
                            {isWrong ? undefined : cell.value}
                        </CurrentEntry>
                    )}
                </>
            )}
        </SudokuCellWrapper>
    );
};

SudokuCell.displayName = 'SudokuCell';
