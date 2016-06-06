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
    x: 210,
    y: 0,
    h: 10
  };
  draw(ctx, eye, {type: 'tank', x: 500, y: 0, h: 90, color: 'green'});
  draw(ctx, eye, {type: 'cube', x: 500, y: -200, h: 0, color: 'yellow'});
  draw(ctx, eye, {type: 'halfcube', x: 500, y: 200, h: 0, color: 'red'});
  draw(ctx, eye, {type: 'pyramid', x: 500, y: 400, h: 0, color: 'cyan'});
  draw(ctx, eye, {type: 'bullet', x: 500, y: 500, h: 90, color: 'blue'});
  ctx.restore();
}

function draw(ctx, eye, thing) {
  var c = rotate(thing.x - eye.x, thing.y - eye.y, -eye.h);
  if (Math.abs(c.x) < Math.abs(c.y)) {  // Don't draw objects outside 90deg field of view.
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
    var w = -canvas.width * 0.6 / x;  // -ve because y & z
    txs.push(y * w);
    tys.push(z * w);
  }
  ctx.beginPath();
  ctx.strokeStyle = thing.color;
  ctx.lineWidth = 2;
  for (var l of shape.lines) {
    ctx.moveTo(txs[l.start], tys[l.start]);
    ctx.lineTo(txs[l.end], tys[l.end]);
  }
  ctx.stroke();
  ctx.closePath();
}
