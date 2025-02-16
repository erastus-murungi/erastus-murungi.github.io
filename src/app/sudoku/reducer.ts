import { List, Set } from 'immutable';
import { toast } from 'sonner';
import {
    generateHint,
    HINT_COUNT,
    calculateScore,
    type IndexSet,
    Board,
    getBoardIndex,
} from './utils';
import type {
    ReducerState,
    HistoryState,
    StopWatchAction,
    Difficulty,
    Value,
} from './types';

const HINT_MESSAGES = [
    'No more hints available for Bebi Bebi 🐧. Nisuke nikuongezee 😉',
    'Mapangale 🤣',
];

const getHintMessage = () => {
    const randomIndex = Math.floor(Math.random() * HINT_MESSAGES.length);
    return HINT_MESSAGES[randomIndex];
};

const validateBoardAfterEntry = ({
    board,
    selectedIndexSet,
    toCheck,
}: {
    board: ReducerState['board'];
    selectedIndexSet: ReducerState['selectedIndexSet'];
    toCheck: number;
}) => {
    const { rowIndex: selectedRowIndex, columnIndex: selectedColumnIndex } =
        selectedIndexSet || {};
    const conflictBoardIndices: number[] = [];
    if (selectedRowIndex != undefined) {
        for (let offset = 0; offset < 9; offset++) {
            const boardIndex = selectedRowIndex * 9 + offset;
            const boardValue = board.get(boardIndex);
            if (boardValue?.value === toCheck) {
                conflictBoardIndices.push(boardIndex);
            }
        }
        if (selectedColumnIndex != undefined) {
            for (const [boardIndex, value] of board.values.entries()) {
                if (boardIndex % 9 === selectedColumnIndex) {
                    if (value.value === toCheck) {
                        conflictBoardIndices.push(boardIndex);
                    } else {
                        continue;
                    }
                }
            }

            const gridRowIndex = selectedRowIndex - (selectedRowIndex % 3);
            const gridColumnIndex =
                selectedColumnIndex - (selectedColumnIndex % 3);
            for (let colOffset = 0; colOffset < 3; colOffset++) {
                for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
                    const boardIndex = getBoardIndex(
                        gridRowIndex + rowOffset,
                        gridColumnIndex + colOffset
                    );
                    const boardValue = board.get(boardIndex);
                    if (boardValue?.value === toCheck) {
                        conflictBoardIndices.push(boardIndex);
                    }
                }
            }
        }
    }
    return conflictBoardIndices.length > 0
        ? Set(conflictBoardIndices)
        : undefined;
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
          type: 'UNDO';
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
          stopWatchAction: StopWatchAction;
      }
    | {
          type: 'TOGGLE_NOTES';
      }
    | {
          type: 'INIT_SODUKU';
          options:
              | {
                    difficulty: Difficulty;
                    values: undefined;
                    board: undefined;
                }
              | {
                    values: List<Value>;
                    difficulty: undefined;
                    board: undefined;
                }
              | {
                    board: Board;
                    difficulty: undefined;
                    values: undefined;
                };
      }
    | {
          type: 'SET_INDICES';
          selectedIndexSet: IndexSet;
      }
    | {
          type: 'CALCULATE_SCORE';
      }
    | {
          type: 'HINT';
      }
    | {
          type: 'UPDATE_TIME';
          totalSeconds: number;
      }
    | {
          type: 'SET_INTERVAL_ID';
          intervalId: NodeJS.Timeout;
      }
    | {
          type: 'TOGGLE_AUTO_CHECK';
      }
    | {
          type: 'TOGGLE_SHOW_OVERLAY';
      };

export function reducer(state: ReducerState, action: Action): ReducerState {
    // eslint-disable-next-line no-console
    console.log('Action', action.type);

    switch (action.type) {
        case 'SET_NOTE': {
            if (!state.notesOn) {
                throw new Error('Notes are not enabled');
            }
            const { selectedIndexSet } = state;
            if (selectedIndexSet === undefined) {
                return state;
            }
            const { note } = action;

            const selectedValue = state.board.get(selectedIndexSet);
            if (!selectedValue || selectedValue.isOriginal) {
                return state;
            }
            const isSelected = selectedValue.notes.has(note);

            return isSelected
                ? {
                      ...state,
                      board: state.board.set(selectedIndexSet, {
                          ...selectedValue,
                          notes: selectedValue.notes.delete(note),
                      }),
                  }
                : {
                      ...state,
                      board: state.board.set(selectedIndexSet, {
                          ...selectedValue,
                          notes: selectedValue.notes.add(note),
                      }),
                  };
        }
        case 'SET_VALUE': {
            const { selectedIndexSet, board } = state;
            if (selectedIndexSet === undefined) {
                return state;
            }
            const { value } = action;

            const selectedValue = board.get(selectedIndexSet);
            if (!selectedValue || selectedValue.isOriginal) {
                return state;
            }

            if (selectedValue.value.current === value) {
                return {
                    ...state,
                    conflictBoardIndices: Set(),
                    hintIndex: undefined,
                    board: board.clearCurrentValue(selectedIndexSet),
                };
            } else {
                const conflictBoardIndices = validateBoardAfterEntry({
                    selectedIndexSet: selectedIndexSet,
                    board: state.board,
                    toCheck: value,
                });
                const board = state.board.setCurrentValue(
                    selectedIndexSet,
                    value
                );
                return {
                    ...state,
                    hintIndex: undefined,
                    numMoves: state.numMoves + 1,
                    isSolved: board.isSolved,
                    history: state.history.push({
                        board,
                        selectedIndexSet: state.selectedIndexSet,
                        difficulty: state.difficulty,
                        conflictBoardIndices: state.conflictBoardIndices,
                        hintIndex: state.hintIndex,
                        notesOn: state.notesOn,
                    }),
                    board,
                    ...(conflictBoardIndices && conflictBoardIndices.size > 0
                        ? {
                              conflictBoardIndices,
                              numMistakes: state.numMistakes + 1,
                          }
                        : {}),
                };
            }
        }
        case 'DELETE_VALUE': {
            const { board, selectedIndexSet } = state;
            if (selectedIndexSet === undefined) {
                return state;
            }

            const selectedValue = board.get(selectedIndexSet);
            if (!selectedValue || selectedValue.isOriginal) {
                return state;
            }
            return {
                ...state,
                conflictBoardIndices: Set(),
                hintIndex: undefined,
                board: board.clearCurrentValue(selectedIndexSet),
            };
        }
        case 'UNDO': {
            const lastState = state.history.last();
            if (lastState) {
                return {
                    ...state,
                    hintIndex: undefined,
                    board: lastState.board,
                    selectedIndexSet: lastState.selectedIndexSet,
                    difficulty: lastState.difficulty,
                    conflictBoardIndices: lastState.conflictBoardIndices,
                    notesOn: lastState.notesOn,
                    history: state.history.pop(),
                };
            }
            return state;
        }
        case 'SET_WATCH_ACTION': {
            const { stopWatchAction } = action;
            return { ...state, stopWatchAction };
        }
        case 'SUBMIT': {
            return {
                ...state,
                board: state.board.setAllAnswers(),
                isSolved: true,
                hintIndex: undefined,
                stopWatchAction: 'pause',
                conflictBoardIndices: Set(),
            };
        }
        case 'TOGGLE_NOTES': {
            return {
                ...state,
                notesOn: !state.notesOn,
                hintIndex: undefined,
            };
        }
        case 'UPDATE_TIME': {
            return { ...state, totalSeconds: action.totalSeconds };
        }
        case 'CALCULATE_SCORE': {
            const score = calculateScore(state);
            return { ...state, score };
        }
        case 'INIT_SODUKU': {
            const { options } = action;
            const board = options.difficulty
                ? Board.createWithDifficulty(options.difficulty)
                : options.values
                  ? Board.createFromValues(options.values)
                  : options.board;
            return {
                ...state,
                showOverlay: false,
                autoCheckEnabled: false,
                board,
                isSolved: false,
                numMistakes: 0,
            };
        }
        case 'SET_INDICES': {
            const { selectedIndexSet } = action;
            return {
                ...state,
                hintIndex: undefined,
                selectedIndexSet,
            };
        }
        case 'HINT': {
            const { board, hintCount } = state;
            const description = getHintMessage();

            if (hintCount <= 0) {
                toast.error('Bebi Bebi 🐧', {
                    className: 'bold',
                    description,
                    duration: 5000,
                });
                return state;
            }

            const hintIndex = generateHint(board);

            if (hintIndex === undefined) {
                toast.error('No more hints available', {
                    className: 'bold',
                    description: 'No more hints available',
                    duration: 5000,
                });
                return state;
            } else {
                const hint = state.board.getHint(hintIndex);
                if (hint === undefined) {
                    toast.error('Internal Error: hintIndex out of bounds', {
                        description: 'No more hints available',
                        duration: 5000,
                    });
                    return state;
                } else {
                    return {
                        ...state,
                        board: board.setCurrentValue(
                            hintIndex,
                            hint.value.answer
                        ),
                        hintIndex,
                        hintCount: state.hintCount - 1,
                    };
                }
            }
        }
        case 'SET_INTERVAL_ID': {
            const { intervalId } = action;
            return { ...state, intervalId };
        }
        case 'RESET': {
            const { difficulty } = action;
            return {
                ...INITIAL_STATE,
                hintCount: HINT_COUNT[difficulty],
                stopWatchAction: 'start',
            };
        }
        case 'RESET_CURRENT_BOARD': {
            const { difficulty, board } = state;
            return {
                ...INITIAL_STATE,
                board: board.reset(),
                hintCount: HINT_COUNT[difficulty],
                stopWatchAction: 'start',
            };
        }
        case 'TOGGLE_AUTO_CHECK': {
            return { ...state, autoCheckEnabled: !state.autoCheckEnabled };
        }
        case 'TOGGLE_SHOW_OVERLAY': {
            return { ...state, showOverlay: !state.showOverlay };
        }
        default: {
            throw new Error(`$unknown action type: ${JSON.stringify(action)}`);
        }
    }
}

export const INITIAL_STATE: ReducerState = {
    board: Board.empty(),
    selectedIndexSet: undefined,
    difficulty: 'easy',
    conflictBoardIndices: Set(),
    hintIndex: undefined,
    notesOn: false,
    history: List<HistoryState>(),
    hintCount: HINT_COUNT['easy'],
    isSolved: false,
    stopWatchAction: 'start',
    numMoves: 0,
    numMistakes: 0,
    totalSeconds: 0,
    score: '0',
    autoCheckEnabled: false,
    showOverlay: false,
};
