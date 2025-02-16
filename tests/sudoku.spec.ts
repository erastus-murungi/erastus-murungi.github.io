import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/sudoku');
});

test.describe('Sudoku', () => {
    test('should have a title', async ({ page }) => {
        await expect(page).toHaveTitle(/Pepi Pepi's Sudoku/);
    });
});
