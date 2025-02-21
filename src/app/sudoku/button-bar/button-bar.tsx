import React from 'react';
import { Button } from '@/components/ui/button';
import {
    CheckIcon,
    CounterClockwiseClockIcon,
    ResetIcon,
    SunIcon,
    Pencil2Icon,
} from '@radix-ui/react-icons';
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
} from '@/components/ui/alert-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { NewGameButton } from '../new-game-button';
import type { ButtonAction, ButtonInputValue } from '../types';

const NumberPad: React.FC<{
    onClick: (value: ButtonInputValue) => void;
}> = ({ onClick }) => {
    return (
        <div>
            <div
                className={`grid grid-cols-3 gap-4 max-[1120px]:flex max-[1120px]:flex-row max-[1120px]:gap-1`}
            >
                {[...Array.from({ length: 9 }).keys()].map((value) => (
                    <Button
                        key={`numberpad-key-${value + 1}`}
                        className="hover h-12 w-10 text-3xl hover:scale-110 hover:border-2 hover:border-black hover:shadow-lg sm:h-16 sm:w-16"
                        variant="secondary"
                        onClick={() => onClick((value + 1) as ButtonInputValue)}
                    >
                        {value + 1}
                    </Button>
                ))}
            </div>
            <NewGameButton onClick={onClick} />
        </div>
    );
};

export const PauseGameSudokuOverlay: React.FC<{ resumeGame: () => void }> = ({
    resumeGame,
}) => {
    return (
        <AlertDialog>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Submit Game</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will delete all your progress.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => resumeGame()}>
                        Resume Game
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ActionButtons: React.FC<{
    onClick: (value: ButtonAction) => void;
    hintsRemaining: number;
    notesOn: boolean;
}> = React.memo(({ onClick, hintsRemaining = 0, notesOn }) => {
    return (
        <div className="m-6 inline-flex space-x-3">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div className="flex flex-col items-center hover:scale-110">
                        <Button
                            className="mb-2 h-16 w-16 rounded-full hover:border-2 hover:border-black"
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
                        <AlertDialogAction onClick={() => onClick('submit')}>
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col items-center hover:scale-110">
                <Button
                    className="mb-2 h-16 w-16 rounded-full hover:border-2 hover:border-black"
                    variant="secondary"
                    onClick={() => onClick('undo')}
                >
                    <CounterClockwiseClockIcon />
                </Button>
                <span className="text-xs uppercase">Undo</span>
            </div>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div className="flex flex-col items-center hover:scale-110">
                        <Button
                            className="mb-2 h-16 w-16 rounded-full hover:border-2 hover:border-black"
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
                        <AlertDialogAction onClick={() => onClick('reset')}>
                            Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col items-center hover:scale-110">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className="relative inline-block text-center"
                            onClick={() => onClick('hint')}
                            tabIndex={-1}
                            onKeyDown={() => onClick('hint')}
                            role="button"
                        >
                            <Button
                                className="mb-2 h-16 w-16 rounded-full hover:border-2 hover:border-black"
                                variant="secondary"
                            >
                                <SunIcon />
                            </Button>
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
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

            <div className="flex flex-col items-center hover:scale-110">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className="relative inline-block text-center"
                            onClick={() => onClick('toggle-notes')}
                            tabIndex={0}
                            onKeyDown={() => onClick('toggle-notes')}
                            role="button"
                        >
                            <Button
                                className="mb-2 h-16 w-16 rounded-full hover:border-2 hover:border-black"
                                variant="secondary"
                            >
                                <Pencil2Icon className="mb-2 h-16 w-16 rounded-full" />
                            </Button>
                            <div className="absolute top-0 right-0 flex h-6 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
                                {notesOn ? 'ON' : 'OFF'}
                            </div>
                            <p className="text-xs uppercase">Notes</p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            You have turned off notes, click the button again to
                            turn them on
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
});

ActionButtons.displayName = 'ActionButtons';

export interface ButtonBarProps {
    onClick: (value: ButtonInputValue) => void;
    hintsRemaining: number;
    notesOn: boolean;
}

export const ButtonBar: React.FC<ButtonBarProps> = React.memo(
    ({ onClick, hintsRemaining, notesOn }) => {
        return (
            <div className="flex flex-col items-center justify-center">
                <ActionButtons
                    onClick={onClick}
                    hintsRemaining={hintsRemaining}
                    notesOn={notesOn}
                />
                <NumberPad onClick={onClick} />
            </div>
        );
    }
);

ButtonBar.displayName = 'ButtonBar';
