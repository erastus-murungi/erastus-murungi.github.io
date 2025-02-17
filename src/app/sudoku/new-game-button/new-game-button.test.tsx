import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewGameButton } from '.';

describe('#NewGameButton', () => {
    it('should show correct label', () => {
        render(<NewGameButton onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('New Game');
    });

    it('should call onClick when clicked', () => {
        const onClick = vi.fn(() => {});
        render(<NewGameButton onClick={onClick} />);
        screen.getByTestId('new-game-button').click();
        expect(onClick).toBeCalled();
    });
});
