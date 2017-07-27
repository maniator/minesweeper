export const calculateEmptySpacesOnBoard = ({ board, row, column }, checkedPoints = {}, passThrough = false) => {
    // make a copy
    let boardCopy = JSON.parse(JSON.stringify(board));
    
    if (row < 0 || column < 0) {
        return boardCopy;
    }

    const rowArray = boardCopy[row];

    if (!rowArray) {
        return boardCopy;
    }

    const point = rowArray[column];

    if (!point || point.flagged) {
        return boardCopy;
    }

    const key = `${row}|${column}`;

    if (checkedPoints[key]) {
        return boardCopy;
    }

    point.clicked = true;
    checkedPoints[key] = true;

    if ((point.value === 0 && !point.containsBomb) || passThrough) {
        // once this point has been checked and is empty, check on top, bottom, left, and right of it.
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row + 1, column: column }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row - 1, column: column }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row, column: column + 1 }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row, column: column - 1 }, checkedPoints);
        // diagonals
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row - 1, column: column - 1 }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row - 1, column: column + 1 }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row + 1, column: column + 1 }, checkedPoints);
        boardCopy = calculateEmptySpacesOnBoard({ board: boardCopy, row: row + 1, column: column - 1 }, checkedPoints);
    }

    return boardCopy;
};
