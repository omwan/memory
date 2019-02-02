defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def memory(conn, %{"name" => name}) do
    render conn, "memory.html", name: name
  end
end
