"use client";

import React from "react";
import styled from "@emotion/styled";
import { reenie_beanie } from "@/styles/fonts";
import { ButtonBar, type ButtonValue } from "./button-bar";
import { List } from "immutable";
import { useReward } from "react-rewards";
import Header from "../header";
import { getBoard, getBoardIndex } from "./utils";
import { SudokuSquare } from "./square";
import { StopWatch } from "./stopwatch";
import { reducer, INITIAL_STATE } from "./reducer";
import type { Value } from "./types";

const SCORE_REFRESH_INTERVAL_MS = 10_000;

export const Main = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: white;

  overflow: hidden;
  color: black;
  border-color: black;
`;

export interface SudokuProps {
  onComplete: () => void;
  hide: boolean;
}

export const Sudoku: React.FC<SudokuProps> = () => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

  React.useEffect(() => {
    const { values, board } = getBoard(state.difficulty);
    dispatch({ type: "INIT_SODUKU", values, board });
  }, [state.difficulty]);

  const setTotalSeconds = React.useCallback(
    (totalSeconds: number) => dispatch({ type: "UPDATE_TIME", totalSeconds }),
    []
  );

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

  const buildRow = React.useCallback(
    (rowIndex: number) =>
      function SudokuRow(value: Value, index: number) {
        const boardIndex = getBoardIndex(rowIndex, index);
        const val = state.values.get(boardIndex);

        if (!val) {
          return null;
        }

        return (
          <SudokuSquare
            key={`${state.difficulty}-${rowIndex}-${index}`}
            value={val}
            initialValue={value}
            rowIndex={rowIndex}
            boardIndex={boardIndex}
            index={index}
            selectedColumnIndex={state.selectedColumnIndex}
            selectedRowIndex={state.selectedRowIndex}
            selectedBoardIndex={state.selectedBoardIndex}
            notesOn={state.notesOn}
            setSelectedBoardIndices={(values) =>
              dispatch({ type: "SET_INDICES", ...values })
            }
            isConflictSquare={state.conflictBoardIndices.has(boardIndex)}
            isHint={state.hintIndex === boardIndex}
          />
        );
      },
    [
      state.conflictBoardIndices,
      state.difficulty,
      state.hintIndex,
      state.notesOn,
      state.selectedBoardIndex,
      state.selectedColumnIndex,
      state.selectedRowIndex,
      state.values,
    ]
  );

  const buildBoard = React.useCallback(
    (rowValues: List<Value>, rowIndex: number) => {
      return (
        <div className="inline-flex" key={rowIndex}>
          {rowValues.map(buildRow(rowIndex))}
        </div>
      );
    },
    [buildRow]
  );

  const handleButtonPress = React.useCallback(
    (value: ButtonValue) => {
      if (typeof value === "string") {
        switch (value) {
          case "submit":
            dispatch({ type: "SUBMIT" });
            break;
          case "reset":
            dispatch({ type: "RESET_CURRENT_BOARD" });
            break;
          case "undo":
            dispatch({ type: "UNDO" });
            break;
          case "hint":
            dispatch({ type: "HINT" });
            break;
          case "toggle-notes":
            dispatch({ type: "TOGGLE_NOTES" });
            break;
          default:
            throw new Error("Invalid button value");
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
    lifetime: 10000,
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
          <div className="items-center justify-center inline-flex sm:flex-row flex-col">
            <div className="flex flex-col items-center justify-center">
              <div className="items-stretch inline-flex justify-stretch flex-row" />
              <Main>{state.board.map(buildBoard)}</Main>
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
};

Sudoku.displayName = "Sudoku";
