// very verbose variable
const MAX_BOMBS_NEXT_TO_EACH_OTHER_IN_ROW = 2;

/**
 * Currently there is a bug in this code in that it will create at MAX the
 *  amount of bomb param past, not exactly the amount, can refactor to make
 *  correct later on if need be
 *
 * @param rows
 * @param columns
 * @param bombs
 * @returns {Array}
 */
export const calculateBombsInRows = ({ rows, columns, bombs }) => {
    const board = [];
    let bombCount = 0;
    let bombsInARow = 0;
    // create row/column array
    for (let r = 0; r < rows; ++r) {
        const rowArray = [];
        for (let c = 0; c < columns; ++c) {
            // not the best randomizer, but can be optimized later
            const hasBomb = Math.random() > .75;
            let containsBomb = false;

            if (hasBomb && bombCount < bombs && bombsInARow < MAX_BOMBS_NEXT_TO_EACH_OTHER_IN_ROW) {
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
                //gauche
                if (boxIndex > 0) {
                    rowArray[boxIndex - 1].value += 1;
                    if (boxIndex > 1) {
                        rowArray[boxIndex - 2].value += 1;
                    }
                }

                //droite
                if (boxIndex < (columns - 1)) {
                    rowArray[boxIndex + 1].value += 1;
                    if (boxIndex < (columns - 2)) {
                        rowArray[boxIndex + 2].value += 1;
                    }
                }

                //haut
                if (rowIndex > 0) {
                    board[rowIndex - 1][boxIndex].value += 1;
                    if (rowIndex > 1) {
                        board[rowIndex - 2][boxIndex].value += 1;
                    }
                }

                //bas
                if (rowIndex < (rows - 1)) {
                    board[rowIndex + 1][boxIndex].value += 1;
                    if (rowIndex < (rows - 2)) {
                        board[rowIndex + 2][boxIndex].value += 1;
                    }
                }

                // diagonal
                // haut droit
                if(rowIndex > 0 && boxIndex > 0){
                    board[rowIndex - 1][boxIndex -1].value += 1;
                    if(rowIndex > 1 && boxIndex > 1){
                        board[rowIndex - 2][boxIndex -2].value += 1;
                        board[rowIndex - 1][boxIndex -2].value += 1;
                        board[rowIndex - 2][boxIndex -1].value += 1;
                    }
                }

                // haut gauche
                if(rowIndex > 0 && boxIndex < (columns - 1)){
                    board[rowIndex -1][boxIndex +1].value += 1;
                    if(rowIndex > 1 && boxIndex < (columns - 2)){
                        board[rowIndex -2][boxIndex +2].value += 1;
                        board[rowIndex -2][boxIndex +1].value += 1;
                        board[rowIndex -1][boxIndex +2].value += 1;
                    }
                }

                //bas droit
                if (rowIndex < (rows - 1) && boxIndex > 0) {
                    board[rowIndex +1][boxIndex -1].value += 1;
                    if (rowIndex < (rows - 2) && boxIndex > 1) {
                        board[rowIndex +2][boxIndex -2].value += 1;
                        board[rowIndex +1][boxIndex -2].value += 1;
                        board[rowIndex +2][boxIndex -1].value += 1;
                    }
                }

                //bas gauche
                if (rowIndex < (rows - 1) && boxIndex < (columns - 1)) {
                    board[rowIndex +1][boxIndex +1].value += 1;
                    if (rowIndex < (rows - 2) && boxIndex < (columns - 2)) {
                        board[rowIndex +2][boxIndex +2].value += 1;
                        board[rowIndex +1][boxIndex +2].value += 1;
                        board[rowIndex +2][boxIndex +1].value += 1;
                    }
                }
            }
        });
    });

    // @todo use these counts for something
    board.bombCount = bombCount;
    board.clicked = 0;
    board.maxClicks = ( rows * columns ) - bombCount;

    return board;
};
