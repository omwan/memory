import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Memory/>, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.buildInitState();
    }

    //build initial state of application
    buildInitState() {
        return {
            grid: this.buildGrid(),
            numFlipped: 0,
            currentCards: [],
            score: 0,
            clicks: 0
        }
    }

    //generate a list of memory card values in random order
    getValues() {
        let values = [];
        for (let i = 0; i < 16; i++) {
            let val = ((i % 8) + 10).toString(36);
            values.push(val.toUpperCase());
        }
        return _.shuffle(values);
    }

    //build grid with a random order of cards
    buildGrid() {
        let values = this.getValues();

        let grid = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push({
                    value: values[i * 4 + j],
                    flipped: false,
                    removed: false
                });
            }
            grid.push(row);
        }
        return grid;
    }

    //flip a card
    flipCard(index) {
        let row = index[0];
        let col = index[1];
        let card = this.state.grid[row][col];

        if (this.state.numFlipped < 2 && !card.flipped && !card.removed) {
            let newGrid = this.state.grid.slice();
            let newCard = _.assign({}, card);
            newCard.flipped = true;
            newGrid[row][col] = newCard;

            let currentCards = this.state.currentCards.slice();
            currentCards.push(card);

            let numFlipped = this.state.numFlipped + 1;

            this.setState(_.assign({}, this.state, {
                grid: newGrid,
                numFlipped: numFlipped,
                currentCards: currentCards,
                clicks: this.state.clicks + 1
            }));

            if (numFlipped === 2) {
                setTimeout(() => {
                    this.resetFlips();
                }, 1000);
            }
        }
    }

    //hide all cards
    resetFlips() {
        let newGrid = this.state.grid.slice();
        let matchFound = false;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let card = newGrid[i][j];
                if (card.flipped) {
                    let newCard = _.assign({}, card);
                    newCard.flipped = false;

                    if (this.state.currentCards[0].value === this.state.currentCards[1].value) {
                        newCard.removed = true;
                        matchFound = true;
                    }

                    newGrid[i][j] = newCard;
                }
            }
        }

        this.setState(_.assign({}, this.state, {
            grid: newGrid,
            numFlipped: 0,
            currentCards: [],
            score: this.updateScore(matchFound),
        }));
    }

    //generate new score based on current board
    updateScore(matchFound) {
        let newScore = this.state.score;
        if (matchFound) {
            newScore += 10;
        } else {
            if (newScore > 0) {
                newScore -= 1;
            }
        }
        return newScore;
    }

    //restart game, resetting state to original settings
    restart() {
        this.setState(_.assign({}, this.state, this.buildInitState()));
    }

    render() {
        let rows = _.map(this.state.grid, (row, ii) => {
            return <RowItem row={row} index={ii} key={ii} flipCard={this.flipCard.bind(this)}/>;
        });

        let score = this.state.score;
        let clicks = this.state.clicks;

        let restartButton = <RestartButton restart={this.restart.bind(this)}/>;
        return <div id="grid">
            <div className="row">
                <div className="column">
                    <p>
                        Score: {score}<br/>
                        Clicks: {clicks}
                    </p>
                </div>
                <div className="column">
                    <p>
                        {restartButton}
                    </p>
                </div>
            </div>
            {rows}
        </div>;
    }
}

function RowItem(props) {
    let row = props.row;
    let cards = _.map(row, (card, jj) => {
        let index = [props.index, jj];
        return <CardItem card={card} key={jj} flipCard={props.flipCard} index={index}/>
    });
    return <div className="row">
        {cards}
    </div>;

}

function CardItem(props) {
    let card = props.card;
    let display = "";

    if (card.flipped) {
        display = card.value;
    }

    if (!card.removed) {
        return <div className="column card" onClick={() => {
            props.flipCard(props.index)
        }}>
            {display}
        </div>;
    } else {
        return <div className="column card removed"></div>;
    }
}

function RestartButton(props) {
    return <button onClick={props.restart}>Restart</button>;
}