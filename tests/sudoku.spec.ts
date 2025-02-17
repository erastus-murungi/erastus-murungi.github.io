import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/sudoku');
});

test.describe('Sudoku', () => {
    test('should have a title', async ({ page }) => {
        await expect(page).toHaveTitle(/Pepi Pepi's Sudoku/);

        const newGameButton = await page.getByTestId('new-game-button');
        expect(newGameButton).toHaveText('New Game');

        await newGameButton.click();

        const currentProgressWarning = await page.getByText(
            'Current game progress will be lost'
        );
        expect(currentProgressWarning).toBeVisible();
    });
});
