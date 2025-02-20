import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { cn } from '@/lib/utils';
import type { SudokuCell, SudokuIndex } from './types';

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
    UNKNOWN: 'unknown',
} as const;

type ValueValidationState =
    (typeof ValueValidationState)[keyof typeof ValueValidationState];

function computeValueValidationState(
    autoCheckEnabled: boolean,
    cell: SudokuCell
) {
    if (!cell.isFixed && autoCheckEnabled && !cell.isBlank) {
        return cell.isCorrectlyFilledByUser
            ? ValueValidationState.AUTOCHECK_CORRECT
            : ValueValidationState.AUTOCHECK_WRONG;
    }

    return ValueValidationState.UNKNOWN;
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

export interface SudokuSquareProps {
    selectedIndex?: SudokuIndex;
    index: SudokuIndex;
    cell: SudokuCell;
    setSelectedIndexSet: (indexSet: SudokuIndex) => void;
    onNoteClick: (note: number) => void;
    showNotes: boolean;
    isConflictSquare: boolean;
    isHint: boolean;
    autoCheckEnabled: boolean;
    isWrong: boolean;
}

const OuterContainer = styled.div`
    ${({
        isConflictSquare,
        isHint,
    }: {
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
              `}
`;

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

const UserEditableCell = styled.div<{
    valueValidationState: ValueValidationState;
}>`
    z-index: 1;
    ${({ valueValidationState }) =>
        getColorStyleForValueValidationState(valueValidationState)};
`;

const FixedCell = styled.div`
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

export const SudokuSquare: React.FC<SudokuSquareProps> = ({
    selectedIndex: selectedIndices,
    index: indexSet,
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
    const valueValidationState = computeValueValidationState(
        autoCheckEnabled,
        cell
    );

    const isSelectedBoardIndex = selectedBoardIndex === boardIndex;
    const isSelected =
        selectedColumnIndex === columnIndex || rowIndex === selectedRowIndex;

    const className = cn(
        isConflictSquare
            ? 'bg-red-200'
            : showNotes
              ? 'bg-blue-500'
              : isSelectedBoardIndex
                ? ''
                : isSelected
                  ? 'bg-gray-200'
                  : ''
    );

    return (
        <OuterContainer
            className={cn(
                'rainbow h-11 w-11 min-[1200px]:h-20 min-[1200px]:w-20 md:h-15 md:w-15 lg:h-16 lg:w-16',
                className
            )}
            isConflictSquare={isConflictSquare}
            isHint={isHint}
            onClick={() => {
                setSelectedIndexSet(indexSet);
            }}
        >
            <SudokuCellWrapper valueValidationState={valueValidationState}>
                {showNotes ? (
                    <NotesGrid>
                        {Array.from({ length: 9 }, (_x, i) => i + 1).map(
                            (note) => {
                                const isSelected = cell.containsNote(note);
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
                            }
                        )}
                    </NotesGrid>
                ) : (
                    <>
                        {cell.isFixed ? (
                            <FixedCell>{cell.value}</FixedCell>
                        ) : (
                            <UserEditableCell
                                valueValidationState={valueValidationState}
                            >
                                {isWrong ? undefined : cell.value}
                            </UserEditableCell>
                        )}
                    </>
                )}
            </SudokuCellWrapper>
        </OuterContainer>
    );
};

SudokuSquare.displayName = 'SudokuSquare';
