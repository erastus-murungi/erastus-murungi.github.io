import { List, Set } from 'immutable';
import { toast } from 'sonner';

import { calculateScore, HINT_COUNT } from './utils';

import type {
    ReducerState,
    StopwatchCommand,
    Difficulty,
    SudokuRefs,
    HistoryState,
    SudokuCell,
    SudokuIndex,
    Board,
} from './types';
import {
    createBoardFromCells,
    createBoardFromDifficulty,
    createEmptyBoard,
} from './models/sudoku-board';
import { createHistory } from './models/sudoku-history';

const HINT_MESSAGES = [
    'No more hints available for Bebi Bebi 🐧. Nisuke nikuongezee 😉',
    'Mapangale 🤣',
];

const getHintMessage = () => {
    const randomIndex = Math.floor(Math.random() * HINT_MESSAGES.length);
    return HINT_MESSAGES[randomIndex];
};

type Action =
    | {
          type: 'SUBMIT';
      }
    | {
          type: 'SET_VALUE';
          value: number;
      }
    | {
          type: 'SET_NOTE';
          note: number;
      }
    | {
          type: 'DELETE_VALUE';
      }
    | {
          type: 'TO_STATE';
          historyState: HistoryState;
      }
    | {
          type: 'RESET_CURRENT_BOARD';
      }
    | {
          type: 'RESET';
          difficulty: Difficulty;
      }
    | {
          type: 'SET_WATCH_ACTION';
          stopWatchAction: StopwatchCommand;
      }
    | {
          type: 'TOGGLE_NOTES';
      }
    | {
          type: 'INIT_SODUKU';
          options:
              | {
                    difficulty: Difficulty;
                    cells: undefined;
                    board: undefined;
                }
              | {
                    cells: List<SudokuCell>;
                    difficulty: undefined;
                    board: undefined;
                }
              | {
                    board: Board;
                    difficulty: undefined;
                    cells: undefined;
                };
      }
    | {
          type: 'SET_INDICES';
          selectedIndex: SudokuIndex;
      }
    | {
          type: 'CALCULATE_SCORE';
          totalSeconds: number;
      }
    | {
          type: 'HINT';
      }
    | {
          type: 'TOGGLE_AUTO_CHECK';
      }
    | {
          type: 'TOGGLE_SHOW_OVERLAY';
      };

export function updateRefs(
    action: Action,
    refState: React.RefObject<SudokuRefs>,
    state: ReducerState
): void {
    switch (action.type) {
        case 'SET_VALUE':
        case 'DELETE_VALUE':
        case 'TO_STATE': {
            refState.current.history.push({
                board: state.board,
                selectedIndex: state.selectedIndex,
                conflictingIndices: state.conflictingIndices,
                hintIndex: state.hintIndex,
                notesEnabled: state.notesEnabled,
            });
            break;
        }
        case 'RESET':
        case 'RESET_CURRENT_BOARD': {
            refState.current = {
                elapsedSeconds: 0,
                history: createHistory(),
                intervalRef: undefined,
            };
            break;
        }
    }
}

export function reducer(state: ReducerState, action: Action): ReducerState {
    // eslint-disable-next-line no-console
    console.log('Action', action);

    switch (action.type) {
        case 'SET_NOTE': {
            const { selectedIndex: selectedIndex, notesEnabled: notesOn } =
                state;

            if (!notesOn) {
                throw new Error('Notes are not enabled');
            }
            if (selectedIndex === undefined) {
                return state;
            }
            const { note } = action;
            return {
                ...state,
                board: state.board.toggleCellNote(selectedIndex, note),
            };
        }
        case 'SET_VALUE': {
            const { selectedIndex: selectedIndex, board } = state;
            if (selectedIndex === undefined) {
                return state;
            }
            const { value } = action;

            const selectedCell = board.getCellAt(selectedIndex);
            if (!selectedCell || selectedCell.isFixed) {
                return state;
            }

            if (selectedCell.value === value) {
                return {
                    ...state,
                    conflictingIndices: Set(),
                    hintIndex: undefined,
                    board: board.removeCellValue(selectedIndex),
                };
            }
            const { conflictingIndices, updatedBoard } =
                state.board.checkForConflictsAndSet(selectedIndex, value);

            return {
                ...state,
                hintIndex: undefined,
                moveCount: state.moveCount + 1,
                isSudokuSolved: updatedBoard.isCompleted,
                board: updatedBoard,
                ...(conflictingIndices && conflictingIndices.size > 0
                    ? {
                          conflictingIndices,
                          mistakeCount: state.mistakeCount + 1,
                      }
                    : {}),
            };
        }
        case 'DELETE_VALUE': {
            const { board, selectedIndex: selectedIndex } = state;
            if (selectedIndex === undefined) {
                return state;
            }

            const selectedValue = board.getCellAt(selectedIndex);
            if (!selectedValue || selectedValue.isFixed) {
                return state;
            }
            return {
                ...state,
                conflictingIndices: Set(),
                hintIndex: undefined,
                board: board.removeCellValue(selectedIndex),
            };
        }
        case 'TO_STATE': {
            const { historyState } = action;
            return {
                ...state,
                ...historyState,
            };
        }
        case 'SET_WATCH_ACTION': {
            const { stopWatchAction } = action;
            return { ...state, stopwatchCommand: stopWatchAction };
        }
        case 'SUBMIT': {
            return {
                ...state,
                board: state.board.revealAllAnswers(),
                isSudokuSolved: true,
                hintIndex: undefined,
                stopwatchCommand: 'pause',
                conflictingIndices: Set(),
            };
        }
        case 'TOGGLE_NOTES': {
            return {
                ...state,
                notesEnabled: !state.notesEnabled,
                hintIndex: undefined,
            };
        }
        case 'CALCULATE_SCORE': {
            const { totalSeconds } = action;
            const playerScore = calculateScore(state, totalSeconds);
            return { ...state, playerScore };
        }
        case 'INIT_SODUKU': {
            const { options } = action;
            const board = options.difficulty
                ? createBoardFromDifficulty(options.difficulty)
                : options.cells
                  ? createBoardFromCells(options.cells)
                  : options.board;
            return {
                ...state,
                overlayVisible: false,
                autoCheckEnabled: false,
                board,
                isSudokuSolved: false,
                mistakeCount: 0,
            };
        }
        case 'SET_INDICES': {
            const { selectedIndex } = action;
            return {
                ...state,
                hintIndex: undefined,
                selectedIndex: selectedIndex,
            };
        }
        case 'HINT': {
            const { board, hintUsageCount: hintCount } = state;
            const description = getHintMessage();

            if (hintCount <= 0) {
                toast.error('Bebi Bebi 🐧', {
                    className: 'bold',
                    description,
                    duration: 5000,
                });
                return state;
            }

            const { hintIndex, updatedBoard } = board.provideHint();

            if (hintIndex === undefined) {
                toast.error('No more hints available', {
                    className: 'bold',
                    description: 'No more hints available',
                    duration: 5000,
                });
                return state;
            } else {
                return {
                    ...state,
                    board: updatedBoard,
                    hintIndex,
                    hintUsageCount: state.hintUsageCount - 1,
                };
            }
        }
        case 'RESET': {
            const { difficulty } = action;
            return {
                ...INITIAL_STATE,
                board: createBoardFromDifficulty(difficulty),
                gameDifficulty: difficulty,
                hintUsageCount: HINT_COUNT[difficulty],
                stopwatchCommand: 'reset',
            };
        }
        case 'RESET_CURRENT_BOARD': {
            const { gameDifficulty, board } = state;
            return {
                ...INITIAL_STATE,
                board: board.reset(),
                hintUsageCount: HINT_COUNT[gameDifficulty],
                stopwatchCommand: 'reset',
            };
        }
        case 'TOGGLE_AUTO_CHECK': {
            return { ...state, autoCheckEnabled: !state.autoCheckEnabled };
        }
        case 'TOGGLE_SHOW_OVERLAY': {
            return { ...state, overlayVisible: !state.overlayVisible };
        }
        default: {
            throw new Error(`$unknown action type: ${JSON.stringify(action)}`);
        }
    }
}

export const INITIAL_STATE: ReducerState = {
    board: createEmptyBoard(),
    selectedIndex: undefined,
    gameDifficulty: 'easy',
    conflictingIndices: Set(),
    hintIndex: undefined,
    notesEnabled: false,
    hintUsageCount: HINT_COUNT['easy'],
    isSudokuSolved: false,
    stopwatchCommand: 'start',
    moveCount: 0,
    mistakeCount: 0,
    playerScore: '0',
    autoCheckEnabled: false,
    overlayVisible: false,
};
