'use strict'

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const five = require('johnny-five');
const BZ1 = require('./bz1.js');
let analogPlayer = '';

app.use(express.static(path.join('./', '')));

var analogMove;

http.listen(3000, function () {
  console.log('listening on *:3000');
});

const board = new five.Board();

board.on('ready', () => {
  const led = new five.Led(11);
  const button = new five.Button({pin: 2, invert: true, isPullup: true});

  analogMove = {leftTrack: 0, rightTrack: 0, fire: false};

  button.on('down', function () {
    analogMove.fire = true;
    led.on();
  });

  button.on('up', function () {
    analogMove.fire = false;
    led.off();
  });

  var leftPot = new five.Sensor({
    pin: "A1",
    freq: 20,
    threshold: 20
  });

  leftPot.on('change', function (d) {
    let s = 0;
    if (d < 512 - 15) {
      s = d - 512;
    } else if (d > 512 + 15) {
      s = d - 512;
    }
    analogMove.leftTrack = Math.max(-1, Math.min(1, s / 100));
  });

  var rightPot = new five.Sensor({
    pin: "A0",
    freq: 20,
    threshold: 20
  });

  rightPot.on('change', function (d) {
    let s = 0;
    if (d < 512 - 15) {
      s = d - 512;
    } else if (d > 512 + 15) {
      s = d - 512;
    }
    analogMove.rightTrack = Math.max(-1, Math.min(1, s / 100));
  });

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
      leftTrack: 0,
      rightTrack: 0,
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
      if (data.id === analogPlayer && analogMove) {
        data.move = analogMove;
      }
      storeMove(data.id, data.move);
    });

    socket.on('takecontrol', (data) => {
      if (analogPlayer === data) {
        console.log(analogPlayer, 'is no longer using the sticks.');
        analogPlayer = '';
      } else {
        analogPlayer = data;
        console.log(analogPlayer, 'is using the sticks');
      }
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
  // console.log('*'.repeat(t - t0));;;
  const dt = (t - t0) / 1000; // in seconds, not ms
  t0 = t;

  BZ1.world.update(dt);

  movesReceived = 0;
  io.emit('stateOfTheWorld', {world: BZ1.world, dt: dt});
}

BZ1.world.create();
initEventHandlers();
