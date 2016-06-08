'use strict'

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

const connections = {};
var nextID = 0;
var movesReceived = 0;

function initEventHandlers() {
  function createID() {
    // IDs are of the form Player#.
    return 'Player' + nextID++;
  }

  io.on('connection', function (socket) {
    var playerId = createID();

    connections[socket.id] = playerId;
    console.log('+++', playerId, 'connected; # players:', Object.keys(connections).length);
    console.log(connections);
    console.log();
    socket.emit('assignID', playerId);
    BZ1.world.createTank(playerId);
    storeMove(playerId, {
      left: 0,
      right: 0,
      fire: false
    });
    socket.on('disconnect', function () {
      var playerId = connections[socket.id];
      delete connections[socket.id];    // Remove this socket.
      BZ1.world.delete(BZ1.tanks[playerId]);  // Remove this tank from the world.
      console.log('---', playerId, 'disconnected; # players:', Object.keys(connections).length);
      console.log(connections);
      console.log();
      if (movesReceived == Object.keys(connections).length) {
        updateWorld();
      }
    });

    socket.on('move', function (data) {
      storeMove(data.id, data.move);
    });

    function storeMove(playerId, move) {
      BZ1.tanks[playerId].move = move;
      if (++movesReceived == Object.keys(connections).length) {
        updateWorld();
      }
    }
  });
}

let t0;

function updateWorld() {
  const t = Date.now();
  t0 = t0 || t;
  const dt = (t - t0) / 1000; // in seconds, not ms
  t0 = t;

  BZ1.world.update(dt);

  movesReceived = 0;
  io.emit('stateOfTheWorld', {world: BZ1.world, dt: dt});
}

BZ1.world.create();
initEventHandlers();
