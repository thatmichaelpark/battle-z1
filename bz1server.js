var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join('./', '')));

http.listen(3000, function () {
  console.log('listening on *:3000');
});

var connections = {};
var players = {};
var pids = [];
var nextID = 0;
var movesReceived = 0;

function initEventHandlers() {
  function createID() {
    // IDs are of the form Player#.
    return 'Player' + nextID++;
  }

  io.on('connection', function (socket) {
    var player = {id: createID()};
    pids.push(player.id);
    players[player.id] = player;

    connections[socket.id] = player;
    console.log('a user connected; # players:', pids.length);
    io.emit('msg', 'New connection');
    socket.emit('assignID', player.id);
    storeMove(player, {
      left: 0,
      right: 0,
      fire: false
    });
    socket.on('disconnect', function () {
      var player = connections[socket.id];
      console.log(player);
      delete connections[socket.id];  // Remove this socket.
      console.log(pids);
      console.log(connections);
      console.log(players);
      pids.splice(pids.indexOf(player.id));
      delete players[player.id];
      console.log('a user disconnected; # players:', pids.length);
      if (movesReceived == pids.length) {
        updateWorld();
      }
    });

    socket.on('move', function (data) {
      storeMove(players[data.id], data.move);
    });
    function storeMove(player, move) {
      player.move = move;
      if (++movesReceived == pids.length) {
        updateWorld();
      }
    }
  });
}

var obstacles = [];     // Cubes, halfcubes, pyramids.
var bullets = [];
var tanks = [];

function updateWorld() {
  movesReceived = 0;
  var a = [];
  for (var pid of pids) {
    a.push(players[pid]);
  }
  io.emit('update', a);
}

createWorld();
console.log(obstacles);
initEventHandlers();
