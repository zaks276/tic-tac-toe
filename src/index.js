import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );

}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={'square: ' + i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRows(n) {
        const rows = [];
        for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                row.push(this.renderSquare(i * n + j));
            }
            rows.push(<div key={'row: ' + i} className='board-row'>{row}</div>)
        }
        return rows;
    }

    render() {
        return (
            <div>{this.renderRows(3)}</div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            isDescending: true,
        }
    }

    handleClick(i) {
        const locations = [
            [1, 1],
            [2, 1],
            [3, 1],
            [1, 2],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3],
            [3, 3],
        ]
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: locations[i],
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,

        });
    }

    sortHistory() {
        this.setState({
            isDescending: !this.state.isDescending,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            const desc = move ?
                'Go to move #' + move + ' at position ' + history[move].location :
                'Go to game start';
            if (move === this.state.stepNumber) {

            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            )
        })


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (!current.squares.includes(null)) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.sortHistory()}>
                        Sort by: {this.state.isDescending ? 'Descending' : 'Ascending'}
                    </button>
                    <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
