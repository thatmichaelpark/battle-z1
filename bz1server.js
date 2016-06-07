var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const BZ1 = require('./bz1.js');

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
    socket.emit('assignID', player.id);
    BZ1.world.createTank(player.id);
    storeMove(player.id, {
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
      storeMove(data.id, data.move);
    });

    function storeMove(playerId, move) {
      BZ1.tanks[playerId].move = move;
      if (++movesReceived == pids.length) {
        updateWorld();
      }
    }
  });
}

let t0;

function updateWorld() {
  const t = Date.now();
  t0 = t0 || t;
  const dt = t - t0;
  t0 = t;
  BZ1.world.update(dt / 1000); // update expects seconds, not ms.

  movesReceived = 0;
  io.emit('stateOfTheWorld', BZ1.world);
}

BZ1.world.create();
initEventHandlers();
