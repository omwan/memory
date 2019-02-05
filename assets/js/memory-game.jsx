import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Memory channel={channel}/>, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {
            grid: [],
            numFlipped: 0,
            currentCards: [],
            score: 0,
            clicks: 0
        };

        this.channel
            .join()
            .receive("ok", this.got_view.bind(this))
            .receive("error", resp => {
                console.log("Unable to join", resp);
            });
    }

    got_view(view) {
        console.log("new view", view);
        let game = view.game;
        let grid = this.build_rows(game.board);
        let newState = {
            grid: grid,
            numFlipped: game.num_flipped,
            currentCards: game.current_cards,
            score: game.score,
            clicks: game.clicks
        };

        this.setState(_.assign({}, this.state, newState));
        if (game.num_flipped === 2) {
            setTimeout(() => {
                console.log("reset state");
                this.channel.push("reset", {})
                    .receive("ok", this.got_view.bind(this))
            }, 1000);
        }
    }

    build_rows(board) {
        let rows = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(board[i * 4 + j]);
            }
            rows.push(row);
        }
        return rows;
    }

    flip_card(index) {
        let row = index[0];
        let col = index[1];
        let card = this.state.grid[row][col];
        if (this.state.numFlipped < 2 && !card.flipped && !card.removed) {
            this.channel.push("guess", {row: index[0], col: index[1]})
                .receive("ok", this.got_view.bind(this));
        }
    }

    restart() {
        this.channel.push("restart", {})
            .receive("ok", this.got_view.bind(this));
    }

    render() {
        let rows = _.map(this.state.grid, (row, ii) => {
            return <RowItem row={row} index={ii} key={ii} flipCard={this.flip_card.bind(this)}/>;
        });

        let restartButton =  <RestartButton restart={this.restart.bind(this)}/>;

        let score = this.state.score;
        let clicks = this.state.clicks;

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
    </div>

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