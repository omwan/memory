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
        %{
          value: "",
          flipped: card.flipped,
          removed: card.removed
        }
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
    Enum.map(cards, fn card ->
      %{
        value: to_string(card),
        flipped: false,
        removed: false
      }
    end)
  end

  def shuffle_cards do
    cards = Enum.map(?A..?H, fn x -> [x] end)
    cards = Enum.concat(cards, cards)
    Enum.shuffle(cards)
  end

end