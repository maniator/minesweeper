/**
 * Currently there is a bug in this code in that it will create at MAX the
 *  amount of bomb param past, not exactly the amount
 *
 * @param rows
 * @param columns
 * @param bombs
 * @returns {Array}
 */
export const calculateBombsInRows = ({ rows, columns, bombs }) => {
    const board = [];
    let bombCount = 0;
    // create row/column array
    for (let r = 0; r < rows; ++r) {
        const rowArray = [];
        for (let c = 0; c < columns; ++c) {
            // not the best randomizer, but can be optimized later
            const hasBomb = Math.random() > .75;
            let containsBomb = false;

            if (hasBomb && bombCount < bombs) {
                containsBomb = true;
                bombCount += 1;
            }

            rowArray.push({
                clicked: false,
                flagged: false,
                value: 0, // 0 will mean empty (or will mean BOMB if containsBomb === true)
                containsBomb,
            });
        }
        board.push(rowArray);
    }

    // place numbers on boxes
    board.forEach((rowArray, rowIndex) => {
        rowArray.forEach((box, boxIndex) => {
            if (box.containsBomb) {
                if (boxIndex > 0) {
                    rowArray[boxIndex - 1].value += 1;
                }
                if (boxIndex < (columns - 1)) {
                    rowArray[boxIndex + 1].value += 1;
                }

                if (rowIndex > 0) {
                    board[rowIndex - 1][boxIndex].value += 1;
                }

                if (rowIndex < (rows - 1)) {
                    board[rowIndex + 1][boxIndex].value += 1;
                }
            }
        });
    });

    return board;
};
