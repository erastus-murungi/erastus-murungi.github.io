'use client';

import React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import Header from '../header';
import { ButtonBar } from './button-bar';
import { useReward } from 'react-rewards';
import { SudokuBoard } from './sudoku-board';
import { StopWatch } from './stopwatch';
import { reducer, INITIAL_SUDOKU_STATE, updateRefs } from './reducer';
import { Switch } from '@/components/ui/switch';
import { SudokuStats } from './sudoku-stats';
import { Label } from '@/components/ui/label';
import { SudokuGamePausedOverlay, SudokuOverlay } from './sudoku-overlay';
import { SudokuRefs, type ButtonInputValue } from './types';
import { createHistory } from './models/sudoku-history';

/**
 * The interval in milliseconds to update the player's score
 */
const SCORE_REFRESH_INTERVAL_MS = 10_000;

/**
 * The allowed keys for the sudoku game
 */
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

/**
 * The type of the allowed keys
 */
type ValidPressedKey = (typeof ALLOWED_KEYS)[number];

/**
 * Type guard to ensure that the key pressed is one of the allowed keys
 */
const asAllowedKeyPress = (key: string) =>
    ALLOWED_KEYS.includes(key as ValidPressedKey)
        ? (key as ValidPressedKey)
        : undefined;

export const Sudoku: React.FC = () => {
    const gameRefs = React.useRef<SudokuRefs>({
        history: createHistory(),
        elapsedSeconds: 0,
        intervalRef: undefined,
    });
    const [gameState, dispatchGameAction] = React.useReducer(
        reducer,
        INITIAL_SUDOKU_STATE
    );

    const onKeyDown = React.useCallback(
        (event: globalThis.KeyboardEvent) => {
            const allowedKey = asAllowedKeyPress(event.key);
            if (allowedKey) {
                event.preventDefault();

                switch (allowedKey) {
                    case 'Backspace': {
                        dispatchGameAction({ type: 'DELETE_VALUE' });
                        updateRefs(
                            { type: 'DELETE_VALUE' },
                            gameRefs,
                            gameState
                        );
                        break;
                    }
                    case 'ArrowUp': {
                        const selectedIndex = gameState.selectedIndex?.up;
                        if (selectedIndex) {
                            dispatchGameAction({
                                type: 'SET_SELECTED_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowDown': {
                        const selectedIndex = gameState.selectedIndex?.down;
                        if (selectedIndex) {
                            dispatchGameAction({
                                type: 'SET_SELECTED_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowLeft': {
                        const selectedIndex = gameState.selectedIndex?.left;
                        if (selectedIndex) {
                            dispatchGameAction({
                                type: 'SET_SELECTED_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowRight': {
                        const selectedIndex = gameState.selectedIndex?.right;
                        if (selectedIndex) {
                            dispatchGameAction({
                                type: 'SET_SELECTED_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    default: {
                        const value = Number.parseInt(event.key, 10);
                        if (value <= 9 && value >= 1) {
                            if (gameState.notesEnabled) {
                                dispatchGameAction({
                                    type: 'SET_NOTE',
                                    note: value,
                                });
                            } else {
                                dispatchGameAction({
                                    type: 'SET_VALUE',
                                    value,
                                });
                                updateRefs(
                                    { type: 'SET_VALUE' },
                                    gameRefs,
                                    gameState
                                );
                            }
                        }
                        break;
                    }
                }
            }
        },
        [gameState]
    );

    React.useEffect(() => {
        dispatchGameAction({
            type: 'INIT_SODUKU',
            options: {
                using: 'difficulty',
                difficulty: gameState.gameDifficulty,
            },
        });
        updateRefs(
            {
                type: 'INIT_SODUKU',
            },
            gameRefs,
            gameState
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.gameDifficulty]);

    React.useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        clearInterval(gameRefs.current.intervalRef);
        if (
            gameState.stopwatchCommand === 'start' &&
            !gameState.overlayVisible
        ) {
            gameRefs.current.intervalRef = setInterval(() => {
                dispatchGameAction({
                    type: 'CALCULATE_SCORE',
                    totalSeconds: gameRefs.current.elapsedSeconds,
                });
            }, SCORE_REFRESH_INTERVAL_MS);
        }
    }, [gameState.stopwatchCommand, gameState.overlayVisible]);

    const handleButtonPress = React.useCallback(
        (value: ButtonInputValue) => {
            if (typeof value === 'string') {
                switch (value) {
                    case 'submit': {
                        dispatchGameAction({ type: 'SUBMIT' });
                        break;
                    }
                    case 'reset': {
                        dispatchGameAction({ type: 'RESET_CURRENT_BOARD' });
                        updateRefs(
                            { type: 'RESET_CURRENT_BOARD' },
                            gameRefs,
                            gameState
                        );
                        break;
                    }
                    case 'undo': {
                        const historyState = gameRefs.current.history.undo();
                        if (historyState) {
                            dispatchGameAction({
                                type: 'TO_STATE',
                                historyState,
                            });
                        }
                        break;
                    }
                    case 'hint': {
                        dispatchGameAction({ type: 'REQUEST_HINT' });
                        break;
                    }
                    case 'toggle-notes': {
                        dispatchGameAction({ type: 'TOGGLE_NOTES' });
                        break;
                    }
                    case 'togge-auto-check': {
                        dispatchGameAction({ type: 'TOGGLE_AUTO_CHECK' });
                        break;
                    }
                    default: {
                        throw new Error('Invalid button value');
                    }
                }
            } else if (typeof value === 'number') {
                if (gameState.notesEnabled) {
                    dispatchGameAction({ type: 'SET_NOTE', note: value });
                    updateRefs({ type: 'SET_NOTE' }, gameRefs, gameState);
                } else {
                    dispatchGameAction({ type: 'SET_VALUE', value });
                    updateRefs({ type: 'SET_VALUE' }, gameRefs, gameState);
                }
            } else if (value.type === 'change-difficulty') {
                updateRefs({ type: 'RESET' }, gameRefs, gameState);
                dispatchGameAction({ type: 'RESET', difficulty: value.to });
            }
        },
        [gameState]
    );

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        lifetime: 10_000,
        elementCount: 300,
        elementSize: 20,
        spread: 90,
    });

    React.useEffect(() => {
        if (gameState.isSudokuSolved === true) {
            confettiReward();
            setTimeout(() => {
                dispatchGameAction({ type: 'TOGGLE_OVERLAY_VISIBILITY' });
            }, 5000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState.isSudokuSolved]);

    return (
        <div>
            <Header titleHeading="SUDOKU" />
            <div className="flex h-screen items-center justify-center">
                <div className="inline-flex flex-row items-center justify-center">
                    <div className="inline-flex flex-col items-center justify-center min-[1120px]:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex flex-col items-stretch justify-stretch">
                                {gameState.overlayVisible && (
                                    <SudokuOverlay
                                        state={gameState}
                                        onClick={(difficulty) =>
                                            dispatchGameAction({
                                                type: 'RESET',
                                                difficulty,
                                            })
                                        }
                                    />
                                )}
                                <SudokuStats
                                    moveCount={gameState.moveCount}
                                    mistakeCount={gameState.mistakeCount}
                                    playerScore={gameState.playerScore}
                                />
                                <div className="relative flex">
                                    {gameState.stopwatchCommand === 'pause' &&
                                        !gameState.isSudokuSolved && (
                                            <SudokuGamePausedOverlay
                                                onClick={() =>
                                                    dispatchGameAction({
                                                        type: 'SET_STOPWATCH_COMMAND',
                                                        stopwatchCommand:
                                                            'start',
                                                    })
                                                }
                                            />
                                        )}
                                    <SudokuBoard
                                        notesEnabled={gameState.notesEnabled}
                                        autoCheckEnabled={
                                            gameState.autoCheckEnabled
                                        }
                                        hintIndex={gameState.hintIndex}
                                        conflictingIndices={
                                            gameState.conflictingIndices
                                        }
                                        board={gameState.board}
                                        selectedIndex={gameState.selectedIndex}
                                        setSelectedIndex={(selectedIndex) =>
                                            dispatchGameAction({
                                                type: 'SET_SELECTED_INDEX',
                                                selectedIndex,
                                            })
                                        }
                                        onNoteSelected={(note) =>
                                            dispatchGameAction({
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
                                        checked={gameState.autoCheckEnabled}
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
                                    stopwatchCommand={
                                        gameState.stopwatchCommand
                                    }
                                    setStopwatchCommand={(stopwatchCommand) =>
                                        dispatchGameAction({
                                            type: 'SET_STOPWATCH_COMMAND',
                                            stopwatchCommand,
                                        })
                                    }
                                    setElapsedSeconds={(seconds) => {
                                        gameRefs.current.elapsedSeconds =
                                            seconds;
                                    }}
                                />
                            </div>

                            <ButtonBar
                                onClick={handleButtonPress}
                                notesOn={gameState.notesEnabled}
                                hintsRemaining={gameState.hintUsageCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Sudoku.displayName = 'Sudoku';
