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
const moveKeys = {
  q: false,
  a: false,
  p: false,
  l: false,
  fire: false
};
let dt = 0;

function convertKeysToMove() {
  let left = 0;
  if (moveKeys.q) {
    ++left;
  }
  if (moveKeys.a) {
    --left;
  }
  let right = 0;
  if (moveKeys.p) {
    ++right;
  }
  if (moveKeys.l) {
    --right;
  }
  return {leftTrack: left, rightTrack: right, fire: moveKeys.fire};
}

socket.on('assignID', function (data) {
  playerId = data;
  $('#playerid').text(playerId);
});

socket.on('stateOfTheWorld', function (data) {
  world = data.world;
  dt = data.dt;
  redraw();

  socket.emit('move', {id: playerId, move: convertKeysToMove()});
});

// const arrowLeft = 37;
// const arrowUp = 38;
// const arrowRight = 39;
// const arrowDown = 40;
const space = 32;
const keyQ = 81;
const keyA = 65;
const keyP = 80;
const keyL = 76;
const escape = 27;

$('body').on('keydown', (event) => {
  switch (event.which) {
    case keyQ:
      moveKeys.q = true;
      break;
    case keyA:
      moveKeys.a = true;
      break;
    case keyP:
      moveKeys.p = true;
      break;
    case keyL:
      moveKeys.l = true;
      break;
    case space:
      moveKeys.fire = true;
      break;
  }
});

$('body').on('keyup', (event) => {
  switch (event.which) {
    case keyQ:
      moveKeys.q = false;
      break;
    case keyA:
      moveKeys.a = false;
      break;
    case keyP:
      moveKeys.p = false;
      break;
    case keyL:
      moveKeys.l = false;
      break;
    case space:
      moveKeys.fire = false;
      break;
    case escape:
      socket.emit('takecontrol', playerId);
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

function randomColor() {
  // Returns '#rgb' where r is randomly '0' or 'f' (and similarly for g and b).
  const bbb = Math.floor(Math.random() * 7) + 1; // 3 random bits, not all 0.
  return '#' + (bbb & 4 ? 'f' : '0') + (bbb & 2 ? 'f' : '0') + (bbb & 1 ? 'f' : '0');
}
function redraw() {

  var eye = {
    x: 0,
    y: 0,
    h: 0
  };

  var bkgdColor = 'black';

  for (const obj of world) {
    if (obj.id === playerId) {
      eye.x = obj.x;
      eye.y = obj.y;
      eye.h = obj.h;
      if (obj.state === 'hit') {
        bkgdColor = randomColor();
      }
      break;
    }
  }

  ctx.fillStyle = bkgdColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height * 0.66);

  drawBkgd(ctx, eye.h);
  for (const obj of world) {
    draw(ctx, eye, obj);
  }
  ctx.restore();
}

function x4m(a, h) {
	h %= 360;
  a = a / 1600 * 360;
	let x = ((h - a + 360) % 360) / 45;
  if (x >= 4) {
    x -= 8;
  }
  return x;
}

function drawGBOFs(ctx, h, scaleX, scaleY) {
  const accel = -8;
  for (const gbof of GBOFs) {
    gbof.vy += accel * dt;
    gbof.x += gbof.vx * dt;
    gbof.y += gbof.vy * dt;
    if (gbof.y < gbof.limit) {
      gbof.x = gbof.y = 0;
      gbof.vx = (Math.random() - 0.5) * 10;
      gbof.vy = 5 + Math.random() * 5;
      gbof.limit = -5 - Math.random() * 5;
    }
    const x = x4m(1275 + gbof.x, h) * scaleX;
    const y = (12 + gbof.y) * scaleY;
    ctx.fillStyle = 'green';
    ctx.fillRect(x-2, y-2, 4, 4);
  }
}

function drawBkgd(ctx, h) {
  ctx.beginPath();
  ctx.strokeStyle = '#050';
  ctx.lineWidth = 2;
  ctx.moveTo(-canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, 0);

  const scaleX = canvas.width * 0.8;
  const scaleY = -canvas.width * 0.007;

  let prevX;
  let prevY;
  for (const pt of rawBkgdData) {
    var x = x4m(pt[0], h);
    var y = pt[1];
    if (y < 0) {
      y = -y;
    } else {
      if (prevX > -1 && prevX < 1 && x > -1 && x < 1) {
        ctx.moveTo(prevX * scaleX, prevY * scaleY);
        ctx.lineTo(x * scaleX, y * scaleY);
      }
    }
    prevX = x;
    prevY = y;
  }
  ctx.closePath();
  ctx.stroke();

  drawGBOFs(ctx, h, scaleX, scaleY);
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
  if (thing.state === 'normal') {
    ctx.strokeStyle = 'green';
  } else {
    ctx.strokeStyle = randomColor();
  }
  ctx.lineWidth = 2;
  for (var l of shape.lines) {
    ctx.moveTo(txs[l.start], tys[l.start]);
    ctx.lineTo(txs[l.end], tys[l.end]);
  }
  ctx.stroke();
  ctx.closePath();
}
