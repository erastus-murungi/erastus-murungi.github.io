import { List } from 'immutable';

import type { Difficulty, ReducerState, HistoryState } from './types';

export const HINT_COUNT: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
    expert: 3,
};

const MUTLIPLIERS = {
    basePointsMap: {
        easy: 100,
        medium: 200,
        hard: 300,
        expert: 400,
    },
    hintMultiplier: 10,
    timePenaltyExponent: 0.002,
};

/**
 * We calculate the score using a number of factors:
 * - Time taken to solve the puzzle
 * - Difficulty of the puzzle
 * - Number of hints used
 *
 * @param reducerState
 */
export const calculateScore = (
    reducerState: ReducerState,
    totalSeconds: number,
    multipliers: typeof MUTLIPLIERS = MUTLIPLIERS
): string => {
    const { gameDifficulty: difficulty, hintUsageCount: hintCount } =
        reducerState;
    const { hintMultiplier, timePenaltyExponent, basePointsMap } = multipliers;
    const basePoints = basePointsMap[difficulty];
    const hintsPenalty = hintMultiplier * hintCount;
    const scoreAfterHintsPenalty = basePoints - hintsPenalty;

    return (
        scoreAfterHintsPenalty *
        Math.pow(Math.E, 1 - timePenaltyExponent * totalSeconds)
    ).toFixed(0);
};

export class SudokuHistory implements Iterable<HistoryState> {
    private history: List<HistoryState> = List();
    private currentIndex = -1;

    get current() {
        return this.history.get(this.currentIndex);
    }

    get length() {
        return this.history.size;
    }

    get isAtEnd() {
        return this.currentIndex === this.history.size - 1;
    }

    get isAtStart() {
        return this.currentIndex === 0;
    }

    get canUndo() {
        return this.currentIndex >= 0;
    }

    get canRedo() {
        return this.currentIndex <= this.history.size - 1;
    }

    get last() {
        return this.history.last();
    }

    get first() {
        return this.history.first();
    }

    push(state: HistoryState) {
        this.history = this.history.push(state);
        this.currentIndex = this.history.size - 1;
    }

    undo() {
        if (this.canUndo) {
            const state = this.history.get(this.currentIndex);
            this.currentIndex--;
            return state;
        }
    }

    redo() {
        if (this.canRedo) {
            const state = this.history.get(this.currentIndex);
            this.currentIndex++;
            return state;
        }
    }

    [Symbol.iterator]() {
        return this.history[Symbol.iterator]();
    }
}

export const createHistory = () => new SudokuHistory();
