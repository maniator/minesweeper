import React, { Component } from 'react';
import style from 'styled-components';


const BlockStyled = style.div`
    width: 1rem;
    height: 1rem;
    padding: 1rem;
    border: 1px solid grey;
    display: inline-block;
    white-space: nowrap;
    background-color: ${({ clicked, flagged, containsBomb }) => {
        if (clicked) {
            if (containsBomb) {
                return 'red';
            } else {
                return 'white';
            }
        } else if (flagged) {
            return 'purple';
        } else {
            return 'black';
        }
    }};
    
    &:hover {
        cursor: ${({ clicked }) => clicked ? 'not-allowed' : 'pointer' };
    }
`;

class Block extends Component {
    constructor ({data}) {
        super();

        this.state = data;
    }

    render () {
        const { data: { value } } = this.props;
        const clickedLetter = this.state.containsBomb ? 'B' : (value > 0 ? value : '');

        return <BlockStyled
            onClick={(e) => this.handleClick(e)}
            onContextMenu={(e) => this.handleContextMenu(e)}
            {...this.state}
        >
            {this.state.clicked ? clickedLetter : ''}
            {this.state.flagged ? 'F' : ''}
        </BlockStyled>
    }

    handleContextMenu (e) {
        e.preventDefault();
        if (!this.state.clicked) {
            this.setState({
                flagged: !this.state.flagged,
            });
        }

    }

    handleClick (e) {
        if (!this.state.clicked && !this.state.flagged) {
            this.props.onBoxClick({
                row: this.props.rowIndex,
                column: this.props.index,
                currentBox: this.props,
            });
            this.setState({
                clicked: true,
            });
        }
    }
}
const RowWrapper = style.div`
    display: flex;
`;

const Row = ({ currentRow, id, rowIndex, onBoxClick }) => {
    const blocks = currentRow.map((blockData, index) => <Block
        key={`block_${index}_${id}`}
        index={index}
        rowIndex={rowIndex}
        onBoxClick={onBoxClick}
        data={blockData}
    />);

    return (
        <RowWrapper>
            {blocks}
        </RowWrapper>
    );
};

/**
 * Currently there is a bug in this code in that it will create at MAX the
 *  amount of bomb param past, not exactly the amount
 *
 * @param rows
 * @param columns
 * @param bombs
 * @returns {Array}
 */
const calculateBombsInRows = ({ rows, columns, bombs }) => {
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

class Board extends Component {
    constructor (props) {
        super(props);

        const { rows = 10, columns = 10, bombs = 25 } = props;

        this.state = {
            board: calculateBombsInRows({rows, columns, bombs}),
        };
    }

    onBoxClick ({ row, column, currentBox }) {
        const { data: { containsBomb, value } } = currentBox;
        const checked = [];
        if (containsBomb) {
            // @todo reset timer/disable board, etc
            alert('YOU LOSE!\n\n\n YOU CLICKED ON A BOMB!');
        } else if (value === 0) {
            // you clicked on an empty space, need to expand out
            console.log('YOU CLICKED ON AN EMPTY SPACE');
        }
    }

    render () {
        const blocks = this.state.board.map((currentRow, index) => {
            const key = `row_${index}`;
            return (
                <Row key={key} id={key}
                     rowIndex={index}
                     currentRow={currentRow}
                     onBoxClick={(e) => this.onBoxClick(e)}
                />
            );
        });

        return (
            <div>
                {blocks}
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
        <Board />
    );
  }
}

export default App;
