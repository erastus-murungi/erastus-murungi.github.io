import React from "react";

import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  CounterClockwiseClockIcon,
  ResetIcon,
  SunIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styled from "@emotion/styled";

export type ButtonValue =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 0
  | "submit"
  | "undo"
  | "hint"
  | "toggle-notes"
  | "reset";
type Row = React.FC<{
  onClick: (value: ButtonValue) => void;
  hintsRemaining: number;
  notesOn: boolean;
}>;

const StyledButtonBar = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 640px) {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
`;

const NumPad: React.FC<{
  onClick: (value: ButtonValue) => void;
}> = ({ onClick }) => {
  return (
    <StyledButtonBar className="sm:flex sm:flex-row">
      {[...Array(9).keys()].map((value) => (
        <Button
          key={`numpad-key-${value + 1}`}
          className="text-2xl w-10 h-10 hover:scale-110 hover:shadow-lg hover:border-2 hover:border-black hover sm:w-16 sm:h-16 sm:text-xl"
          variant="secondary"
          onClick={() => onClick((value + 1) as ButtonValue)}
        >
          {value + 1}
        </Button>
      ))}
    </StyledButtonBar>
  );
};

const ActionButtons: Row = React.memo(
  ({ onClick, hintsRemaining = 0, notesOn }) => {
    return (
      <div className="space-x-3 m-6 inline-flex">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center flex-col hover:scale-110">
              <Button
                className="rounded-full w-16 h-16 mb-2 hover:border-2 hover:border-black"
                variant="secondary"
              >
                <CheckIcon />
              </Button>
              <span className="text-xs uppercase">Submit</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Game</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onClick("submit")}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center flex-col hover:scale-110">
          <Button
            className="rounded-full w-16 h-16 mb-2 hover:border-2 hover:border-black"
            variant="secondary"
            onClick={() => onClick("undo")}
          >
            <CounterClockwiseClockIcon />
          </Button>
          <span className="text-xs uppercase">Undo</span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex items-center flex-col hover:scale-110">
              <Button
                className="rounded-full w-16 h-16 mb-2 hover:border-2 hover:border-black"
                variant="secondary"
              >
                <ResetIcon />
              </Button>
              <span className="text-xs uppercase">Reset</span>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Game</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onClick("reset")}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex items-center flex-col hover:scale-110">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="relative inline-block text-center"
                onClick={() => onClick("hint")}
                role="button"
              >
                <Button
                  className="rounded-full w-16 h-16 mb-2 hover:border-2 hover:border-black"
                  variant="secondary"
                >
                  <SunIcon />
                </Button>
                <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {hintsRemaining}
                </span>
                <p className="text-xs uppercase">Hint</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>You have {hintsRemaining} hints remaining</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center flex-col hover:scale-110">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="relative inline-block text-center"
                onClick={() => onClick("toggle-notes")}
                role="button"
              >
                <Button
                  className="rounded-full w-16 h-16 mb-2 hover:border-2 hover:border-black"
                  variant="secondary"
                >
                  <Pencil2Icon className="rounded-full w-16 h-16 mb-2" />
                </Button>
                <span className="absolute top-0 right-0 bg-gray-500 text-white text-xs font-bold rounded-lg h-6 w-7 flex items-center justify-center">
                  {notesOn ? "ON" : "OFF"}
                </span>
                <p className="text-xs uppercase">Notes</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                You have turned off notes, click the button again to turn them
                on
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }
);

ActionButtons.displayName = "ActionButtons";

export const ButtonBar: Row = React.memo(
  ({ onClick, hintsRemaining, notesOn }) => {
    return (
      <div className="items-center justify-center flex flex-col">
        <ActionButtons
          onClick={onClick}
          hintsRemaining={hintsRemaining}
          notesOn={notesOn}
        />
        <NumPad onClick={onClick} />
      </div>
    );
  }
);

ButtonBar.displayName = "ButtonBar";
