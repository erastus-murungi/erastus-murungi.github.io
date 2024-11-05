import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  CounterClockwiseClockIcon,
  ResetIcon,
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
  | "check"
  | "undo"
  | "reset";
type Row = React.FC<{ onClick: (value: ButtonValue) => void }>;

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

const NumPad: Row = ({ onClick }) => {
  return (
    <StyledButtonBar className="sm:flex sm:flex-row">
      {[...Array(9).keys()].map((value) => (
        <Button
          key={`numpad-key-${value + 1}`}
          className="text-2xl w-10 h-10 hover:scale-110 hover:shadow-lg sm:w-16 sm:h-16 sm:text-xl"
          variant="secondary"
          onClick={() => onClick((value + 1) as ButtonValue)}
        >
          {value + 1}
        </Button>
      ))}
    </StyledButtonBar>
  );
};

const ActionButtons: Row = ({ onClick }) => {
  return (
    <div className="space-x-3 m-6 inline-flex">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center space-x-2 flex-col hover:scale-110">
            <Button className="rounded-full w-16 h-16" variant="secondary">
              <CheckIcon />
            </Button>
            <span>Submit</span>
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
            <AlertDialogAction>
              <Button onClick={() => onClick("check")}>Submit</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center space-x-2 flex-col hover:scale-110">
        <Button
          className="rounded-full w-16 h-16"
          variant="secondary"
          onClick={() => onClick("undo")}
        >
          <CounterClockwiseClockIcon />
        </Button>
        <span>Undo</span>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="flex items-center space-x-2 flex-col hover:scale-110">
            <Button className="rounded-full w-16 h-16" variant="secondary">
              <ResetIcon />
            </Button>
            <span>Reset</span>
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
            <AlertDialogAction>
              <Button onClick={() => onClick("reset")}>Reset</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const ButtonBar: Row = ({ onClick }) => {
  return (
    <div className="items-center justify-center">
      <ActionButtons onClick={onClick} />
      <NumPad onClick={onClick} />
    </div>
  );
};
