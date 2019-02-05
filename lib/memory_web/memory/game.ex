defmodule Memory.Game do

  def new do
    %{
      board: build_board(),
      num_flipped: 0,
      current_cards: [],
      score: 0,
      clicks: 0
    }
  end

  def client_view(game) do
    board = Enum.map(game.board, fn card ->
      if card.flipped do
        card
      else
        %{card | value: ""}
      end
    end)
    %{
      board: board,
      num_flipped: game.num_flipped,
      score: game.score,
      clicks: game.clicks
    }
  end

  def build_board do
    cards = shuffle_cards()
    Enum.map(Enum.with_index(cards), fn {card, index} ->
      %{
        value: to_string(card),
        flipped: false,
        removed: false,
        index: index
      }
    end)
  end

  def shuffle_cards do
    cards = Enum.map(?A..?H, fn x -> [x] end)
    cards = Enum.concat(cards, cards)
    Enum.shuffle(cards)
  end

  def guess(game, row, col) do
    index = row * 4 + col
    board = Enum.map(game.board, fn card ->
        if card.index === index do
          %{card | flipped: true}
        else
          card
        end
    end)
    %{game |
      board: board,
      num_flipped: game.num_flipped + 1,
      current_cards: [Enum.at(game.board, index) | game.current_cards],
      score: game.score,
      clicks: game.clicks + 1
    }
  end

  def reset_flips(game) do
    match = is_match?(game.current_cards)
    board = Enum.map(game.board, fn card ->
      if card.flipped do
        if match do
          %{card | removed: true}
        else
          %{card | flipped: false}
        end
      else
        card
      end
    end)
    %{game |
      board: board,
      num_flipped: 0,
      current_cards: [],
      score: update_score(game.score, match)
    }
  end

  def update_score(score, match) do
    if match do
      score + 10
    else
      if score > 0 do
        score - 1
      else
        score
      end
    end
  end

  def is_match?(cards) do
    Enum.at(cards, 0).value == Enum.at(cards, 1).value
  end

end