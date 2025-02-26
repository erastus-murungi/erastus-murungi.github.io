'use client';

import React from 'react';
import { reenie_beanie } from '@/styles/fonts';
import Header from '../header';
import { ButtonBar } from './button-bar';
import { useReward } from 'react-rewards';
import { SudokuBoard } from './sudoku-board';
import { StopWatch } from './stopwatch';
import { reducer, INITIAL_BOARD_STATE, updateRefs } from './reducer';
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
const asAllowedKeyPress = (key: string) =>
    ALLOWED_KEYS.includes(key as HandledKeyPress)
        ? (key as HandledKeyPress)
        : undefined;

export const Sudoku: React.FC = () => {
    const refs = React.useRef<SudokuRefs>({
        history: createHistory(),
        elapsedSeconds: 0,
        intervalRef: undefined,
    });
    const [boardState, boardDispatch] = React.useReducer(
        reducer,
        INITIAL_BOARD_STATE
    );

    const onKeyDown = React.useCallback(
        (event: globalThis.KeyboardEvent) => {
            const allowedKey = asAllowedKeyPress(event.key);
            if (allowedKey) {
                event.preventDefault();

                switch (allowedKey) {
                    case 'Backspace': {
                        boardDispatch({ type: 'DELETE_VALUE' });
                        updateRefs({ type: 'DELETE_VALUE' }, refs, boardState);
                        break;
                    }
                    case 'ArrowUp': {
                        const selectedIndex = boardState.selectedIndex?.up;
                        if (selectedIndex) {
                            boardDispatch({
                                type: 'SET_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowDown': {
                        const selectedIndex = boardState.selectedIndex?.down;
                        if (selectedIndex) {
                            boardDispatch({
                                type: 'SET_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowLeft': {
                        const selectedIndex = boardState.selectedIndex?.left;
                        if (selectedIndex) {
                            boardDispatch({
                                type: 'SET_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    case 'ArrowRight': {
                        const selectedIndex = boardState.selectedIndex?.right;
                        if (selectedIndex) {
                            boardDispatch({
                                type: 'SET_INDEX',
                                selectedIndex,
                            });
                        }
                        break;
                    }
                    default: {
                        const value = Number.parseInt(event.key, 10);
                        if (value <= 9 && value >= 1) {
                            if (boardState.notesEnabled) {
                                boardDispatch({
                                    type: 'SET_NOTE',
                                    note: value,
                                });
                            } else {
                                boardDispatch({ type: 'SET_VALUE', value });
                                updateRefs(
                                    { type: 'SET_VALUE' },
                                    refs,
                                    boardState
                                );
                            }
                        }
                        break;
                    }
                }
            }
        },
        [boardState]
    );

    React.useEffect(() => {
        boardDispatch({
            type: 'INIT_SODUKU',
            options: {
                using: 'difficulty',
                difficulty: boardState.gameDifficulty,
            },
        });
        updateRefs(
            {
                type: 'INIT_SODUKU',
            },
            refs,
            boardState
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardState.gameDifficulty]);

    React.useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    React.useEffect(() => {
        clearInterval(refs.current.intervalRef);
        if (
            boardState.stopwatchCommand === 'start' &&
            !boardState.overlayVisible
        ) {
            refs.current.intervalRef = setInterval(() => {
                boardDispatch({
                    type: 'CALCULATE_SCORE',
                    totalSeconds: refs.current.elapsedSeconds,
                });
            }, SCORE_REFRESH_INTERVAL_MS);
        }
    }, [boardState.stopwatchCommand, boardState.overlayVisible]);

    const handleButtonPress = React.useCallback(
        (value: ButtonInputValue) => {
            if (typeof value === 'string') {
                switch (value) {
                    case 'submit': {
                        boardDispatch({ type: 'SUBMIT' });
                        break;
                    }
                    case 'reset': {
                        boardDispatch({ type: 'RESET_CURRENT_BOARD' });
                        updateRefs(
                            { type: 'RESET_CURRENT_BOARD' },
                            refs,
                            boardState
                        );
                        break;
                    }
                    case 'undo': {
                        const historyState = refs.current.history.undo();
                        if (historyState) {
                            boardDispatch({ type: 'TO_STATE', historyState });
                        }
                        break;
                    }
                    case 'hint': {
                        boardDispatch({ type: 'HINT' });
                        break;
                    }
                    case 'toggle-notes': {
                        boardDispatch({ type: 'TOGGLE_NOTES' });
                        break;
                    }
                    case 'togge-auto-check': {
                        boardDispatch({ type: 'TOGGLE_AUTO_CHECK' });
                        break;
                    }
                    default: {
                        throw new Error('Invalid button value');
                    }
                }
            } else if (typeof value === 'number') {
                if (boardState.notesEnabled) {
                    boardDispatch({ type: 'SET_NOTE', note: value });
                    updateRefs({ type: 'SET_NOTE' }, refs, boardState);
                } else {
                    boardDispatch({ type: 'SET_VALUE', value });
                    updateRefs({ type: 'SET_VALUE' }, refs, boardState);
                }
            } else if (value.type === 'change-difficulty') {
                updateRefs({ type: 'RESET' }, refs, boardState);
                boardDispatch({ type: 'RESET', difficulty: value.to });
            }
        },
        [boardState]
    );

    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        lifetime: 10_000,
        elementCount: 300,
        elementSize: 20,
        spread: 90,
    });

    React.useEffect(() => {
        if (boardState.isSudokuSolved === true) {
            confettiReward();
            setTimeout(() => {
                boardDispatch({ type: 'TOGGLE_SHOW_OVERLAY' });
            }, 5000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boardState.isSudokuSolved]);

    return (
        <div>
            <Header titleHeading="SUDOKU" />
            <div className="flex h-screen items-center justify-center">
                <div className="inline-flex flex-row items-center justify-center">
                    <div className="inline-flex flex-col items-center justify-center min-[1120px]:flex-row">
                        <div className="flex flex-col items-center justify-center">
                            <div className="inline-flex flex-col items-stretch justify-stretch">
                                {boardState.overlayVisible && (
                                    <SudokuOverlay
                                        state={boardState}
                                        onClick={(difficulty) =>
                                            boardDispatch({
                                                type: 'RESET',
                                                difficulty,
                                            })
                                        }
                                    />
                                )}
                                <SudokuStats
                                    moveCount={boardState.moveCount}
                                    mistakeCount={boardState.mistakeCount}
                                    playerScore={boardState.playerScore}
                                />
                                <div className="relative flex">
                                    {boardState.stopwatchCommand === 'pause' &&
                                        !boardState.isSudokuSolved && (
                                            <SudokuGamePausedOverlay
                                                onClick={() =>
                                                    boardDispatch({
                                                        type: 'SET_WATCH_COMMAND',
                                                        stopwatchCommand:
                                                            'start',
                                                    })
                                                }
                                            />
                                        )}
                                    <SudokuBoard
                                        notesEnabled={boardState.notesEnabled}
                                        autoCheckEnabled={
                                            boardState.autoCheckEnabled
                                        }
                                        hintIndex={boardState.hintIndex}
                                        conflictingIndices={
                                            boardState.conflictingIndices
                                        }
                                        board={boardState.board}
                                        selectedIndex={boardState.selectedIndex}
                                        setSelectedIndex={(selectedIndex) =>
                                            boardDispatch({
                                                type: 'SET_INDEX',
                                                selectedIndex,
                                            })
                                        }
                                        onNoteSelected={(note) =>
                                            boardDispatch({
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
                                        checked={boardState.autoCheckEnabled}
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
                                        boardState.stopwatchCommand
                                    }
                                    setStopwatchCommand={(stopwatchCommand) =>
                                        boardDispatch({
                                            type: 'SET_WATCH_COMMAND',
                                            stopwatchCommand,
                                        })
                                    }
                                    setElapsedSeconds={(seconds) => {
                                        refs.current.elapsedSeconds = seconds;
                                    }}
                                />
                            </div>

                            <ButtonBar
                                onClick={handleButtonPress}
                                notesOn={boardState.notesEnabled}
                                hintsRemaining={boardState.hintUsageCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Sudoku.displayName = 'Sudoku';
