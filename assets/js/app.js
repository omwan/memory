// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import $ from "jquery";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

import game_init from "./memory-game";
import socket from "./socket";

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("game:default", {});
channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });


function roll_init() {
  $('#roll-button').click(() => {
    channel.push("roll", {}).receive("roll", msg => {
      console.log("roll", msg);
      $('#roll-output').text(msg.roll);
    });
  });
}

$(() => {
  roll_init();
  // let root = $('#root')[0];
  // game_init(root);
});

