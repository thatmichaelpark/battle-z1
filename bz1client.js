/*
World coordinates
- X-axis runs east-west (east is positive)
- Y-axis runs north-south (north is positive)
- Z-axis runs up-down (up is positive)
(Right hand rule)

Angles are in degrees.
Heading 0 is east; heading increases counter-clockwise (i.e. 90 is north)

Screen coordinates
- (0,0) is center of screen
- X-axis: right is positive
- Y-axis: down is positive



*/
var socket = io();

var playerId;
var world = [];
const move = {
  left: false,
  right: false,
  fwd: false,
  rev: false,
  fire: false
};

socket.on('assignID', function (data) {
  playerId = data;
  console.log(playerId);
});

socket.on('stateOfTheWorld', function (data) {
  world = data;
  redraw();
  socket.emit('move', {id: playerId, move: move});
});

$('body').on('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      move.left = true;
      break;
    case 'ArrowRight':
      move.right = true;
      break;
    case 'ArrowUp':
      move.fwd = true;
      break;
    case 'ArrowDown':
      move.rev = true;
      break;
    case ' ':
      move.fire = true;
      break;
  }
});

$('body').on('keyup', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      move.left = false;
      break;
    case 'ArrowRight':
      move.right = false;
      break;
    case 'ArrowUp':
      move.fwd = false;
      break;
    case 'ArrowDown':
      move.rev = false;
      break;
    case ' ':
      move.fire = false;
      break;
  }
});

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

resize();
window.addEventListener('resize', resize);

function resize() {
  canvas.width = document.querySelector('#drawdiv').clientWidth;
  canvas.height = document.querySelector('#drawdiv').clientHeight;
  redraw();
}

function rotate(x, y, degrees) {
  var a = degrees / 180 * Math.PI;
  var sin = Math.sin(a);
  var cos = Math.cos(a);
  var rx = cos * x - sin * y;
  var ry = sin * x + cos * y;
  return {x: rx, y: ry};
}

function redraw() {

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);

  var eye = {
    x: 0,
    y: 0,
    h: 0
  };
  for (const obj of world) {
    if (obj.id === playerId) {
      eye.x = obj.x;
      eye.y = obj.y;
      eye.h = obj.h;
      break;
    }
  }
  for (const obj of world) {
    draw(ctx, eye, obj);
  }
  ctx.restore();
}

function draw(ctx, eye, thing) {
  var c = rotate(thing.x - eye.x, thing.y - eye.y, -eye.h);
  if (c.x < 0 || c.x <= Math.abs(c.y)) {  // Don't draw objects outside 90deg field of view.
    return;
  }
  var txs = [];
  var tys = [];
  var shape = shapes[thing.type];
  for (var p of shape.pts) {
    var rot = rotate(p.x, p.y, thing.h - eye.h);
    var x = rot.x + c.x;
    var y = rot.y + c.y;
    var z = p.z - 60;
    var w = -canvas.width / x;  // -ve because y & z
    txs.push(y * w);
    tys.push(z * w);
  }
  ctx.beginPath();
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 2;
  for (var l of shape.lines) {
    ctx.moveTo(txs[l.start], tys[l.start]);
    ctx.lineTo(txs[l.end], tys[l.end]);
  }
  ctx.stroke();
  ctx.closePath();
}
