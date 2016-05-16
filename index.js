var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  })
  socket.on('chat message', function (msg) {
    led.toggle();
    io.emit('chat message', msg);
  })
});

http.listen(3003, function () {
  console.log('listening on *:3003');
});

var led;

var five = require("johnny-five");
var board = new five.Board({repl: false});

board.on("ready", function() {
  console.log("Ready event. Repl instance auto-initialized!");

  led = new five.Led(11);

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 20,
    threshold: 20
  });
  sensor.on('change', function (d) {
    console.log(d);
    io.emit('chat message', d);
  })

});
