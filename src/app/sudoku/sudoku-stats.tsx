import React from 'react';

const SudokuStat: React.FC<{ label: string; value: number | string }> = ({
    label,
    value,
}) => (
    <div className="mr-8 flex flex-row items-center justify-between">
        <span className="text-sm font-bold">{label}:&nbsp;</span>
        <span className="text-sm">{value}</span>
    </div>
);

interface SudokuStatsProps {
    moveCount: number;
    mistakeCount: number;
    playerScore: string;
}

export const SudokuStats: React.FC<SudokuStatsProps> = React.memo(
    ({ mistakeCount, moveCount, playerScore }) => {
        return (
            <div className="space-between mb-2 flex h-8 w-full flex-row items-center justify-center rounded-sm bg-white p-1 backdrop-opacity-50">
                <SudokuStat label="# Moves" value={moveCount} />
                <SudokuStat label="# Mistakes" value={mistakeCount} />
                <SudokuStat label="Score" value={playerScore} />
            </div>
        );
    }
);

SudokuStats.displayName = 'SudokuStats';
