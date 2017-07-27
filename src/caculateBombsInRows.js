// very verbose variable
const MAX_BOMBS_NEXT_TO_EACH_OTHER_IN_ROW = 2;
// not the best randomizer, but can be optimized later
const bombSeed = () => Math.random() > 0.8;

/**
 * Currently there is a bug in this code in that it will create at MAX the
 *  amount of bomb param past, not exactly the amount, can refactor to make
 *  correct later on if need be
 *
 * @param rows
 * @param columns
 * @param bombs
 * @param noBomb
 * @return {Array}
 */
export const calculateBombsInRows = ({ rows, columns, bombs, noBomb = {} }) => {
    const board = [];
    let bombCount = 0;
    let bombsInARow = 0;
    // create row/column array
    for (let r = 0; r < rows; ++r) {
        const rowArray = [];
        for (let c = 0; c < columns; ++c) {
            const hasBomb = bombSeed();
            let containsBomb = false;
            
            const cannotHaveBomb = noBomb.row === r && noBomb.column === c;

            if (hasBomb && bombCount < bombs && bombsInARow < MAX_BOMBS_NEXT_TO_EACH_OTHER_IN_ROW && !cannotHaveBomb) {
                containsBomb = true;
                bombCount += 1;
                bombsInARow += 1;
            } else {
                bombsInARow = 0;
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

                    // check corner diagonals
                    if (rowIndex > 0) {
                        board[rowIndex - 1][boxIndex - 1].value += 1;
                    }

                    if (rowIndex < (rows - 1)) {
                        board[rowIndex + 1][boxIndex - 1].value += 1;
                    }
                }
                if (boxIndex < (columns - 1)) {
                    rowArray[boxIndex + 1].value += 1;

                    // check corner diagonals
                    if (rowIndex > 0) {
                        board[rowIndex - 1][boxIndex + 1].value += 1;
                    }

                    if (rowIndex < (rows - 1)) {
                        board[rowIndex + 1][boxIndex + 1].value += 1;
                    }
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
