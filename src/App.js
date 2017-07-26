import React, { Component } from 'react';
import style from 'styled-components';


const BlockStyled = style.div`
    width: 1rem;
    height: 1rem;
    padding: 1rem;
    border: 1px solid black;
    display: inline-block;
    white-space: nowrap;
    
    &:hover {
        cursor: ${({ clicked }) => clicked ? 'not-allowed' : 'pointer' };
    }
`;

class Block extends Component {
    constructor () {
        super();

        this.state = {
            flagged: false,
            clicked: false,
        };
    }

    render () {
        return <BlockStyled
            onClick={(e) => this.handleClick(e)}
            onContextMenu={(e) => this.handleContextMenu(e)}
            {...this.state}
        >
            {this.state.clicked ? 'C' : ''}
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

const Row = ({ columns = 5, id }) => {
    const blocks = Array.from(Array(10)).map((t, index) => <Block key={`block_${index}_${id}`}/>);

    return (
        <RowWrapper>
            {blocks}
        </RowWrapper>
    );
};

const Board = ({ rows = 5, columns = 5 }) => {
    const blocks = Array.from(Array(10)).map((t, index) => {
        const key = `row_${index}`;
        return (
            <Row key={key} id={key} columns={columns}/>
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
