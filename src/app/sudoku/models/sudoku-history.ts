import { List, Set as ImmutableSet } from 'immutable';
import type { Board } from './sudoku-board';
import type { SudokuIndex } from './sudoku-index';

/**
 * Represents the state of the Sudoku game history.
 */
export interface HistoryState {
    /**
     * The board at the current state
     */
    board: Board;
    /**
     * The selected index set, if any
     */
    selectedIndex?: SudokuIndex;
    /**
     * The indices of the board that are in conflict
     */
    conflictingIndices: ImmutableSet<number>;
    /**
     * The index of the hint, if any
     */
    hintIndex?: number;
    /**
     * Whether notes are enabled
     */
    notesEnabled: boolean;
}

/**
 * Manages the history of states in a Sudoku game.
 */
export class SudokuHistory implements Iterable<HistoryState> {
    private states: List<HistoryState> = List();
    private currentIndex = -1;

    /**
     * Gets the current state in the history.
     */
    get current() {
        return this.states.get(this.currentIndex);
    }

    /**
     * Gets the length of the history.
     */
    get length() {
        return this.states.size;
    }

    /**
     * Checks if the current state is the latest state.
     */
    get isAtEnd() {
        return this.currentIndex === this.states.size - 1;
    }

    /**
     * Checks if the current state is the initial state.
     */
    get isAtStart() {
        return this.currentIndex === 0;
    }

    /**
     * Checks if there is a previous state to undo to.
     */
    get canUndo() {
        return this.currentIndex >= 0;
    }

    /**
     * Checks if there is a next state to redo to.
     */
    get canRedo() {
        return this.currentIndex <= this.states.size - 1;
    }

    /**
     * Gets the last state in the history.
     */
    get last() {
        return this.states.last();
    }

    /**
     * Gets the first state in the history.
     */
    get first() {
        return this.states.first();
    }

    /**
     * Adds a new state to the history.
     * @param state - The state to add.
     */
    push(state: HistoryState) {
        this.states = this.states.push(state);
        this.currentIndex = this.states.size - 1;
    }

    /**
     * Undoes the current state, moving to the previous state.
     * @returns The previous state, if available.
     */
    undo() {
        if (this.canUndo) {
            const state = this.states.get(this.currentIndex);
            this.currentIndex--;
            return state;
        }
    }

    /**
     * Redoes the current state, moving to the next state.
     * @returns The next state, if available.
     */
    redo() {
        if (this.canRedo) {
            const state = this.states.get(this.currentIndex);
            this.currentIndex++;
            return state;
        }
    }

    /**
     * Returns an iterator for the history states.
     */
    [Symbol.iterator]() {
        return this.states[Symbol.iterator]();
    }
}

/**
 * Creates a new Sudoku game history.
 * @returns A new instance of SudokuGameHistory.
 */
export const createHistory = () => new SudokuHistory();
