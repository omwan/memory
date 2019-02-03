defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
               |> assign(:game, game)
               |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("guess", %{"row" => row, "col" => col}, socket) do
    game = Game.guess(socket.assigns[:game], row, col)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
