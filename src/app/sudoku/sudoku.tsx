"use client";

import React from "react";
import { reenie_beanie } from "@/styles/fonts";
import Header from "../header";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { useReward } from "react-rewards";
import { getBoard } from "./utils";
import { Board } from "./sudoku-board";
import { StopWatch } from "./stopwatch";
import { reducer, INITIAL_STATE } from "./reducer";

const SCORE_REFRESH_INTERVAL_MS = 10_000;

export interface SudokuProps {
  onComplete: () => void;
  hide: boolean;
}

const ALLOWED_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "Backspace",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const;

type HandledKeyPress = (typeof ALLOWED_KEYS)[number];

export const Sudoku: React.FC<SudokuProps> = React.memo(() => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  const setTotalSeconds = React.useCallback(
    (totalSeconds: number) => dispatch({ type: "UPDATE_TIME", totalSeconds }),
    []
  );

  const onKeyDown = React.useCallback((event: globalThis.KeyboardEvent) => {
    const wasAnyKeyPressed = ALLOWED_KEYS.includes(
      event.key as HandledKeyPress
    );
    if (wasAnyKeyPressed) {
      event.preventDefault();

      switch (event.key as HandledKeyPress) {
        case "Backspace": {
          dispatch({ type: "DELETE_VALUE" });
          break;
        }
        case "ArrowUp": {
          const selectedIndexSet = state.selectedIndexSet?.up;
          if (selectedIndexSet) {
            dispatch({
              type: "SET_INDICES",
              selectedIndexSet,
            });
          }
          break;
        }
        case "ArrowDown": {
          const selectedIndexSet = state.selectedIndexSet?.down;
          if (selectedIndexSet) {
            dispatch({
              type: "SET_INDICES",
              selectedIndexSet,
            });
          }
          break;
        }
        case "ArrowLeft": {
          const selectedIndexSet = state.selectedIndexSet?.left;
          if (selectedIndexSet) {
            dispatch({
              type: "SET_INDICES",
              selectedIndexSet,
            });
          }
          break;
        }
        case "ArrowRight": {
          const selectedIndexSet = state.selectedIndexSet?.right;
          if (selectedIndexSet) {
            dispatch({
              type: "SET_INDICES",
              selectedIndexSet,
            });
          }
          break;
        }
        default: {
          const value = Number.parseInt(event.key, 10);
          if (value <= 9 && value >= 1) {
            dispatch({ type: "SET_VALUE", value });
          }
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const { values, board } = getBoard(state.difficulty);
    dispatch({ type: "INIT_SODUKU", values, board });
  }, [state.difficulty]);

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  React.useEffect(() => {
    if (state.intervalStartTime) {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }
      if (state.stopWatchAction === "start") {
        const newIntervalId = setInterval(() => {
          dispatch({ type: "CALCULATE_SCORE" });
        }, SCORE_REFRESH_INTERVAL_MS);
        dispatch({ type: "SET_INTERVAL_ID", intervalId: newIntervalId });
      }
    }
  }, [state.intervalStartTime, state.stopWatchAction]);

  const handleButtonPress = React.useCallback(
    (value: ButtonValue) => {
      if (typeof value === "string") {
        switch (value) {
          case "submit": {
            dispatch({ type: "SUBMIT" });
            break;
          }
          case "reset": {
            dispatch({ type: "RESET_CURRENT_BOARD" });
            break;
          }
          case "undo": {
            dispatch({ type: "UNDO" });
            break;
          }
          case "hint": {
            dispatch({ type: "HINT" });
            break;
          }
          case "toggle-notes": {
            dispatch({ type: "TOGGLE_NOTES" });
            break;
          }
          default: {
            throw new Error("Invalid button value");
          }
        }
      } else if (typeof value === "number") {
        dispatch({ type: "SET_VALUE", value });
      } else if (value.type === "change-difficulty") {
        dispatch({ type: "RESET", difficulty: value.to });
      }
    },
    [state.difficulty]
  );

  const { reward: confettiReward } = useReward("confettiReward", "confetti", {
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
      <div className="flex justify-center items-center h-screen">
        <div className="inline-flex justify-center items-center flex-row">
          <div className="items-center justify-center inline-flex min-[1120px]:flex-row flex-col">
            <div className="flex flex-col items-center justify-center">
              <div className="items-stretch inline-flex justify-stretch flex-row" />
              <Board
                notesOn={state.notesOn}
                hintIndex={state.hintIndex}
                conflictBoardIndices={state.conflictBoardIndices}
                board={state.board}
                values={state.values}
                selectedIndexSet={state.selectedIndexSet}
                setSelectedIndexSet={(indexSet) =>
                  dispatch({
                    type: "SET_INDICES",
                    selectedIndexSet: indexSet,
                  })
                }
              />
              <span id="confettiReward" z-index={100} />
              <span id="balloonsReward" z-index={101} />
              <span
                className={`${reenie_beanie.className} justify-start text-xl italic mt-4 w-full`}
              >
                made with love, by yours truly ❤️
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row items-center justify-between w-full px-8">
                <div className="flex flex-row">
                  <p className="text-xs uppercase">Mistakes:&nbsp;</p>
                  <p className="text-xs text-gray-700 ">{state.numMistakes}</p>
                </div>
                <div className="flex flex-row">
                  <p className="text-xs uppercase">Score:&nbsp;</p>
                  <p className="text-xs text-gray-700 ">{state.score}</p>
                </div>
                <StopWatch
                  stopwatchAction={state.stopWatchAction}
                  setStopwatchAction={(stopWatchAction) =>
                    dispatch({ type: "SET_WATCH_ACTION", stopWatchAction })
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
});

Sudoku.displayName = "Sudoku";
