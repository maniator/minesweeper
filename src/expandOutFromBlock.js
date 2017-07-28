export const expandOutFromBlock = ({ board, row, column, autoClick }, checkedPoints = {}, shouldPassThroughCallback = () => ({ board })) => {
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
    const key = `${row}|${column}`;

    if (!point || point.flagged) {
        return boardCopy;
    }

    if (checkedPoints[key]) {
        return boardCopy;
    }

    checkedPoints[key] = true;
    if (autoClick) {
        point.clicked = true;
    }

    let { newBoard = boardCopy, passThrough = false } = shouldPassThroughCallback({ point, row, column, boardCopy })
    if (passThrough) {
        // once this point has been checked and is empty, check on top, bottom, left, and right of it.
        newBoard = expandOutFromBlock({ board: newBoard, row: row + 1, column: column, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row - 1, column: column, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row, column: column + 1, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row, column: column - 1, autoClick }, checkedPoints, shouldPassThroughCallback);
        // diagonals
        newBoard = expandOutFromBlock({ board: newBoard, row: row - 1, column: column - 1, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row - 1, column: column + 1, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row + 1, column: column + 1, autoClick }, checkedPoints, shouldPassThroughCallback);
        newBoard = expandOutFromBlock({ board: newBoard, row: row + 1, column: column - 1, autoClick }, checkedPoints, shouldPassThroughCallback);
    }

    return newBoard;
};