defmodule Memory.Game do

  def new do
    %{
      board: build_board(),
      num_flipped: 0,
      current_cards: []
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
      current_cards: game.current_cards
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
    %{
      board: board,
      num_flipped: game.num_flipped,
      current_cards: game.current_cards
    }
  end

end