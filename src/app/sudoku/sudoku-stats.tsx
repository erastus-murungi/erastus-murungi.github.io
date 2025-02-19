import React from 'react';
import type { ReducerState } from './types';

type SudokuStats = {
    numMistakes: number;
    numMoves: number;
    score: number;
    gamesPlayed?: number;
};

const SudokuStat: React.FC<{ label: string; value: number | string }> = ({
    label,
    value,
}) => (
    <div className="mr-8 flex flex-row items-center justify-between">
        <span className="text-xs font-bold">{label}:&nbsp;</span>
        <span className="text-xs">{value}</span>
    </div>
);

export const SudokuStats: React.FC<ReducerState> = (state: ReducerState) => {
    const {
        moveCount: numMoves,
        mistakeCount: numMistakes,
        playerScore: score,
    } = state;
    return (
        <div className="space-between bg-accent mb-2 flex h-8 w-full flex-row items-center justify-center rounded-sm border-4 p-1">
            <SudokuStat label="# Moves" value={numMoves} />
            <SudokuStat label="# Mistakes" value={numMistakes} />
            <SudokuStat label="Score" value={score} />
        </div>
    );
};
