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
  socket.on('servo', function (angle) {
    servo.to(angle);
  })
});

http.listen(3003, function () {
  console.log('listening on *:3003');
});



var five = require("johnny-five");
var board = new five.Board({repl: false});
var led;
var servo;

board.on("ready", function() {
  console.log("Ready event. Repl instance auto-initialized!");

  led = new five.Led(11);

  servo = new five.Servo(8);

  var sensor = new five.Sensor({
    pin: "A0",
    freq: 20,
    threshold: 20
  });
  sensor.on('change', function (d) {
    io.emit('pot', d);
  })

});
