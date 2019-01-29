import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Memory/>, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: this.buildGrid()
        };
    }

    buildGrid() {
        let grid = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push({
                    value: "A",
                    flipped: false
                });
            }
            grid.push(row);
        }
        return grid;
    }

    flipCard(index) {
        let row = index[0];
        let col = index[1];

        let card = this.state.grid[row][col];
        let newGrid = this.state.grid.slice();
        newGrid[row][col] = {
            value: card.value,
            flipped: !card.flipped
        };
        this.setState({grid: newGrid});
    }

    render() {
        let rows = _.map(this.state.grid, (row, ii) => {
            return <RowItem row={row} index={ii} key={ii} flipCard={this.flipCard.bind(this)}/>;
        });
        return <div id="grid">
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

    return <div className="column card" onClick={() => {
        props.flipCard(props.index)
    }}>
        {display}
    </div>;
}