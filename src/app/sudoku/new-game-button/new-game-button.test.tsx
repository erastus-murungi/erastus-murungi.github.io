import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewGameButton } from '.';

describe('#NewGameButton', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should show correct label', () => {
        render(<NewGameButton onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('New Game');
    });
});
