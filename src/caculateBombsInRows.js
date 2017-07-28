// very verbose variable
import {expandOutFromBlock} from "./expandOutFromBlock";

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
    let board = [];
    let bombCount = 0;
    let bombsInARow = 0;
    const emptyCells = {};
    const increaseCellValue = ({ row, column }, board) => {
        const point = board[row][column];
        point.value += 1;

        if (board[row][column].value >= 4) {
            delete emptyCells[`${row}|${column}`];
        } else if (!point.containsBomb) {
            emptyCells[`${row}|${column}`] = true;
        }
    };
    
    const addBomb = ({ rowIndex, boxIndex, box, board }) => {
        if (box.containsBomb) {
            // remove from no-bombs list
            delete emptyCells[`${rowIndex}|${boxIndex}`];
            
            if (boxIndex > 0) {
                increaseCellValue({ row: rowIndex, column: boxIndex - 1 }, board);
                
                // check corner diagonals
                if (rowIndex > 0) {
                    increaseCellValue({ row: rowIndex - 1, column: boxIndex - 1 }, board);
                }
                
                if (rowIndex < (rows - 1)) {
                    increaseCellValue({ row: rowIndex + 1, column: boxIndex - 1 }, board);
                }
            }
            if (boxIndex < (columns - 1)) {
                increaseCellValue({ row: rowIndex, column: boxIndex + 1 }, board);
                
                // check corner diagonals
                if (rowIndex > 0) {
                    increaseCellValue({ row: rowIndex - 1, column: boxIndex + 1 }, board);
                }
                
                if (rowIndex < (rows - 1)) {
                    increaseCellValue({ row: rowIndex + 1, column: boxIndex + 1 }, board);
                }
            }
            
            if (rowIndex > 0) {
                increaseCellValue({ row: rowIndex - 1, column: boxIndex }, board);
            }
            
            if (rowIndex < (rows - 1)) {
                increaseCellValue({ row: rowIndex + 1, column: boxIndex }, board);
            }
        }

        return board;
    };

    // create row/column array
    for (let r = 0; r < rows; ++r) {
        const rowArray = [];
        for (let c = 0; c < columns; ++c) {
            rowArray.push({
                clicked: false,
                flagged: false,
                value: 0, // 0 will mean empty (or will mean BOMB if containsBomb === true)
                containsBomb: false,
            });
        }
        board.push(rowArray);
    }

    const noBombRow = noBomb.row || 0;
    const noBombColumn = noBomb.column || 0;

    // seed the board starting either from the noBomb cell or from the top corner
    board = expandOutFromBlock({ board, row: noBombRow, column: noBombColumn }, {}, ({ point, row, column, boardCopy }) => {
        const hasBomb = bombSeed();
        let containsBomb = false;

        const cannotHaveBomb = noBomb.row === row && noBomb.column === column;

        if (hasBomb && bombCount < bombs && bombsInARow < MAX_BOMBS_NEXT_TO_EACH_OTHER_IN_ROW && !cannotHaveBomb) {
            containsBomb = true;
            bombCount += 1;
            bombsInARow += 1;
        } else {
            bombsInARow = 0;
        }

        point.containsBomb = containsBomb;

        const newBoard = addBomb({
            rowIndex: row,
            boxIndex: column,
            box: point,
            board: boardCopy,
        });

        return {
            newBoard,
            passThrough: true,
        };
    });
    
    // fill in missing bombs based on emptyCellMap
    if (bombCount !== bombs) {
        const emptyCellMap = Object.keys(emptyCells).map((cell) => {
            const [ r, c ] = cell.split('|');
            
            return {
                rowIndex: Number(r),
                boxIndex: Number(c),
                box: board[r][c],
            };
        });
        
        for (let i = 0; i < emptyCellMap.length && bombCount <= bombs; ++i) {
            const { rowIndex, boxIndex, box } = emptyCellMap[i];
    
            const cannotHaveBomb = noBomb.row === rowIndex && noBomb.column === boxIndex;
            
            if (!cannotHaveBomb) {
                box.containsBomb = true;
                bombCount += 1;
                addBomb({
                    rowIndex,
                    boxIndex,
                    box,
                    board
                });
            }
        }
    }

    return board;
};
