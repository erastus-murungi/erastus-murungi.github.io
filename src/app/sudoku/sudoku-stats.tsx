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
    <div className="mr-10 flex flex-row items-center justify-between">
        <span className="text-xs uppercase">{label}:&nbsp;</span>
        <span className="text-xs uppercase">{value}</span>
    </div>
);

export const SudokuStats: React.FC<ReducerState> = (state: ReducerState) => {
    const { numMoves, numMistakes, score } = state;
    return (
        <div className="space-between bg-accent mb-2 flex w-full flex-row bg-radial p-1">
            <SudokuStat label="Total Moves" value={numMoves} />
            <SudokuStat label="Total Mistakes" value={numMistakes} />
            <SudokuStat label="Score" value={score} />
        </div>
    );
};
