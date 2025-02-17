import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NewGameButton } from '.';

describe('#NewGameButton', () => {
    it('should show correct label', () => {
        render(<NewGameButton onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveTextContent('New Game');
    });
});
