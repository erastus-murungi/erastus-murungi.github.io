'use client';

import React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import Header from '../header';
import { ButtonBar } from './button-bar';
import { useReward } from 'react-rewards';
// import { Board, generateHints } from './utils';
import { SudokuBoard } from './sudoku-board';
import { StopWatch } from './stopwatch';
import { reducer, INITIAL_STATE } from './reducer';
import { Switch } from '@/components/ui/switch';
import { SudokuStats } from './sudoku-stats';
import { Label } from '@/components/ui/label';
import { SudokuGamePausedOverlay, SudokuOverlay } from './sudoku-overlay';
import type { ButtonValue } from './types';

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

    const totalSeconds = React.useRef(0);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

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
        // let board = Board.createWithDifficulty(state.difficulty);
        // const hints = generateHints(40, board);
        // if (hints) {
        //     for (const hintIndex of hints) {
        //         const hint = board.getFromBoardIndex(hintIndex);
        //         if (hint) {
        //             board = board.set(hintIndex, hint);
        //         }
        //     }
        //     dispatch({
        //         type: 'INIT_SODUKU',
        //         options: {
        //             values: undefined,
        //             board,
        //             difficulty: undefined,
        //         },
        //     });
        // } else {
        //     dispatch({
        //         type: 'INIT_SODUKU',
        //         options: { board, values: undefined, difficulty: undefined },
        //     });
        // }
        dispatch({
            type: 'INIT_SODUKU',
            options: {
                board: undefined,
                values: undefined,
                difficulty: state.difficulty,
            },
        });
    }, [state.difficulty]);

    React.useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (state.stopWatchAction === 'start' && !state.showOverlay) {
            intervalRef.current = setInterval(() => {
                dispatch({
                    type: 'CALCULATE_SCORE',
                    totalSeconds: totalSeconds.current,
                });
            }, SCORE_REFRESH_INTERVAL_MS);
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
                        totalSeconds.current = 0;
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
                totalSeconds.current = 0;
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
        if (state.isSolved === true) {
            confettiReward();
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_SHOW_OVERLAY' });
            }, 5000);
        }
    }, [state.isSolved]);

    return (
        <div>
            <Header titleHeading="SUDOKU" />
            <div className="flex h-screen items-center justify-center">
                <div className="inline-flex flex-row items-center justify-center">
                    <div className="inline-flex flex-col items-center justify-center min-[1120px]:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex flex-col items-stretch justify-stretch">
                                {state.showOverlay && (
                                    <SudokuOverlay
                                        state={state}
                                        onClick={(difficulty) =>
                                            dispatch({
                                                type: 'INIT_SODUKU',
                                                options: {
                                                    board: undefined,
                                                    values: undefined,
                                                    difficulty,
                                                },
                                            })
                                        }
                                    />
                                )}
                                <SudokuStats {...state} />
                                <div className="relative flex">
                                    {state.stopWatchAction === 'pause' &&
                                        !state.isSolved && (
                                            <SudokuGamePausedOverlay
                                                onClick={() =>
                                                    dispatch({
                                                        type: 'SET_WATCH_ACTION',
                                                        stopWatchAction:
                                                            'start',
                                                    })
                                                }
                                            />
                                        )}
                                    <SudokuBoard
                                        notesOn={state.notesOn}
                                        autoCheckEnabled={
                                            state.autoCheckEnabled
                                        }
                                        hintIndex={state.hintIndex}
                                        conflictBoardIndices={
                                            state.conflictBoardIndices
                                        }
                                        board={state.board}
                                        selectedIndexSet={
                                            state.selectedIndexSet
                                        }
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
                                </div>
                            </div>
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
                                    setTotalSeconds={(seconds) => {
                                        totalSeconds.current = seconds;
                                    }}
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
