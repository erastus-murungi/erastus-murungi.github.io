import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import styled from '@emotion/styled';
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { Label } from '@/components/ui/label';

type ActionButton =
    | 'submit'
    | 'undo'
    | 'hint'
    | 'toggle-notes'
    | 'reset'
    | { type: 'change-difficulty'; to: Difficulty };

export type ButtonValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | ActionButton;

const StyledButtonBar = styled.div`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, 1fr);
    @media (max-width: 1120px) {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }
`;

export const StartButton: React.FC<{
    onClick: (value: ButtonValue) => void;
}> = ({ onClick }) => {
    const difficulties = React.useRef<readonly [string, Difficulty][]>([
        ['🥱', 'easy'],
        ['🤔', 'medium'],
        ['😅', 'hard'],
        ['🤯', 'expert'],
    ]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    className="mt-2 flex h-14 w-full items-center justify-center rounded-md hover:border-2 hover:border-black"
                >
                    New Game
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    <div className="text-center">
                        <p className="text-xs">
                            Current game progress will be lost
                        </p>
                    </div>
                </DropdownMenuLabel>
                {difficulties.current.map(([secretText, difficulty], index) => (
                    <div
                        className="flex items-center space-x-1"
                        key={`dropdown-menu-item-${difficulty}-${index}`}
                        id={`dropdown-menu-item-${difficulty}-${index}`}
                    >
                        <DropdownMenuItem
                            className="w-full"
                            onSelect={() =>
                                onClick({
                                    type: 'change-difficulty',
                                    to: difficulty,
                                })
                            }
                        >
                            <Label
                                htmlFor={`dropdown-menu-item-${difficulty}-${index}`}
                                className="text-sm"
                            >
                                {secretText} {difficulty.toLocaleUpperCase()}
                            </Label>
                        </DropdownMenuItem>
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

StartButton.displayName = 'StartButton';

const NumberPad: React.FC<{
    onClick: (value: ButtonValue) => void;
}> = ({ onClick }) => {
    return (
        <div>
            <StyledButtonBar>
                {[...Array.from({ length: 9 }).keys()].map((value) => (
                    <Button
                        key={`numberpad-key-${value + 1}`}
                        className="hover h-12 w-10 text-3xl hover:scale-110 hover:border-2 hover:border-black hover:shadow-lg sm:h-16 sm:w-16"
                        variant="secondary"
                        onClick={() => onClick((value + 1) as ButtonValue)}
                    >
                        {value + 1}
                    </Button>
                ))}
            </StyledButtonBar>
            <StartButton onClick={onClick} />
        </div>
    );
};

const ActionButtons: React.FC<{
    onClick: (value: ButtonValue) => void;
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

export const ButtonBar: React.FC<{
    onClick: (value: ButtonValue) => void;
    hintsRemaining: number;
    notesOn: boolean;
}> = React.memo(({ onClick, hintsRemaining, notesOn }) => {
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
});

ButtonBar.displayName = 'ButtonBar';
