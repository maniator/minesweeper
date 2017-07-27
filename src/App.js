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

        // use a copy of the data as state
        this.state = JSON.parse(JSON.stringify(data));
    }

    render () {
        const clickedLetter = this.state.containsBomb ? 'B' : 'C';

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
            this.setState({
                clicked: true,
            });
        }
    }
}
const RowWrapper = style.div`
    display: flex;
`;

const Row = ({ currentRow, id }) => {
    const blocks = currentRow.map((blockData, index) => <Block key={`block_${index}_${id}`} data={blockData} />);

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
                value: -1, // -1 will mean empty (or will mean BOMB if containsBomb === true)
                containsBomb,
            });
        }
        board.push(rowArray);
    }

    // place numbers on boxes

    return board;
};

const Board = ({ rows = 10, columns = 10, bombs = 15 }) => {
    const board = calculateBombsInRows({rows, columns, bombs });
    const blocks = board.map((currentRow, index) => {
        const key = `row_${index}`;
        return (
            <Row key={key} id={key} currentRow={currentRow} />
        );
    });

    return (
        <div>
            {blocks}
        </div>
    );
};

class App extends Component {
  render() {
    return (
        <Board />
    );
  }
}

export default App;
