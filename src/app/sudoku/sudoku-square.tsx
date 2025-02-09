import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { SudokuCell } from './sudoku-cell';
import type { Value } from './types';
import type { IndexSet } from './utils';

export interface SudokuSquareProps {
    selectedIndexSet?: IndexSet;
    indexSet: IndexSet;
    value: Value;
    initialValue: Value;
    setSelectedIndexSet: (indexSet: IndexSet) => void;
    showNotes: boolean;
    isConflictSquare: boolean;
    isHint: boolean;
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

export const SudokuSquare: React.FC<SudokuSquareProps> = React.memo(
    ({
        selectedIndexSet,
        indexSet,
        value,
        initialValue,
        setSelectedIndexSet,
        showNotes,
        isConflictSquare,
        isHint,
    }) => {
        const { columnIndex, rowIndex, boardIndex } = indexSet;
        const {
            columnIndex: selectedColumnIndex,
            rowIndex: selectedRowIndex,
            boardIndex: selectedBoardIndex,
        } = selectedIndexSet || {};

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
    }
);

SudokuSquare.displayName = 'SudokuSquare';
