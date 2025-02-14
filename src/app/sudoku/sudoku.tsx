'use client';

import React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import Header from '../header';
import { ButtonBar, type ButtonValue } from './button-bar';
import { useReward } from 'react-rewards';
import { Board, generateHints } from './utils';
import { SudokuBoard } from './sudoku-board';
import { StopWatch } from './stopwatch';
import { reducer, INITIAL_STATE } from './reducer';
import { Switch } from '@/components/ui/switch';
import { SudokuStats } from './sudoku-stats';
import { Label } from '@/components/ui/label';

const SCORE_REFRESH_INTERVAL_MS = 10_000;

export interface SudokuProps {
    onComplete: () => void;
    hide: boolean;
}

const ALLOWED_KEYS = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
] as const;

type HandledKeyPress = (typeof ALLOWED_KEYS)[number];

export const Sudoku: React.FC<SudokuProps> = () => {
    const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

    const setTotalSeconds = React.useCallback(
        (totalSeconds: number) =>
            dispatch({ type: 'UPDATE_TIME', totalSeconds }),
        []
    );

    const onKeyDown = React.useCallback(
        (event: globalThis.KeyboardEvent) => {
            const wasAnyKeyPressed = ALLOWED_KEYS.includes(
                event.key as HandledKeyPress
            );
            if (wasAnyKeyPressed) {
                event.preventDefault();

                switch (event.key as HandledKeyPress) {
                    case 'Backspace': {
                        dispatch({ type: 'DELETE_VALUE' });
                        break;
                    }
                    case 'ArrowUp': {
                        const selectedIndexSet = state.selectedIndexSet?.up;
                        if (selectedIndexSet) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndexSet,
                            });
                        }
                        break;
                    }
                    case 'ArrowDown': {
                        const selectedIndexSet = state.selectedIndexSet?.down;
                        if (selectedIndexSet) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndexSet,
                            });
                        }
                        break;
                    }
                    case 'ArrowLeft': {
                        const selectedIndexSet = state.selectedIndexSet?.left;
                        if (selectedIndexSet) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndexSet,
                            });
                        }
                        break;
                    }
                    case 'ArrowRight': {
                        const selectedIndexSet = state.selectedIndexSet?.right;
                        if (selectedIndexSet) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndexSet,
                            });
                        }
                        break;
                    }
                    default: {
                        const value = Number.parseInt(event.key, 10);
                        if (value <= 9 && value >= 1) {
                            if (state.notesOn) {
                                dispatch({
                                    type: 'SET_NOTE',
                                    note: value,
                                });
                            } else {
                                dispatch({ type: 'SET_VALUE', value });
                            }
                        }
                        break;
                    }
                }
            }
        },
        [state.notesOn, state.selectedIndexSet]
    );

    React.useEffect(() => {
        const board = Board.createWithDifficulty(state.difficulty);
        const hints = generateHints(40, board);
        if (hints) {
            let newValues = board.values;
            for (const hintIndex of hints) {
                newValues = newValues.setIn(
                    [hintIndex, 'value'],
                    newValues.get(hintIndex)?.answer
                );
            }
            dispatch({
                type: 'INIT_SODUKU',
                options: {
                    values: newValues,
                    board: undefined,
                    difficulty: undefined,
                },
            });
        } else {
            dispatch({
                type: 'INIT_SODUKU',
                options: { board, values: undefined, difficulty: undefined },
            });
        }
    }, [state.difficulty]);

    React.useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        if (state.intervalId) {
            clearInterval(state.intervalId);
        }
        if (state.stopWatchAction === 'start') {
            const newIntervalId = setInterval(() => {
                dispatch({ type: 'CALCULATE_SCORE' });
            }, SCORE_REFRESH_INTERVAL_MS);
            dispatch({
                type: 'SET_INTERVAL_ID',
                intervalId: newIntervalId,
            });
        }
    }, [state.stopWatchAction]);

    const handleButtonPress = React.useCallback(
        (value: ButtonValue) => {
            if (typeof value === 'string') {
                switch (value) {
                    case 'submit': {
                        dispatch({ type: 'SUBMIT' });
                        break;
                    }
                    case 'reset': {
                        dispatch({ type: 'RESET_CURRENT_BOARD' });
                        break;
                    }
                    case 'undo': {
                        dispatch({ type: 'UNDO' });
                        break;
                    }
                    case 'hint': {
                        dispatch({ type: 'HINT' });
                        break;
                    }
                    case 'toggle-notes': {
                        dispatch({ type: 'TOGGLE_NOTES' });
                        break;
                    }
                    case 'togge-auto-check': {
                        dispatch({ type: 'TOGGLE_AUTO_CHECK' });
                        break;
                    }
                    default: {
                        throw new Error('Invalid button value');
                    }
                }
            } else if (typeof value === 'number') {
                if (state.notesOn) {
                    dispatch({ type: 'SET_NOTE', note: value });
                } else {
                    dispatch({ type: 'SET_VALUE', value });
                }
            } else if (value.type === 'change-difficulty') {
                dispatch({ type: 'RESET', difficulty: value.to });
            }
        },
        [state.notesOn]
    );

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        lifetime: 10_000,
        elementCount: 300,
        elementSize: 20,
        spread: 90,
    });

    React.useEffect(() => {
        if (state.isSolved) {
            confettiReward();
        }
    }, [state.isSolved]);

    return (
        <div>
            <Header titleHeading="SUDOKU" />
            <div className="flex h-screen items-center justify-center">
                <div className="inline-flex flex-row items-center justify-center">
                    <div className="inline-flex flex-col items-center justify-center min-[1120px]:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex flex-row items-stretch justify-stretch" />
                            <SudokuStats {...state} />
                            <SudokuBoard
                                notesOn={state.notesOn}
                                autoCheckEnabled={state.autoCheckEnabled}
                                hintIndex={state.hintIndex}
                                conflictBoardIndices={
                                    state.conflictBoardIndices
                                }
                                board={state.board}
                                selectedIndexSet={state.selectedIndexSet}
                                setSelectedIndexSet={(indexSet) =>
                                    dispatch({
                                        type: 'SET_INDICES',
                                        selectedIndexSet: indexSet,
                                    })
                                }
                                onNoteClick={(note) =>
                                    dispatch({
                                        type: 'SET_NOTE',
                                        note,
                                    })
                                }
                            />
                            <span id="confettiReward" z-index={100} />
                            <span id="balloonsReward" z-index={101} />
                            <span
                                className={`${reenie_beanie.className} mt-4 w-full justify-start text-xl italic`}
                            >
                                made with love, by yours truly ❤️
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="space-between flex w-full flex-row items-center space-x-4 px-8">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="switch-toggle-auto-check"
                                        checked={state.autoCheckEnabled}
                                        onCheckedChange={() =>
                                            handleButtonPress(
                                                'togge-auto-check'
                                            )
                                        }
                                    />
                                    <Label htmlFor="switch-toggle-auto-check">
                                        AutoCheck
                                    </Label>
                                </div>
                                <StopWatch
                                    stopwatchAction={state.stopWatchAction}
                                    setStopwatchAction={(stopWatchAction) =>
                                        dispatch({
                                            type: 'SET_WATCH_ACTION',
                                            stopWatchAction,
                                        })
                                    }
                                    setTotalSeconds={setTotalSeconds}
                                />
                            </div>

                            <ButtonBar
                                onClick={handleButtonPress}
                                notesOn={state.notesOn}
                                hintsRemaining={state.hintCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Sudoku.displayName = 'Sudoku';
