export const calculateEmptySpacesOnBoard = ({ board, row, column }, checkedPoints = {}) => {
    if (row < 0 || column < 0) {
        return board;
    }

    const rowArray = board[row];

    if (!rowArray) {
        return board;
    }
    const point = rowArray[column];

    if (!point) {
        return board;
    }

    const key = `${row}${column}`;

    if (checkedPoints[key]) {
        return board;
    }

    point.clicked = true;
    board.clicked += 1;
    checkedPoints[key] = true;

    if (point.value === 0) {
        // once this point has been checked and is empty, check on top, bottom, left, and right of it.
        calculateEmptySpacesOnBoard({ board, row: row + 1, column: column }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row - 1, column: column }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row, column: column + 1 }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row, column: column - 1 }, checkedPoints);
    }

    // at top corner and there is nothing to do
    if (row === 0 && column === 0) {
        return board;
    }

    return board;
};
