defmodule MemoryWeb.GameChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  import IO

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

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (game:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
