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
        let grid = this.build_rows(view.game.board);
        this.setState(_.assign({}, this.state, {grid: grid}));
        // this.setState(view.game);
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

    render() {
        let rows = _.map(this.state.grid, (row, ii) => {
            return <RowItem row={row} index={ii} key={ii}/>;
        });
        // console.log(rows);
        return <div>
            {rows}
        </div>;
    }
}

function RowItem(props) {
    let row = props.row;
    let cards = _.map(row, (card, jj) => {
        // let index = [props.index, jj];
        // return <CardItem card={card} key={jj} index={index}/>
        return <CardItem key={jj} card={card}></CardItem>
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
        return <div className="column card">
            {display}
        </div>;
    } else {
        return <div className="column card removed"></div>;
    }
}
