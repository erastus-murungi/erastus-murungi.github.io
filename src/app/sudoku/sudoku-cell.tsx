import React from 'react';
import styled from '@emotion/styled';
import { publicSans } from '@/styles/fonts';
import type { Value } from './types';

const SudokuCellWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-sizing: border-box;
`;

const MainNumber = styled.div<{ isOriginal: boolean }>`
    z-index: 1;
    color: ${({ isOriginal }) => (isOriginal ? 'inherit' : '#488470')};
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

interface SudokuCellProps extends Value {
    showNotes: boolean;
    onNoteClick: (note: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
    value,
    isOriginal,
    notes,
    showNotes,
    onNoteClick,
}) => {
    return (
        <SudokuCellWrapper>
            {showNotes ? (
                <NotesGrid>
                    {Array.from({ length: 9 }, (_x, i) => i + 1).map((note) => {
                        const isSelected = notes.includes(note);
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
                <MainNumber
                    isOriginal={isOriginal}
                    className={`${publicSans.className}`}
                >
                    {value}
                </MainNumber>
            )}
        </SudokuCellWrapper>
    );
};

SudokuCell.displayName = 'SudokuCell';
