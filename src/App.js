import React, { Component } from 'react';
import style from 'styled-components';
import {calculateBombsInRows} from "./caculateBombsInRows";
import {calculateEmptySpacesOnBoard} from "./calculateEmptySpacesOnBoard";


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

class Board extends Component {
    constructor (props) {
        super(props);

        const { rows = 10, columns = 10, bombs = 25 } = props;

        this.state = {
            board: calculateBombsInRows({ rows, columns, bombs }),
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
            const board = calculateEmptySpacesOnBoard({board: this.state.board, row, column});

            this.setState({
                board,
            });
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
