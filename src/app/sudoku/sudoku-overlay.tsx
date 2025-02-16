import type React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import type { Difficulty, ReducerState } from './types';
import { SudokuStats } from './sudoku-stats';
import { NewGameButton } from './new-game-button/new-game-button';

interface SudokuOverlayProps {
    onClick: (difficulty: Difficulty) => void;
    state: ReducerState;
}

export const SudokuOverlay: React.FC<SudokuOverlayProps> = ({
    onClick,
    state,
}) => {
    return (
        <div className="absolute top-0 right-0 z-2 inline-flex h-screen w-full flex-col items-center justify-center bg-white/30 backdrop-blur-xs">
            <span className={`${reenie_beanie.className} text-center text-6xl`}>
                🐣 🐣 🐣 Congratulations bebi, you solved the puzzle! <br />
                🐣 🐣 🐣
            </span>
            <SudokuStats {...state} />
            <div className="space-between flex w-full flex-row items-center justify-center space-y-4">
                <NewGameButton
                    className="w-40"
                    onClick={({ to }) => onClick(to)}
                    showWarning={false}
                />
            </div>
        </div>
    );
};
