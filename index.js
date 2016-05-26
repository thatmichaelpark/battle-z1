var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var connections = [];
var nextID = 0;
var movesReceived = 0;

io.on('connection', function (socket) {
  var id = nextID++;
  connections.push({
    socket: socket,
    id: id,
    move: null
  });
  console.log('a user connected; # connections:', connections.length);
  io.emit('msg', 'New connection');
  socket.emit('assignID', id);
  storeMove(id, {
    left: false,
    right: false,
    fwd: false,
    back: false
  });
  socket.on('disconnect', function () {
    for (var i=0; i<connections.length; ++i) {
      if (connections[i].socket === socket) {
        connections.splice(i, 1); // remove this socket from list.
        if (movesReceived == connections.length) {
          flushMoves();
        }
        break;
      }
    }
    console.log('a user disconnected; # connections:', connections.length);
  });

  socket.on('move', function (data) {
    console.log('move from', data.id, data.move);
    storeMove(data.id, data.move);
  });
  function storeMove(id, move) {
    for (var i=0; i<connections.length; ++i) {
      if (connections[i].id == id) {
        connections[i].move = move;
        console.log(movesReceived+1);
        if (++movesReceived == connections.length) {
          flushMoves();
        }
        break;
      }
    }
  }

  function flushMoves() {
    var a = [];
    for (var c of connections) {
      a.push({
        id: c.id,
        move: c.move
      })
    }
    movesReceived = 0;
    console.log('flush' + '-'.repeat(Math.random()*40));
    io.emit('update', a);
  }
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
