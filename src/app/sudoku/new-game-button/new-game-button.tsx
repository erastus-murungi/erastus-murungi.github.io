import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Difficulty } from '../types';

export interface NewGameButtonProps {
    className?: string;
    showWarning?: boolean;
    onClick: (value: { type: 'change-difficulty'; to: Difficulty }) => void;
}

export const NewGameButton: React.FC<NewGameButtonProps> = ({
    className,
    onClick,
    showWarning = true,
}) => {
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
                    className={cn(
                        'mt-2 flex h-14 w-full items-center justify-center rounded-md hover:border-2 hover:border-black',
                        className
                    )}
                >
                    New Game
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {showWarning && (
                    <DropdownMenuLabel>
                        <div className="text-center">
                            <p className="text-xs">
                                Current game progress will be lost
                            </p>
                        </div>
                    </DropdownMenuLabel>
                )}
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

NewGameButton.displayName = 'StartButton';
