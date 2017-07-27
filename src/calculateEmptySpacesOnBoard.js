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

    console.log('POINT', JSON.stringify(point));
    const key = `${row}${column}`;

    if (checkedPoints[key]) {
        return board;
    }

    if (point.value === 0) {
        point.clicked = true;
        checkedPoints[key] = true;
        calculateEmptySpacesOnBoard({ board, row: row + 1, column: column }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row - 1, column: column }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row, column: column + 1 }, checkedPoints);
        calculateEmptySpacesOnBoard({ board, row: row, column: column - 1 }, checkedPoints);
    } else {
        point.clicked = true;
    }

    // at top corner and there is nothing to do
    if (row === 0 && column === 0) {
        return board;
    }

    return board;
};
