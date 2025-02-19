import { Set as ImmutableSet } from 'immutable';

/**
 * Represents a cell in a Sudoku puzzle.
 * A cell can either be a fixed number or an editable cell with a current value and an answer.
 * It can also contain notes, which are possible values the user is considering.
 */
export class SudokuCell {
    /**
     * Constructs a new SudokuCell.
     * @param content - The content of the cell, which can be a fixed number or an object containing the current value and the correct answer.
     * @param notes - An optional set of notes (possible values) for the cell.
     */
    constructor(
        private readonly content:
            | number
            | { current: number | undefined; answer: number },
        private notes?: ImmutableSet<number>
    ) {}

    /**
     * Checks if the cell is fixed (i.e., a predefined number that the puzzle was initialized with.)
     * @returns True if the cell is fixed, otherwise false.
     */
    get isFixed() {
        return typeof this.content === 'number';
    }

    /**
     * Updates the current value of the cell.
     * @note Only call this method if the cell is user editable.
     *
     * @param value - The new current value to set.
     * @returns A new SudokuCell instance with the updated current value.
     * @throws {TypeError} If the cell is fixed and cannot be updated.
     */
    public updateValue(value: number) {
        if (typeof this.content === 'number') {
            throw new TypeError(
                'Internal Error: Cannot update predefined cell'
            );
        }
        return new SudokuCell(
            { current: value, answer: this.content.answer },
            this.notes
        );
    }

    /**
     * Removes the current value of the cell, making it undefined.
     *
     * @note Only call this method if the cell is user editable.
     * @returns A new SudokuCell instance with the current value cleared.
     * @throws {TypeError} If the cell is fixed and cannot be updated.
     */
    public removeValue() {
        if (typeof this.content === 'number') {
            throw new TypeError(
                'Internal Error: Cannot update predefined cell'
            );
        }
        return new SudokuCell(
            { current: undefined, answer: this.content.answer },
            this.notes
        );
    }

    /**
     * Resets the current value of the cell to the answer.
     *
     * @returns A new SudokuCell instance with the current value reset to the answer.
     * @note Unlike {Board.removeValue} This does not throw an error if the cell is fixed.
     */
    public resetValue() {
        if (typeof this.content === 'number') {
            return this;
        }
        return new SudokuCell(
            { current: undefined, answer: this.content.answer },
            this.notes
        );
    }

    /**
     * Checks if the cell is blank (i.e., has no current value).
     * @returns True if the cell is blank, otherwise false.
     */
    get isBlank() {
        return (
            typeof this.content !== 'number' &&
            this.content.current === undefined
        );
    }

    /**
     * Checks if the cell is correctly filled by the user.
     * @returns True if the user's current value matches the answer, otherwise false.
     */
    get isCorrectlyFilledByUser() {
        return (
            typeof this.content !== 'number' &&
            this.content.current === this.content.answer
        );
    }

    /**
     * Checks if the cell is completed (either fixed or correctly filled).
     * @returns True if the cell is completed, otherwise false.
     */
    get isCompleted() {
        return (
            typeof this.content === 'number' ||
            (typeof this.content !== 'number' &&
                this.content.current === this.content.answer)
        );
    }

    /**
     * Fills the cell with the correct answer.
     * @returns A new SudokuCell instance with the current value set to the answer.
     */
    public fillWithAnswer() {
        return typeof this.content === 'number'
            ? this
            : new SudokuCell(
                  {
                      current: this.content.answer,
                      answer: this.content.answer,
                  },
                  this.notes
              );
    }

    /**
     * Gets the current value of the cell.
     * @returns The current value if the cell is editable, or the fixed value if the cell is fixed.
     */
    get value() {
        return typeof this.content === 'number'
            ? this.content
            : this.content.current;
    }

    /**
     * If the cell is not fixed, this will return the answer
     * that the user should have entered, otherwise it will
     * return undefined
     */
    get editableAnswer() {
        return typeof this.content === 'number'
            ? undefined
            : this.content.answer;
    }

    /**
     * Checks if a specific note is present in the cell.
     * @param note - The note to check for.
     * @returns True if the note is present, otherwise false.
     */
    public containsNote(note: number) {
        return this.notes?.has(note) ?? false;
    }

    /**
     * Adds a note to the cell.
     * @param note - The note to add.
     * @returns A new SudokuCell instance with the note added.
     * @throws {TypeError} If the cell is fixed and cannot have notes.
     */
    addNote(note: number) {
        if (this.isFixed) {
            throw new TypeError(
                'Internal Error: Cannot add note to fixed cell'
            );
        }
        this.notes = this.notes ?? ImmutableSet();
        return new SudokuCell(this.content, this.notes?.add(note));
    }

    /**
     * Removes a note from the cell.
     * @param note - The note to remove.
     * @returns A new SudokuCell instance with the note removed.
     * @throws {TypeError} If the cell is fixed or if notes are empty.
     */
    removeNote(note: number) {
        if (this.isFixed) {
            throw new TypeError(
                'Internal Error: Cannot remove note from fixed cell'
            );
        }
        if (!this.notes || this.notes.isEmpty()) {
            throw new TypeError('Internal Error: Notes are empty');
        }
        return new SudokuCell(this.content, this.notes?.delete(note));
    }

    /**
     * Toggles the presence of a note in the cell.
     * @param note - The note to toggle.
     * @returns A new SudokuCell instance with the note toggled.
     */
    public toggleNote(note: number) {
        return this.containsNote(note)
            ? this.removeNote(note)
            : this.addNote(note);
    }

    /**
     * Checks if the cell has any notes.
     * @returns True if the cell has notes, otherwise false.
     */
    public hasNotes() {
        return !this.hasNoNotes();
    }

    /**
     * Checks if the cell has no notes.
     * @returns True if the cell has no notes, otherwise false.
     */
    public hasNoNotes() {
        return this.notes?.isEmpty() ?? true;
    }
}

/**
 * Creates a fixed SudokuCell with a predefined value.
 * @param value - The fixed value of the cell.
 * @returns A new SudokuCell instance representing a fixed cell.
 */
export const createFixedCell = (value: number) => new SudokuCell(value);

/**
 * Creates an editable SudokuCell with a specified answer.
 * @param answer - The correct answer for the cell.
 * @returns A new SudokuCell instance representing an editable cell.
 */
export const createUserEditableCell = (answer: number) =>
    new SudokuCell({ current: undefined, answer });
