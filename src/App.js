import React, { Component } from 'react';
import style from 'styled-components';
import {calculateBombsInRows} from "./caculateBombsInRows";
import {calculateEmptySpacesOnBoard} from "./calculateEmptySpacesOnBoard";
import {Row} from "./Row";

const TimerWrapper = style.div`
    width: 20vw;
    height: 3rem;
    font-size: 2.5rem;
    font-weight: bold;
`;

class Timer extends Component {
    constructor () {
        super();

        this.state = {
            time: 0,
        };
    }

    componentDidMount () {
        this.startTime();
    }

    startTime () {
        const timer = () => {
            this.setState({
                time: this.state.time + 1,
            });

            setTimeout(timer, 1000);
        };

        return timer();
    }

    render () {
        return (
            <TimerWrapper>{this.state.time}</TimerWrapper>
        )
    }
}

const NewGameButton = style.button`
    color: white;
    padding: 1rem;
    font-size: 2rem;
    font-weight: bold;
    background: black;
`;

class Board extends Component {
    blocksGotten = 0;

    constructor (props) {
        super(props);
        
        this.state = {
            started: false,
            board: this.generateNewBoard(),
        };
    }
    
    generateNewBoard (noBomb = {}) {
        const { rows = 10, columns = 10, bombs = 10 } = this.props;
        
        return calculateBombsInRows({ rows, columns, bombs, noBomb });
    }
    
    newGame (callback = () => null) {
        this.setState({
            started: false,
            board: this.generateNewBoard(),
        }, callback);
    }

    onBoxClick ({ row, column, clicked = false, flagged = false, currentBox }) {
        let { data: { containsBomb, value } } = currentBox;
        const isClickable = !flagged && clicked;
        
        const clickEvent = () => {
            let board = this.state.board;
            
            if (containsBomb && isClickable) {
                // @todo reset timer/disable board, etc
                alert('YOU LOSE!\n\n\n YOU CLICKED ON A BOMB!');
        
                board[row][column].clicked = true;
            } else if (value === 0 && isClickable) {
                // you clicked on an empty space, need to expand out
                board = calculateEmptySpacesOnBoard({ board: this.state.board, row, column });
            } else {
                board[row][column].clicked = clicked;
                board[row][column].flagged = flagged;
            }
    
            this.setState({
                board,
            });
        };
        
        if (!this.state.started) {
            this.setState({
                started: true,
            }, () => {
                // reseed if the first click contains a bomb so that you cannot lose on first turn
                if (containsBomb && isClickable) {
                    this.setState({
                        board: this.generateNewBoard({ row, column })
                    }, () => {
                        const current = this.state.board[row][column];
                        containsBomb = false;
                        value = current.value;
                        clickEvent();
                    })
                } else {
                    clickEvent();
                }
            });
        } else {
            clickEvent();
        }
    }

    getBlocks () {
        this.blocksGotten += 1;

        return this.state.board.map((currentRow, index) => {
            const key = `row_${index}_${this.blocksGotten}`;
            return (
                <Row key={key} id={key}
                     rowIndex={index}
                     currentRow={currentRow}
                     onBoxClick={(e) => this.onBoxClick(e)}
                />
            );
        });
    }

    render () {
        return (
            <div>
                <div>
                    {this.getBlocks()}
                </div>
    
                { this.state.started ? <Timer/> : <TimerWrapper>0</TimerWrapper> }
                <NewGameButton onClick={() => this.newGame()}>New Game</NewGameButton>
            </div>
        );
    }
}

const App = () => (
    <Board bombs={15} />
);

export default App;
