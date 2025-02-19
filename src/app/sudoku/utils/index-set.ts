export class IndexSet {
    constructor(
        public readonly columnIndex: number,
        public readonly rowIndex: number
    ) {}

    get boardIndex() {
        return this.rowIndex * 9 + this.columnIndex;
    }

    get left(): IndexSet | undefined {
        return this.columnIndex > 0
            ? new IndexSet(this.columnIndex - 1, this.rowIndex)
            : undefined;
    }

    get right(): IndexSet | undefined {
        return this.columnIndex < 8
            ? new IndexSet(this.columnIndex + 1, this.rowIndex)
            : undefined;
    }

    get up(): IndexSet | undefined {
        return this.rowIndex > 0
            ? new IndexSet(this.columnIndex, this.rowIndex - 1)
            : undefined;
    }

    get down(): IndexSet | undefined {
        return this.rowIndex < 8
            ? new IndexSet(this.columnIndex, this.rowIndex + 1)
            : undefined;
    }
}

export const createIndexSet = ({
    columnIndex,
    rowIndex,
}: {
    columnIndex: number;
    rowIndex: number;
}) => new IndexSet(columnIndex, rowIndex);
