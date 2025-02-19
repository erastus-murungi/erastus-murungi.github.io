import { describe, it, expect } from 'vitest';
import { createFixedCell, createUserEditableCell } from '../sudoku-cell';

describe('SudokuCell', () => {
    describe('createFixedCell', () => {
        it('should create a fixed cell', () => {
            const cell = createFixedCell(5);
            expect(cell.isFixed).toBe(true);
        });
    });

    describe('createUserEditableCell', () => {
        it('should create an editable cell', () => {
            const cell = createUserEditableCell(5);
            expect(cell.isFixed).toBe(false);
        });
    });

    describe('toggleNote', () => {
        it('should add a note if it does not exist', () => {
            const cell = createUserEditableCell(5);
            const newCell = cell.toggleNote(3);
            expect(newCell.containsNote(3)).toBe(true);
        });

        it('should remove a note if it exists', () => {
            const cell = createUserEditableCell(5).addNote(3);
            const newCell = cell.toggleNote(3);
            expect(newCell.containsNote(3)).toBe(false);
        });

        it('should throw TypeError if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(() => cell.toggleNote(3)).toThrow(TypeError);
        });
    });

    describe('removeNote', () => {
        it('should remove a note', () => {
            const cell = createUserEditableCell(5).addNote(3);
            const newCell = cell.removeNote(3);
            expect(newCell.containsNote(3)).toBe(false);
        });

        it('should throw TypeError if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(() => cell.removeNote(3)).toThrow(TypeError);
        });

        it('should throw TypeError if the cell has no notes', () => {
            const cell = createUserEditableCell(5);
            expect(() => cell.removeNote(3)).toThrow(TypeError);
        });
    });

    describe('hasNotes', () => {
        it('should return true if the cell has notes', () => {
            const cell = createUserEditableCell(5).addNote(3);
            expect(cell.hasNotes()).toBe(true);
        });

        it('should return false if the cell has no notes', () => {
            const cell = createUserEditableCell(5);
            expect(cell.hasNotes()).toBe(false);
        });

        it('should return false if a cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.hasNotes()).toBe(false);
        });
    });

    describe('hasNoNotes', () => {
        it('should return true if the cell has no notes', () => {
            const cell = createUserEditableCell(5);
            expect(cell.hasNoNotes()).toBe(true);
        });

        it('should return false if the cell has notes', () => {
            const cell = createUserEditableCell(5).addNote(3);
            expect(cell.hasNoNotes()).toBe(false);
        });

        it('should return true if a fixed cell', () => {
            const cell = createFixedCell(5);
            expect(cell.hasNoNotes()).toBe(true);
        });
    });

    describe('containsNote', () => {
        it('should return true if the cell contains the note', () => {
            const cell = createUserEditableCell(5).addNote(3);
            expect(cell.containsNote(3)).toBe(true);
        });

        it('should return false if the cell does not contain the note', () => {
            const cell = createUserEditableCell(5);
            expect(cell.containsNote(3)).toBe(false);
        });

        it('should return false if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.containsNote(3)).toBe(false);
        });
    });

    describe('updateValue', () => {
        it('should update the value of the cell', () => {
            const cell = createUserEditableCell(5);
            const newCell = cell.updateValue(3);
            expect(newCell.value).toBe(3);
        });

        it('should throw TypeError if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(() => cell.updateValue(3)).toThrow(TypeError);
        });
    });

    describe('removeValue', () => {
        it('should remove the value of the cell', () => {
            const cell = createUserEditableCell(5);
            const newCell = cell.removeValue();
            expect(newCell.value).toBeUndefined();
        });

        it('should throw TypeError if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(() => cell.removeValue()).toThrow(TypeError);
        });
    });

    describe('fillWithAnswer', () => {
        it('should fill the cell with the answer', () => {
            const cell = createUserEditableCell(5);
            const newCell = cell.fillWithAnswer();
            expect(newCell.value).toBe(5);
        });

        it('should not modify a fixed cell', () => {
            const cell = createFixedCell(5);
            const newCell = cell.fillWithAnswer();
            expect(newCell.value).toBe(5);
        });
    });

    describe('isBlank', () => {
        it('should return true if the cell is blank', () => {
            const cell = createUserEditableCell(5);
            expect(cell.isBlank).toBe(true);
        });

        it('should return false if the cell is not blank', () => {
            const cell = createUserEditableCell(5).updateValue(3);
            expect(cell.isBlank).toBe(false);
        });

        it('should return false if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.isBlank).toBe(false);
        });
    });

    describe('isCorrectlyFilledByUser', () => {
        it('should return true if the cell is correctly filled by the user', () => {
            const cell = createUserEditableCell(5).updateValue(5);
            expect(cell.isCorrectlyFilledByUser).toBe(true);
        });

        it('should return false if the cell is not correctly filled by the user', () => {
            const cell = createUserEditableCell(5).updateValue(3);
            expect(cell.isCorrectlyFilledByUser).toBe(false);
        });

        it('should return false if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.isCorrectlyFilledByUser).toBe(false);
        });
    });

    describe('isCompleted', () => {
        it('should return true if the cell is completed', () => {
            const cell = createUserEditableCell(5).updateValue(5);
            expect(cell.isCompleted).toBe(true);
        });

        it('should return false if the cell is not completed', () => {
            const cell = createUserEditableCell(5);
            expect(cell.isCompleted).toBe(false);
        });

        it('should return true if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.isCompleted).toBe(true);
        });
    });

    describe('editableAnswer', () => {
        it('should return the answer if the cell is editable', () => {
            const cell = createUserEditableCell(5);
            expect(cell.editableAnswer).toBe(5);
        });

        it('should return undefined if the cell is fixed', () => {
            const cell = createFixedCell(5);
            expect(cell.editableAnswer).toBeUndefined();
        });
    });
});
