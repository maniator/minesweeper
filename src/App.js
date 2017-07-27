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

class Board extends Component {
    constructor (props) {
        super(props);

        const { rows = 10, columns = 10, bombs = 10 } = props;

        this.state = {
            board: calculateBombsInRows({ rows, columns, bombs }),
        };
    }

    onBoxClick ({ row, column, currentBox }) {
        const { data: { containsBomb, value } } = currentBox;

        if (containsBomb) {
            // @todo reset timer/disable board, etc
            alert('YOU LOSE!\n\n\n YOU CLICKED ON A BOMB!');
        } else if (value === 0) {
            // you clicked on an empty space, need to expand out
            const board = calculateEmptySpacesOnBoard({board: this.state.board, row, column});

            this.setState({
                board,
            });
        } else {
            const board = this.state.board;

            board.clicked += 1;

            this.setState({
                board,
            });
        }

        this.props.startTimer();
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
    constructor () {
        super();

        this.state = {
            timerStarted: false,
        }
    }
    render() {
        return (
            <div>
                <Board
                    startTimer={() => this.setState({
                        timerStarted: true
                    })}
                    bombs={20}
                />
                { this.state.timerStarted ? <Timer/> : <TimerWrapper>0</TimerWrapper> }
            </div>
        );
    }
}

export default App;
