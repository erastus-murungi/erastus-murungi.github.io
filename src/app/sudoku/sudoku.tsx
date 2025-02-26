'use client';

import React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import Header from '../header';
import { ButtonBar } from './button-bar';
import { useReward } from 'react-rewards';
import { SudokuBoard } from './sudoku-board';
import { StopWatch } from './stopwatch';
import { reducer, INITIAL_STATE, updateRefs } from './reducer';
import { Switch } from '@/components/ui/switch';
import { SudokuStats } from './sudoku-stats';
import { Label } from '@/components/ui/label';
import { SudokuGamePausedOverlay, SudokuOverlay } from './sudoku-overlay';
import { SudokuRefs, type ButtonInputValue } from './types';
import { createHistory } from './models/sudoku-history';

const SCORE_REFRESH_INTERVAL_MS = 10_000;

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

export const Sudoku: React.FC = () => {
    const refs = React.useRef<SudokuRefs>({
        history: createHistory(),
        elapsedSeconds: 0,
        intervalRef: undefined,
    });
    const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

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
                        updateRefs({ type: 'DELETE_VALUE' }, refs, state);
                        break;
                    }
                    case 'ArrowUp': {
                        const selectedIndex = state.selectedIndex?.up;
                        if (selectedIndex) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowDown': {
                        const selectedIndex = state.selectedIndex?.down;
                        if (selectedIndex) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowLeft': {
                        const selectedIndex = state.selectedIndex?.left;
                        if (selectedIndex) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowRight': {
                        const selectedIndex = state.selectedIndex?.right;
                        if (selectedIndex) {
                            dispatch({
                                type: 'SET_INDICES',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    default: {
                        const value = Number.parseInt(event.key, 10);
                        if (value <= 9 && value >= 1) {
                            if (state.notesEnabled) {
                                dispatch({
                                    type: 'SET_NOTE',
                                    note: value,
                                });
                            } else {
                                dispatch({ type: 'SET_VALUE', value });
                                updateRefs(
                                    { type: 'SET_VALUE', value },
                                    refs,
                                    state
                                );
                            }
                        }
                        break;
                    }
                }
            }
        },
        [state]
    );

    React.useEffect(() => {
        dispatch({
            type: 'INIT_SODUKU',
            options: {
                board: undefined,
                cells: undefined,
                difficulty: state.gameDifficulty,
            },
        });
        updateRefs(
            {
                type: 'INIT_SODUKU',
                options: {
                    board: undefined,
                    cells: undefined,
                    difficulty: state.gameDifficulty,
                },
            },
            refs,
            state
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.gameDifficulty]);

    React.useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        if (refs.current.intervalRef) {
            clearInterval(refs.current.intervalRef);
        }
        if (state.stopwatchCommand === 'start' && !state.overlayVisible) {
            refs.current.intervalRef = setInterval(() => {
                dispatch({
                    type: 'CALCULATE_SCORE',
                    totalSeconds: refs.current.elapsedSeconds,
                });
            }, SCORE_REFRESH_INTERVAL_MS);
        }
    }, [state.stopwatchCommand, state.overlayVisible]);

    const handleButtonPress = React.useCallback(
        (value: ButtonInputValue) => {
            if (typeof value === 'string') {
                switch (value) {
                    case 'submit': {
                        dispatch({ type: 'SUBMIT' });
                        break;
                    }
                    case 'reset': {
                        dispatch({ type: 'RESET_CURRENT_BOARD' });
                        updateRefs(
                            { type: 'RESET_CURRENT_BOARD' },
                            refs,
                            state
                        );
                        break;
                    }
                    case 'undo': {
                        const historyState = refs.current.history.undo();
                        if (historyState) {
                            dispatch({ type: 'TO_STATE', historyState });
                        }
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
                if (state.notesEnabled) {
                    dispatch({ type: 'SET_NOTE', note: value });
                    updateRefs({ type: 'SET_NOTE', note: value }, refs, state);
                } else {
                    dispatch({ type: 'SET_VALUE', value });
                    updateRefs({ type: 'SET_VALUE', value }, refs, state);
                }
            } else if (value.type === 'change-difficulty') {
                updateRefs(
                    { type: 'RESET', difficulty: value.to },
                    refs,
                    state
                );
                dispatch({ type: 'RESET', difficulty: value.to });
            }
        },
        [state]
    );

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        lifetime: 10_000,
        elementCount: 300,
        elementSize: 20,
        spread: 90,
    });

    React.useEffect(() => {
        if (state.isSudokuSolved === true) {
            confettiReward();
            setTimeout(() => {
                dispatch({ type: 'TOGGLE_SHOW_OVERLAY' });
            }, 5000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isSudokuSolved]);

    // bg-[url(../../public/cool-background.svg)]

    return (
        <div>
            <Header titleHeading="SUDOKU" />
            <div className="flex h-screen items-center justify-center">
                <div className="inline-flex flex-row items-center justify-center">
                    <div className="inline-flex flex-col items-center justify-center min-[1120px]:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex flex-col items-stretch justify-stretch">
                                {state.overlayVisible && (
                                    <SudokuOverlay
                                        state={state}
                                        onClick={(difficulty) =>
                                            dispatch({
                                                type: 'RESET',
                                                difficulty,
                                            })
                                        }
                                    />
                                )}
                                <SudokuStats
                                    moveCount={state.moveCount}
                                    mistakeCount={state.mistakeCount}
                                    playerScore={state.playerScore}
                                />
                                <div className="relative flex">
                                    {state.stopwatchCommand === 'pause' &&
                                        !state.isSudokuSolved && (
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
                                        notesEnabled={state.notesEnabled}
                                        autoCheckEnabled={
                                            state.autoCheckEnabled
                                        }
                                        hintIndex={state.hintIndex}
                                        conflictingIndices={
                                            state.conflictingIndices
                                        }
                                        board={state.board}
                                        selectedIndex={state.selectedIndex}
                                        setSelectedIndex={(index) =>
                                            dispatch({
                                                type: 'SET_INDICES',
                                                selectedIndex: index,
                                            })
                                        }
                                        onNoteSelected={(note) =>
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
                                    stopwatchCommand={state.stopwatchCommand}
                                    setStopwatchCommand={(stopWatchAction) =>
                                        dispatch({
                                            type: 'SET_WATCH_ACTION',
                                            stopWatchAction,
                                        })
                                    }
                                    setElapsedSeconds={(seconds) => {
                                        refs.current.elapsedSeconds = seconds;
                                    }}
                                />
                            </div>

                            <ButtonBar
                                onClick={handleButtonPress}
                                notesOn={state.notesEnabled}
                                hintsRemaining={state.hintUsageCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Sudoku.displayName = 'Sudoku';
