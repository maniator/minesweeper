import React, { Component } from 'react';
import style from 'styled-components';

const BlockStyled = style.div`
    width: 1rem;
    height: 1rem;
    padding: 1rem;
    border: 1px solid grey;
    display: inline-block;
    white-space: nowrap;
    text-align: center;
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

export class Block extends Component {
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
            onDoubleClick={(e) => this.handleDoubleClick(e)}
            clicked={this.state.clicked}
            flagged={this.state.flagged}
            containsBomb={this.state.containsBomb}
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
            }, () => this.props.onBoxClick({
                row: this.props.rowIndex,
                column: this.props.index,
                currentBox: this.props,
                flagged: this.state.flagged,
                clicked: false,
                doubleClicked: e.buttons === 3,
            }));
        }
    }
    
    handleDoubleClick (e) {
        e.preventDefault();
      
        if (this.state.clicked && !this.state.flagged) {
            this.props.onBoxClick({
                row: this.props.rowIndex,
                column: this.props.index,
                currentBox: this.props,
                flagged: this.state.flagged,
                clicked: this.state.clicked,
                doubleClicked: true,
            });
        }
    }

    handleClick (e) {
        if (!this.state.clicked && !this.state.flagged) {
            this.setState({
                clicked: true,
            }, () => this.props.onBoxClick({
                row: this.props.rowIndex,
                column: this.props.index,
                currentBox: this.props,
                flagged: this.state.flagged,
                clicked: this.state.clicked,
                doubleClicked: e.buttons === 3,
            }));
        }
    }
}
