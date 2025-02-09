import { List, Set } from "immutable";
import { toast } from "sonner";
import {
  getBoard,
  getBoardIndex,
  generateHint,
  HINT_COUNT,
  calculateScore,
} from "./utils";
import type {
  ReducerState,
  HistoryState,
  StopWatchAction,
  Difficulty,
  Value,
} from "./types";

const validateBoardAfterEntry = ({
  values,
  selectedColumnIndex,
  selectedRowIndex,
  toCheck,
}: {
  values: ReducerState["values"];
  selectedColumnIndex: ReducerState["selectedColumnIndex"];
  selectedRowIndex: ReducerState["selectedRowIndex"];
  toCheck: number;
}) => {
  const conflictBoardIndices: number[] = [];
  if (selectedRowIndex != undefined) {
    for (let offset = 0; offset < 9; offset++) {
      const boardIndex = selectedRowIndex * 9 + offset;
      const boardValue = values.get(boardIndex);
      if (boardValue?.value === toCheck) {
        conflictBoardIndices.push(boardIndex);
      }
    }
    if (selectedColumnIndex != undefined) {
      for (const [boardIndex, value] of values.entries()) {
        if (boardIndex % 9 === selectedColumnIndex) {
          if (value.value === toCheck) {
            conflictBoardIndices.push(boardIndex);
          } else {
            continue;
          }
        }
      }

      const gridRowIndex = selectedRowIndex - (selectedRowIndex % 3);
      const gridColumnIndex = selectedColumnIndex - (selectedColumnIndex % 3);
      for (let colOffset = 0; colOffset < 3; colOffset++) {
        for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
          const boardIndex = getBoardIndex(
            gridRowIndex + rowOffset,
            gridColumnIndex + colOffset
          );
          const boardValue = values.get(boardIndex);
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
      type: "SUBMIT";
    }
  | {
      type: "SET_VALUE";
      value: number;
    }
  | {
      type: "DELETE_VALUE";
    }
  | {
      type: "UNDO";
    }
  | {
      type: "RESET_CURRENT_BOARD";
    }
  | {
      type: "RESET";
      difficulty: Difficulty;
    }
  | {
      type: "SET_WATCH_ACTION";
      stopWatchAction: StopWatchAction;
    }
  | {
      type: "TOGGLE_NOTES";
    }
  | {
      type: "INIT_SODUKU";
      values: List<Value>;
      board: List<List<Value>>;
    }
  | {
      type: "SET_INDICES";
      selectedBoardIndex: number;
      selectedColumnIndex: number;
      selectedRowIndex: number;
    }
  | {
      type: "CALCULATE_SCORE";
    }
  | {
      type: "HINT";
    }
  | {
      type: "UPDATE_TIME";
      totalSeconds: number;
    }
  | {
      type: "SET_INTERVAL_ID";
      intervalId: NodeJS.Timeout;
    };

export function reducer(state: ReducerState, action: Action): ReducerState {
  // eslint-disable-next-line no-console
  console.log("Action", action.type);

  switch (action.type) {
    case "SET_VALUE": {
      const { selectedBoardIndex, values } = state;
      const { value } = action;
      if (selectedBoardIndex === undefined) {
        return state;
      }

      const selectedValue = values.get(selectedBoardIndex);
      if (!selectedValue || selectedValue.isOriginal) {
        return state;
      }

      if (selectedValue.value === value) {
        return {
          ...state,
          conflictBoardIndices: Set(),
          hintIndex: undefined,
          values: state.values.set(selectedBoardIndex, {
            ...selectedValue,
            value: undefined,
            hasError: false,
          }),
        };
      } else {
        const conflictBoardIndices = validateBoardAfterEntry({
          selectedColumnIndex: state.selectedColumnIndex,
          selectedRowIndex: state.selectedRowIndex,
          values: state.values,
          toCheck: value,
        });
        return {
          ...state,
          hintIndex: undefined,
          history: state.history.push({
            values,
            selectedBoardIndex: state.selectedBoardIndex,
            selectedColumnIndex: state.selectedColumnIndex,
            selectedRowIndex: state.selectedRowIndex,
            difficulty: state.difficulty,
            conflictBoardIndices: state.conflictBoardIndices,
            hintIndex: state.hintIndex,
            notesOn: state.notesOn,
          }),
          values: state.values.set(selectedBoardIndex, {
            ...selectedValue,
            value,
            answer: selectedValue.answer,
            hasError: conflictBoardIndices !== undefined,
          }),
          ...(conflictBoardIndices && conflictBoardIndices.size > 0
            ? { conflictBoardIndices, numMistakes: state.numMistakes + 1 }
            : {}),
        };
      }
    }
    case "DELETE_VALUE": {
      const { selectedBoardIndex, values } = state;
      if (selectedBoardIndex === undefined) {
        return state;
      }

      const selectedValue = values.get(selectedBoardIndex);
      if (!selectedValue || selectedValue.isOriginal) {
        return state;
      }
      return {
        ...state,
        conflictBoardIndices: Set(),
        hintIndex: undefined,
        values: state.values.set(selectedBoardIndex, {
          ...selectedValue,
          value: undefined,
          hasError: false,
        }),
      };
    }
    case "UNDO": {
      const lastState = state.history.last();
      if (lastState) {
        return {
          ...state,
          hintIndex: undefined,
          values: lastState.values,
          selectedBoardIndex: lastState.selectedBoardIndex,
          selectedColumnIndex: lastState.selectedColumnIndex,
          selectedRowIndex: lastState.selectedRowIndex,
          difficulty: lastState.difficulty,
          conflictBoardIndices: lastState.conflictBoardIndices,
          notesOn: lastState.notesOn,
          history: state.history.pop(),
        };
      }
      return state;
    }
    case "RESET_CURRENT_BOARD": {
      const { difficulty } = state;
      return {
        ...state,
        values: state.values.map((value) => ({
          ...value,
          ...(value.isOriginal
            ? { value: value.answer }
            : { value: undefined }),
          errorMessage: undefined,
        })),
        selectedBoardIndex: undefined,
        selectedColumnIndex: undefined,
        selectedRowIndex: undefined,
        hintIndex: undefined,
        conflictBoardIndices: Set(),
        stopWatchAction: "reset",
        notesOn: false,
        hintCount: HINT_COUNT[difficulty],
        isSolved: false,
        numMistakes: 0,
        score: "0",
      };
    }
    case "SET_WATCH_ACTION": {
      const { stopWatchAction } = action;
      return { ...state, stopWatchAction };
    }
    case "SUBMIT": {
      return {
        ...state,
        values: state.values.map((value) => ({
          ...value,
          value: value.answer,
          errorMessage: undefined,
        })),
        isSolved: true,
        hintIndex: undefined,
        stopWatchAction: "pause",
        conflictBoardIndices: Set(),
      };
    }
    case "TOGGLE_NOTES": {
      return { ...state, notesOn: !state.notesOn, hintIndex: undefined };
    }
    case "UPDATE_TIME": {
      return { ...state, totalSeconds: action.totalSeconds };
    }
    case "CALCULATE_SCORE": {
      const score = calculateScore(state);
      return { ...state, score };
    }
    case "INIT_SODUKU": {
      const { values, board } = action;
      return {
        ...state,
        values,
        board,
        isSolved: false,
        numMistakes: 0,
      };
    }
    case "SET_INDICES": {
      const { selectedColumnIndex, selectedRowIndex, selectedBoardIndex } =
        action;
      return {
        ...state,
        hintIndex: undefined,
        selectedBoardIndex,
        selectedColumnIndex,
        selectedRowIndex,
      };
    }
    case "HINT": {
      if (state.hintCount <= 0) {
        toast.error("Bebi Bebi 🐧", {
          className: "bold",
          description:
            "No more hints available for Bebi Bebi 🐧. Nisuke nikuongezee 😉",
          duration: 5000,
        });
        return state;
      }
      const hintIndex = generateHint(state.values);
      if (hintIndex === undefined) {
        toast.error("No more hints available", {
          className: "bold",
          description: "No more hints available",
          duration: 5000,
        });
        return state;
      } else {
        const hint = state.values.get(hintIndex);
        if (hint === undefined) {
          toast.error("Internal Error: hintIndex out of bounds", {
            description: "No more hints available",
            duration: 5000,
          });
          return state;
        } else {
          return {
            ...state,
            values: state.values.set(hintIndex, {
              ...hint,
              hasError: false,
              value: hint.answer,
            }),
            hintIndex,
            hintCount: state.hintCount - 1,
          };
        }
      }
    }
    case "SET_INTERVAL_ID": {
      const { intervalId } = action;
      return { ...state, intervalId };
    }
    case "RESET": {
      const { difficulty } = action;
      const { values, board } = getBoard(difficulty);
      return {
        ...state,
        values,
        board,
        selectedBoardIndex: undefined,
        selectedColumnIndex: undefined,
        selectedRowIndex: undefined,
        difficulty,
        conflictBoardIndices: Set(),
        hintIndex: undefined,
        notesOn: false,
        history: List(),
        stopWatchAction: "reset",
        hintCount: HINT_COUNT[difficulty],
        isSolved: false,
        numMistakes: 0,
        score: "0",
      };
    }
    default: {
      throw new Error(`$unknown action type: ${JSON.stringify(action)}`);
    }
  }
}

export const INITIAL_STATE: ReducerState = {
  values: List(),
  board: List(),
  selectedBoardIndex: undefined,
  selectedColumnIndex: undefined,
  selectedRowIndex: undefined,
  difficulty: "easy",
  conflictBoardIndices: Set(),
  hintIndex: undefined,
  notesOn: false,
  history: List<HistoryState>(),
  hintCount: HINT_COUNT["easy"],
  isSolved: false,
  stopWatchAction: "idle",
  numMistakes: 0,
  totalSeconds: 0,
  score: "0",
  intervalStartTime: Date.now(),
};
