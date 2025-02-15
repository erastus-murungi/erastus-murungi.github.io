import type React from 'react';
import styled from '@emotion/styled';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Difficulty } from './types';

interface SudokuOverlayProps {
    startNewGame: (difficulty: Difficulty) => void;
}

const StyledOverlay = styled.div`
    background-color: #c6ddaf;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.5;
    top: 0;
    right: 0;
`;

export const SudokuOverlay: React.FC<SudokuOverlayProps> = ({
    startNewGame,
}) => {
    return (
        <StyledOverlay>
            <AlertDialog>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset Game</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete all your progress.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => startNewGame('easy')}>
                            Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </StyledOverlay>
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
